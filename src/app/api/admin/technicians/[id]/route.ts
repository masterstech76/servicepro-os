import { NextResponse } from "next/server";
import {
  resolveAdminSession,
  getAdminTechnicianDetail,
} from "@/lib/server/admin-portal";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

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

  const detail = getAdminTechnicianDetail(params.id);
  if (!detail) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Technician not found" } },
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
    const tech = store.technicians.get(params.id);

    if (!tech) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Technician not found" } },
        { status: 404 }
      );
    }

    if (body.active !== undefined) tech.active = Boolean(body.active);
    if (body.phone) tech.phone = String(body.phone).trim();
    if (body.color) tech.color = String(body.color).trim();
    if (body.commissionPct !== undefined) tech.commission_pct = Number(body.commissionPct);
    if (Array.isArray(body.skills)) tech.skills = body.skills;
    if (Array.isArray(body.zipCodes)) tech.zip_codes = body.zipCodes;

    const detail = getAdminTechnicianDetail(params.id);
    return NextResponse.json({ ok: true, technician: detail });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bad request";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
