import { describe, it, expect, beforeEach } from "vitest";
import {
  createAdminJob,
  getAdminWorkOrders,
  getAdminJobDetail,
  getAdminTechnicianDetail,
  getAdminCustomerDetail,
  getCentralInventoryOverview,
  adjustCentralInventoryStock,
  getInventoryAuditLog,
  getAdminReportsData,
} from "@/lib/server/admin-portal";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

describe("Batch 5: Admin Operations, Dispatch & Business Control Center", () => {
  beforeEach(() => {
    // Initialize demo database
    getLocalDbWithDemo();
  });

  describe("Work Order Creation & Dispatch Conflict Detection", () => {
    it("creates an unassigned work order with valid input", () => {
      const res = createAdminJob({
        customerName: "Alice Walker",
        customerPhone: "(305) 555-8912",
        customerEmail: "alice.w@example.com",
        addressLine1: "150 SE 2nd Ave",
        city: "Miami",
        state: "FL",
        zip: "33131",
        serviceId: "svc-ac-repair",
        scheduledStart: "2026-10-25T10:00:00",
        issueText: "No cooling in master bedroom",
      });

      expect(res.ok).toBe(true);
      expect(res.job).toBeDefined();
      expect(res.job?.customer.name).toBe("Alice Walker");
      expect(res.job?.status).toBe("unassigned");
      expect(res.job?.service.id).toBe("svc-ac-repair");
    });

    it("rejects work order creation when customer details or address are missing", () => {
      const res = createAdminJob({
        customerName: "",
        customerPhone: "",
        addressLine1: "",
        city: "Miami",
        state: "FL",
        zip: "",
        serviceId: "svc-ac-repair",
        scheduledStart: "2026-10-25T10:00:00",
      });

      expect(res.ok).toBe(false);
      expect(res.error).toMatch(/customer name and phone number are required/i);
    });

    it("prevents scheduling overlapping jobs for the same technician", () => {
      // First booking for Carlos at 10:00 AM on 2026-10-26
      const first = createAdminJob({
        customerName: "Customer One",
        customerPhone: "(305) 555-1111",
        addressLine1: "100 Biscayne Blvd",
        city: "Miami",
        state: "FL",
        zip: "33132",
        serviceId: "svc-ac-repair", // 90 min duration
        scheduledStart: "2026-10-26T10:00:00",
        technicianId: "tech-carlos",
      });
      expect(first.ok).toBe(true);

      // Attempt second booking overlapping Carlos at 10:30 AM
      const conflict = createAdminJob({
        customerName: "Customer Two",
        customerPhone: "(305) 555-2222",
        addressLine1: "200 Brickell Ave",
        city: "Miami",
        state: "FL",
        zip: "33131",
        serviceId: "svc-ac-tuneup",
        scheduledStart: "2026-10-26T10:30:00",
        technicianId: "tech-carlos",
      });

      expect(conflict.ok).toBe(false);
      expect(conflict.error).toMatch(/schedule conflict/i);
    });

    it("fetches deep work order details including checklist and estimates", () => {
      const store = getLocalDbWithDemo();
      const firstJob = Array.from(store.jobs.values())[0];

      const detail = getAdminJobDetail(firstJob.id);
      expect(detail.job).not.toBeNull();
      expect(detail.job?.id).toBe(firstJob.id);
      expect(Array.isArray(detail.checklist)).toBe(true);
      expect(Array.isArray(detail.estimates)).toBe(true);
      expect(Array.isArray(detail.inventoryMovements)).toBe(true);
    });
  });

  describe("Central Inventory Management & Audit Trail", () => {
    it("retrieves central inventory overview and stock valuation", () => {
      const overview = getCentralInventoryOverview();
      expect(overview.totalSkus).toBeGreaterThan(5);
      expect(overview.totalWarehouseUnits).toBeGreaterThan(50);
      expect(overview.totalValuationCostCents).toBeGreaterThan(0);
      expect(overview.totalValuationRetailCents).toBeGreaterThan(overview.totalValuationCostCents);
    });

    it("successfully adjusts warehouse stock and logs an immutable audit record", () => {
      const overview = getCentralInventoryOverview();
      const part = overview.parts[0];
      const initialQty = part.warehouseQuantity;

      const res = adjustCentralInventoryStock({
        partId: part.id,
        adjustmentQuantity: 10,
        reason: "Received new supplier replenishment crate",
        actor: "Admin Manager",
      });

      expect(res.ok).toBe(true);
      expect(res.part?.warehouseQuantity).toBe(initialQty + 10);
      expect(res.audit).toBeDefined();
      expect(res.audit?.quantityChange).toBe(10);
      expect(res.audit?.previousQuantity).toBe(initialQty);
      expect(res.audit?.newQuantity).toBe(initialQty + 10);
      expect(res.audit?.reason).toContain("Received new supplier replenishment");

      const audits = getInventoryAuditLog();
      expect(audits.some((a) => a.id === res.audit?.id)).toBe(true);
    });

    it("rejects inventory adjustment if reason is absent or too brief", () => {
      const overview = getCentralInventoryOverview();
      const part = overview.parts[0];

      const res = adjustCentralInventoryStock({
        partId: part.id,
        adjustmentQuantity: 5,
        reason: "po", // Less than 5 characters
        actor: "Admin Manager",
      });

      expect(res.ok).toBe(false);
      expect(res.error).toMatch(/detailed reason/i);
    });

    it("prevents negative inventory when deduction exceeds stock", () => {
      const overview = getCentralInventoryOverview();
      const part = overview.parts[0];

      const res = adjustCentralInventoryStock({
        partId: part.id,
        adjustmentQuantity: -(part.warehouseQuantity + 100),
        reason: "Defective inventory write-off bulk",
        actor: "Admin Manager",
      });

      expect(res.ok).toBe(false);
      expect(res.error).toMatch(/negative inventory/i);
    });
  });

  describe("Database-Derived Business Reporting", () => {
    it("aggregates jobs operations metrics accurately", () => {
      const report = getAdminReportsData({ type: "jobs" }) as any;
      expect(report.type).toBe("jobs");
      expect(report.totalJobs).toBeGreaterThan(0);
      expect(report.completedJobs).toBeGreaterThanOrEqual(0);
      expect(report.completionRate).toMatch(/%/);
      expect(typeof report.serviceBreakdown).toBe("object");
    });

    it("distinguishes invoiced accrual revenue from collected cash payments", () => {
      const report = getAdminReportsData({ type: "revenue" }) as any;
      expect(report.type).toBe("revenue");
      expect(typeof report.invoicedTotalCents).toBe("number");
      expect(typeof report.collectedPaymentsCents).toBe("number");
      expect(typeof report.taxCents).toBe("number");
      expect(typeof report.outstandingDueCents).toBe("number");
    });

    it("computes technician performance leaderboard", () => {
      const report = getAdminReportsData({ type: "technicians" }) as any;
      expect(report.type).toBe("technicians");
      expect(Array.isArray(report.technicians)).toBe(true);
      expect(report.technicians.length).toBeGreaterThan(0);
      const carlos = report.technicians.find((t: any) => t.id === "tech-carlos");
      expect(carlos).toBeDefined();
      expect(carlos.rating).toBeGreaterThan(4.0);
    });
  });

  describe("Customer 360 & Technician Profiles", () => {
    it("returns deep customer profile with lifetime spending and unique properties", () => {
      const store = getLocalDbWithDemo();
      const customer = Array.from(store.customers.values())[0];

      const profile = getAdminCustomerDetail(customer.id);
      expect(profile).not.toBeNull();
      expect(profile?.customer.id).toBe(customer.id);
      expect(Array.isArray(profile?.addresses)).toBe(true);
      expect(Array.isArray(profile?.jobs)).toBe(true);
      expect(profile?.stats.totalSpentCents).toBeGreaterThanOrEqual(0);
    });

    it("returns deep technician profile with vehicle, licenses, and roster", () => {
      const profile = getAdminTechnicianDetail("tech-carlos");
      expect(profile).not.toBeNull();
      expect(profile?.technician.id).toBe("tech-carlos");
      expect(profile?.technician.vehicle.model).toContain("Ford Transit");
      expect(Array.isArray(profile?.hours)).toBe(true);
      expect(Array.isArray(profile?.jobs)).toBe(true);
    });
  });
});
