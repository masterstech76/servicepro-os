import { NextResponse } from "next/server";
import {
  resolveCustomerSession,
  getCustomerNotifications,
  markCustomerNotificationRead,
  markAllCustomerNotificationsRead,
} from "@/lib/server/customer-portal";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const notifications = getCustomerNotifications(session.customerId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const body = (await request.json()) as {
    notificationId?: string;
    markAll?: boolean;
  };

  if (body.markAll) {
    const updatedCount = markAllCustomerNotificationsRead(session.customerId);
    return NextResponse.json({ ok: true, updatedCount });
  }

  if (body.notificationId) {
    const ok = markCustomerNotificationRead(session.customerId, body.notificationId);
    return NextResponse.json({ ok });
  }

  return NextResponse.json(
    { error: { code: "INVALID_INPUT", message: "notificationId or markAll is required" } },
    { status: 400 }
  );
}
