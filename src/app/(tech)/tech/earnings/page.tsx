"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  Briefcase,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import type { TechEarningsSummary } from "@/lib/server/tech-portal";

export default function TechEarningsPage() {
  const [data, setData] = React.useState<TechEarningsSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [period, setPeriod] = React.useState<"this_week" | "this_month" | "all_time">("this_month");

  const tz = businessConfig.timezone;

  const loadEarnings = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/technicians/earnings?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, [period]);

  React.useEffect(() => {
    void loadEarnings();
  }, [loadEarnings]);

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-navy-900 tracking-tight flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-orange-500" />
            My Earnings &amp; Commission
          </h1>
          <p className="text-xs text-navy-600 mt-0.5">
            Verified completed work orders, performance commission, and payout balances.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-200 p-1 text-xs">
          {(["this_month", "all_time"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                period === p ? "bg-white text-navy-950 shadow-sm" : "text-navy-600"
              }`}
            >
              {p.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Earned</span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">
            {formatMoney(data?.totalEarningsCents || 0)}
          </span>
          <span className="text-[11px] text-emerald-600 mt-0.5 block font-semibold">
            {data?.commissionRatePct}% Tier Rate + Tips
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Completed Jobs</span>
          <span className="text-2xl font-black text-navy-900 block mt-1">
            {data?.completedJobsCount || 0}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block font-medium">
            {formatMoney(data?.totalBilledCents || 0)} Gross Billed
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Paid Out</span>
          <span className="text-xl font-black text-emerald-700 block mt-1">
            {formatMoney(data?.paidPayoutCents || 0)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Direct deposited</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Pending Next Cycle</span>
          <span className="text-xl font-black text-amber-600 block mt-1">
            {formatMoney(data?.pendingPayoutCents || 0)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Scheduled for Friday</span>
        </div>
      </div>

      {/* Commission Breakdown List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-navy-700">
            Completed Job Ledger
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {data?.jobs.length || 0} jobs
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading payout records...</div>
        ) : !data || data.jobs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No completed jobs in this period.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.jobs.map((job) => (
              <div key={job.jobId} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold text-navy-900">#{job.jobNumber}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        job.status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-navy-900">{job.serviceName}</h4>
                  <p className="text-[11px] text-slate-500">
                    Billed: {formatMoney(job.billedCents)} • {formatInTimeZone(new Date(job.completedAt), tz, "MMM d, yyyy")}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-sm text-emerald-700 block">
                    +{formatMoney(job.totalPayoutCents)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Comm: {formatMoney(job.commissionEarnedCents)}
                    {job.tipsCents > 0 && ` + Tip: ${formatMoney(job.tipsCents)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
