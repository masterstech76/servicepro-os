import { describe, it, expect } from "vitest";
import {
  getAdminInvoicesList,
  getAdminInvoiceDetail,
  getAdminPaymentsList,
  getAdminNotificationsList,
  getAdminReviewsList,
  moderateAdminReview,
  getAdminCouponsList,
  createAdminCoupon,
  toggleAdminCoupon,
  getAdminAuditLogs,
} from "@/lib/server/admin-portal";
import {
  getTechEarnings,
  getTechNotifications,
  markTechNotificationRead,
} from "@/lib/server/tech-portal";
import {
  getCustomerReviews,
  submitCustomerReview,
  getCustomerFavorites,
  toggleCustomerFavorite,
} from "@/lib/server/customer-portal";

describe("Missing Pages & Portal Extensions — Full Functional Suite", () => {
  describe("Admin Invoices & Payments Ledger", () => {
    it("returns admin invoices list with financial calculations", () => {
      const res = getAdminInvoicesList({});
      expect(res).toBeDefined();
      expect(res.invoices.length).toBeGreaterThan(0);
      expect(res.summary.totalBilledCents).toBeGreaterThan(0);
      expect(typeof res.totalPages).toBe("number");
    });

    it("fetches single invoice details with items and payment history", () => {
      const list = getAdminInvoicesList({});
      const first = list.invoices[0];
      const detail = getAdminInvoiceDetail(first.id);
      expect(detail).not.toBeNull();
      expect(detail?.invoice.id).toBe(first.id);
      expect(Array.isArray(detail?.lineItems)).toBe(true);
      expect(Array.isArray(detail?.payments)).toBe(true);
    });

    it("returns admin payments ledger with breakdown", () => {
      const res = getAdminPaymentsList({});
      expect(res).toBeDefined();
      expect(res.payments.length).toBeGreaterThan(0);
      expect(typeof res.summary.totalCollectedCents).toBe("number");
      expect(typeof res.summary.cardCollectedCents).toBe("number");
    });
  });

  describe("Admin Operations: Notifications, Reviews, Coupons & Audit Logs", () => {
    it("fetches notification history", () => {
      const notifs = getAdminNotificationsList();
      expect(Array.isArray(notifs)).toBe(true);
      expect(notifs.length).toBeGreaterThan(0);
      expect(notifs[0]).toHaveProperty("channel");
      expect(notifs[0]).toHaveProperty("recipient");
    });

    it("fetches and moderates customer reviews", () => {
      const reviews = getAdminReviewsList();
      expect(reviews.length).toBeGreaterThan(0);
      const first = reviews[0];
      const ok = moderateAdminReview(first.id, "approved");
      expect(ok).toBe(true);
    });

    it("manages promotional coupons (create and toggle active state)", () => {
      const initial = getAdminCouponsList();
      expect(initial.length).toBeGreaterThan(0);

      const created = createAdminCoupon({
        code: "SUMMERCOOL25",
        description: "Summer special discount",
        discountType: "percentage",
        discountValue: 25,
        minSpendCents: 10000,
        expiresAt: "2026-12-31T23:59:59Z",
      });
      expect(created.code).toBe("SUMMERCOOL25");
      expect(created.discountValue).toBe(25);

      const toggled = toggleAdminCoupon(created.id);
      expect(toggled).toBe(true);
    });

    it("fetches admin audit logs trail", () => {
      const res = getAdminAuditLogs();
      expect(Array.isArray(res.logs)).toBe(true);
      expect(res.logs.length).toBeGreaterThan(0);
      expect(res.logs[0]).toHaveProperty("action");
      expect(res.logs[0]).toHaveProperty("actor");
    });
  });

  describe("Technician Portal: Earnings & Notifications", () => {
    it("computes technician earnings with commission and tips", () => {
      const earnings = getTechEarnings("tech-carlos");
      expect(earnings.completedJobsCount).toBeGreaterThan(0);
      expect(earnings.commissionRatePct).toBe(20);
      expect(earnings.totalCommissionCents).toBeGreaterThan(0);
      expect(earnings.totalEarningsCents).toBe(
        earnings.totalCommissionCents + earnings.totalTipsCents
      );
    });

    it("retrieves technician notifications and marks item read", () => {
      const notifs = getTechNotifications("tech-carlos");
      expect(notifs.length).toBeGreaterThan(0);
      const first = notifs[0];
      const res = markTechNotificationRead("tech-carlos", first.id);
      expect(res).toBe(true);
    });
  });

  describe("Customer Portal: Reviews & Saved Services", () => {
    it("retrieves customer reviews and validates new review submission constraints", () => {
      const reviews = getCustomerReviews("cust-1");
      expect(Array.isArray(reviews)).toBe(true);

      // Attempt review for non-existent job
      const invalid = submitCustomerReview("cust-1", {
        jobId: "non-existent-job",
        rating: 5,
        content: "Awesome service!",
      });
      expect(invalid.ok).toBe(false);
      expect(invalid.error).toBeDefined();

      // Attempt review with invalid rating
      const invalidRating = submitCustomerReview("cust-1", {
        jobId: "job-1001",
        rating: 10,
        content: "Way too high rating!",
      });
      expect(invalidRating.ok).toBe(false);
    });

    it("toggles customer favorites (saved services)", () => {
      const serviceId = "svc-capacitor-replace";

      // Add to favorites
      const added = toggleCustomerFavorite("cust-1", serviceId);
      expect(added.saved).toBe(true);

      // Remove from favorites
      const removed = toggleCustomerFavorite("cust-1", serviceId);
      expect(removed.saved).toBe(false);
    });
  });
});
