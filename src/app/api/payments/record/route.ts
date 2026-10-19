import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { collectJobPayment } from "@/lib/server/operations";

const recordPaymentSchema = z.object({
  jobId: z.string().min(1),
  method: z.enum(["cash", "check", "card_on_file", "tap_card"]),
  tipCents: z.number().int().min(0).default(0),
  cardBrand: z.string().optional(),
  cardLast4: z.string().optional(),
  cardholderName: z.string().optional(),
  checkReference: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = recordPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid payment payload" } },
        { status: 400 }
      );
    }

    const result = await collectJobPayment({
      jobId: parsed.data.jobId,
      method: parsed.data.method,
      tipCents: parsed.data.tipCents,
      cardBrand: parsed.data.cardBrand,
      cardLast4: parsed.data.cardLast4,
      cardholderName: parsed.data.cardholderName,
      checkReference: parsed.data.checkReference,
      actorLabel: "owner/tech",
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to record payment";
    return NextResponse.json(
      { error: { code: "PAYMENT_RECORD_FAILED", message } },
      { status: 400 }
    );
  }
}
