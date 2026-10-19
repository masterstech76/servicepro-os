"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Receipt,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import type { AdminInvoiceItem } from "@/lib/server/admin-portal";

interface InvoicesResponse {
  invoices: AdminInvoiceItem[];
  total: number;
  page: number;
  totalPages: number;
  summary: {
    totalBilledCents: number;
    totalCollectedCents: number;
    totalOutstandingCents: number;
    paidCount: number;
    overdueCount: number;
  };
}

export default function AdminInvoicesPage() {
  const [data, setData] = React.useState<InvoicesResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const tz = businessConfig.timezone;

  const loadInvoices = React.useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (statusFilter !== "all") sp.set("status", statusFilter);
      if (searchQuery.trim()) sp.set("q", searchQuery.trim());
      sp.set("page", String(page));
      sp.set("limit", "15");

      const res = await fetch(`/api/admin/invoices?${sp.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, page]);

  React.useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  function exportCSV() {
    if (!data || !data.invoices.length) return;
    const headers = ["Invoice Number", "Customer", "Phone", "Job Number", "Service", "Status", "Total", "Paid", "Due", "Created Date"];
    const rows = data.invoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.customerName}"`,
      inv.customerPhone,
      inv.jobNumber,
      `"${inv.serviceName}"`,
      inv.status,
      (inv.totalCents / 100).toFixed(2),
      (inv.amountPaidCents / 100).toFixed(2),
      (inv.amountDueCents / 100).toFixed(2),
      inv.createdAt,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invoices_export_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <FileText className="h-6 w-6 text-orange-500" />
            Invoice Management
          </h1>
          <p className="text-xs text-navy-600 mt-1">
            Track customer billings, payment settlements, and outstanding balances.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="rounded-xl border-slate-300 font-bold text-navy-800"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV
          </Button>
          <Link
            href="/admin/jobs/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            + Create Work Order
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-navy-500 uppercase tracking-wider block">Total Billed</span>
          <span className="text-xl font-black text-navy-900 block mt-1">
            {formatMoney(data?.summary.totalBilledCents || 0)}
          </span>
          <span className="text-[11px] text-navy-400 mt-0.5 block">{data?.total || 0} total invoices</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Collected Cash</span>
          <span className="text-xl font-black text-emerald-700 block mt-1">
            {formatMoney(data?.summary.totalCollectedCents || 0)}
          </span>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">{data?.summary.paidCount || 0} paid in full</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Outstanding Due</span>
          <span className="text-xl font-black text-amber-600 block mt-1">
            {formatMoney(data?.summary.totalOutstandingCents || 0)}
          </span>
          <span className="text-[11px] text-amber-600 mt-0.5 block">Awaiting customer payment</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Overdue Alerts</span>
          <span className="text-xl font-black text-rose-600 block mt-1">
            {data?.summary.overdueCount || 0}
          </span>
          <span className="text-[11px] text-rose-500 mt-0.5 block">Past payment window</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, customer name, phone, or service..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {["all", "paid", "sent", "draft", "overdue"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                statusFilter === st
                  ? "bg-navy-900 text-white shadow-sm"
                  : "bg-slate-100 text-navy-700 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-navy-700 uppercase font-bold tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Related Job</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Amount Due</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading invoice records...
                  </td>
                </tr>
              ) : !data || data.invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No invoices match the specified criteria.
                  </td>
                </tr>
              ) : (
                data.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-navy-900">
                      <Link href={`/admin/invoices/${inv.id}`} className="hover:text-orange-600 hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-navy-900">{inv.customerName}</div>
                      <div className="text-[11px] text-navy-500">{inv.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-navy-800">Job #{inv.jobNumber}</div>
                      <div className="text-[11px] text-navy-500 truncate max-w-[180px]">{inv.serviceName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          inv.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "sent"
                            ? "bg-blue-100 text-blue-800"
                            : inv.status === "overdue"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-navy-900">
                      {formatMoney(inv.totalCents)}
                    </td>
                    <td className="px-4 py-3 font-bold">
                      {inv.amountDueCents > 0 ? (
                        <span className="text-amber-600">{formatMoney(inv.amountDueCents)}</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">$0.00</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-navy-600">
                      {formatInTimeZone(new Date(inv.dueDate), tz, "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="inline-flex items-center gap-1 font-bold text-orange-600 hover:underline text-xs"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
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
              <span className="font-bold text-navy-900">{data.totalPages}</span>
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
