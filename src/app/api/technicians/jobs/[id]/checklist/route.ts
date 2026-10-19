import { NextResponse } from "next/server";
import {
  resolveTechnicianSession,
  getJobChecklist,
  saveJobChecklist,
  type ChecklistItem,
} from "@/lib/server/tech-portal";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  const checklist = getJobChecklist(params.id);
  return NextResponse.json({ checklist });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  const body = (await request.json()) as { items?: ChecklistItem[] };
  if (!body.items || !Array.isArray(body.items)) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "Checklist items array required" } },
      { status: 400 }
    );
  }

  const res = saveJobChecklist(session.techId, params.id, body.items);
  if (!res.ok) {
    return NextResponse.json(
      { error: { code: "CHECKLIST_ERROR", message: res.error || "Failed to save checklist" } },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, checklist: res.checklist });
}
