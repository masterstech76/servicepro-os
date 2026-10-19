import { NextResponse } from "next/server";
import {
  resolveTechnicianSession,
  getTechNotifications,
  markTechNotificationRead,
} from "@/lib/server/tech-portal";

export async function GET(request: Request) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  const notifications = getTechNotifications(session.techId);
  return NextResponse.json({
    notifications,
    total: notifications.length,
    unreadCount: notifications.filter((n) => !n.read).length,
  });
}

export async function PATCH(request: Request) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Notification ID required" } },
        { status: 400 }
      );
    }

    const ok = markTechNotificationRead(session.techId, body.id);
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
