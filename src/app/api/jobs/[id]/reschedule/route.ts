import { NextResponse } from "next/server";
import { rescheduleJobWindow } from "@/lib/server/operations";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
    startsAt?: string;
    endsAt?: string;
  };

  if (!body.startsAt) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "startsAt is required" } },
      { status: 400 }
    );
  }

  const res = await rescheduleJobWindow({
    jobId: params.id,
    newStartIso: body.startsAt,
    newEndIso: body.endsAt,
  });

  if (!res.ok) {
    return NextResponse.json(
      {
        error: {
          code: res.errorCode ?? "RESCHEDULE_FAILED",
          message: "Could not reschedule job",
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ job: res.job });
}
