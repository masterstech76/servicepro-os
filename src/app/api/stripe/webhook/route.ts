import { NextRequest, NextResponse } from "next/server";
import {
  processStripeWebhookEvent,
  type StripeWebhookPayload,
} from "@/lib/server/stripe-webhook";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && process.env.NODE_ENV === "production" && !signature) {
      return NextResponse.json(
        { error: { code: "INVALID_SIGNATURE", message: "Missing Stripe-Signature header." } },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody) as StripeWebhookPayload;
    if (!event?.id || !event?.type) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid Stripe event payload." } },
        { status: 400 }
      );
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
