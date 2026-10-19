import { describe, expect, it, beforeEach } from "vitest";
import { resetLocalDb } from "@/lib/server/local-db-fallback";
import {
  populateRichDemoDataset,
  clearDemoDataset,
  restoreDemoDataset,
  getDemoDataStats,
  deleteJobRecord,
} from "@/lib/server/demo-dataset";
import {
  getDispatchBoardData,
  suggestTechniciansForJob,
  assignTechnicianToJob,
  transitionJobState,
  cancelJobWithPolicy,
  rescheduleJobWindow,
  createOrUpdateInvoiceForJob,
  collectJobPayment,
  getRevenueReport,
} from "@/lib/server/operations";
import { acePlumbingAustinConfig } from "@config/examples/ace-plumbing-austin";
import { businessConfigSchema } from "@config/business.schema";
import { processStripeWebhookEvent } from "@/lib/server/stripe-webhook";
import { chargeCustomerOffSession } from "@/lib/server/stripe";
import { maskPhoneForLogs } from "@/lib/server/sms";
import { GET as getJobByIdRoute } from "@/app/api/jobs/[id]/route";
import { getLocalDb, rpcHoldSlot } from "@/lib/server/local-db-fallback";
import { fromZonedTime } from "date-fns-tz";

describe("Phases 3, 4 & 5 — Full-Stack Server Operations & White-Label Config", () => {
  beforeEach(() => {
    const store = resetLocalDb();
    populateRichDemoDataset(store);
  });

  it("loads Dispatch Board with today's jobs, technician load, and SLA alerts for unassigned jobs within 2h", () => {
    const board = getDispatchBoardData();
    expect(board.jobs.length).toBeGreaterThanOrEqual(8);
    expect(board.technicians).toHaveLength(4);
    expect(board.kpis.unassignedCount).toBeGreaterThanOrEqual(2);
    expect(board.kpis.unassignedUrgentCount).toBeGreaterThanOrEqual(2);
    expect(board.alerts.length).toBeGreaterThanOrEqual(2);
  });

  it("ranks technicians for an unassigned job, enforces eligibility, and supports force-assign", async () => {
    const board = getDispatchBoardData();
    const unassignedJob = board.jobs.find((j) => j.status === "unassigned")!;
    expect(unassignedJob).toBeDefined();

    const suggestions = suggestTechniciansForJob(unassignedJob.id);
    expect(suggestions).toHaveLength(4);
    const eligibleTech = suggestions.find((s) => s.eligible)!;
    expect(eligibleTech).toBeDefined();

    // Assign to eligible technician
    const assignedRes = await assignTechnicianToJob({
      jobId: unassignedJob.id,
      technicianId: eligibleTech.technicianId,
    });
    expect(assignedRes.ok).toBe(true);
    expect(assignedRes.job?.status).toBe("assigned");
    expect(assignedRes.job?.technician?.id).toBe(eligibleTech.technicianId);

    // If there is an ineligible technician, verify non-forced assign returns ok: false and force: true succeeds
    const ineligibleTech = suggestions.find((s) => !s.eligible);
    if (ineligibleTech) {
      const blocked = await assignTechnicianToJob({
        jobId: unassignedJob.id,
        technicianId: ineligibleTech.technicianId,
        force: false,
      });
      expect(blocked.ok).toBe(false);

      const forced = await assignTechnicianToJob({
        jobId: unassignedJob.id,
        technicianId: ineligibleTech.technicianId,
        force: true,
      });
      expect(forced.ok).toBe(true);
      expect(forced.job?.technician?.id).toBe(ineligibleTech.technicianId);
    }
  });

  it("walks job state machine assigned -> on_the_way -> in_progress -> invoice + parts + tip + payment collection", async () => {
    const board = getDispatchBoardData();
    const assignedJob = board.jobs.find((j) => j.status === "assigned")!;
    expect(assignedJob).toBeDefined();

    // Transition to on_the_way (triggers ETA SMS)
    const onWay = await transitionJobState({
      jobId: assignedJob.id,
      toStatus: "on_the_way",
      actor: "technician",
    });
    expect(onWay.ok).toBe(true);
    expect(onWay.job?.status).toBe("on_the_way");
    expect(onWay.job?.onTheWayAt).toBeTruthy();

    // Transition to in_progress
    const inProg = await transitionJobState({
      jobId: assignedJob.id,
      toStatus: "in_progress",
      actor: "technician",
    });
    expect(inProg.ok).toBe(true);
    expect(inProg.job?.status).toBe("in_progress");

    // Create invoice with $99 labor + $120 taxable part -> $219 subtotal + $8.40 tax (7%)
    const invRes = await createOrUpdateInvoiceForJob({
      jobId: assignedJob.id,
      tipCents: 4380, // 20% of $219.00
      lineItems: [
        {
          kind: "labor",
          description: "AC Repair Labor",
          quantity: 1,
          unitPriceCents: 9900,
          taxable: false,
        },
        {
          kind: "parts",
          description: "OEM Dual Run Capacitor",
          quantity: 1,
          unitPriceCents: 12000,
          taxable: true,
        },
      ],
    });
    expect(invRes.ok).toBe(true);
    expect(invRes.job?.invoice?.subtotalCents).toBe(21900);
    expect(invRes.job?.invoice?.taxCents).toBe(840);
    expect(invRes.job?.invoice?.tipCents).toBe(4380);
    // $219.00 + $8.40 + $43.80 - $19.80 deposit = $251.40 (25140 cents)
    expect(invRes.job?.invoice?.amountDueCents).toBe(25140);

    // Collect remaining balance on card on file
    const payRes = await collectJobPayment({
      jobId: assignedJob.id,
      method: "card_on_file",
      tipCents: 4380,
    });
    expect(payRes.ok).toBe(true);
    expect(payRes.job?.status).toBe("completed");
    expect(payRes.job?.invoice?.status).toBe("paid");
    expect(payRes.job?.invoice?.amountDueCents).toBe(0);
  });

  it("handles job rescheduling and D12 cancellation refund policy", async () => {
    const board = getDispatchBoardData();
    const targetJob = board.jobs.find((j) => j.status === "unassigned")!;

    const resched = await rescheduleJobWindow({
      jobId: targetJob.id,
      newStartIso: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    });
    expect(resched.ok).toBe(true);

    // Cancel outside 24h window -> auto refund deposit
    const cancelled = await cancelJobWithPolicy({
      jobId: targetJob.id,
      reason: "Customer travelling",
      refundDeposit: "auto",
    });
    expect(cancelled.ok).toBe(true);
    expect(cancelled.refunded).toBe(true);
    expect(cancelled.refundCents).toBe(targetJob.depositCents);
    expect(cancelled.job?.status).toBe("cancelled");
  });

  it("computes 14-day revenue and commission reports by tech, service, and day", () => {
    const byTech = getRevenueReport({ groupBy: "tech" });
    expect(byTech.summary.jobsCompleted).toBeGreaterThan(15);
    expect(byTech.summary.grossCents).toBeGreaterThan(100000);
    expect(byTech.rows.length).toBeGreaterThanOrEqual(4);

    const byService = getRevenueReport({ groupBy: "service" });
    expect(byService.rows.length).toBeGreaterThanOrEqual(4);

    const byDay = getRevenueReport({ groupBy: "day" });
    expect(byDay.rows.length).toBeGreaterThanOrEqual(10);
  });

  it("handles Stripe webhook idempotency/replay and SLOT_LOST auto-refund path", async () => {
    const store = getLocalDb();
    const bizId = "00000000-0000-4000-8000-000000000001";
    store.nowOverride = fromZonedTime("2027-05-03T04:00:00", "America/New_York");

    // Hold a 1-capacity slot (07:00 AM on Monday, 3h > 2h min_notice)
    const slotIso = fromZonedTime("2027-05-03T07:00:00", "America/New_York").toISOString();
    const holdId = await rpcHoldSlot(
      {
        p_business: bizId,
        p_service: "svc-ac-repair",
        p_zip: "33133",
        p_start: slotIso,
        p_ip_hash: "ip_wh_1",
        p_payload: {
          customer: { name: "Alex Mercer", phone: "+13055550177", email: "alex@example.com" },
          address: { line1: "500 Brickell Ave", city: "Miami", state: "FL" },
          estimatedTotalCents: 9900,
        },
      },
      store
    );

    const evtPayload = {
      id: "evt_stripe_test_001",
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_test_001",
          amount: 1980,
          metadata: { hold_id: holdId },
          payment_method_details: { card: { brand: "visa", last4: "4242" } },
        },
      },
    };

    const firstRun = await processStripeWebhookEvent(evtPayload, store);
    expect(firstRun.duplicate).toBe(false);
    expect(firstRun.action).toBe("job_created");
    expect(firstRun.jobId).toBeTruthy();

    // Replay identical event ID -> idempotent duplicate
    const replayRun = await processStripeWebhookEvent(evtPayload, store);
    expect(replayRun.duplicate).toBe(true);
    expect(replayRun.action).toBe("ignored");

    // Test SLOT_LOST when hold expired and slot capacity is now 0
    const slot2Iso = fromZonedTime("2027-05-04T07:00:00", "America/New_York").toISOString();
    const holdLostId = await rpcHoldSlot(
      {
        p_business: bizId,
        p_service: "svc-ac-repair",
        p_zip: "33133",
        p_start: slot2Iso,
        p_ip_hash: "ip_wh_2",
        p_payload: {
          customer: { name: "Late Buyer", phone: "+13055550188", email: "late@example.com" },
        },
      },
      store
    );

    // Advance time 15 minutes so holdLostId is expired, and occupy the 07:00 slot with a job
    store.nowOverride = fromZonedTime("2027-05-03T04:15:00", "America/New_York");
    const existingJob = store.jobs.get(firstRun.jobId!)!;
    store.jobs.set("job_occupying_slot2", {
      ...existingJob,
      id: "job_occupying_slot2",
      job_number: 9999,
      scheduled_start: slot2Iso,
      scheduled_end: fromZonedTime("2027-05-04T08:30:00", "America/New_York").toISOString(),
      deposit_payment_intent_id: "pi_other_customer",
    });

    // Now the late buyer's webhook arrives -> SLOT_LOST auto-refund + slot_lost SMS
    const slotLostRes = await processStripeWebhookEvent(
      {
        id: "evt_stripe_slot_lost_002",
        type: "payment_intent.succeeded",
        data: {
          object: {
            id: "pi_late_buyer",
            amount: 1980,
            metadata: { hold_id: holdLostId },
          },
        },
      },
      store
    );
    expect(slotLostRes.action).toBe("slot_lost_refunded");
    expect(slotLostRes.refundId).toContain("re_slot_lost_");
  });

  it("validates Ace Plumbing Austin white-label config schema & rejects low-contrast color pairs", () => {
    expect(acePlumbingAustinConfig.businessName).toBe("Ace Plumbing Austin");
    expect(acePlumbingAustinConfig.timezone).toBe("America/Chicago");
    expect(acePlumbingAustinConfig.services).toHaveLength(3);

    // Low-contrast primary color (#CBD5E1 on #FFFFFF) should fail schema validation
    const invalidContrast = businessConfigSchema.safeParse({
      ...acePlumbingAustinConfig,
      colors: {
        ...acePlumbingAustinConfig.colors,
        primary: "#CBD5E1",
      },
    });
    expect(invalidContrast.success).toBe(false);
  });

  it("enforces API RBAC (anon 401, other tech 403, assigned tech 200, owner 200), 3DS off-session fallback, and PII masking", async () => {
    const board = getDispatchBoardData();
    const carlosJob = board.jobs.find((j) => j.technician?.id === "tech-carlos")!;
    expect(carlosJob).toBeDefined();

    // 1. Anon cannot fetch job via API -> 401
    const anonRes = await getJobByIdRoute(
      new Request(`http://localhost:3000/api/jobs/${carlosJob.id}`, {
        headers: { "x-servicepro-role": "anon" },
      }),
      { params: { id: carlosJob.id } }
    );
    expect(anonRes.status).toBe(401);

    // 2. Technician Danny cannot fetch Carlos's job via API -> 403
    const otherTechRes = await getJobByIdRoute(
      new Request(`http://localhost:3000/api/jobs/${carlosJob.id}`, {
        headers: {
          "x-servicepro-role": "technician",
          "x-servicepro-tech-id": "tech-danny",
        },
      }),
      { params: { id: carlosJob.id } }
    );
    expect(otherTechRes.status).toBe(403);

    // 3. Assigned Technician Carlos can fetch his own job -> 200
    const ownTechRes = await getJobByIdRoute(
      new Request(`http://localhost:3000/api/jobs/${carlosJob.id}`, {
        headers: {
          "x-servicepro-role": "technician",
          "x-servicepro-tech-id": "tech-carlos",
        },
      }),
      { params: { id: carlosJob.id } }
    );
    expect(ownTechRes.status).toBe(200);

    // 4. Owner can fetch any job -> 200
    const ownerRes = await getJobByIdRoute(
      new Request(`http://localhost:3000/api/jobs/${carlosJob.id}`, {
        headers: { "x-servicepro-role": "owner" },
      }),
      { params: { id: carlosJob.id } }
    );
    expect(ownerRes.status).toBe(200);

    // 5. Off-session charge requiring authentication returns { fallback: "link" }
    const authReqRes = await chargeCustomerOffSession({
      jobId: carlosJob.id,
      invoiceId: "inv_test_3ds",
      amountCents: 12500,
      simulateAuthRequired: true,
    });
    expect(authReqRes.status).toBe("requires_action");
    expect(authReqRes.fallback).toBe("link");

    // 6. Phone PII masking hides middle digits
    expect(maskPhoneForLogs("+13055550142")).toBe("+1305***0142");
  });

  it("deletes sample demo data with 1-click while preserving real user-created jobs and customers", () => {
    const store = getLocalDb();

    // Verify initial demo data
    const initialStats = getDemoDataStats(store);
    expect(initialStats.demoJobs).toBeGreaterThan(0);
    expect(initialStats.demoCustomers).toBeGreaterThan(0);

    // Simulate a real user booking created via /book
    const realCustomerId = "cust_real_live_001";
    store.customers.set(realCustomerId, {
      id: realCustomerId,
      business_id: "00000000-0000-4000-8000-000000000001",
      name: "Real Live Customer",
      phone: "+13055550999",
      email: "real@customer.com",
      stripe_customer_id: null,
      stripe_payment_method_id: null,
      card_brand: "Visa",
      card_last4: "4242",
      sms_opt_out: false,
      sms_consent_at: null,
      created_at: new Date().toISOString(),
    });

    const realJobId = "job_real_live_001";
    store.jobs.set(realJobId, {
      id: realJobId,
      business_id: "00000000-0000-4000-8000-000000000001",
      job_number: 9999,
      customer_id: realCustomerId,
      service_id: "svc-ac-repair",
      status: "unassigned",
      scheduled_start: new Date().toISOString(),
      scheduled_end: new Date(Date.now() + 7200000).toISOString(),
      technician_id: null,
      address_line1: "1000 Brickell Ave",
      address_line2: null,
      city: "Miami",
      state: "FL",
      zip: "33131",
      lat: 25.76,
      lng: -80.19,
      issue_text: "Real customer AC blowing warm air",
      issue_photos: [],
      before_photos: [],
      after_photos: [],
      notes_internal: null,
      tech_notes: null,
      billable_minutes: null,
      on_the_way_at: null,
      started_at: null,
      completed_at: null,
      estimated_total_cents: 18900,
      deposit_cents: 3780,
      deposit_paid_at: new Date().toISOString(),
      deposit_payment_intent_id: "pi_real_001",
      total_cents: null,
      tip_cents: 0,
      cancel_reason: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Run clearDemoDataset
    const cleared = clearDemoDataset(store);
    expect(cleared.demoJobsRemoved).toBe(initialStats.demoJobs);
    expect(cleared.demoCustomersRemoved).toBe(initialStats.demoCustomers);

    // Verify all demo jobs are gone
    const afterClearStats = getDemoDataStats(store);
    expect(afterClearStats.demoJobs).toBe(0);
    expect(afterClearStats.demoCustomers).toBe(0);

    // Crucial: verify REAL booking and customer were 100% PRESERVED
    expect(store.jobs.has(realJobId)).toBe(true);
    expect(store.customers.has(realCustomerId)).toBe(true);
    expect(afterClearStats.realJobs).toBe(1);
    expect(afterClearStats.realCustomers).toBe(1);

    // Run restoreDemoDataset
    const restored = restoreDemoDataset(store);
    expect(restored.demoJobsRestored).toBeGreaterThan(0);
    expect(restored.demoCustomersRestored).toBeGreaterThan(0);

    // Verify real customer and real job are STILL intact after restore
    expect(store.jobs.has(realJobId)).toBe(true);
    expect(store.customers.has(realCustomerId)).toBe(true);
    const afterRestoreStats = getDemoDataStats(store);
    expect(afterRestoreStats.realJobs).toBe(1);
    expect(afterRestoreStats.demoJobs).toBe(restored.demoJobsRestored);

    // Test individual job deletion
    const jobDeleted = deleteJobRecord(realJobId, store);
    expect(jobDeleted).toBe(true);
    expect(store.jobs.has(realJobId)).toBe(false);
  });

  it("records payment method transactions and updates ledger with transaction IDs", async () => {
    const store = getLocalDb();
    const demoJob = store.jobs.get("job_today_6")!;
    expect(demoJob).toBeDefined();

    // 1. Collect payment using a new card
    const cardPayRes = await collectJobPayment({
      jobId: demoJob.id,
      method: "tap_card",
      tipCents: 1500,
      cardBrand: "Mastercard",
      cardLast4: "5555",
      cardholderName: "Test Cardholder",
      actorLabel: "customer",
    });

    expect(cardPayRes.ok).toBe(true);
    expect(cardPayRes.transactionId).toBeDefined();
    expect(cardPayRes.job?.invoice?.status).toBe("paid");

    // Check payment record in store
    const payments = Array.from(store.payments.values()).filter((p) => p.job_id === demoJob.id);
    const balancePayment = payments.find((p) => p.kind === "remaining");
    expect(balancePayment).toBeDefined();
    expect(balancePayment?.status).toBe("succeeded");
    expect(balancePayment?.stripe_payment_intent_id).toBe(cardPayRes.transactionId);

    // Customer card on file was updated
    const customer = store.customers.get(demoJob.customer_id);
    expect(customer?.card_last4).toBe("5555");
    expect(customer?.card_brand).toBe("Mastercard");
  });
});

