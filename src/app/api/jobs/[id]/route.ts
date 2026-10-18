import { NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { enrichJob } from "@/lib/server/operations";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const store = getLocalDbWithDemo();
  const job = enrichJob(params.id, store);
  if (!job) {
    return NextResponse.json(
      { error: { code: "JOB_NOT_FOUND", message: "Job not found" } },
      { status: 404 }
    );
  }
  return NextResponse.json({ job });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(params.id);
  if (!job) {
    return NextResponse.json(
      { error: { code: "JOB_NOT_FOUND", message: "Job not found" } },
      { status: 404 }
    );
  }

  const body = (await request.json()) as {
    notesInternal?: string;
    techNotes?: string;
    beforePhotos?: string[];
    afterPhotos?: string[];
  };

  if (body.notesInternal !== undefined) {
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

  return NextResponse.json({ job: enrichJob(job.id, store) });
}
