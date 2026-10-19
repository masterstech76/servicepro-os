"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  MessageSquare,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import type { AdminNotificationRecord } from "@/lib/server/admin-portal";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = React.useState<AdminNotificationRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [channelFilter, setChannelFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const tz = businessConfig.timezone;

  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (channelFilter !== "all") sp.set("channel", channelFilter);
      if (searchQuery.trim()) sp.set("q", searchQuery.trim());

      const res = await fetch(`/api/admin/notifications?${sp.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications || []);
      }
    } finally {
      setLoading(false);
    }
  }, [channelFilter, searchQuery]);

  React.useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-orange-500" />
            Notification &amp; SMS History
          </h1>
          <p className="text-xs text-navy-600 mt-1">
            Audit log of all automated customer SMS alerts, technician dispatch messages, and confirmations.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void loadNotifications()}
          className="rounded-xl border-slate-300 font-bold text-navy-800"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Log
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by recipient phone, customer name, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          {["all", "sms", "email", "in_app"].map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[11px] transition-all ${
                channelFilter === ch
                  ? "bg-navy-900 text-white shadow-sm"
                  : "bg-slate-100 text-navy-700 hover:bg-slate-200"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading notification delivery records...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications match your search criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-bold">
                  {n.channel === "sms" ? <MessageSquare className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-navy-900 text-xs">{n.recipientName}</span>
                      <span className="text-[11px] font-mono text-slate-500">({n.recipient})</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        {n.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {formatInTimeZone(new Date(n.createdAt), tz, "MMM d, h:mm a")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 mt-1">
                    {n.body}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Delivered via Twilio Gateway
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
