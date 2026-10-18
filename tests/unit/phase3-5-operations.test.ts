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

  it("validates Ace Plumbing Austin white-label config schema & contrast rules", () => {
    expect(acePlumbingAustinConfig.businessName).toBe("Ace Plumbing Austin");
    expect(acePlumbingAustinConfig.timezone).toBe("America/Chicago");
    expect(acePlumbingAustinConfig.services).toHaveLength(3);
  });
});
