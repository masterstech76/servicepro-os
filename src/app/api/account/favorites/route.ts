import { NextResponse } from "next/server";
import {
  resolveCustomerSession,
  getCustomerFavorites,
  toggleCustomerFavorite,
} from "@/lib/server/customer-portal";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const favorites = getCustomerFavorites(session.customerId);
  return NextResponse.json({ favorites, total: favorites.length });
}

export async function POST(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body.serviceId) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Service ID required" } },
        { status: 400 }
      );
    }

    const res = toggleCustomerFavorite(session.customerId, body.serviceId);
    return NextResponse.json({ ok: true, saved: res.saved });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
