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

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) {
        return NextResponse.json(
          { error: { code: "INVALID_INPUT", message: "Customer name cannot be empty" } },
          { status: 400 }
        );
      }
      customer.name = name;
    }

    if (body.phone !== undefined) {
      const digits = String(body.phone).replace(/\D/g, "");
      if (digits.length < 10) {
        return NextResponse.json(
          { error: { code: "INVALID_INPUT", message: "A valid 10-digit phone number is required" } },
          { status: 400 }
        );
      }
      customer.phone = String(body.phone).trim();
    }

    if (body.email !== undefined && body.email) {
      const email = String(body.email).trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: { code: "INVALID_INPUT", message: "Invalid email address format" } },
          { status: 400 }
        );
      }
      customer.email = email;
    } else if (body.email === "") {
      customer.email = "";
    }

    if (body.smsOptOut !== undefined) {
      customer.sms_opt_out = Boolean(body.smsOptOut);
    }

    // Record immutable audit event
    const evtId = `evt_cust_update_${Date.now()}`;
    store.job_events.set(evtId, {
      id: evtId,
      business_id: customer.business_id,
      job_id: "",
      actor_id: session.role,
      actor_label: `${session.name} (${session.role})`,
      event_type: "customer_updated",
      from_status: null,
      to_status: null,
      meta: {
        customerId: customer.id,
        updatedFields: Object.keys(body),
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    });

    const detail = getAdminCustomerDetail(params.id);
    return NextResponse.json({ ok: true, customer: detail?.customer, detail });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bad request";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
