import { NextResponse } from "next/server";
import { getDispatchBoardData } from "@/lib/server/operations";
import { requireRole } from "@/lib/server/auth-guard";

export async function GET(request: Request) {
  const auth = await requireRole(request, ["owner", "technician"]);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? undefined;
  const board = getDispatchBoardData(date);
  return NextResponse.json(board);
}
