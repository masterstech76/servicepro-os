import { NextResponse } from "next/server";
import { transitionJobState } from "@/lib/server/operations";
import type { JobStatus } from "@/lib/supabase/types";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
    toStatus: JobStatus;
    actor?: "owner" | "technician";
    note?: string;
  };

  const res = await transitionJobState({
    jobId: params.id,
    toStatus: body.toStatus,
    actor: body.actor ?? "technician",
    actorLabel: body.actor ?? "technician",
    note: body.note,
  });

  if (!res.ok) {
    return NextResponse.json(
      {
        error: {
          code: res.errorCode ?? "INVALID_TRANSITION",
          message: res.message ?? "Cannot transition job state",
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ job: res.job });
}
