import { NextResponse } from "next/server";
import {
  resolveAdminSession,
  getCentralInventoryOverview,
  adjustCentralInventoryStock,
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
  const q = searchParams.get("q")?.toLowerCase();
  const cat = searchParams.get("category");

  const overview = getCentralInventoryOverview();
  let filtered = overview.parts;

  if (q) {
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }

  if (cat && cat !== "all") {
    filtered = filtered.filter((p) => p.category === cat);
  }

  return NextResponse.json({ parts: filtered, total: filtered.length });
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
    const qty =
      body.adjustmentQuantity !== undefined
        ? Number(body.adjustmentQuantity)
        : body.adjustment !== undefined
        ? Number(body.adjustment)
        : 0;

    const res = adjustCentralInventoryStock({
      partId: body.partId,
      adjustmentQuantity: qty,
      reason: body.reason,
      actor: session.name,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: { code: "INVENTORY_ADJUSTMENT_ERROR", message: res.error || "Failed to adjust stock" } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      part: res.part,
      audit: res.audit,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bad request";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
