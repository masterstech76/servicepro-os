import { NextResponse } from "next/server";
import {
  resolveAdminSession,
  getAdminWorkOrders,
  createAdminJob,
} from "@/lib/server/admin-portal";

export async function GET(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const technicianId = searchParams.get("technicianId") || undefined;
  const customerId = searchParams.get("customerId") || undefined;
  const search = searchParams.get("q") || undefined;
  const date = searchParams.get("date") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "25", 10);

  const result = getAdminWorkOrders({
    status,
    technicianId,
    customerId,
    search,
    date,
    page,
    limit,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const res = createAdminJob({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      city: body.city || "Miami",
      state: body.state || "FL",
      zip: body.zip,
      serviceId: body.serviceId,
      scheduledStart: body.scheduledStart,
      issueText: body.issueText,
      notesInternal: body.notesInternal,
      technicianId: body.technicianId || null,
      actor: session.name,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: { code: "CREATE_JOB_ERROR", message: res.error || "Failed to create work order" } },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, job: res.job });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bad request";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
