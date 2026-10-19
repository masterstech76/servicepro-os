import "server-only";
import { addMinutes, subDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import { computeInvoiceTotals, roundHalfUp } from "@/lib/domain/pricing";
import {
  validateJobTransition,
  shouldRefundDepositOnCancel,
} from "@/lib/domain/job-state";
import {
  scoreAndRankTechnicians,
  estimateTravelMinutesHaversine,
  type CandidateTechInput,
  type TargetJobInput,
  type TechSuggestionResult,
} from "@/lib/domain/dispatch-score";
import { sendServiceSms } from "@/lib/server/sms";
import {
  getLocalDbWithDemo,
  isDemoCustomerId,
  isDemoJobId,
} from "@/lib/server/demo-dataset";
import { saveLocalDbToDisk } from "@/lib/server/local-db-fallback";
import { chargeCustomerOffSession } from "@/lib/server/stripe";
import type { JobStatus, PaymentKind, PaymentStatus } from "@/lib/supabase/types";

export interface EnrichedJob {
  id: string;
  jobNumber: number;
  isDemo?: boolean;
  status: JobStatus;
  scheduledStart: string;
  scheduledEnd: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zip: string;
  lat: number | null;
  lng: number | null;
  issueText: string | null;
  issuePhotos: string[];
  beforePhotos: string[];
  afterPhotos: string[];
  estimatedTotalCents: number;
  depositCents: number;
  depositPaymentIntentId: string | null;
  totalCents: number | null;
  tipCents: number;
  billableMinutes: number | null;
  notesInternal: string | null;
  techNotes: string | null;
  cancelReason: string | null;
  cancelledAt: string | null;
  onTheWayAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  isUnassignedUrgent: boolean;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    cardBrand: string | null;
    cardLast4: string | null;
    smsOptOut: boolean;
    isDemo?: boolean;
  };
  service: {
    id: string;
    name: string;
    category: string;
    skillTag: string;
    pricingType: "flat" | "hourly";
    priceCents: number;
    durationMinutes: number;
    minBillableMinutes: number;
  };
  technician: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    color: string;
    commissionPct: number;
  } | null;
  invoice: {
    id: string;
    invoiceNumber: string;
    status: "draft" | "sent" | "paid" | "void";
    subtotalCents: number;
    taxCents: number;
    tipCents: number;
    totalCents: number;
    depositCreditCents: number;
    amountPaidCents: number;
    amountDueCents: number;
    publicPayToken: string;
    lineItems: Array<{
      id: string;
      kind: "labor" | "parts" | "fee" | "discount";
      description: string;
      quantity: number;
      unitPriceCents: number;
      taxable: boolean;
      amountCents: number;
    }>;
  } | null;
  payments: Array<{
    id: string;
    kind: PaymentKind;
    method: "card" | "cash" | "check" | "other";
    status: PaymentStatus;
    amountCents: number;
    stripePaymentIntentId: string | null;
    stripeChargeId?: string | null;
    stripeRefundId?: string | null;
    recordedBy?: string | null;
    createdAt: string;
  }>;
  events: Array<{
    id: string;
    actorLabel: string | null;
    eventType: string;
    fromStatus: JobStatus | null;
    toStatus: JobStatus | null;
    meta: Record<string, unknown>;
    createdAt: string;
  }>;
}

export function enrichJob(
  jobId: string,
  store = getLocalDbWithDemo()
): EnrichedJob | null {
  const job = store.jobs.get(jobId);
  if (!job) return null;

  const customer = store.customers.get(job.customer_id);
  const service = store.services.get(job.service_id);
  const technician = job.technician_id
    ? store.technicians.get(job.technician_id) ?? null
    : null;

  if (!customer || !service) return null;

  const invRow = Array.from(store.invoices.values()).find(
    (inv) => inv.job_id === job.id
  );
  const lineItems = invRow
    ? Array.from(store.invoice_line_items.values())
        .filter((li) => li.invoice_id === invRow.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((li) => ({
          id: li.id,
          kind: li.kind,
          description: li.description,
          quantity: Number(li.quantity),
          unitPriceCents: li.unit_price_cents,
          taxable: li.taxable,
          amountCents: li.amount_cents,
        }))
    : [];

  const payments = Array.from(store.payments.values())
    .filter((p) => p.job_id === job.id)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((p) => ({
      id: p.id,
      kind: p.kind,
      method: p.method,
      status: p.status,
      amountCents: p.amount_cents,
      stripePaymentIntentId: p.stripe_payment_intent_id,
      stripeChargeId: p.stripe_charge_id,
      stripeRefundId: p.stripe_refund_id,
      recordedBy: p.recorded_by ?? null,
      createdAt: p.created_at,
    }));

  const otherPaidCents = payments
    .filter(
      (p) =>
        p.status === "succeeded" && p.kind !== "deposit" && p.kind !== "refund"
    )
    .reduce((sum, p) => sum + p.amountCents, 0);

  const events = Array.from(store.job_events.values())
    .filter((e) => e.job_id === job.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((e) => ({
      id: e.id,
      actorLabel: e.actor_label,
      eventType: e.event_type,
      fromStatus: e.from_status,
      toStatus: e.to_status,
      meta: (e.meta ?? {}) as Record<string, unknown>,
      createdAt: e.created_at,
    }));

  const nowMs = Date.now();
  const startMs = new Date(job.scheduled_start).getTime();
  const hoursUntilStart = (startMs - nowMs) / 3_600_000;
  const isUnassignedUrgent =
    job.status === "unassigned" &&
    ((hoursUntilStart <= 2.5 && hoursUntilStart >= -4) || job.id.startsWith("job_today_"));

  return {
    id: job.id,
    jobNumber: job.job_number,
    isDemo: isDemoJobId(job.id),
    status: job.status,
    scheduledStart: job.scheduled_start,
    scheduledEnd: job.scheduled_end,
    addressLine1: job.address_line1,
    addressLine2: job.address_line2,
    city: job.city,
    state: job.state,
    zip: job.zip,
    lat: job.lat,
    lng: job.lng,
    issueText: job.issue_text,
    issuePhotos: job.issue_photos,
    beforePhotos: job.before_photos,
    afterPhotos: job.after_photos,
    estimatedTotalCents: job.estimated_total_cents,
    depositCents: job.deposit_cents,
    depositPaymentIntentId: job.deposit_payment_intent_id ?? null,
    totalCents: job.total_cents,
    tipCents: job.tip_cents,
    billableMinutes: job.billable_minutes,
    notesInternal: job.notes_internal,
    techNotes: job.tech_notes,
    cancelReason: job.cancel_reason,
    cancelledAt: job.cancelled_at,
    onTheWayAt: job.on_the_way_at,
    startedAt: job.started_at,
    completedAt: job.completed_at,
    createdAt: job.created_at,
    isUnassignedUrgent,
    customer: {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      cardBrand: customer.card_brand,
      cardLast4: customer.card_last4,
      smsOptOut: customer.sms_opt_out,
      isDemo: isDemoCustomerId(customer.id),
    },
    service: {
      id: service.id,
      name: service.name,
      category: service.category ?? "HVAC",
      skillTag: service.skill_tag,
      pricingType: service.pricing_type,
      priceCents: service.price_cents,
      durationMinutes: service.duration_minutes,
      minBillableMinutes: service.min_billable_minutes,
    },
    technician: technician
      ? {
          id: technician.id,
          name: technician.name,
          phone: technician.phone,
          email: technician.email,
          color: technician.color,
          commissionPct: Number(technician.commission_pct),
        }
      : null,
    invoice: invRow
      ? {
          id: invRow.id,
          invoiceNumber: invRow.invoice_number,
          status: invRow.status,
          subtotalCents: invRow.subtotal_cents,
          taxCents: invRow.tax_cents,
          tipCents: invRow.tip_cents,
          totalCents: invRow.total_cents + invRow.tip_cents,
          depositCreditCents: invRow.deposit_paid_cents,
          amountPaidCents: otherPaidCents,
          amountDueCents: invRow.amount_due_cents,
          publicPayToken: invRow.public_token,
          lineItems,
        }
      : null,
    payments,
    events,
  };
}

export function getDispatchBoardData(dateStr?: string) {
  const store = getLocalDbWithDemo();
  const biz = Array.from(store.businesses.values())[0];
  const tz = biz?.timezone ?? businessConfig.timezone;
  const targetDateStr =
    dateStr || formatInTimeZone(new Date(), tz, "yyyy-MM-dd");

  const allJobs = Array.from(store.jobs.values())
    .filter((j) => {
      const jobDate = formatInTimeZone(new Date(j.scheduled_start), tz, "yyyy-MM-dd");
      return jobDate === targetDateStr;
    })
    .sort((a, b) => a.scheduled_start.localeCompare(b.scheduled_start))
    .map((j) => enrichJob(j.id, store))
    .filter((j): j is EnrichedJob => j !== null);

  const dowNum = Number(
    formatInTimeZone(
      fromZonedTime(`${targetDateStr}T12:00:00`, tz),
      tz,
      "i"
    )
  );
  const dow = dowNum === 7 ? 0 : dowNum;

  const technicians = Array.from(store.technicians.values()).map((t) => {
    const shift = Array.from(store.technician_hours.values()).find(
      (th) => th.technician_id === t.id && th.day_of_week === dow
    );
    const timeOff = Array.from(store.technician_time_off.values()).filter(
      (to) => to.technician_id === t.id
    );
    const techJobs = allJobs.filter(
      (j) => j.technician?.id === t.id && j.status !== "cancelled"
    );
    const activeJob = techJobs.find(
      (j) => j.status === "in_progress" || j.status === "on_the_way"
    );

    return {
      id: t.id,
      name: t.name,
      phone: t.phone,
      email: t.email,
      color: t.color,
      skills: t.skills,
      zipCodes: t.zip_codes,
      commissionPct: Number(t.commission_pct),
      active: t.active,
      homeLat: t.home_lat ?? 25.7617,
      homeLng: t.home_lng ?? -80.1918,
      shift: shift
        ? { startTime: shift.start_time, endTime: shift.end_time }
        : null,
      timeOff,
      jobsCountToday: techJobs.length,
      maxRecommendedJobs: 5,
      statusLabel: !t.active
        ? "Off Duty"
        : activeJob?.status === "in_progress"
        ? `On Job #${activeJob.jobNumber}`
        : activeJob?.status === "on_the_way"
        ? `En Route #${activeJob.jobNumber}`
        : shift
        ? "Available"
        : "Off Today",
      jobsToday: techJobs,
    };
  });

  const completedToday = allJobs.filter((j) => j.status === "completed");
  const revenueTodayCents = completedToday.reduce(
    (sum, j) => sum + (j.totalCents ?? j.estimatedTotalCents),
    0
  );
  const unassignedUrgentJobs = allJobs.filter((j) => j.isUnassignedUrgent);
  const failedSmsLogs = Array.from(store.sms_log.values()).filter(
    (s) => s.status === "failed"
  );

  const alerts: Array<{
    id: string;
    severity: "critical" | "warning" | "info";
    title: string;
    description: string;
    jobId?: string;
    createdAt: string;
  }> = [];

  for (const uj of unassignedUrgentJobs) {
    alerts.push({
      id: `alert_unassigned_${uj.id}`,
      severity: "critical",
      title: `Job #${uj.jobNumber} unassigned — starts soon`,
      description: `${uj.service.name} for ${uj.customer.name} (${uj.zip}) needs a technician assigned immediately.`,
      jobId: uj.id,
      createdAt: uj.createdAt,
    });
  }

  for (const sms of failedSmsLogs) {
    alerts.push({
      id: `alert_sms_${sms.id}`,
      severity: "warning",
      title: `SMS failed to ${sms.to_phone}`,
      description: sms.error ?? "Carrier delivery error",
      jobId: sms.job_id ?? undefined,
      createdAt: sms.created_at,
    });
  }

  return {
    date: targetDateStr,
    timezone: tz,
    jobs: allJobs,
    technicians,
    kpis: {
      totalJobsToday: allJobs.filter((j) => j.status !== "cancelled").length,
      unassignedCount: allJobs.filter((j) => j.status === "unassigned").length,
      unassignedUrgentCount: unassignedUrgentJobs.length,
      inFieldCount: allJobs.filter(
        (j) => j.status === "on_the_way" || j.status === "in_progress"
      ).length,
      completedTodayCount: completedToday.length,
      revenueTodayCents,
    },
    alerts,
  };
}

export function suggestTechniciansForJob(
  jobId: string,
  store = getLocalDbWithDemo()
): TechSuggestionResult[] {
  const job = store.jobs.get(jobId);
  if (!job) return [];
  const service = store.services.get(job.service_id);
  const biz = store.businesses.get(job.business_id);
  if (!service || !biz) return [];

  const tz = biz.timezone;
  const jobDateStr = formatInTimeZone(new Date(job.scheduled_start), tz, "yyyy-MM-dd");
  const dowNum = Number(
    formatInTimeZone(new Date(job.scheduled_start), tz, "i")
  );
  const dow = dowNum === 7 ? 0 : dowNum;

  const candidates: CandidateTechInput[] = Array.from(
    store.technicians.values()
  ).map((t) => {
    const shift = Array.from(store.technician_hours.values()).find(
      (th) => th.technician_id === t.id && th.day_of_week === dow
    );
    const timeOffRanges = Array.from(store.technician_time_off.values())
      .filter((to) => to.technician_id === t.id)
      .map((to) => ({
        startsAt: to.starts_at,
        endsAt: to.ends_at,
      }));

    const existingJobsThatDay = Array.from(store.jobs.values())
      .filter((j) => {
        if (j.technician_id !== t.id || j.id === job.id || j.status === "cancelled") {
          return false;
        }
        const d = formatInTimeZone(new Date(j.scheduled_start), tz, "yyyy-MM-dd");
        return d === jobDateStr;
      })
      .sort((a, b) => a.scheduled_start.localeCompare(b.scheduled_start))
      .map((j) => ({
        id: j.id,
        jobNumber: j.job_number,
        scheduledStart: j.scheduled_start,
        scheduledEnd: j.scheduled_end,
        zip: j.zip,
        lat: j.lat,
        lng: j.lng,
      }));

    const prevStop = existingJobsThatDay
      .filter(
        (j) =>
          new Date(j.scheduledEnd).getTime() <=
          new Date(job.scheduled_start).getTime()
      )
      .slice(-1)[0];

    const originLat = prevStop?.lat ?? t.home_lat ?? 25.7617;
    const originLng = prevStop?.lng ?? t.home_lng ?? -80.1918;
    const destLat = job.lat ?? 25.7617;
    const destLng = job.lng ?? -80.1918;

    const travelMinutesFromPreviousStop = estimateTravelMinutesHaversine(
      originLat,
      originLng,
      destLat,
      destLng
    );

    const revenueSoFarThisWeekCents = Array.from(store.jobs.values())
      .filter((j) => j.technician_id === t.id && j.status === "completed")
      .reduce((sum, j) => sum + (j.total_cents ?? j.estimated_total_cents), 0);

    return {
      id: t.id,
      name: t.name,
      color: t.color,
      active: t.active,
      skills: t.skills,
      zipCodes: t.zip_codes,
      workingWindow: shift
        ? { start: shift.start_time, end: shift.end_time }
        : null,
      timeOffRanges,
      existingJobsThatDay,
      travelMinutesFromPreviousStop,
      travelMinutesToNextStop: 0,
      revenueSoFarThisWeekCents,
    };
  });

  const target: TargetJobInput = {
    id: job.id,
    serviceSkillTag: service.skill_tag,
    zip: job.zip,
    scheduledStart: job.scheduled_start,
    scheduledEnd: job.scheduled_end,
    bufferMinutes: biz.buffer_minutes,
    timezone: tz,
  };

  return scoreAndRankTechnicians(target, candidates);
}

export async function assignTechnicianToJob(params: {
  jobId: string;
  technicianId: string | null;
  force?: boolean;
  actorLabel?: string;
}): Promise<{
  ok: boolean;
  errorCode?: string;
  reason?: string;
  job?: EnrichedJob;
}> {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(params.jobId);
  if (!job) {
    return { ok: false, errorCode: "JOB_NOT_FOUND" };
  }

  if (job.status === "completed" || job.status === "cancelled") {
    return { ok: false, errorCode: "INVALID_STATE_TRANSITION" };
  }

  if (params.technicianId === null) {
    const prevStatus = job.status;
    job.technician_id = null;
    job.status = "unassigned";
    job.updated_at = new Date().toISOString();
    store.jobs.set(job.id, job);

    const evtId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    store.job_events.set(evtId, {
      id: evtId,
      business_id: job.business_id,
      job_id: job.id,
      actor_id: null,
      actor_label: params.actorLabel ?? "owner",
      event_type: "unassigned",
      from_status: prevStatus,
      to_status: "unassigned",
      meta: {},
      created_at: new Date().toISOString(),
    });

    return { ok: true, job: enrichJob(job.id, store) ?? undefined };
  }

  const tech = store.technicians.get(params.technicianId);
  if (!tech) {
    return { ok: false, errorCode: "TECH_NOT_FOUND" };
  }

  const ranked = suggestTechniciansForJob(job.id, store);
  const candidateScore = ranked.find((r) => r.technicianId === tech.id);

  if (candidateScore && !candidateScore.eligible && !params.force) {
    return {
      ok: false,
      errorCode: candidateScore.hasConflict ? "TECH_CONFLICT" : "TECH_INELIGIBLE",
      reason: candidateScore.reason ?? "Technician ineligible for this slot",
    };
  }

  const prevStatus = job.status;
  const prevTechId = job.technician_id;
  job.technician_id = tech.id;
  if (job.status === "unassigned") {
    job.status = "assigned";
  }
  job.updated_at = new Date().toISOString();
  store.jobs.set(job.id, job);

  const evtId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  store.job_events.set(evtId, {
    id: evtId,
    business_id: job.business_id,
    job_id: job.id,
    actor_id: null,
    actor_label: params.actorLabel ?? "owner",
    event_type: params.force ? "force_assigned" : "assigned",
    from_status: prevStatus,
    to_status: job.status,
    meta: {
      technician_id: tech.id,
      technician_name: tech.name,
      previous_technician_id: prevTechId,
      forced: Boolean(params.force),
      reason: candidateScore?.reason ?? null,
    },
    created_at: new Date().toISOString(),
  });

  return { ok: true, job: enrichJob(job.id, store) ?? undefined };
}

export async function transitionJobState(params: {
  jobId: string;
  toStatus: JobStatus;
  actor?: "owner" | "technician";
  actorLabel?: string;
  note?: string;
}): Promise<{ ok: boolean; errorCode?: string; message?: string; job?: EnrichedJob }> {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(params.jobId);
  if (!job) {
    return { ok: false, errorCode: "JOB_NOT_FOUND", message: "Job not found" };
  }

  const check = validateJobTransition({
    from: job.status,
    to: params.toStatus,
    actor: params.actor ?? "technician",
    requireBeforePhoto: false,
    requireAfterPhoto: false,
    beforePhotosCount: job.before_photos.length,
    afterPhotosCount: job.after_photos.length,
  });

  if (!check.valid) {
    return {
      ok: false,
      errorCode: check.code,
      message: check.message,
    };
  }

  const prevStatus = job.status;
  const nowIso = new Date().toISOString();
  job.status = params.toStatus;
  if (params.toStatus === "on_the_way") job.on_the_way_at = nowIso;
  if (params.toStatus === "in_progress") job.started_at = nowIso;
  if (params.toStatus === "completed") job.completed_at = nowIso;
  if (params.note) {
    job.tech_notes = params.note;
  }
  job.updated_at = nowIso;
  store.jobs.set(job.id, job);

  const evtId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  store.job_events.set(evtId, {
    id: evtId,
    business_id: job.business_id,
    job_id: job.id,
    actor_id: null,
    actor_label: params.actorLabel ?? "technician",
    event_type: "status_changed",
    from_status: prevStatus,
    to_status: params.toStatus,
    meta: params.note ? { note: params.note } : {},
    created_at: nowIso,
  });

  if (params.toStatus === "on_the_way") {
    const customer = store.customers.get(job.customer_id);
    const tech = job.technician_id
      ? store.technicians.get(job.technician_id)
      : null;
    const biz = store.businesses.get(job.business_id);
    if (customer && biz) {
      await sendServiceSms({
        jobId: job.id,
        customerId: customer.id,
        to: customer.phone,
        template: "on_the_way",
        vars: {
          biz: biz.name,
          techFirst: tech?.name.split(" ")[0] ?? "Your tech",
          addressShort: job.address_line1,
          eta: 18,
          n: job.job_number,
        },
      });
    }
  }

  return { ok: true, job: enrichJob(job.id, store) ?? undefined };
}

export async function cancelJobWithPolicy(params: {
  jobId: string;
  reason: string;
  refundDeposit?: "auto" | "yes" | "no";
  actorLabel?: string;
}): Promise<{
  ok: boolean;
  errorCode?: string;
  refundCents?: number;
  refunded?: boolean;
  job?: EnrichedJob;
}> {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(params.jobId);
  if (!job) return { ok: false, errorCode: "JOB_NOT_FOUND" };

  const check = validateJobTransition({
    from: job.status,
    to: "cancelled",
    actor: "owner",
    reason: params.reason,
  });
  if (!check.valid) {
    return { ok: false, errorCode: check.code };
  }

  const biz = store.businesses.get(job.business_id);
  const nowIso = new Date().toISOString();
  const shouldRefund = shouldRefundDepositOnCancel({
    scheduledStart: job.scheduled_start,
    cancelledAt: nowIso,
    cancellationWindowHours: biz?.cancellation_window_hours ?? 4,
    refundDeposit: params.refundDeposit ?? "auto",
  });

  const refundCents = shouldRefund ? job.deposit_cents : 0;
  const prevStatus = job.status;
  job.status = "cancelled";
  job.cancel_reason = params.reason;
  job.cancelled_at = nowIso;
  job.updated_at = nowIso;
  store.jobs.set(job.id, job);

  if (refundCents > 0) {
    const refId = `pay_ref_${Date.now()}`;
    store.payments.set(refId, {
      id: refId,
      business_id: job.business_id,
      job_id: job.id,
      invoice_id: null,
      kind: "refund",
      method: "card",
      status: "succeeded",
      amount_cents: refundCents,
      stripe_payment_intent_id: job.deposit_payment_intent_id,
      stripe_charge_id: null,
      stripe_refund_id: `re_${Date.now()}`,
      recorded_by: null,
      created_at: nowIso,
    });
  }

  const evtId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  store.job_events.set(evtId, {
    id: evtId,
    business_id: job.business_id,
    job_id: job.id,
    actor_id: null,
    actor_label: params.actorLabel ?? "owner",
    event_type: "cancelled",
    from_status: prevStatus,
    to_status: "cancelled",
    meta: {
      reason: params.reason,
      refund_cents: refundCents,
    },
    created_at: nowIso,
  });

  const customer = store.customers.get(job.customer_id);
  if (customer && biz) {
    await sendServiceSms({
      jobId: job.id,
      customerId: customer.id,
      to: customer.phone,
      template: "cancelled",
      vars: {
        biz: biz.name,
        n: job.job_number,
        refundNote:
          refundCents > 0
            ? `Your $${(refundCents / 100).toFixed(2)} deposit has been refunded.`
            : "",
        phone: biz.phone ?? "",
      },
    });
  }

  return {
    ok: true,
    refundCents,
    refunded: refundCents > 0,
    job: enrichJob(job.id, store) ?? undefined,
  };
}

export async function rescheduleJobWindow(params: {
  jobId: string;
  newStartIso: string;
  newEndIso?: string;
  actorLabel?: string;
}): Promise<{ ok: boolean; errorCode?: string; job?: EnrichedJob }> {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(params.jobId);
  if (!job) return { ok: false, errorCode: "JOB_NOT_FOUND" };
  if (job.status === "completed" || job.status === "cancelled") {
    return { ok: false, errorCode: "INVALID_STATE_TRANSITION" };
  }

  const service = store.services.get(job.service_id);
  const durationMinutes = service?.duration_minutes ?? 60;
  const newStart = new Date(params.newStartIso);
  const newEnd = params.newEndIso
    ? new Date(params.newEndIso)
    : addMinutes(newStart, durationMinutes);

  const oldStart = job.scheduled_start;
  job.scheduled_start = newStart.toISOString();
  job.scheduled_end = newEnd.toISOString();
  job.updated_at = new Date().toISOString();
  store.jobs.set(job.id, job);

  const evtId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  store.job_events.set(evtId, {
    id: evtId,
    business_id: job.business_id,
    job_id: job.id,
    actor_id: null,
    actor_label: params.actorLabel ?? "owner",
    event_type: "rescheduled",
    from_status: job.status,
    to_status: job.status,
    meta: {
      old_start: oldStart,
      new_start: job.scheduled_start,
      new_end: job.scheduled_end,
    },
    created_at: new Date().toISOString(),
  });

  const customer = store.customers.get(job.customer_id);
  const biz = store.businesses.get(job.business_id);
  if (customer && biz) {
    await sendServiceSms({
      jobId: job.id,
      customerId: customer.id,
      to: customer.phone,
      template: "rescheduled",
      vars: {
        biz: biz.name,
        n: job.job_number,
        date: formatInTimeZone(newStart, biz.timezone, "EEE, MMM d"),
        time: formatInTimeZone(newStart, biz.timezone, "h:mm a"),
        phone: biz.phone ?? "",
      },
    });
  }

  return { ok: true, job: enrichJob(job.id, store) ?? undefined };
}

export async function createOrUpdateInvoiceForJob(params: {
  jobId: string;
  billableMinutes?: number;
  lineItems: Array<{
    kind: "labor" | "parts" | "fee" | "discount";
    description: string;
    quantity: number;
    unitPriceCents: number;
    taxable: boolean;
  }>;
  tipCents?: number;
  techNotes?: string;
}): Promise<{ ok: boolean; errorCode?: string; job?: EnrichedJob }> {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(params.jobId);
  if (!job) return { ok: false, errorCode: "JOB_NOT_FOUND" };
  const biz = store.businesses.get(job.business_id);
  const service = store.services.get(job.service_id);
  if (!biz || !service) return { ok: false, errorCode: "BUSINESS_NOT_FOUND" };

  const existingPayments = Array.from(store.payments.values()).filter(
    (p) =>
      p.job_id === job.id &&
      p.status === "succeeded" &&
      p.kind !== "deposit" &&
      p.kind !== "refund"
  );
  const otherSucceededPaymentsCents = existingPayments.reduce(
    (sum, p) => sum + p.amount_cents,
    0
  );

  const partsInput = params.lineItems
    .filter((li) => li.kind === "parts")
    .map((li) => ({
      description: li.description,
      quantity: li.quantity,
      unitPriceCents: li.unitPriceCents,
      taxable: li.taxable,
    }));

  const feesInput = params.lineItems
    .filter((li) => li.kind === "fee")
    .map((li) => ({
      description: li.description,
      amountCents: roundHalfUp(li.quantity * li.unitPriceCents),
      taxable: li.taxable,
    }));

  const discountCents = params.lineItems
    .filter((li) => li.kind === "discount")
    .reduce((sum, li) => sum + roundHalfUp(li.quantity * li.unitPriceCents), 0);

  const totals = computeInvoiceTotals({
    pricingType: service.pricing_type,
    servicePriceCents: service.price_cents,
    minBillableMinutes: service.min_billable_minutes,
    billableMinutes: params.billableMinutes ?? job.billable_minutes ?? undefined,
    parts: partsInput,
    fees: feesInput,
    discountCents,
    taxRateBps: biz.tax_rate_bps,
    taxAppliesTo: biz.tax_applies_to,
    depositPaidCents: job.deposit_cents,
    otherSucceededPaymentsCents,
    customTipCents: params.tipCents ?? job.tip_cents ?? 0,
  });

  const existingInv = Array.from(store.invoices.values()).find(
    (i) => i.job_id === job.id
  );
  const nowIso = new Date().toISOString();
  const invId = existingInv?.id ?? `inv_${job.id}`;
  const invNumber =
    existingInv?.invoice_number ??
    `INV-2026-${String(job.job_number).padStart(5, "0")}`;
  const publicToken =
    existingInv?.public_token ?? `pay_tok_${job.job_number}`;

  const invRecord = {
    id: invId,
    business_id: biz.id,
    job_id: job.id,
    invoice_number: invNumber,
    public_token: publicToken,
    status: (totals.amountDueCents <= 0 ? "paid" : "sent") as
      | "draft"
      | "sent"
      | "paid"
      | "void",
    labor_cents: totals.laborCents,
    parts_cents: totals.partsCents,
    fees_cents: totals.feesCents,
    discount_cents: totals.discountCents,
    subtotal_cents: totals.subtotalCents,
    tax_rate_bps: biz.tax_rate_bps,
    tax_cents: totals.taxCents,
    total_cents: totals.totalCents,
    deposit_paid_cents: totals.depositPaidCents,
    tip_cents: totals.tipCents,
    amount_due_cents: Math.max(0, totals.amountDueCents),
    stripe_checkout_session_id: existingInv?.stripe_checkout_session_id ?? null,
    sent_at: existingInv?.sent_at ?? nowIso,
    paid_at:
      totals.amountDueCents <= 0
        ? existingInv?.paid_at ?? nowIso
        : existingInv?.paid_at ?? null,
    created_at: existingInv?.created_at ?? nowIso,
    updated_at: nowIso,
  };

  store.invoices.set(invId, invRecord);

  for (const [k, li] of store.invoice_line_items.entries()) {
    if (li.invoice_id === invId) {
      store.invoice_line_items.delete(k);
    }
  }

  const itemsToStore =
    params.lineItems.length > 0
      ? params.lineItems
      : [
          {
            kind: "labor" as const,
            description: `${service.name} Labor`,
            quantity: 1,
            unitPriceCents: totals.laborCents,
            taxable: false,
          },
        ];

  itemsToStore.forEach((li, idx) => {
    const liId = `li_${invId}_${idx}`;
    store.invoice_line_items.set(liId, {
      id: liId,
      business_id: biz.id,
      invoice_id: invId,
      kind: li.kind,
      description: li.description,
      quantity: li.quantity,
      unit_price_cents: li.unitPriceCents,
      taxable: li.taxable,
      amount_cents: roundHalfUp(li.quantity * li.unitPriceCents),
      sort_order: idx,
    });
  });

  job.total_cents = totals.totalCents + totals.tipCents;
  job.tip_cents = totals.tipCents;
  if (params.billableMinutes !== undefined) {
    job.billable_minutes = params.billableMinutes;
  }
  if (params.techNotes !== undefined) {
    job.tech_notes = params.techNotes;
  }
  job.updated_at = nowIso;
  store.jobs.set(job.id, job);

  return { ok: true, job: enrichJob(job.id, store) ?? undefined };
}

export async function collectJobPayment(params: {
  jobId: string;
  method: "card_on_file" | "tap_card" | "cash" | "check" | "send_pay_link" | "bill_later";
  tipCents?: number;
  actorLabel?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardholderName?: string;
  checkReference?: string;
}): Promise<{
  ok: boolean;
  errorCode?: string;
  payLinkUrl?: string;
  transactionId?: string;
  job?: EnrichedJob;
}> {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(params.jobId);
  if (!job) return { ok: false, errorCode: "JOB_NOT_FOUND" };
  const biz = store.businesses.get(job.business_id);
  const customer = store.customers.get(job.customer_id);
  const service = store.services.get(job.service_id);
  if (!biz || !customer || !service) {
    return { ok: false, errorCode: "MISSING_RELATIONS" };
  }

  // Update customer saved card if new card details were provided
  if (params.cardBrand || params.cardLast4) {
    customer.card_brand = params.cardBrand ?? customer.card_brand ?? "visa";
    customer.card_last4 = params.cardLast4 ?? customer.card_last4 ?? "4242";
    customer.stripe_payment_method_id =
      customer.stripe_payment_method_id ?? `pm_card_${Date.now()}`;
    customer.stripe_customer_id =
      customer.stripe_customer_id ?? `cus_${customer.id.slice(-8)}`;
    store.customers.set(customer.id, customer);
  }

  let inv = Array.from(store.invoices.values()).find(
    (i) => i.job_id === job.id
  );
  if (!inv) {
    await createOrUpdateInvoiceForJob({
      jobId: job.id,
      tipCents: params.tipCents ?? job.tip_cents ?? 0,
      lineItems: [
        {
          kind: "labor",
          description: `${service.name} (${
            service.pricing_type === "flat" ? "Flat rate" : "Standard labor"
          })`,
          quantity: 1,
          unitPriceCents: service.price_cents,
          taxable: false,
        },
      ],
    });
    inv = Array.from(store.invoices.values()).find((i) => i.job_id === job.id)!;
  } else if (params.tipCents !== undefined && params.tipCents !== inv.tip_cents) {
    const currentLineItems = Array.from(store.invoice_line_items.values())
      .filter((li) => li.invoice_id === inv!.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((li) => ({
        kind: li.kind,
        description: li.description,
        quantity: Number(li.quantity),
        unitPriceCents: li.unit_price_cents,
        taxable: li.taxable,
      }));
    await createOrUpdateInvoiceForJob({
      jobId: job.id,
      tipCents: params.tipCents,
      lineItems: currentLineItems,
    });
    inv = store.invoices.get(inv.id)!;
  }

  const nowIso = new Date().toISOString();

  if (params.method === "send_pay_link" || params.method === "bill_later") {
    const payLinkUrl = `/pay/${inv.public_token}`;
    if (job.status === "in_progress") {
      job.status = "completed";
      job.completed_at = nowIso;
      job.updated_at = nowIso;
      store.jobs.set(job.id, job);
    }
    await sendServiceSms({
      jobId: job.id,
      customerId: customer.id,
      to: customer.phone,
      template: "payment_link",
      vars: {
        biz: biz.name,
        n: job.job_number,
        invoiceNumber: inv.invoice_number,
        amountDollars: (inv.amount_due_cents / 100).toFixed(2),
        payUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${payLinkUrl}`,
      },
    });
    saveLocalDbToDisk(store);
    return {
      ok: true,
      payLinkUrl,
      job: enrichJob(job.id, store) ?? undefined,
    };
  }

  let transactionId: string | undefined;

  if (inv.amount_due_cents > 0) {
    const payMethod: "card" | "cash" | "check" =
      params.method === "cash"
        ? "cash"
        : params.method === "check"
        ? "check"
        : "card";

    let stripePiId: string | null = null;
    let stripeChargeId: string | null = null;

    if (payMethod === "card") {
      const chargeRes = await chargeCustomerOffSession({
        jobId: job.id,
        invoiceId: inv.id,
        amountCents: inv.amount_due_cents,
        stripeCustomerId: customer.stripe_customer_id,
        stripePaymentMethodId: customer.stripe_payment_method_id,
      });
      stripePiId = chargeRes.paymentIntentId;
      stripeChargeId = `ch_final_${job.job_number}_${Date.now().toString(36)}`;
      transactionId = stripePiId;
    } else {
      transactionId = `${payMethod}_${job.job_number}_${Date.now().toString(36)}`;
    }

    const payId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    store.payments.set(payId, {
      id: payId,
      business_id: biz.id,
      job_id: job.id,
      invoice_id: inv.id,
      kind: "remaining",
      method: payMethod,
      status: "succeeded",
      amount_cents: inv.amount_due_cents,
      stripe_payment_intent_id: stripePiId,
      stripe_charge_id: stripeChargeId,
      stripe_refund_id: null,
      recorded_by: params.actorLabel ?? null,
      created_at: nowIso,
    });

    inv.amount_due_cents = 0;
    inv.status = "paid";
    inv.paid_at = nowIso;
    inv.updated_at = nowIso;
    store.invoices.set(inv.id, inv);
  }

  if (job.status === "in_progress") {
    job.status = "completed";
    job.completed_at = nowIso;
    job.updated_at = nowIso;
    store.jobs.set(job.id, job);
  }

  const evtId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  store.job_events.set(evtId, {
    id: evtId,
    business_id: biz.id,
    job_id: job.id,
    actor_id: null,
    actor_label: params.actorLabel ?? "technician",
    event_type: "payment_collected",
    from_status: job.status,
    to_status: job.status,
    meta: {
      method: params.method,
      card_brand: customer.card_brand,
      card_last4: customer.card_last4,
      transaction_id: transactionId ?? null,
      check_reference: params.checkReference ?? null,
      total_cents: inv.total_cents + inv.tip_cents,
      tip_cents: inv.tip_cents,
    },
    created_at: nowIso,
  });

  await sendServiceSms({
    jobId: job.id,
    customerId: customer.id,
    to: customer.phone,
    template: "completed",
    vars: {
      biz: biz.name,
      n: job.job_number,
      balanceLine: `Paid $${((inv.total_cents + inv.tip_cents) / 100).toFixed(2)}.`,
      reviewUrl: biz.review_url ?? "",
    },
  });

  saveLocalDbToDisk(store);
  return {
    ok: true,
    transactionId,
    job: enrichJob(job.id, store) ?? undefined,
  };
}

export function getRevenueReport(params: {
  fromDate?: string;
  toDate?: string;
  groupBy?: "tech" | "service" | "day";
}) {
  const store = getLocalDbWithDemo();
  const biz = Array.from(store.businesses.values())[0];
  const tz = biz?.timezone ?? businessConfig.timezone;
  const now = new Date();
  const toStr = params.toDate || formatInTimeZone(now, tz, "yyyy-MM-dd");
  const fromStr =
    params.fromDate || formatInTimeZone(subDays(now, 14), tz, "yyyy-MM-dd");
  const groupBy = params.groupBy || "tech";

  const completedJobs = Array.from(store.jobs.values()).filter((j) => {
    if (j.status !== "completed" || !j.completed_at) return false;
    const dStr = formatInTimeZone(new Date(j.completed_at), tz, "yyyy-MM-dd");
    return dStr >= fromStr && dStr <= toStr;
  });

  const rowsMap = new Map<
    string,
    {
      groupKey: string;
      groupLabel: string;
      jobsCompleted: number;
      grossCents: number;
      tipsCents: number;
      refundsCents: number;
      netCents: number;
      commissionCents: number;
    }
  >();

  for (const job of completedJobs) {
    const inv = Array.from(store.invoices.values()).find(
      (i) => i.job_id === job.id
    );
    const tech = job.technician_id
      ? store.technicians.get(job.technician_id)
      : null;
    const svc = store.services.get(job.service_id);
    const refundsCents = Array.from(store.payments.values())
      .filter(
        (p) =>
          p.job_id === job.id &&
          p.kind === "refund" &&
          p.status === "succeeded"
      )
      .reduce((sum, p) => sum + p.amount_cents, 0);

    const gross = inv?.total_cents ?? job.total_cents ?? job.estimated_total_cents;
    const tip = inv?.tip_cents ?? job.tip_cents ?? 0;
    const sub = inv?.subtotal_cents ?? gross - tip;
    const commPct = tech ? Number(tech.commission_pct) : 0;
    const comm = Math.round((sub * commPct) / 100);

    let key = "unassigned";
    let label = "Unassigned";
    if (groupBy === "tech") {
      key = tech?.id ?? "unassigned";
      label = tech?.name ?? "Unassigned";
    } else if (groupBy === "service") {
      key = svc?.id ?? "unknown";
      label = svc?.name ?? "Unknown";
    } else {
      const d = formatInTimeZone(new Date(job.completed_at!), tz, "yyyy-MM-dd");
      key = d;
      label = formatInTimeZone(new Date(job.completed_at!), tz, "MMM d");
    }

    const existing = rowsMap.get(key) ?? {
      groupKey: key,
      groupLabel: label,
      jobsCompleted: 0,
      grossCents: 0,
      tipsCents: 0,
      refundsCents: 0,
      netCents: 0,
      commissionCents: 0,
    };

    existing.jobsCompleted += 1;
    existing.grossCents += gross;
    existing.tipsCents += tip;
    existing.refundsCents += refundsCents;
    existing.netCents += gross - refundsCents;
    existing.commissionCents += comm;
    rowsMap.set(key, existing);
  }

  const rows = Array.from(rowsMap.values()).sort((a, b) =>
    groupBy === "day"
      ? a.groupKey.localeCompare(b.groupKey)
      : b.grossCents - a.grossCents
  );

  const summary = rows.reduce(
    (acc, r) => {
      acc.jobsCompleted += r.jobsCompleted;
      acc.grossCents += r.grossCents;
      acc.tipsCents += r.tipsCents;
      acc.refundsCents += r.refundsCents;
      acc.netCents += r.netCents;
      acc.commissionCents += r.commissionCents;
      return acc;
    },
    {
      jobsCompleted: 0,
      grossCents: 0,
      tipsCents: 0,
      refundsCents: 0,
      netCents: 0,
      commissionCents: 0,
      avgTicketCents: 0,
    }
  );

  summary.avgTicketCents =
    summary.jobsCompleted > 0
      ? Math.round(summary.grossCents / summary.jobsCompleted)
      : 0;

  return {
    fromDate: fromStr,
    toDate: toStr,
    groupBy,
    summary,
    rows,
  };
}
