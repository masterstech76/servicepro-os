import { NextResponse } from "next/server";
import { getLocalDbWithDemo, deleteJobRecord } from "@/lib/server/demo-dataset";
import { saveLocalDbToDisk } from "@/lib/server/local-db-fallback";
import { enrichJob } from "@/lib/server/operations";
import { requireRole } from "@/lib/server/auth-guard";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(request, ["owner", "technician"]);
  if (!auth.ok) return auth.response;

  const store = getLocalDbWithDemo();
  const job = enrichJob(params.id, store);
  if (!job) {
    return NextResponse.json(
      { error: { code: "JOB_NOT_FOUND", message: "Job not found" } },
      { status: 404 }
    );
  }

  // Enforce technician job ownership per BUILD_PLAN Section 19 & RLS
  if (
    auth.actor.role === "technician" &&
    auth.actor.technicianId &&
    job.technician?.id &&
    job.technician.id !== auth.actor.technicianId
  ) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Technicians can only view jobs assigned to them.",
        },
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ job });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(request, ["owner", "technician"]);
  if (!auth.ok) return auth.response;

  const store = getLocalDbWithDemo();
  const job = store.jobs.get(params.id);
  if (!job) {
    return NextResponse.json(
      { error: { code: "JOB_NOT_FOUND", message: "Job not found" } },
      { status: 404 }
    );
  }

  if (
    auth.actor.role === "technician" &&
    auth.actor.technicianId &&
    job.technician_id &&
    job.technician_id !== auth.actor.technicianId
  ) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Technicians can only modify jobs assigned to them.",
        },
      },
      { status: 403 }
    );
  }

  const body = (await request.json()) as {
    notesInternal?: string;
    techNotes?: string;
    beforePhotos?: string[];
    afterPhotos?: string[];
  };

  if (body.notesInternal !== undefined && auth.actor.role === "owner") {
    job.notes_internal = body.notesInternal;
  }
  if (body.techNotes !== undefined) {
    job.tech_notes = body.techNotes;
  }
  if (Array.isArray(body.beforePhotos)) {
    job.before_photos = body.beforePhotos;
  }
  if (Array.isArray(body.afterPhotos)) {
    job.after_photos = body.afterPhotos;
  }

  job.updated_at = new Date().toISOString();
  store.jobs.set(job.id, job);
  saveLocalDbToDisk(store);

  return NextResponse.json({ job: enrichJob(job.id, store) });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(request, ["owner"]);
  if (!auth.ok) return auth.response;

  const store = getLocalDbWithDemo();
  const ok = deleteJobRecord(params.id, store);
  if (!ok) {
    return NextResponse.json(
      { error: { code: "JOB_NOT_FOUND", message: "Job not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, deletedJobId: params.id });
}
