import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { saveLocalDbToDisk } from "@/lib/server/local-db-fallback";
import { enrichJob } from "@/lib/server/operations";
import { issueStripeRefund } from "@/lib/server/stripe";

const refundSchema = z.object({
  jobId: z.string().min(1),
  amountCents: z.number().int().positive().optional(),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = refundSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid refund request" } },
        { status: 400 }
      );
    }

    const store = getLocalDbWithDemo();
    const job = store.jobs.get(parsed.data.jobId);
    if (!job) {
      return NextResponse.json(
        { error: { code: "JOB_NOT_FOUND", message: "Job not found." } },
        { status: 404 }
      );
    }

    const amountCents = parsed.data.amountCents ?? job.deposit_cents;

    // Call Stripe API or simulated refund
    const refundResult = await issueStripeRefund({
      paymentIntentId: job.deposit_payment_intent_id,
      amountCents,
      reason: parsed.data.reason ?? "Owner refund",
    });

    const refundId = refundResult.refundId;
    const payId = `pay_ref_${Date.now()}`;
    const nowIso = new Date().toISOString();

    store.payments.set(payId, {
      id: payId,
      business_id: job.business_id,
      job_id: job.id,
      invoice_id: null,
      kind: "refund",
      method: "card",
      status: "succeeded",
      amount_cents: amountCents,
      stripe_payment_intent_id: job.deposit_payment_intent_id,
      stripe_charge_id: null,
      stripe_refund_id: refundId,
      recorded_by: "user_owner",
      created_at: nowIso,
    });

    const evtId = `evt_${Date.now()}`;
    store.job_events.set(evtId, {
      id: evtId,
      business_id: job.business_id,
      job_id: job.id,
      actor_id: "user_owner",
      actor_label: "owner",
      event_type: "refund_issued",
      from_status: job.status,
      to_status: job.status,
      meta: { refund_id: refundId, amount_cents: amountCents, reason: parsed.data.reason ?? "Owner refund", mode: refundResult.mode },
      created_at: nowIso,
    });

    saveLocalDbToDisk(store);

    return NextResponse.json({
      ok: true,
      refundId,
      amountCents,
      mode: refundResult.mode,
      job: enrichJob(job.id, store),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refund failed";
    return NextResponse.json(
      { error: { code: "REFUND_FAILED", message } },
      { status: 400 }
    );
  }
}
