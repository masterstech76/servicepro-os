import { NextResponse } from "next/server";
import {
  resolveAdminSession,
  getAdminReportsData,
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
  const type = (searchParams.get("type") as "jobs" | "revenue" | "technicians") || "revenue";
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const data = getAdminReportsData({ type, from, to });
  return NextResponse.json(data);
}
