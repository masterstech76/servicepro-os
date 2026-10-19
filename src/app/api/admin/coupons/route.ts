import { NextResponse } from "next/server";
import {
  resolveAdminSession,
  getAdminCouponsList,
  createAdminCoupon,
  toggleAdminCoupon,
} from "@/lib/server/admin-portal";

export async function GET(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const coupons = getAdminCouponsList();
  return NextResponse.json({ coupons, total: coupons.length });
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
    if (!body.code || !body.description || !body.discountValue) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Code, description, and discount value are required" } },
        { status: 400 }
      );
    }

    const coupon = createAdminCoupon({
      code: body.code,
      description: body.description,
      discountType: body.discountType || "fixed",
      discountValue: Number(body.discountValue),
      minSpendCents: Number(body.minSpendCents) || 0,
      expiresAt: body.expiresAt || new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    return NextResponse.json({ ok: true, coupon });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Coupon ID is required" } },
        { status: 400 }
      );
    }

    const success = toggleAdminCoupon(body.id);
    if (!success) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Coupon not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
