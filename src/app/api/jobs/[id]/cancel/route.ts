import { NextResponse } from "next/server";
import { cancelJobWithPolicy } from "@/lib/server/operations";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
    reason?: string;
    refundDeposit?: "auto" | "yes" | "no";
  };

  const res = await cancelJobWithPolicy({
    jobId: params.id,
    reason: body.reason ?? "Cancelled by owner",
    refundDeposit: body.refundDeposit ?? "auto",
  });

  if (!res.ok) {
    return NextResponse.json(
      {
        error: {
          code: res.errorCode ?? "CANCEL_FAILED",
          message: "Could not cancel job",
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    job: res.job,
    refundCents: res.refundCents,
    refunded: res.refunded,
  });
}
