import { describe, expect, it, beforeEach } from "vitest";
import {
  validateJobTransition,
  shouldRefundDepositOnCancel,
} from "@/lib/domain/job-state";
import {
  scoreAndRankTechnicians,
  estimateTravelMinutesHaversine,
  type CandidateTechInput,
  type TargetJobInput,
} from "@/lib/domain/dispatch-score";
import { computeTipPresets, computeTipFromPercent } from "@/lib/domain/tip";
import { renderSmsTemplate, sendServiceSms } from "@/lib/server/sms";
import { resetLocalDb } from "@/lib/server/local-db-fallback";

describe("Phase 3 & 4 Domain Modules", () => {
  describe("job-state.ts — State Machine & D12 Cancellation Policy", () => {
    it("allows all legal forward transitions and blocks illegal ones", () => {
      expect(
        validateJobTransition({ from: "unassigned", to: "assigned", actor: "owner" }).valid
      ).toBe(true);
      expect(
        validateJobTransition({ from: "assigned", to: "unassigned", actor: "owner" }).valid
      ).toBe(true);
      expect(
        validateJobTransition({ from: "assigned", to: "on_the_way", actor: "technician" }).valid
      ).toBe(true);
      expect(
        validateJobTransition({ from: "on_the_way", to: "in_progress", actor: "technician" }).valid
      ).toBe(true);
      expect(
        validateJobTransition({ from: "in_progress", to: "completed", actor: "technician" }).valid
      ).toBe(true);

      // Illegal skips or backward transitions
      expect(
        validateJobTransition({ from: "unassigned", to: "on_the_way", actor: "owner" }).valid
      ).toBe(false);
      expect(
        validateJobTransition({ from: "assigned", to: "in_progress", actor: "technician" }).valid
      ).toBe(false);
      expect(
        validateJobTransition({ from: "on_the_way", to: "completed", actor: "technician" }).valid
      ).toBe(false);
      expect(
        validateJobTransition({ from: "completed", to: "in_progress", actor: "owner" }).valid
      ).toBe(false);
      expect(
        validateJobTransition({
          from: "completed",
          to: "cancelled",
          actor: "owner",
          reason: "Changed mind",
        }).valid
      ).toBe(false);
      expect(
        validateJobTransition({ from: "cancelled", to: "assigned", actor: "owner" }).valid
      ).toBe(false);
    });

    it("enforces photo requirements when configured on completion", () => {
      const blocked = validateJobTransition({
        from: "in_progress",
        to: "completed",
        actor: "technician",
        requireBeforePhoto: true,
        requireAfterPhoto: true,
        beforePhotosCount: 0,
        afterPhotosCount: 1,
      });
      expect(blocked.valid).toBe(false);
      expect(blocked.code).toBe("BEFORE_PHOTO_REQUIRED");

      const allowed = validateJobTransition({
        from: "in_progress",
        to: "completed",
        actor: "technician",
        requireBeforePhoto: true,
        requireAfterPhoto: true,
        beforePhotosCount: 1,
        afterPhotosCount: 2,
      });
      expect(allowed.valid).toBe(true);
    });

    it("computes D12 cancellation refund policy accurately around the window", () => {
      const now = new Date("2026-10-20T12:00:00Z");
      const scheduled6hAway = new Date("2026-10-20T18:00:00Z"); // 6h notice >= 4h window
      const scheduled2hAway = new Date("2026-10-20T14:00:00Z"); // 2h notice < 4h window

      expect(
        shouldRefundDepositOnCancel({
          scheduledStart: scheduled6hAway,
          cancelledAt: now,
          cancellationWindowHours: 4,
          refundDeposit: "auto",
        })
      ).toBe(true);

      expect(
        shouldRefundDepositOnCancel({
          scheduledStart: scheduled2hAway,
          cancelledAt: now,
          cancellationWindowHours: 4,
          refundDeposit: "auto",
        })
      ).toBe(false);

      expect(
        shouldRefundDepositOnCancel({
          scheduledStart: scheduled2hAway,
          cancelledAt: now,
          cancellationWindowHours: 4,
          refundDeposit: "yes",
        })
      ).toBe(true);
    });
  });

  describe("dispatch-score.ts — Section 13 Dispatch Scoring & Eligibility", () => {
    const targetJob: TargetJobInput = {
      id: "job-target",
      serviceSkillTag: "hvac",
      zip: "33131",
      scheduledStart: "2026-10-20T14:00:00.000Z", // Tuesday 10:00 AM EDT
      scheduledEnd: "2026-10-20T15:30:00.000Z", // Tuesday 11:30 AM EDT
      bufferMinutes: 30,
      timezone: "America/New_York",
    };

    it("ranks eligible technicians above ineligible ones and applies Section 13 weights", () => {
      const candidates: CandidateTechInput[] = [
        {
          id: "tech-carlos",
          name: "Carlos Mendez",
          color: "#3B82F6",
          active: true,
          skills: ["hvac"],
          zipCodes: ["33131"],
          workingWindow: { start: "07:00", end: "16:00" },
          timeOffRanges: [],
          existingJobsThatDay: [
            {
              id: "job-1",
              jobNumber: 1001,
              scheduledStart: "2026-10-20T11:30:00.000Z",
              scheduledEnd: "2026-10-20T13:00:00.000Z",
              zip: "33130",
            },
          ],
          travelMinutesFromPreviousStop: 10,
          travelMinutesToNextStop: 0,
          revenueSoFarThisWeekCents: 120000,
        },
        {
          id: "tech-danny",
          name: "Danny Reyes",
          color: "#14B8A6",
          active: true,
          skills: ["hvac"],
          zipCodes: ["33139"], // does not cover 33131
          workingWindow: { start: "09:00", end: "18:00" },
          timeOffRanges: [],
          existingJobsThatDay: [],
          travelMinutesFromPreviousStop: 12,
          travelMinutesToNextStop: 0,
          revenueSoFarThisWeekCents: 80000,
        },
        {
          id: "tech-maria",
          name: "Maria Alvarez",
          color: "#A855F7",
          active: true,
          skills: ["hvac"],
          zipCodes: [], // covers all ZIPs
          workingWindow: { start: "08:00", end: "17:00" },
          timeOffRanges: [],
          existingJobsThatDay: [], // 0 jobs today -> 0 load penalty
          travelMinutesFromPreviousStop: 8,
          travelMinutesToNextStop: 0,
          revenueSoFarThisWeekCents: 90000,
        },
      ];

      const ranked = scoreAndRankTechnicians(targetJob, candidates);
      expect(ranked).toHaveLength(3);
      // Maria (eligible, 0 jobs today) should be #1
      expect(ranked[0].technicianId).toBe("tech-maria");
      expect(ranked[0].eligible).toBe(true);
      expect(ranked[0].breakdown.load).toBe(0);

      // Carlos (eligible, 1 job today -> -15 load) should be #2
      expect(ranked[1].technicianId).toBe("tech-carlos");
      expect(ranked[1].eligible).toBe(true);
      expect(ranked[1].breakdown.load).toBe(-15);

      // Danny (ineligible due to ZIP) should be #3
      expect(ranked[2].technicianId).toBe("tech-danny");
      expect(ranked[2].eligible).toBe(false);
      expect(ranked[2].reason).toContain("Outside coverage");
    });

    it("calculates Haversine travel minutes fallback reasonably", () => {
      const minutes = estimateTravelMinutesHaversine(25.7617, -80.1918, 25.7907, -80.13);
      expect(minutes).toBeGreaterThanOrEqual(8);
      expect(minutes).toBeLessThanOrEqual(25);
    });
  });

  describe("tip.ts — Tip Computation", () => {
    it("computes preset percentage and custom tip amounts in integer cents", () => {
      // $219.00 pre-tax subtotal * 20% = $43.80 (4380 cents)
      expect(computeTipFromPercent(21900, 20)).toBe(4380);
      const presets = computeTipPresets(21900, [15, 20, 25]);
      expect(presets).toEqual([
        { pct: 15, amountCents: 3285 },
        { pct: 20, amountCents: 4380 },
        { pct: 25, amountCents: 5475 },
      ]);
      expect(computeTipFromPercent(21900, 0)).toBe(0);
    });
  });

  describe("sms/index.ts — SMS Templates & Opt-Out Enforcement", () => {
    beforeEach(() => {
      resetLocalDb();
    });

    it("renders templates and records SMS in sms_log + job_events, blocking opted-out customers", async () => {
      const body = renderSmsTemplate("on_the_way", {
        biz: "Cool Air HVAC",
        techFirst: "Carlos",
        addressShort: "123 Brickell Ave",
        eta: 18,
        n: 1031,
      });
      expect(body).toContain("Carlos is on the way");
      expect(body).toContain("ETA about 18 min");

      const store = resetLocalDb();
      const bizId = Array.from(store.businesses.keys())[0];
      store.customers.set("cust_sms_1", {
        id: "cust_sms_1",
        business_id: bizId,
        name: "Maria Rivera",
        phone: "+13055550142",
        email: "maria@example.com",
        stripe_customer_id: null,
        stripe_payment_method_id: null,
        card_brand: null,
        card_last4: null,
        sms_opt_out: false,
        sms_consent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      const sent = await sendServiceSms({
        customerId: "cust_sms_1",
        to: "+13055550142",
        template: "on_the_way",
        vars: {
          biz: "Cool Air HVAC",
          techFirst: "Carlos",
          eta: 18,
          n: 1031,
        },
      });
      expect(sent.sent).toBe(true);
      expect(store.sms_log.size).toBe(1);

      // Now opt out customer and verify skip
      const c = store.customers.get("cust_sms_1")!;
      c.sms_opt_out = true;
      store.customers.set("cust_sms_1", c);

      const skipped = await sendServiceSms({
        customerId: "cust_sms_1",
        to: "+13055550142",
        template: "on_the_way",
        vars: {
          biz: "Cool Air HVAC",
          techFirst: "Carlos",
        },
      });
      expect(skipped.sent).toBe(false);
      expect(skipped.optedOut).toBe(true);
    });
  });
});
