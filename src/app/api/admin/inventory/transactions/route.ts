import { NextResponse } from "next/server";
import {
  resolveAdminSession,
  getInventoryAuditLog,
} from "@/lib/server/admin-portal";

export async function GET(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const audits = getInventoryAuditLog();
  return NextResponse.json({ audits, total: audits.length });
}
