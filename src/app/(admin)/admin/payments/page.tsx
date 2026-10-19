"use client";

import * as React from "react";
import Link from "next/link";
import {
  CreditCard,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  DollarSign,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import type { AdminPaymentItem } from "@/lib/server/admin-portal";

interface PaymentsResponse {
  payments: AdminPaymentItem[];
  total: number;
  page: number;
  totalPages: number;
  summary: {
    totalCollectedCents: number;
    cardCollectedCents: number;
    cashCollectedCents: number;
    totalRefundedCents: number;
  };
}

export default function AdminPaymentsPage() {
  const [data, setData] = React.useState<PaymentsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const tz = businessConfig.timezone;

  const loadPayments = React.useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (statusFilter !== "all") sp.set("status", statusFilter);
      if (searchQuery.trim()) sp.set("q", searchQuery.trim());
      sp.set("page", String(page));
      sp.set("limit", "15");

      const res = await fetch(`/api/admin/payments?${sp.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, page]);

  React.useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  function exportCSV() {
    if (!data || !data.payments.length) return;
    const headers = ["Payment Ref", "Job #", "Customer", "Amount", "Method", "Card Brand", "Last4", "Gateway Ref", "Status", "Date"];
    const rows = data.payments.map((p) => [
      p.paymentNumber,
      p.jobNumber,
      `"${p.customerName}"`,
      (p.amountCents / 100).toFixed(2),
      p.method,
      p.cardBrand || "",
      p.cardLast4 || "",
      p.stripePaymentIntentId || "",
      p.status,
      p.createdAt,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payments_export_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <CreditCard className="h-6 w-6 text-orange-500" />
            Payment Ledger
          </h1>
          <p className="text-xs text-navy-600 mt-1">
            Real-time ledger of digital captures, deposits, and cash settlements.
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
            Export Ledger
          </Button>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs"
          >
            View Invoices &rarr;
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Net Collected</span>
          <span className="text-xl font-black text-emerald-700 block mt-1">
            {formatMoney(data?.summary.totalCollectedCents || 0)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{data?.total || 0} recorded transactions</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-navy-600 uppercase tracking-wider block">Stripe Card Digital</span>
          <span className="text-xl font-black text-navy-900 block mt-1">
            {formatMoney(data?.summary.cardCollectedCents || 0)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Online &amp; mobile terminal</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-navy-600 uppercase tracking-wider block">Cash / Check</span>
          <span className="text-xl font-black text-navy-900 block mt-1">
            {formatMoney(data?.summary.cashCollectedCents || 0)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Field collections</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Refunds</span>
          <span className="text-xl font-black text-amber-600 block mt-1">
            {formatMoney(data?.summary.totalRefundedCents || 0)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Settled reversals</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transaction #, customer name, card last 4..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {["all", "succeeded", "refunded", "failed"].map((st) => (
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

      {/* Payments Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-navy-700 uppercase font-bold tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Payment Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Related Job</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Transaction Date</th>
                <th className="px-4 py-3 text-right">Job Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading ledger transactions...
                  </td>
                </tr>
              ) : !data || data.payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payment records match the specified filters.
                  </td>
                </tr>
              ) : (
                data.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-navy-900">
                      {p.paymentNumber}
                      {p.stripePaymentIntentId && (
                        <span className="block text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                          {p.stripePaymentIntentId}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy-900">
                      {p.customerName}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/jobs/${p.jobId}`}
                        className="font-bold text-orange-600 hover:underline"
                      >
                        Job #{p.jobNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <span className="font-semibold text-navy-800">{p.method}</span>
                      {p.cardLast4 && (
                        <span className="text-slate-400 text-[11px] ml-1">
                          •••• {p.cardLast4}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          p.status === "succeeded"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "refunded"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-navy-900">
                      {formatMoney(p.amountCents)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatInTimeZone(new Date(p.createdAt), tz, "MMM d, yyyy h:mm a")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/jobs/${p.jobId}`}
                        className="inline-flex items-center gap-1 font-bold text-navy-700 hover:text-navy-950 text-xs"
                      >
                        <span>Inspect</span>
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
