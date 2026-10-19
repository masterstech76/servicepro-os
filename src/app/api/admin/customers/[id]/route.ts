import { NextResponse } from "next/server";
import {
  resolveAdminSession,
  getAdminCustomerDetail,
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

  const detail = getAdminCustomerDetail(params.id);
  if (!detail) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Customer not found" } },
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
    const customer = store.customers.get(params.id);

    if (!customer) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Customer not found" } },
        { status: 404 }
      );
    }

    if (body.name) customer.name = String(body.name).trim();
    if (body.phone) customer.phone = String(body.phone).trim();
    if (body.email !== undefined) customer.email = body.email ? String(body.email).trim() : "";
    if (body.smsOptOut !== undefined) customer.sms_opt_out = Boolean(body.smsOptOut);

    const detail = getAdminCustomerDetail(params.id);
    return NextResponse.json({ ok: true, customer: detail });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bad request";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
