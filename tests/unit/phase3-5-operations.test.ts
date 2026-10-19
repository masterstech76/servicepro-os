import { describe, expect, it, beforeEach } from "vitest";
import { resetLocalDb } from "@/lib/server/local-db-fallback";
import { populateRichDemoDataset } from "@/lib/server/demo-dataset";
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
});

