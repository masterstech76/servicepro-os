import { NextResponse } from "next/server";
import { getDispatchBoardData } from "@/lib/server/operations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? undefined;
  const board = getDispatchBoardData(date);
  return NextResponse.json(board);
}
