"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wrench,
  Star,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  User,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";

interface TechPerformanceRecord {
  id: string;
  name: string;
  assignedJobs: number;
  completedJobs: number;
  revenueCents: number;
  rating: number;
}

interface TechniciansReportData {
  type: "technicians";
  technicians: TechPerformanceRecord[];
}

export default function AdminTechniciansReportPage() {
  const [data, setData] = React.useState<TechniciansReportData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadReport = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports?type=technicians");
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
          <h1 className="text-2xl font-bold text-navy-950">Technician Performance Report</h1>
          <p className="text-xs text-navy-600">
            Workload distribution, revenue generated, and customer ratings per field technician
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
            className="px-3 py-1.5 rounded-lg text-navy-700 hover:text-navy-900"
          >
            Revenue
          </Link>
          <Link
            href="/admin/reports/technicians"
            className="px-3 py-1.5 rounded-lg bg-navy-900 text-white shadow-sm"
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
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-700">
              Technician Leaderboard ({data.technicians.length})
            </span>
            <span className="text-xs text-navy-500 font-semibold">
              Live database metrics
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-navy-700 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Technician</th>
                  <th className="px-5 py-3 text-right">Assigned Jobs</th>
                  <th className="px-5 py-3 text-right">Completed Visits</th>
                  <th className="px-5 py-3 text-right">Completion Rate</th>
                  <th className="px-5 py-3 text-right">Revenue Contributed</th>
                  <th className="px-5 py-3 text-right">Rating</th>
                  <th className="px-5 py-3 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.technicians.map((t) => {
                  const compRate =
                    t.assignedJobs > 0
                      ? ((t.completedJobs / t.assignedJobs) * 100).toFixed(0) + "%"
                      : "0%";

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy-900 text-orange-500 font-bold shrink-0">
                            <Wrench className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-navy-950 text-xs block">
                              {t.name}
                            </span>
                            <span className="text-[10px] text-navy-500 font-mono">
                              ID: {t.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-right font-bold text-navy-900 font-mono">
                        {t.assignedJobs}
                      </td>

                      <td className="px-5 py-3.5 text-right font-bold text-emerald-700 font-mono">
                        {t.completedJobs}
                      </td>

                      <td className="px-5 py-3.5 text-right font-bold text-navy-700">
                        {compRate}
                      </td>

                      <td className="px-5 py-3.5 text-right font-bold text-navy-950">
                        {formatMoney(t.revenueCents)}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {t.rating.toFixed(1)}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/technicians/${t.id}`}
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-navy-900 hover:bg-slate-100 inline-block"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
