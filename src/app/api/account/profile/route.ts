import { NextResponse } from "next/server";
import { resolveCustomerSession } from "@/lib/server/customer-portal";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { saveLocalDbToDisk } from "@/lib/server/local-db-fallback";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const store = getLocalDbWithDemo();
  const cust = store.customers.get(session.customerId);

  return NextResponse.json({
    profile: {
      id: session.customerId,
      name: cust?.name || session.name,
      email: cust?.email || session.email,
      phone: cust?.phone || session.phone,
      smsOptOut: Boolean(cust?.sms_opt_out),
      emailNotifications: true,
      serviceReminders: true,
      role: "customer",
      createdAt: cust?.created_at || new Date().toISOString(),
    },
  });
}

export async function PATCH(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const body = (await request.json()) as {
    name?: string;
    phone?: string;
    smsOptOut?: boolean;
    // Malicious or privilege escalation attempts will be discarded
    role?: never;
    privilege?: never;
  };

  const store = getLocalDbWithDemo();
  const cust = store.customers.get(session.customerId);

  if (cust) {
    if (body.name && typeof body.name === "string" && body.name.trim().length > 1) {
      cust.name = body.name.trim();
    }
    if (body.phone && typeof body.phone === "string") {
      cust.phone = body.phone.trim();
    }
    if (typeof body.smsOptOut === "boolean") {
      cust.sms_opt_out = body.smsOptOut;
    }
    saveLocalDbToDisk(store);
  }

  return NextResponse.json({
    ok: true,
    message: "Profile updated successfully",
    profile: {
      id: session.customerId,
      name: cust?.name || session.name,
      email: cust?.email || session.email,
      phone: cust?.phone || session.phone,
      smsOptOut: Boolean(cust?.sms_opt_out),
      role: "customer",
    },
  });
}
