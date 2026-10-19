import { NextResponse } from "next/server";
import {
  resolveAdminSession,
  getAdminJobDetail,
} from "@/lib/server/admin-portal";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { assignTechnicianToJob, enrichJob } from "@/lib/server/operations";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const detail = getAdminJobDetail(params.id);
  if (!detail.job) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Work order not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json(detail);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const store = getLocalDbWithDemo();
    const job = store.jobs.get(params.id);

    if (!job) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Work order not found" } },
        { status: 404 }
      );
    }

    if (body.notesInternal !== undefined) {
      job.notes_internal = String(body.notesInternal).trim();
    }

    if (body.technicianId !== undefined) {
      const assignRes = await assignTechnicianToJob({
        jobId: params.id,
        technicianId: body.technicianId || null,
        force: body.force ?? false,
        actorLabel: session.name,
      });

      if (!assignRes.ok) {
        return NextResponse.json(
          { error: { code: assignRes.errorCode || "ASSIGN_FAILED", message: assignRes.reason || "Could not assign technician" } },
          { status: 400 }
        );
      }
    }

    const updated = enrichJob(params.id, store);
    return NextResponse.json({ ok: true, job: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bad request";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
