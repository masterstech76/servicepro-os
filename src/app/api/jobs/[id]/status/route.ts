import { NextResponse } from "next/server";
import { transitionJobState } from "@/lib/server/operations";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { saveLocalDbToDisk } from "@/lib/server/local-db-fallback";
import { requireRole } from "@/lib/server/auth-guard";
import type { JobStatus } from "@/lib/supabase/types";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(request, ["owner", "technician"]);
  if (!auth.ok) return auth.response;

  const store = getLocalDbWithDemo();
  const jobRow = store.jobs.get(params.id);
  if (
    jobRow &&
    auth.actor.role === "technician" &&
    auth.actor.technicianId &&
    jobRow.technician_id &&
    jobRow.technician_id !== auth.actor.technicianId
  ) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Technicians can only transition jobs assigned to them.",
        },
      },
      { status: 403 }
    );
  }

  const body = (await request.json()) as {
    toStatus: JobStatus;
    actor?: "owner" | "technician";
    note?: string;
  };

  const actorRole: "owner" | "technician" =
    auth.actor.role === "technician" ? "technician" : "owner";

  const res = await transitionJobState({
    jobId: params.id,
    toStatus: body.toStatus,
    actor: body.actor ?? actorRole,
    actorLabel: body.actor ?? actorRole,
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

  saveLocalDbToDisk(store);
  return NextResponse.json({ job: res.job });
}
