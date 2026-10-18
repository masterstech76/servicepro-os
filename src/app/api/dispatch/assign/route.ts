import { NextResponse } from "next/server";
import { assignTechnicianToJob } from "@/lib/server/operations";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    jobId?: string;
    technicianId?: string | null;
    force?: boolean;
  };

  if (!body.jobId) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "jobId is required" } },
      { status: 400 }
    );
  }

  const res = await assignTechnicianToJob({
    jobId: body.jobId,
    technicianId: body.technicianId ?? null,
    force: Boolean(body.force),
  });

  if (!res.ok) {
    const status =
      res.errorCode === "TECH_CONFLICT" || res.errorCode === "TECH_INELIGIBLE"
        ? 409
        : 400;
    return NextResponse.json(
      {
        error: {
          code: res.errorCode ?? "ASSIGN_FAILED",
          message: res.reason ?? "Could not assign technician",
        },
      },
      { status }
    );
  }

  return NextResponse.json({ job: res.job });
}
