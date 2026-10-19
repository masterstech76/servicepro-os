import { describe, it, expect, beforeEach } from "vitest";
import {
  getTechVanInventory,
  consumeVanPart,
  returnVanPart,
  getJobChecklist,
  saveJobChecklist,
  isChecklistComplete,
  saveJobEstimate,
  recordEstimateDecision,
  getTechnicianScheduleJobs,
  STANDARD_CHECKLIST_TEMPLATE,
} from "@/lib/server/tech-portal";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

describe("Batch 4: Technician Mobile Field PWA Business Logic", () => {
  const testTechId = "tech-carlos";
  const otherTechId = "tech-danny";
  let sampleJobId: string;

  beforeEach(() => {
    const store = getLocalDbWithDemo();
    // Find a job assigned to testTechId
    for (const j of store.jobs.values()) {
      if (j.technician_id === testTechId) {
        sampleJobId = j.id;
        break;
      }
    }
    if (!sampleJobId) {
      const firstJob = Array.from(store.jobs.values())[0];
      firstJob.technician_id = testTechId;
      sampleJobId = firstJob.id;
    }
  });

  describe("Technician Schedule Filtering", () => {
    it("returns jobs assigned only to the specific technician", () => {
      const schedule = getTechnicianScheduleJobs(testTechId, "all");
      expect(Array.isArray(schedule)).toBe(true);
      expect(schedule.length).toBeGreaterThan(0);
      schedule.forEach((j) => {
        expect(j.technician?.id).toBe(testTechId);
      });
    });

    it("does not include cancelled jobs in active schedule", () => {
      const schedule = getTechnicianScheduleJobs(testTechId, "all");
      schedule.forEach((j) => {
        expect(j.status).not.toBe("cancelled");
      });
    });
  });

  describe("10-Point HVAC Inspection Checklist", () => {
    it("initializes 10 standard diagnostic inspection points", () => {
      const checklist = getJobChecklist(sampleJobId);
      expect(checklist).toHaveLength(10);
      expect(STANDARD_CHECKLIST_TEMPLATE).toHaveLength(10);
      expect(checklist[0].status).toBe("pending");
    });

    it("rejects checklist save if a failed item is missing an explanatory note", () => {
      const items = getJobChecklist(sampleJobId);
      const modified = items.map((it, idx) => ({
        ...it,
        status: idx === 0 ? ("fail" as const) : ("pass" as const),
        notes: "", // Empty notes on failed item
      }));

      const res = saveJobChecklist(testTechId, sampleJobId, modified);
      expect(res.ok).toBe(false);
      expect(res.error).toMatch(/explaining/i);
    });

    it("accepts checklist save when failed items contain explanatory notes", () => {
      const items = getJobChecklist(sampleJobId);
      const modified = items.map((it, idx) => ({
        ...it,
        status: idx === 0 ? ("fail" as const) : ("pass" as const),
        notes: idx === 0 ? "Capacitor reads 38.2 MFD, below -6% tolerance spec" : undefined,
      }));

      const res = saveJobChecklist(testTechId, sampleJobId, modified);
      expect(res.ok).toBe(true);
      expect(res.checklist[0].status).toBe("fail");
      expect(res.checklist[0].notes).toContain("Capacitor reads 38.2 MFD");
    });

    it("prevents an unassigned technician from modifying checklist", () => {
      const items = getJobChecklist(sampleJobId);
      const res = saveJobChecklist("unauthorized_tech", sampleJobId, items);
      expect(res.ok).toBe(false);
      expect(res.error).toMatch(/unauthorized/i);
    });

    it("accurately verifies completion status", () => {
      const items = getJobChecklist(sampleJobId);
      const allPassed = items.map((it) => ({
        ...it,
        status: "pass" as const,
      }));
      saveJobChecklist(testTechId, sampleJobId, allPassed);
      expect(isChecklistComplete(sampleJobId)).toBe(true);
    });
  });

  describe("Van Truck Stock & Inventory Concurrency", () => {
    it("loads default van parts stock for a technician", () => {
      const stock = getTechVanInventory(testTechId);
      expect(stock.length).toBeGreaterThan(5);
      const cap = stock.find((p) => p.sku.includes("CAP"));
      expect(cap).toBeDefined();
      expect(cap!.quantity).toBeGreaterThan(0);
    });

    it("decrements inventory and logs movement upon consumption", () => {
      const stock = getTechVanInventory(testTechId);
      const part = stock[0];
      const initialQty = part.quantity;

      const res = consumeVanPart({
        techId: testTechId,
        jobId: sampleJobId,
        partId: part.id,
        quantity: 1,
        notes: "Field replacement",
      });

      expect(res.ok).toBe(true);
      expect(res.remainingQuantity).toBe(initialQty - 1);
      expect(res.movement).toBeDefined();
      expect(res.movement?.sku).toBe(part.sku);
      expect(res.movement?.type).toBe("consumed");
    });

    it("prevents negative inventory when requested quantity exceeds stock", () => {
      const stock = getTechVanInventory(testTechId);
      const part = stock[0];

      const res = consumeVanPart({
        techId: testTechId,
        jobId: sampleJobId,
        partId: part.id,
        quantity: part.quantity + 999,
      });

      expect(res.ok).toBe(false);
      expect(res.error).toMatch(/insufficient van stock/i);
    });

    it("restores truck stock when returning a part", () => {
      const stock = getTechVanInventory(testTechId);
      const part = stock[0];
      const currentQty = part.quantity;

      const res = returnVanPart({
        techId: testTechId,
        jobId: sampleJobId,
        partId: part.id,
        quantity: 1,
        notes: "Unused part return",
      });

      expect(res.ok).toBe(true);
      expect(res.remainingQuantity).toBe(currentQty + 1);
      expect(res.movement?.type).toBe("returned");
    });
  });

  describe("On-Site Estimate Builder & Customer Approval", () => {
    it("creates an estimate with decimal-safe integer math and tax calculations", () => {
      const res = saveJobEstimate({
        techId: testTechId,
        jobId: sampleJobId,
        title: "Condenser Fan Motor Replacement",
        description: "Motor bearing seized",
        items: [
          {
            kind: "parts",
            description: "1/3 HP Condenser Fan Motor",
            quantity: 1,
            unitPriceCents: 21000, // $210.00
          },
          {
            kind: "labor",
            description: "Motor Replacement Labor",
            quantity: 1,
            unitPriceCents: 15000, // $150.00
          },
        ],
      });

      expect(res.ok).toBe(true);
      expect(res.estimate).toBeDefined();
      const est = res.estimate!;
      expect(est.subtotalCents).toBe(36000); // $360.00
      expect(est.taxCents).toBe(Math.round(36000 * 0.07)); // 7% tax = $25.20 -> 2520 cents
      expect(est.totalCents).toBe(36000 + est.taxCents);
      expect(est.status).toBe("pending_customer_approval");
    });

    it("requires customer signature name when approving estimate", () => {
      const estRes = saveJobEstimate({
        techId: testTechId,
        jobId: sampleJobId,
        title: "Thermostat Replacement",
        items: [
          {
            kind: "parts",
            description: "Smart Digital Thermostat",
            quantity: 1,
            unitPriceCents: 16500,
          },
        ],
      });

      const estId = estRes.estimate!.id;
      const decisionRes = recordEstimateDecision({
        techId: testTechId,
        jobId: sampleJobId,
        estimateId: estId,
        decision: "approved",
        customerSignatureName: "", // Blank name
      });

      expect(decisionRes.ok).toBe(false);
      expect(decisionRes.error).toMatch(/signature verification is required/i);
    });

    it("approves estimate with customer authorization and prevents further state mutation", () => {
      const estRes = saveJobEstimate({
        techId: testTechId,
        jobId: sampleJobId,
        title: "Contactors & Surge Protector",
        items: [
          {
            kind: "parts",
            description: "HVAC Whole Home Surge Protector",
            quantity: 1,
            unitPriceCents: 19500,
          },
        ],
      });

      const estId = estRes.estimate!.id;
      const approved = recordEstimateDecision({
        techId: testTechId,
        jobId: sampleJobId,
        estimateId: estId,
        decision: "approved",
        customerSignatureName: "Jane Doe",
      });

      expect(approved.ok).toBe(true);
      expect(approved.estimate?.status).toBe("approved");
      expect(approved.estimate?.customerSignatureName).toBe("Jane Doe");

      // Attempting to mutate an already approved estimate
      const reDecision = recordEstimateDecision({
        techId: testTechId,
        jobId: sampleJobId,
        estimateId: estId,
        decision: "declined",
      });

      expect(reDecision.ok).toBe(false);
      expect(reDecision.error).toMatch(/already been approved/i);
    });
  });
});
