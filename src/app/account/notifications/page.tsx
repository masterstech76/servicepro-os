"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Calendar,
  FileText,
  Navigation,
  Info,
  CheckCheck,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CustomerNotification } from "@/lib/server/customer-portal";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<CustomerNotification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const fetchNotifications = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/notifications");
      if (!res.ok) throw new Error("Failed to load notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
      toast.error("Unable to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function handleMarkRead(id: string) {
    try {
      await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silent
    }
  }

  async function handleMarkAllRead() {
    try {
      await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  function getNotificationIcon(type: string) {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "dispatch":
        return <Navigation className="h-4 w-4 text-orange-500" />;
      case "invoice":
        return <FileText className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
              Customer Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-navy-900 text-xs font-black">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time dispatches, appointment reminders, and billing receipts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs font-bold border-slate-300 text-navy-900"
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
            filter === "all"
              ? "border-orange-500 text-orange-600 bg-orange-50/50"
              : "border-transparent text-slate-600 hover:text-navy-900"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
            filter === "unread"
              ? "border-orange-500 text-orange-600 bg-orange-50/50"
              : "border-transparent text-slate-600 hover:text-navy-900"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
          <Bell className="h-8 w-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-navy-900 text-sm">No Notifications</h3>
          <p className="text-xs text-slate-500">You are all caught up on your service updates!</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm divide-y divide-slate-100">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !item.read ? "bg-orange-50/40" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs sm:text-sm text-navy-900">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{item.message}</p>
                  <p className="text-[10px] text-slate-400 pt-0.5">
                    {format(new Date(item.createdAt), "MMM d, yyyy • h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.linkUrl && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkRead(item.id)}
                    className="text-xs font-bold"
                  >
                    <Link href={item.linkUrl}>View</Link>
                  </Button>
                )}
                {!item.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(item.id)}
                    className="text-[11px] font-semibold text-slate-400 hover:text-navy-900"
                    title="Mark as read"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
