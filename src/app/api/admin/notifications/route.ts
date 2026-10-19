import { NextResponse } from "next/server";
import { resolveAdminSession, getAdminNotificationsList } from "@/lib/server/admin-portal";

export async function GET(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("q") || undefined;

  const result = getAdminNotificationsList({ channel, status, search });
  return NextResponse.json({ notifications: result, total: result.length });
}
