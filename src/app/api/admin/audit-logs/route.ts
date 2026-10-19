import { NextResponse } from "next/server";
import { resolveAdminSession, getAdminAuditLogs } from "@/lib/server/admin-portal";

export async function GET(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType") || undefined;
  const search = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "25", 10);

  const result = getAdminAuditLogs({ entityType, search, page, limit });
  return NextResponse.json(result);
}
