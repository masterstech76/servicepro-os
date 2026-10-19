"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Download,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";
import { formatMoneyCents } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export default function InvoicesPage() {
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState({ totalInvoices: 0, totalSpentCents: 0, balanceDueCents: 0 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "paid" | "due">("all");

  const fetchInvoices = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/invoices");
      if (!res.ok) throw new Error("Failed to load invoices");
      const data = await res.json();
      setInvoices(data.invoices || []);
      setSummary(data.summary || { totalInvoices: 0, totalSpentCents: 0, balanceDueCents: 0 });
    } catch (err: any) {
      setError(err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = React.useMemo(() => {
    if (filter === "paid") return invoices.filter((i) => i.status === "paid");
    if (filter === "due") return invoices.filter((i) => i.status === "sent" || i.status === "draft");
    return invoices;
  }, [invoices, filter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
          Invoices & Billing Statements
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review transparent labor & parts breakdowns, download receipts, and settle pending balances.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Invoices
          </p>
          <p className="text-2xl font-black text-navy-900">{summary.totalInvoices}</p>
          <span className="text-[11px] text-slate-500 block">Generated work orders</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Paid to Date
          </p>
          <p className="text-2xl font-black text-emerald-600">
            {formatMoneyCents(summary.totalSpentCents)}
          </p>
          <span className="text-[11px] text-slate-500 block">Settled with receipts</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Outstanding Balance
          </p>
          <p
            className={`text-2xl font-black ${
              summary.balanceDueCents > 0 ? "text-orange-600" : "text-slate-900"
            }`}
          >
            {formatMoneyCents(summary.balanceDueCents)}
          </p>
          <span className="text-[11px] text-slate-500 block">
            {summary.balanceDueCents > 0 ? "Due upon completion" : "Zero balance"}
          </span>
        </div>
      </div>

      {/* Filters */}
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
          All Invoices ({invoices.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("due")}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
            filter === "due"
              ? "border-orange-500 text-orange-600 bg-orange-50/50"
              : "border-transparent text-slate-600 hover:text-navy-900"
          }`}
        >
          Balance Due
        </button>
        <button
          type="button"
          onClick={() => setFilter("paid")}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
            filter === "paid"
              ? "border-orange-500 text-orange-600 bg-orange-50/50"
              : "border-transparent text-slate-600 hover:text-navy-900"
          }`}
        >
          Paid in Full
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center space-y-3">
          <AlertCircle className="h-7 w-7 text-red-600 mx-auto" />
          <p className="font-bold text-red-900">{error}</p>
          <Button onClick={fetchInvoices} size="sm" variant="outline" className="text-xs">
            Retry
          </Button>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <Receipt className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No Invoices Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don&apos;t have any invoices matching this status. Invoices are generated once a service job is confirmed or completed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((inv) => {
            const isPaid = inv.status === "paid";

            return (
              <div
                key={inv.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-navy-900 text-orange-500 flex items-center justify-center font-bold">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-navy-900">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {isPaid ? "Paid in Full" : "Balance Due"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {inv.serviceName} • Job #{inv.jobNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-black text-navy-900">
                      Total: {formatMoneyCents(inv.totalCents)}
                    </p>
                    {!isPaid && (
                      <p className="text-xs font-bold text-orange-600">
                        Due: {formatMoneyCents(inv.amountDueCents)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Line Items Preview */}
                {inv.lineItems && inv.lineItems.length > 0 && (
                  <div className="rounded-xl bg-slate-50 p-3 space-y-1 text-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Itemized Breakdown
                    </p>
                    {inv.lineItems.map((li: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-slate-600">
                        <span>{li.description}</span>
                        <span className="font-semibold text-navy-900">{formatMoneyCents(li.amountCents)}</span>
                      </div>
                    ))}
                    {inv.depositCreditCents > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                        <span>Deposit Credit Applied:</span>
                        <span>-{formatMoneyCents(inv.depositCreditCents)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500">
                    Location: <span className="font-semibold text-navy-900">{inv.addressLine1}, {inv.city}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/account/appointments/${inv.jobId}`}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-navy-900 font-bold hover:bg-slate-50"
                    >
                      Work Order
                    </Link>

                    {isPaid ? (
                      <Link
                        href={`/pay/${inv.publicPayToken}`}
                        className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Receipt</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/pay/${inv.publicPayToken}`}
                        className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold shadow-sm"
                      >
                        Pay Online ({formatMoneyCents(inv.amountDueCents)})
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
