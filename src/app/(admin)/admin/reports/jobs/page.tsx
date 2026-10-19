"use client";

import * as React from "react";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Layers,
  PieChart,
  RefreshCw,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobsReportData {
  type: "jobs";
  totalJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  inProgressJobs: number;
  unassignedJobs: number;
  completionRate: string;
  cancellationRate: string;
  serviceBreakdown: Record<string, number>;
}

export default function AdminJobsReportPage() {
  const [data, setData] = React.useState<JobsReportData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadReport = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports?type=jobs");
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
          <h1 className="text-2xl font-bold text-navy-950">Job Operations Report</h1>
          <p className="text-xs text-navy-600">
            Work order volume, completion rates, and service category breakdown
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
            className="px-3 py-1.5 rounded-lg bg-navy-900 text-white shadow-sm"
          >
            Jobs
          </Link>
          <Link
            href="/admin/reports/revenue"
            className="px-3 py-1.5 rounded-lg text-navy-700 hover:text-navy-900"
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
          {/* KPI Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
                Total Work Orders
              </span>
              <span className="text-2xl font-black text-navy-900 mt-1 block">
                {data.totalJobs}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
                Completed Visits
              </span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                {data.completedJobs}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                {data.completionRate} rate
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
                Active / In-Field
              </span>
              <span className="text-2xl font-black text-orange-600 mt-1 block">
                {data.inProgressJobs}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
                Cancelled Orders
              </span>
              <span className="text-2xl font-black text-rose-600 mt-1 block">
                {data.cancelledJobs}
              </span>
              <span className="text-[11px] text-rose-600 font-semibold mt-0.5 block">
                {data.cancellationRate} rate
              </span>
            </div>
          </div>

          {/* Service Categories Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy-950">
              Work Order Distribution by HVAC Service Category
            </h3>

            <div className="space-y-3">
              {Object.entries(data.serviceBreakdown).map(([category, count]) => {
                const pct = Math.round((count / Math.max(1, data.totalJobs)) * 100);

                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-navy-900">{category}</span>
                      <span className="text-navy-600 font-mono">
                        {count} jobs ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
