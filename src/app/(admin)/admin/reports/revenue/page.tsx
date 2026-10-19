"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Receipt,
  Download,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";

interface RevenueReportData {
  type: "revenue";
  invoicedTotalCents: number;
  collectedPaymentsCents: number;
  tipsCents: number;
  taxCents: number;
  outstandingDueCents: number;
  completedJobsCount: number;
  avgTicketCents: number;
}

export default function AdminRevenueReportPage() {
  const [data, setData] = React.useState<RevenueReportData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadReport = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports?type=revenue");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadReport();
  }, [loadReport]);

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Revenue & Invoicing Report</h1>
          <p className="text-xs text-navy-600">
            Database-derived accrual billing vs cash collections, sales tax, and ticket sizes
          </p>
        </div>

        {/* Sub-report switcher tabs */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <Link
            href="/admin/reports"
            className="px-3 py-1.5 rounded-lg text-navy-700 hover:text-navy-900"
          >
            Overview
          </Link>
          <Link
            href="/admin/reports/jobs"
            className="px-3 py-1.5 rounded-lg text-navy-700 hover:text-navy-900"
          >
            Jobs
          </Link>
          <Link
            href="/admin/reports/revenue"
            className="px-3 py-1.5 rounded-lg bg-navy-900 text-white shadow-sm"
          >
            Revenue
          </Link>
          <Link
            href="/admin/reports/technicians"
            className="px-3 py-1.5 rounded-lg text-navy-700 hover:text-navy-900"
          >
            Technicians
          </Link>
        </div>
      </div>

      {loading || !data ? (
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      ) : (
        <>
          {/* Financial KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
                Total Invoiced (Accrual)
              </span>
              <span className="text-2xl font-black text-navy-900 mt-1 block">
                {formatMoney(data.invoicedTotalCents)}
              </span>
              <span className="text-[11px] text-navy-600 font-semibold mt-0.5 block">
                From completed jobs
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
                Payments Collected (Cash)
              </span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                {formatMoney(data.collectedPaymentsCents)}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                Settled deposits & charges
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
                Average Ticket Size
              </span>
              <span className="text-2xl font-black text-orange-600 mt-1 block">
                {formatMoney(data.avgTicketCents)}
              </span>
              <span className="text-[11px] text-navy-600 font-semibold mt-0.5 block">
                Per completed visit
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
                Outstanding Balance
              </span>
              <span
                className={`text-2xl font-black mt-1 block ${
                  data.outstandingDueCents > 0 ? "text-amber-600" : "text-emerald-700"
                }`}
              >
                {formatMoney(data.outstandingDueCents)}
              </span>
              <span className="text-[11px] text-navy-600 font-semibold mt-0.5 block">
                Accounts receivable
              </span>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy-950">
              Tax & Additional Surcharges Summary
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between font-semibold text-navy-800">
                <span>Florida State & County Sales Tax (7.0%):</span>
                <span className="font-bold text-navy-950 font-mono">
                  {formatMoney(data.taxCents)}
                </span>
              </div>
              <div className="py-2.5 flex justify-between font-semibold text-navy-800">
                <span>Customer Tips Collected for Field Techs:</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {formatMoney(data.tipsCents)}
                </span>
              </div>
              <div className="py-2.5 flex justify-between font-bold text-navy-950 text-sm pt-3">
                <span>Net Operating Collections:</span>
                <span className="text-orange-600 font-mono">
                  {formatMoney(data.collectedPaymentsCents - data.taxCents)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
