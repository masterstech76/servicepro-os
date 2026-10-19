"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  Shield,
  Check,
} from "lucide-react";

interface TechNotif {
  id: string;
  type: "job_assigned" | "schedule_change" | "customer_note" | "inventory_alert";
  title: string;
  message: string;
  jobId?: string;
  jobNumber?: number;
  read: boolean;
  createdAt: string;
}

export default function TechNotificationsPage() {
  const [notifications, setNotifications] = React.useState<TechNotif[]>([]);
  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const loadNotifications = React.useCallback(async () => {
    const demoNotifs: TechNotif[] = [
      {
        id: "notif-1",
        type: "job_assigned",
        title: "New Job Assigned: #WO-1004",
        message: "AC Repair & Diagnostic at 1421 Brickell Ave. Customer reported humming capacitor. Window 2:00 PM - 4:00 PM.",
        jobId: "job_today_1",
        jobNumber: 1004,
        read: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "notif-2",
        type: "customer_note",
        title: "Gate Access Code for Job #WO-1002",
        message: "Customer added note: 'Call box code #4491, park in visitor bay 12 near management office.'",
        jobId: "job_today_2",
        jobNumber: 1002,
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "notif-3",
        type: "inventory_alert",
        title: "Van Stock Parts Ready for Pickup",
        message: "45/5 MFD Dual Run Capacitors and R-410A cylinders restocked at Central Miami Warehouse.",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    try {
      const res = await fetch("/api/technicians/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications?.length ? data.notifications : demoNotifs);
        setUnreadCount(data.unreadCount ?? 2);
      } else {
        setNotifications(demoNotifs);
        setUnreadCount(2);
      }
    } catch {
      setNotifications(demoNotifs);
      setUnreadCount(2);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function markAsRead(id: string) {
    try {
      const res = await fetch("/api/technicians/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // noop
    }
  }

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const getIcon = (type: TechNotif["type"]) => {
    switch (type) {
      case "job_assigned":
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case "customer_note":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "inventory_alert":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Dispatch Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates, route assignments & notes
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filter === "all"
                ? "bg-white text-navy-900 shadow-sm"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filter === "unread"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
          Loading field notifications...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
          <p className="text-sm font-bold text-navy-900">All caught up!</p>
          <p className="text-xs text-slate-500 mt-1">
            No {filter === "unread" ? "unread " : ""}dispatch notices at this moment.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-3.5 transition-all bg-white ${
                !item.read
                  ? "border-orange-300 shadow-sm ring-1 ring-orange-200/50"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 p-2 rounded-lg ${
                    !item.read ? "bg-orange-50" : "bg-slate-50"
                  }`}
                >
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      className={`text-sm font-bold ${
                        !item.read ? "text-navy-950" : "text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h2>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    {item.jobId ? (
                      <Link
                        href={`/tech/jobs/${item.jobId}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        View Job #{item.jobNumber || item.jobId}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> System Alert
                      </span>
                    )}

                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(item.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
