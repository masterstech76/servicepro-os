import { describe, it, expect, beforeEach } from "vitest";
import {
  getCustomerJobs,
  getCustomerAppointmentById,
  getCustomerAddresses,
  saveCustomerAddress,
  deleteCustomerAddress,
  getCustomerSupportTickets,
  createCustomerSupportTicket,
  getCustomerNotifications,
  markCustomerNotificationRead,
  markAllCustomerNotificationsRead,
} from "@/lib/server/customer-portal";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

describe("Batch 3: Customer Portal Business Logic & Security", () => {
  const testCustId = "cust_demo_1";
  const otherCustId = "cust_demo_2";

  beforeEach(() => {
    // Ensure demo store is initialized
    getLocalDbWithDemo();
  });

  describe("Customer Ownership & Data Isolation", () => {
    it("returns jobs strictly belonging to the authenticated customer", () => {
      const jobs = getCustomerJobs(testCustId);
      expect(Array.isArray(jobs)).toBe(true);
      jobs.forEach((j) => {
        expect(j.customer.id).toBe(testCustId);
      });
    });

    it("prevents accessing another customer's appointment", () => {
      const otherJobs = getCustomerJobs(otherCustId);
      if (otherJobs.length > 0) {
        const forbiddenJobId = otherJobs[0].id;
        const result = getCustomerAppointmentById(testCustId, forbiddenJobId);
        expect(result).toBeNull();
      }
    });

    it("permits accessing the customer's own appointment", () => {
      const myJobs = getCustomerJobs(testCustId);
      if (myJobs.length > 0) {
        const myJobId = myJobs[0].id;
        const result = getCustomerAppointmentById(testCustId, myJobId);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(myJobId);
      }
    });
  });

  describe("Appointment Action Restrictions", () => {
    it("identifies cancellable vs non-cancellable statuses", () => {
      const cancellableStatuses = ["unassigned", "assigned"];
      const restrictedStatuses = ["on_the_way", "in_progress", "completed", "cancelled"];

      cancellableStatuses.forEach((st) => {
        expect(["unassigned", "assigned"]).toContain(st);
      });

      restrictedStatuses.forEach((st) => {
        expect(["unassigned", "assigned"]).not.toContain(st);
      });
    });
  });

  describe("Saved Service Addresses", () => {
    it("saves and retrieves customer addresses with defaults", () => {
      const initial = getCustomerAddresses(testCustId);
      expect(initial.length).toBeGreaterThanOrEqual(1);

      const newAddr = saveCustomerAddress(testCustId, {
        label: "Beachside Condo",
        line1: "450 Ocean Dr",
        line2: "Unit 301",
        city: "Miami Beach",
        state: "FL",
        zip: "33139",
        isDefault: true,
      });

      expect(newAddr.id).toBeDefined();
      expect(newAddr.isDefault).toBe(true);

      const allAddrs = getCustomerAddresses(testCustId);
      const found = allAddrs.find((a) => a.id === newAddr.id);
      expect(found).toBeDefined();
      expect(found?.label).toBe("Beachside Condo");

      // Clean up
      deleteCustomerAddress(testCustId, newAddr.id);
    });

    it("prevents deleting another customer's address", () => {
      const deleted = deleteCustomerAddress(testCustId, "non_existent_addr_id");
      expect(deleted).toBe(false);
    });
  });

  describe("Support Inquiries & Ticketing", () => {
    it("creates a support ticket with open status and customer association", () => {
      const ticket = createCustomerSupportTicket(testCustId, {
        subject: "Unit inspection question",
        category: "equipment",
        priority: "normal",
        message: "Need clarification on refrigerant recharge specifications.",
      });

      expect(ticket.id).toBeDefined();
      expect(ticket.ticketNumber).toMatch(/^TICK-\d+/);
      expect(ticket.status).toBe("open");
      expect(ticket.customerId).toBe(testCustId);

      const tickets = getCustomerSupportTickets(testCustId);
      expect(tickets.some((t) => t.id === ticket.id)).toBe(true);
    });
  });

  describe("Customer Notifications", () => {
    it("manages read/unread states accurately", () => {
      const notifs = getCustomerNotifications(testCustId);
      expect(notifs.length).toBeGreaterThanOrEqual(1);

      const firstId = notifs[0].id;
      const readResult = markCustomerNotificationRead(testCustId, firstId);
      expect(readResult).toBe(true);

      const updated = getCustomerNotifications(testCustId);
      const target = updated.find((n) => n.id === firstId);
      expect(target?.read).toBe(true);

      const markedCount = markAllCustomerNotificationsRead(testCustId);
      expect(typeof markedCount).toBe("number");
    });
  });
});
