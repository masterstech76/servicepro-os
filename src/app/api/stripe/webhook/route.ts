import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, isRealStripeConfigured } from "@/lib/server/stripe";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import {
  processStripeWebhookEvent,
  type StripeWebhookPayload,
} from "@/lib/server/stripe-webhook";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: StripeWebhookPayload;

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
      const { data: existingEvent } = await supabase
        .from("stripe_events")
        .select("id")
        .eq("id", event.id)
        .maybeSingle();

      if (existingEvent) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      const obj = event.data.object;
      const meta = obj.metadata ?? {};
      const holdId = meta.hold_id ?? meta.holdId;

      if (event.type === "payment_intent.succeeded" && holdId) {
        const { data: holdRow } = await supabase
          .from("slot_holds")
          .select("*")
          .eq("id", holdId)
          .maybeSingle();

        const depositCents = typeof obj.amount === "number" ? obj.amount : 1980;
        const { data: jobId, error: rpcError } = await supabase.rpc(
          "convert_hold_to_job",
          {
            p_hold: holdId,
            p_payment_intent: obj.id,
            p_deposit_cents: depositCents,
          }
        );

        if (rpcError || !jobId) {
          throw new Error(rpcError?.message ?? "Failed to convert hold to job");
        }

        const businessId = holdRow?.business_id ?? meta.business_id ?? "";
        const payloadObj = (holdRow?.payload ?? {}) as Record<string, unknown>;
        const draftPaths = Array.isArray(payloadObj.photoPaths)
          ? (payloadObj.photoPaths as string[])
          : [];
        const movedPaths: string[] = [];

        for (const draft of draftPaths) {
          const filename = draft.split("/").pop() ?? "photo.jpg";
          const dest = `${businessId}/${jobId}/issue/${filename}`;
          await supabase.storage.from("job-photos").move(draft, dest);
          movedPaths.push(dest);
        }

        if (movedPaths.length > 0) {
          await supabase
            .from("jobs")
            .update({ issue_photos: movedPaths })
            .eq("id", jobId);
        }

        await supabase.from("stripe_events").insert({
          id: event.id,
          type: event.type,
          processed_at: new Date().toISOString(),
        });

        return NextResponse.json({
          received: true,
          duplicate: false,
          handled: true,
          action: "job_created",
          jobId,
        });
      }

      await supabase.from("stripe_events").insert({
        id: event.id,
        type: event.type,
        processed_at: new Date().toISOString(),
      });

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
