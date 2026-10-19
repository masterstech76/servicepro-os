import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, isRealStripeConfigured } from "@/lib/server/stripe";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import {
  processStripeWebhookEvent,
  type StripeWebhookPayload,
} from "@/lib/server/stripe-webhook";
import { assertRuntimeSecrets } from "../../../../../scripts/verify-env";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      try {
        assertRuntimeSecrets();
      } catch (envErr) {
        return NextResponse.json(
          {
            error: {
              code: "ENV_MISCONFIGURED",
              message:
                envErr instanceof Error
                  ? envErr.message
                  : "Missing runtime secrets",
            },
          },
          { status: 500 }
        );
      }
    }

    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: StripeWebhookPayload;

    if (process.env.NODE_ENV === "production" && !isRealStripeConfigured()) {
      return NextResponse.json(
        {
          error: {
            code: "STRIPE_MISCONFIGURED",
            message: "Real Stripe secret and webhook keys are required in production.",
          },
        },
        { status: 500 }
      );
    }

    if (isRealStripeConfigured()) {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
      if (!signature || !webhookSecret) {
        return NextResponse.json(
          { error: { code: "INVALID_SIGNATURE", message: "Missing Stripe-Signature header." } },
          { status: 400 }
        );
      }

      try {
        const verified = getStripeClient()!.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret
        );
        event = verified as unknown as StripeWebhookPayload;
      } catch (verifyErr) {
        const msg = verifyErr instanceof Error ? verifyErr.message : "Invalid Stripe signature";
        return NextResponse.json(
          { error: { code: "INVALID_SIGNATURE", message: msg } },
          { status: 400 }
        );
      }
    } else {
      event = JSON.parse(rawBody) as StripeWebhookPayload;
      if (!event?.id || !event?.type) {
        return NextResponse.json(
          { error: { code: "VALIDATION_ERROR", message: "Invalid Stripe event payload." } },
          { status: 400 }
        );
      }
    }

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data: existingEvent, error: dedupeErr } = await supabase
        .from("stripe_events")
        .select("id")
        .eq("id", event.id)
        .maybeSingle();

      if (dedupeErr) throw new Error(dedupeErr.message);

      if (existingEvent) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      const obj = event.data.object;
      const meta = obj.metadata ?? {};
      const holdId = meta.hold_id ?? meta.holdId;

      if (event.type === "payment_intent.succeeded" && holdId) {
        const { data: holdRow, error: holdErr } = await supabase
          .from("slot_holds")
          .select("*")
          .eq("id", holdId)
          .maybeSingle();

        if (holdErr) throw new Error(holdErr.message);

        const payloadDeposit = Number(
          (holdRow?.payload as Record<string, unknown> | null)?.depositCents ?? NaN
        );
        const depositCents =
          typeof obj.amount === "number"
            ? obj.amount
            : Number.isFinite(payloadDeposit)
            ? payloadDeposit
            : 1980;
        let jobId = holdRow?.converted_job_id ?? null;

        if (!jobId) {
          const { data: rpcJobId, error: rpcError } = await supabase.rpc(
            "convert_hold_to_job",
            {
              p_hold: holdId,
              p_payment_intent: obj.id,
              p_deposit_cents: depositCents,
            }
          );

          if (rpcError || !rpcJobId) {
            throw new Error(rpcError?.message ?? "Failed to convert hold to job");
          }
          jobId = rpcJobId;
        }

        const businessId =
          holdRow?.business_id ??
          meta.business_id ??
          "00000000-0000-4000-8000-000000000001";
        const payloadObj = (holdRow?.payload ?? {}) as Record<string, unknown>;
        const draftPaths = Array.isArray(payloadObj.photoPaths)
          ? (payloadObj.photoPaths as string[])
          : [];
        const movedPaths: string[] = [];
        const photoWarnings: string[] = [];

        for (const draft of draftPaths) {
          const filename = draft.split("/").pop() ?? "photo.jpg";
          const dest = `${businessId}/${jobId}/issue/${filename}`;
          const { error: mvErr } = await supabase.storage
            .from("job-photos")
            .move(draft, dest);
          if (mvErr) {
            photoWarnings.push("PHOTO_MOVE_FAILED: " + mvErr.message);
          } else {
            movedPaths.push(dest);
          }
        }

        if (movedPaths.length > 0) {
          const { error: phErr } = await supabase
            .from("jobs")
            .update({ issue_photos: movedPaths })
            .eq("id", jobId);
          if (phErr) {
            photoWarnings.push(phErr.message);
          }
        }

        const { error: evErr } = await supabase.from("stripe_events").insert({
          id: event.id,
          type: event.type,
          processed_at: new Date().toISOString(),
        });
        if (evErr) throw new Error(evErr.message);

        return NextResponse.json({
          received: true,
          duplicate: false,
          handled: true,
          action: "job_created",
          jobId,
          ...(photoWarnings.length > 0 ? { photo_warning: photoWarnings } : {}),
        });
      }

      const { error: evErr } = await supabase.from("stripe_events").insert({
        id: event.id,
        type: event.type,
        processed_at: new Date().toISOString(),
      });
      if (evErr) throw new Error(evErr.message);

      return NextResponse.json({
        received: true,
        duplicate: false,
        handled: true,
        action: "ignored",
      });
    }

    const result = await processStripeWebhookEvent(event);
    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing error";
    return NextResponse.json(
      { error: { code: "WEBHOOK_ERROR", message } },
      { status: 400 }
    );
  }
}
