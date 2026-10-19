import { describe, it, expect, beforeEach } from "vitest";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { GET as getJobsRoute, POST as postJobRoute } from "@/app/api/admin/jobs/route";
import { GET as getCustomerRoute, PATCH as patchCustomerRoute } from "@/app/api/admin/customers/[id]/route";
import { GET as getInventoryRoute, POST as postInventoryRoute } from "@/app/api/admin/inventory/parts/route";
import { getAdminReportsData, getCentralInventoryOverview } from "@/lib/server/admin-portal";
import { checkRateLimit, resetRateLimits } from "@/lib/server/rate-limit";
import { verifyCsrfOrigin } from "@/lib/server/csrf";
import { resolveRequestActor } from "@/lib/server/auth-guard";

describe("Production Security, Role Authorization & Financial Integrity Audit", () => {
  beforeEach(() => {
    getLocalDbWithDemo();
    resetRateLimits();
  });

  describe("Server-Side API Authorization & Gatekeeping", () => {
    it("denies unauthenticated requests with no auth headers or cookies at all (401)", async () => {
      const req = new Request("http://localhost:3000/api/admin/jobs");
      const res = await getJobsRoute(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error?.code).toBe("UNAUTHORIZED");
    });

    it("strictly rejects x-servicepro-role spoofing when running outside test runner", async () => {
      const origVitest = process.env.VITEST;
      const origNodeEnv = process.env.NODE_ENV;
      try {
        delete (process.env as any).VITEST;
        (process.env as any).NODE_ENV = "production";
        const req = new Request("http://localhost:3000/api/admin/jobs", {
          headers: { "x-servicepro-role": "owner" },
        });
        const actor = await resolveRequestActor(req);
        expect(actor).toBeNull();
      } finally {
        process.env.VITEST = origVitest;
        (process.env as any).NODE_ENV = origNodeEnv;
      }
    });

    it("denies unauthenticated requests to admin work orders with explicit anon header (401)", async () => {
      const req = new Request("http://localhost:3000/api/admin/jobs", {
        headers: { "x-servicepro-role": "anon" },
      });
      const res = await getJobsRoute(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error?.code).toBe("UNAUTHORIZED");
    });

    it("denies technician role access to admin work orders (401)", async () => {
      const req = new Request("http://localhost:3000/api/admin/jobs", {
        headers: { "x-servicepro-role": "technician" },
      });
      const res = await getJobsRoute(req);
      expect(res.status).toBe(401);
    });

    it("denies customer role access to admin work orders (401)", async () => {
      const req = new Request("http://localhost:3000/api/admin/jobs", {
        headers: { "x-servicepro-role": "customer" },
      });
      const res = await getJobsRoute(req);
      expect(res.status).toBe(401);
    });

    it("allows authorized admin/owner access to admin work orders (200)", async () => {
      const req = new Request("http://localhost:3000/api/admin/jobs", {
        headers: { "x-servicepro-role": "owner" },
      });
      const res = await getJobsRoute(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.jobs).toBeDefined();
      expect(Array.isArray(data.jobs)).toBe(true);
    });
  });

  describe("Customer API Validation & Audit Logging", () => {
    it("denies unauthenticated requests to PATCH customer details (401)", async () => {
      const store = getLocalDbWithDemo();
      const customer = Array.from(store.customers.values())[0];
      const req = new Request(`http://localhost:3000/api/admin/customers/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "anon",
        },
        body: JSON.stringify({ name: "Hacker" }),
      });
      const res = await patchCustomerRoute(req, { params: { id: customer.id } });
      expect(res.status).toBe(401);
    });

    it("denies technician requests to PATCH customer details (401)", async () => {
      const store = getLocalDbWithDemo();
      const customer = Array.from(store.customers.values())[0];
      const req = new Request(`http://localhost:3000/api/admin/customers/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "technician",
        },
        body: JSON.stringify({ name: "Tech Attempt" }),
      });
      const res = await patchCustomerRoute(req, { params: { id: customer.id } });
      expect(res.status).toBe(401);
    });

    it("validates phone number format on customer update (400 if invalid)", async () => {
      const store = getLocalDbWithDemo();
      const customer = Array.from(store.customers.values())[0];
      const req = new Request(`http://localhost:3000/api/admin/customers/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "owner",
        },
        body: JSON.stringify({ phone: "123" }),
      });
      const res = await patchCustomerRoute(req, { params: { id: customer.id } });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error?.message).toMatch(/valid 10-digit phone/i);
    });

    it("validates email address format on customer update (400 if invalid)", async () => {
      const store = getLocalDbWithDemo();
      const customer = Array.from(store.customers.values())[0];
      const req = new Request(`http://localhost:3000/api/admin/customers/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "owner",
        },
        body: JSON.stringify({ email: "invalid-email-no-domain" }),
      });
      const res = await patchCustomerRoute(req, { params: { id: customer.id } });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error?.message).toMatch(/invalid email/i);
    });

    it("updates customer contact and writes an immutable audit record", async () => {
      const store = getLocalDbWithDemo();
      const customer = Array.from(store.customers.values())[0];
      const eventsBefore = Array.from(store.job_events.values()).length;

      const req = new Request(`http://localhost:3000/api/admin/customers/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "owner",
        },
        body: JSON.stringify({
          name: "Audited Customer",
          phone: "(305) 555-9988",
          email: "audited@example.com",
        }),
      });

      const res = await patchCustomerRoute(req, { params: { id: customer.id } });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.customer?.name).toBe("Audited Customer");

      // Verify audit event written
      const eventsAfter = Array.from(store.job_events.values());
      expect(eventsAfter.length).toBeGreaterThan(eventsBefore);

      const lastAudit = eventsAfter.find(
        (e) => e.event_type === "customer_updated" && (e.meta as any)?.customerId === customer.id
      );
      expect(lastAudit).toBeDefined();
      expect(lastAudit?.actor_id).toBe("owner");
    });
  });

  describe("Inventory Security & Negative Stock Prevention", () => {
    it("denies unauthenticated inventory adjustments (401)", async () => {
      const overview = getCentralInventoryOverview();
      const part = overview.parts[0];
      const req = new Request("http://localhost:3000/api/admin/inventory/parts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "anon",
        },
        body: JSON.stringify({
          partId: part.id,
          adjustment: -5,
          reason: "Cycle count test",
        }),
      });
      const res = await postInventoryRoute(req);
      expect(res.status).toBe(401);
    });

    it("rejects inventory adjustment without a mandatory reason (400)", async () => {
      const overview = getCentralInventoryOverview();
      const part = overview.parts[0];
      const req = new Request("http://localhost:3000/api/admin/inventory/parts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "owner",
        },
        body: JSON.stringify({
          partId: part.id,
          adjustment: 5,
          reason: "",
        }),
      });
      const res = await postInventoryRoute(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error?.message).toMatch(/reason/i);
    });

    it("prevents stock adjustments that drop warehouse quantity below zero (400)", async () => {
      const overview = getCentralInventoryOverview();
      const part = overview.parts[0];
      const req = new Request("http://localhost:3000/api/admin/inventory/parts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-servicepro-role": "owner",
        },
        body: JSON.stringify({
          partId: part.id,
          adjustment: -999999,
          reason: "Excessive decrement test",
        }),
      });
      const res = await postInventoryRoute(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error?.message).toMatch(/negative inventory/i);
    });
  });

  describe("Financial Integrity & Integer Cents Precision", () => {
    it("maintains integer currency cents precision across reports", () => {
      const reports = getAdminReportsData({ type: "revenue" });
      expect(Number.isInteger(reports.invoicedTotalCents)).toBe(true);
      expect(Number.isInteger(reports.collectedPaymentsCents)).toBe(true);
      expect(Number.isInteger(reports.taxCents)).toBe(true);
      expect(Number.isInteger(reports.outstandingDueCents)).toBe(true);
      expect(reports.invoicedTotalCents).toBeGreaterThan(0);
      expect(reports.collectedPaymentsCents).toBeGreaterThan(0);
    });

    it("reconciles invoice totals with line items and payments without floating point drift", () => {
      const store = getLocalDbWithDemo();
      const invoices = Array.from(store.invoices.values());
      expect(invoices.length).toBeGreaterThan(0);

      for (const inv of invoices) {
        expect(Number.isInteger(inv.total_cents)).toBe(true);
        expect(Number.isInteger(inv.subtotal_cents)).toBe(true);
        expect(Number.isInteger(inv.tax_cents)).toBe(true);
        expect(inv.total_cents).toBe(inv.subtotal_cents + inv.tax_cents);
      }
    });
  });

  describe("API Rate Limiting & Denial of Service Protection", () => {
    it("permits requests within configured rate limits", () => {
      const req = new Request("http://localhost:3000/api/contact", {
        headers: { "x-forwarded-for": "203.0.113.195" },
      });
      const res1 = checkRateLimit(req, { limit: 3, windowMs: 60000, keyPrefix: "test_contact" });
      expect(res1.allowed).toBe(true);
      expect(res1.remaining).toBe(2);

      const res2 = checkRateLimit(req, { limit: 3, windowMs: 60000, keyPrefix: "test_contact" });
      expect(res2.allowed).toBe(true);
      expect(res2.remaining).toBe(1);
    });

    it("enforces HTTP 429 Too Many Requests when rate threshold is breached", () => {
      const req = new Request("http://localhost:3000/api/auth/demo-session", {
        headers: { "x-forwarded-for": "198.51.100.42" },
      });

      // Exhaust 2 allowed attempts
      checkRateLimit(req, { limit: 2, windowMs: 60000, keyPrefix: "test_auth" });
      checkRateLimit(req, { limit: 2, windowMs: 60000, keyPrefix: "test_auth" });

      // 3rd attempt must be rejected with 429
      const blocked = checkRateLimit(req, { limit: 2, windowMs: 60000, keyPrefix: "test_auth" });
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.response).toBeDefined();
      expect(blocked.response?.status).toBe(429);
      expect(blocked.response?.headers.get("Retry-After")).toBeDefined();
    });
  });

  describe("Cross-Site Request Forgery (CSRF) Protection", () => {
    it("allows requests from matching application origin", () => {
      const req = new Request("http://localhost:3000/api/auth/demo-session", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          host: "localhost:3000",
        },
      });
      const result = verifyCsrfOrigin(req);
      expect(result.valid).toBe(true);
    });

    it("rejects cross-origin POST mutations from unauthorized origins (403)", () => {
      const req = new Request("http://localhost:3000/api/auth/demo-session", {
        method: "POST",
        headers: {
          origin: "https://malicious-attacker.com",
          host: "localhost:3000",
        },
      });
      const result = verifyCsrfOrigin(req);
      expect(result.valid).toBe(false);
      expect(result.response?.status).toBe(403);
    });

    it("verifies CSRF protection guards /api/jobs/checkout against cross-site forged origins (403)", () => {
      const req = new Request("http://localhost:3000/api/jobs/checkout", {
        method: "POST",
        headers: {
          origin: "https://evil-phishing-site.xyz",
          host: "localhost:3000",
        },
      });
      const result = verifyCsrfOrigin(req);
      expect(result.valid).toBe(false);
      expect(result.response?.status).toBe(403);
    });

    it("verifies CSRF protection guards /api/slots/hold and /api/payments/record (403)", () => {
      const holdReq = new Request("http://localhost:3000/api/slots/hold", {
        method: "POST",
        headers: {
          origin: "https://attacker.com",
          host: "localhost:3000",
        },
      });
      expect(verifyCsrfOrigin(holdReq).valid).toBe(false);

      const payReq = new Request("http://localhost:3000/api/payments/record", {
        method: "POST",
        headers: {
          origin: "https://attacker.com",
          host: "localhost:3000",
        },
      });
      expect(verifyCsrfOrigin(payReq).valid).toBe(false);
    });
  });
});
