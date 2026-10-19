import { NextResponse } from "next/server";
import {
  resolveCustomerSession,
  getCustomerAddresses,
  saveCustomerAddress,
  deleteCustomerAddress,
} from "@/lib/server/customer-portal";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const addresses = getCustomerAddresses(session.customerId);
  return NextResponse.json({ addresses });
}

export async function POST(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  if (!body.label || !body.line1 || !body.city || !body.state || !body.zip) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "Label, street address, city, state, and ZIP are required." } },
      { status: 400 }
    );
  }

  const saved = saveCustomerAddress(session.customerId, body);
  return NextResponse.json({ address: saved, ok: true });
}

export async function DELETE(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const addressId = searchParams.get("id");
  if (!addressId) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "Address ID is required" } },
      { status: 400 }
    );
  }

  const deleted = deleteCustomerAddress(session.customerId, addressId);
  return NextResponse.json({ ok: deleted });
}
