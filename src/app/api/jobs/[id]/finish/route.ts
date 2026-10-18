import { NextResponse } from "next/server";
import { collectJobPayment } from "@/lib/server/operations";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
    method: "card_on_file" | "tap_card" | "cash" | "check" | "send_pay_link" | "bill_later";
    tipCents?: number;
  };

  const res = await collectJobPayment({
    jobId: params.id,
    method: body.method,
    tipCents: body.tipCents,
  });

  if (!res.ok) {
    return NextResponse.json(
      {
        error: {
          code: res.errorCode ?? "PAYMENT_FAILED",
          message: "Could not collect payment",
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    job: res.job,
    payLinkUrl: res.payLinkUrl,
  });
}
