"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  User,
  History,
  Activity,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import type { AdminAuditEntry } from "@/lib/server/admin-portal";

interface AuditLogsResponse {
  logs: AdminAuditEntry[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminAuditLogsPage() {
  const [data, setData] = React.useState<AuditLogsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [entityFilter, setEntityFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const tz = businessConfig.timezone;

  const loadAuditLogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (entityFilter !== "all") sp.set("entityType", entityFilter);
      if (searchQuery.trim()) sp.set("q", searchQuery.trim());
      sp.set("page", String(page));
      sp.set("limit", "20");

      const res = await fetch(`/api/admin/audit-logs?${sp.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, [entityFilter, searchQuery, page]);

  React.useEffect(() => {
    void loadAuditLogs();
  }, [loadAuditLogs]);

  function exportCSV() {
    if (!data || !data.logs.length) return;
    const headers = ["ID", "Actor", "Action", "Entity Type", "Entity ID", "Details", "Timestamp"];
    const rows = data.logs.map((l) => [
      l.id,
      `"${l.actor}"`,
      `"${l.action}"`,
      l.entityType,
      `"${l.entityId}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.timestamp,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_trail_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-orange-500" />
            Administrative Audit Trail
          </h1>
          <p className="text-xs text-navy-600 mt-1">
            Immutable log of operations, inventory stock adjustments, customer updates, and job dispatches.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={exportCSV}
          className="rounded-xl border-slate-300 font-bold text-navy-800"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Export Audit Trail
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by actor, action, details, entity ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {["all", "Job", "Customer", "Inventory"].map((et) => (
            <button
              key={et}
              onClick={() => {
                setEntityFilter(et);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                entityFilter === et
                  ? "bg-navy-900 text-white shadow-sm"
                  : "bg-slate-100 text-navy-700 hover:bg-slate-200"
              }`}
            >
              {et}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-navy-700 uppercase font-bold tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity Type</th>
                <th className="px-4 py-3">Target ID</th>
                <th className="px-4 py-3">Context &amp; Payload Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading audit trail entries...
                  </td>
                </tr>
              ) : !data || data.logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No audit records found matching criteria.
                  </td>
                </tr>
              ) : (
                data.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatInTimeZone(new Date(log.timestamp), tz, "MMM d, h:mm:ss a")}
                    </td>
                    <td className="px-4 py-3 font-bold text-navy-900">
                      {log.actor}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] font-bold text-navy-800 bg-slate-100 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.entityType === "Job"
                            ? "bg-blue-100 text-blue-800"
                            : log.entityType === "Inventory"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {log.entityType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {log.entityId}
                    </td>
                    <td className="px-4 py-3 max-w-md font-mono text-[11px] text-slate-700 truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs">
            <span className="text-navy-500">
              Showing page <span className="font-bold text-navy-900">{data.page}</span> of{" "}
              <span className="font-bold text-navy-900">{data.totalPages}</span> ({data.total} total events)
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
