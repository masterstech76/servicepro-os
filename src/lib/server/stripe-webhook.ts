import "server-only";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import {
  DbException,
  getDbNow,
  rpcConvertHoldToJob,
  type LocalDbStore,
} from "@/lib/server/local-db-fallback";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { sendServiceSms } from "@/lib/server/sms";

export interface StripeWebhookPayload {
  id: string;
  type:
    | "payment_intent.succeeded"
    | "payment_intent.payment_failed"
    | "charge.refunded"
    | "charge.dispute.created"
    | string;
  data: {
    object: {
      id: string;
      amount?: number;
      amount_refunded?: number;
      payment_intent?: string;
      metadata?: Record<string, string>;
      payment_method_details?: {
        card?: {
          brand?: string;
          last4?: string;
        };
      };
    };
  };
}

export interface WebhookProcessResult {
  duplicate: boolean;
  handled: boolean;
  action?:
    | "job_created"
    | "slot_lost_refunded"
    | "payment_failed"
    | "charge_refunded"
    | "dispute_recorded"
    | "ignored";
  jobId?: string;
  refundId?: string;
}

export async function processStripeWebhookEvent(
  event: StripeWebhookPayload,
  store: LocalDbStore = getLocalDbWithDemo()
): Promise<WebhookProcessResult> {
  // 1. Idempotency check in stripe_events
  if (store.stripe_events.has(event.id)) {
    return {
      duplicate: true,
      handled: true,
      action: "ignored",
    };
  }

  const nowIso = getDbNow(store).toISOString();
  store.stripe_events.set(event.id, {
    id: event.id,
    type: event.type,
    processed_at: nowIso,
  });

  const obj = event.data.object;
  const meta = obj.metadata ?? {};
  const holdId = meta.hold_id ?? meta.holdId;
  const biz = Array.from(store.businesses.values())[0];
  const businessId = biz?.id ?? "00000000-0000-4000-8000-000000000001";

  if (event.type === "payment_intent.succeeded") {
    const paymentIntentId = obj.id;
    const depositCents = typeof obj.amount === "number" ? obj.amount : 1980;

    if (!holdId) {
      return { duplicate: false, handled: true, action: "ignored" };
    }

    const hold = store.slot_holds.get(holdId);
    try {
      const jobId = await rpcConvertHoldToJob(
        {
          p_hold: holdId,
          p_payment_intent: paymentIntentId,
          p_deposit_cents: depositCents,
        },
        store
      );

      const job = store.jobs.get(jobId);
      if (job) {
        // Move draft photos into {jobId}/issue/
        if (job.issue_photos.length > 0) {
          const movedPhotos: string[] = [];
          for (const oldPath of job.issue_photos) {
            const filename = oldPath.split("/").pop() ?? "photo.jpg";
            const newPath = `${jobId}/issue/${filename}`;
            const existingObj = store.storage_objects.get(oldPath);
            if (existingObj) {
              store.storage_objects.delete(oldPath);
              store.storage_objects.set(newPath, {
                ...existingObj,
                path: newPath,
              });
            }
            movedPhotos.push(newPath);
          }
          job.issue_photos = movedPhotos;
          store.jobs.set(jobId, job);
        }

        // Save card on file on customer
        const cust = store.customers.get(job.customer_id);
        const cardBrand = obj.payment_method_details?.card?.brand ?? "visa";
        const cardLast4 = obj.payment_method_details?.card?.last4 ?? "4242";
        if (cust) {
          cust.card_brand = cardBrand;
          cust.card_last4 = cardLast4;
          cust.stripe_customer_id = cust.stripe_customer_id ?? `cus_${cust.id}`;
          cust.stripe_payment_method_id =
            cust.stripe_payment_method_id ?? `pm_${paymentIntentId}`;
          store.customers.set(cust.id, cust);

          const svc = store.services.get(job.service_id);
          const dateLabel = formatInTimeZone(
            new Date(job.scheduled_start),
            businessConfig.timezone,
            "EEE, MMM d"
          );
          const windowLabel = `${formatInTimeZone(
            new Date(job.scheduled_start),
            businessConfig.timezone,
            "h:mm a"
          )} – ${formatInTimeZone(
            new Date(job.scheduled_end),
            businessConfig.timezone,
            "h:mm a"
          )}`;

          await sendServiceSms({
            to: cust.phone,
            template: "booked",
            jobId: job.id,
            customerId: cust.id,
            vars: {
              service: svc?.name ?? "Service",
              date: dateLabel,
              time: windowLabel,
              n: job.job_number,
            },
          });
        }
      }

      return {
        duplicate: false,
        handled: true,
        action: "job_created",
        jobId,
      };
    } catch (err) {
      if (err instanceof DbException && err.code === "SLOT_LOST") {
        // Auto-refund deposit and log slot_lost SMS + event
        const refundId = `re_slot_lost_${Date.now()}`;
        const payId = `pay_ref_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        store.payments.set(payId, {
          id: payId,
          business_id: hold?.business_id ?? businessId,
          job_id: "slot_lost_unassigned",
          invoice_id: null,
          kind: "refund",
          method: "card",
          status: "succeeded",
          amount_cents: depositCents,
          stripe_payment_intent_id: paymentIntentId,
          stripe_charge_id: null,
          stripe_refund_id: refundId,
          recorded_by: null,
          created_at: nowIso,
        });

        const payload = (hold?.payload ?? {}) as Record<string, unknown>;
        const custPayload = (payload.customer ?? {}) as Record<string, string>;
        const phone = custPayload.phone ?? "+13055550199";

        await sendServiceSms({
          to: phone,
          template: "slot_lost",
          jobId: null,
          vars: {
            n: "PENDING",
          },
        });

        return {
          duplicate: false,
          handled: true,
          action: "slot_lost_refunded",
          refundId,
        };
      }
      throw err;
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const payId = `pay_fail_${Date.now()}`;
    store.payments.set(payId, {
      id: payId,
      business_id: businessId,
      job_id: meta.job_id ?? "unknown_job",
      invoice_id: meta.invoice_id ?? null,
      kind: "remaining",
      method: "card",
      status: "failed",
      amount_cents: typeof obj.amount === "number" ? obj.amount : 0,
      stripe_payment_intent_id: obj.id,
      stripe_charge_id: null,
      stripe_refund_id: null,
      recorded_by: null,
      created_at: nowIso,
    });
    return { duplicate: false, handled: true, action: "payment_failed" };
  }

  if (event.type === "charge.refunded") {
    const refundId = `re_evt_${Date.now()}`;
    const payId = `pay_ref_${Date.now()}`;
    store.payments.set(payId, {
      id: payId,
      business_id: businessId,
      job_id: meta.job_id ?? "unknown_job",
      invoice_id: meta.invoice_id ?? null,
      kind: "refund",
      method: "card",
      status: "succeeded",
      amount_cents:
        typeof obj.amount_refunded === "number"
          ? obj.amount_refunded
          : obj.amount ?? 0,
      stripe_payment_intent_id: obj.payment_intent ?? obj.id,
      stripe_charge_id: obj.id,
      stripe_refund_id: refundId,
      recorded_by: null,
      created_at: nowIso,
    });
    return { duplicate: false, handled: true, action: "charge_refunded", refundId };
  }

  if (event.type === "charge.dispute.created") {
    const payId = `pay_disp_${Date.now()}`;
    store.payments.set(payId, {
      id: payId,
      business_id: businessId,
      job_id: meta.job_id ?? "unknown_job",
      invoice_id: meta.invoice_id ?? null,
      kind: "remaining",
      method: "card",
      status: "failed",
      amount_cents: typeof obj.amount === "number" ? obj.amount : 0,
      stripe_payment_intent_id: obj.payment_intent ?? obj.id,
      stripe_charge_id: obj.id,
      stripe_refund_id: null,
      recorded_by: null,
      created_at: nowIso,
    });
    return { duplicate: false, handled: true, action: "dispute_recorded" };
  }

  return { duplicate: false, handled: false, action: "ignored" };
}
