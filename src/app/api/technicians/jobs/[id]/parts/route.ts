import { NextResponse } from "next/server";
import {
  resolveTechnicianSession,
  getTechVanInventory,
  getJobInventoryMovements,
  consumeVanPart,
  returnVanPart,
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

  const vanInventory = getTechVanInventory(session.techId);
  const movements = getJobInventoryMovements(params.id);

  return NextResponse.json({
    vanInventory,
    movements,
  });
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

  try {
    const body = await request.json();
    const action = body.action || "consume";

    if (action === "consume") {
      const res = consumeVanPart({
        techId: session.techId,
        jobId: params.id,
        partId: body.partId,
        quantity: Number(body.quantity) || 1,
        notes: body.notes,
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: { code: "INVENTORY_ERROR", message: res.error || "Failed to consume part" } },
          { status: 400 }
        );
      }

      return NextResponse.json({
        ok: true,
        remainingQuantity: res.remainingQuantity,
        movement: res.movement,
      });
    } else if (action === "return") {
      const res = returnVanPart({
        techId: session.techId,
        jobId: params.id,
        partId: body.partId,
        quantity: Number(body.quantity) || 1,
        notes: body.notes,
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: { code: "INVENTORY_ERROR", message: res.error || "Failed to return part" } },
          { status: 400 }
        );
      }

      return NextResponse.json({
        ok: true,
        remainingQuantity: res.remainingQuantity,
        movement: res.movement,
      });
    }

    return NextResponse.json(
      { error: { code: "INVALID_ACTION", message: "Action must be 'consume' or 'return'" } },
      { status: 400 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
