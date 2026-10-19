import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

const payLinkIntentSchema = z.object({
  token: z.string().min(1),
  tipCents: z.number().int().min(0).default(0),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = payLinkIntentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid payload" } },
        { status: 400 }
      );
    }

    const store = getLocalDbWithDemo();
    const invoice = Array.from(store.invoices.values()).find(
      (inv) => inv.public_token === parsed.data.token
    );
    if (!invoice) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Invoice not found for payment token." } },
        { status: 404 }
      );
    }

    const baseRemaining = Math.max(0, invoice.total_cents - invoice.deposit_paid_cents);
    const amountDueCents = baseRemaining + parsed.data.tipCents;
    const paymentIntentId = `pi_paylink_${invoice.id}_${Date.now()}`;

    return NextResponse.json({
      paymentIntentId,
      clientSecret: `${paymentIntentId}_secret_demo`,
      amountDueCents,
      tipCents: parsed.data.tipCents,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create pay-link intent";
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    );
  }
}
