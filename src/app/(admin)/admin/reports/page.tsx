"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart3, Calendar, Download, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";

interface RevenueRow {
  groupKey: string;
  groupLabel: string;
  jobsCompleted: number;
  grossCents: number;
  tipsCents: number;
  refundsCents: number;
  netCents: number;
  commissionCents: number;
}

interface ReportResponse {
  fromDate: string;
  toDate: string;
  groupBy: "tech" | "service" | "day";
  summary: {
    jobsCompleted: number;
    grossCents: number;
    tipsCents: number;
    refundsCents: number;
    netCents: number;
    commissionCents: number;
    avgTicketCents: number;
  };
  rows: RevenueRow[];
}

export default function AdminReportsPage() {
  const [groupBy, setGroupBy] = React.useState<"tech" | "service" | "day">(
    "tech"
  );
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");
  const [report, setReport] = React.useState<ReportResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const initialDatesSynced = React.useRef(false);

  const loadReport = React.useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ groupBy });
      if (fromDate) qs.set("from", fromDate);
      if (toDate) qs.set("to", toDate);
      const res = await fetch(`/api/reports/revenue?${qs.toString()}`);
      if (!res.ok) return;
      const data = (await res.json()) as ReportResponse;
      setReport(data);
      if (!initialDatesSynced.current) {
        initialDatesSynced.current = true;
        if (!fromDate && data.fromDate) setFromDate(data.fromDate);
        if (!toDate && data.toDate) setToDate(data.toDate);
      }
    } finally {
      setLoading(false);
    }
  }, [groupBy, fromDate, toDate]);

  React.useEffect(() => {
    void loadReport();
  }, [loadReport]);

  function exportReportCsv() {
    if (!report || !report.rows?.length) return;
    const headers = [
      "Group",
      "Jobs Completed",
      "Gross Revenue ($)",
      "Tips ($)",
      "Refunds ($)",
      "Net Revenue ($)",
      "Tech Commission ($)",
    ];
    const lines = report.rows.map((r) => [
      `"${r.groupLabel ?? ""}"`,
      r.jobsCompleted ?? 0,
      ((r.grossCents ?? 0) / 100).toFixed(2),
      ((r.tipsCents ?? 0) / 100).toFixed(2),
      ((r.refundsCents ?? 0) / 100).toFixed(2),
      ((r.netCents ?? 0) / 100).toFixed(2),
      ((r.commissionCents ?? 0) / 100).toFixed(2),
    ]);
    const csv = [headers.join(","), ...lines.map((l) => l.join(","))].join(
      "\n"
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `servicepro-revenue-${groupBy}-${report.toDate || new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const maxGross = Math.max(
    1,
    ...(report?.rows.map((r) => r.grossCents) ?? [1])
  );

  const chartData = React.useMemo(
    () =>
      (report?.rows ?? []).map((r) => ({
        name: r.groupLabel,
        grossDollars: Number((r.grossCents / 100).toFixed(2)),
        netDollars: Number((r.netCents / 100).toFixed(2)),
        commissionDollars: Number((r.commissionCents / 100).toFixed(2)),
        tipsDollars: Number((r.tipsCents / 100).toFixed(2)),
      })),
    [report]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Revenue & Commission Reports
          </h1>
          <p className="text-xs text-navy-700">
            Financial performance, technician commissions (labor-only), and tip
            pass-through ({report?.fromDate} → {report?.toDate})
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <Link
            href="/admin/reports"
            className="px-3 py-1.5 rounded-lg bg-navy-900 text-white shadow-sm"
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
            className="px-3 py-1.5 rounded-lg text-navy-700 hover:text-navy-900"
          >
            Technicians
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Picker */}
          <div className="inline-flex items-center gap-1.5 rounded-input border border-slate-300 bg-white px-2.5 py-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="date"
              aria-label="Report start date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent font-medium text-navy-900 focus:outline-none"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              aria-label="Report end date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent font-medium text-navy-900 focus:outline-none"
            />
          </div>

          <div
            role="group"
            aria-label="Report grouping"
            className="inline-flex rounded-input border border-slate-300 bg-white p-1"
          >
            {(
              [
                { id: "tech", label: "By Technician" },
                { id: "service", label: "By Service" },
                { id: "day", label: "By Day" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setGroupBy(tab.id)}
                data-testid={`report-tab-${tab.id}`}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                  groupBy === tab.id
                    ? "bg-navy-900 text-white"
                    : "text-navy-700 hover:text-navy-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={exportReportCsv}
            data-testid="export-report-csv"
            className="gap-1.5"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {loading || !report ? (
        <div className="h-64 animate-pulse rounded-card bg-slate-200" />
      ) : (
        <>
          {/* Summary KPI Cards */}
          <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-semibold text-navy-700">
                Gross Revenue
              </span>
              <p
                data-testid="report-gross-revenue"
                className="text-2xl font-bold text-navy-900 mt-1"
              >
                <Money cents={report.summary.grossCents} />
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">
                {report.summary.jobsCompleted} completed jobs
              </span>
            </div>

            <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-semibold text-navy-700">
                Net Revenue
              </span>
              <p className="text-2xl font-bold text-navy-900 mt-1">
                <Money cents={report.summary.netCents} />
              </p>
              <span className="text-[11px] text-navy-700">
                After <Money cents={report.summary.refundsCents} /> refunds
              </span>
            </div>

            <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-semibold text-navy-700">
                Average Ticket
              </span>
              <p className="text-2xl font-bold text-navy-900 mt-1">
                <Money cents={report.summary.avgTicketCents} />
              </p>
              <span className="text-[11px] text-navy-700">
                Per completed job
              </span>
            </div>

            <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-semibold text-navy-700">
                Tech Tips Collected
              </span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                <Money cents={report.summary.tipsCents} />
              </p>
              <span className="text-[11px] text-navy-700">
                100% pass-through
              </span>
            </div>

            <div className="col-span-2 lg:col-span-1 rounded-card border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-semibold text-navy-700">
                Tech Commissions
              </span>
              <p className="text-2xl font-bold text-navy-900 mt-1">
                <Money cents={report.summary.commissionCents} />
              </p>
              <span className="text-[11px] text-navy-700">
                Earned on labor only
              </span>
            </div>
          </section>

          {/* Interactive Recharts Financial Visualization + Progress Breakdown */}
          <section className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              Visual Revenue & Commission Chart (
              {groupBy === "tech"
                ? "By Technician"
                : groupBy === "service"
                  ? "By Service"
                  : "Daily Trend"}
              )
            </h2>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${v}`}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="grossDollars"
                    name="Gross Revenue ($)"
                    fill="#F97316"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="commissionDollars"
                    name="Tech Commission ($)"
                    fill="#0F172A"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="tipsDollars"
                    name="Customer Tips ($)"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              {report.rows.map((row) => {
                const widthPct = Math.max(
                  6,
                  Math.round((row.grossCents / maxGross) * 100)
                );
                return (
                  <div key={row.groupKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-navy-900">
                        {row.groupLabel}{" "}
                        <span className="font-normal text-navy-700">
                          ({row.jobsCompleted} jobs)
                        </span>
                      </span>
                      <span className="font-bold text-navy-900">
                        <Money cents={row.grossCents} />
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Detailed Financial Table */}
          <section className="rounded-card border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Accounting Ledger Breakdown
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-navy-700 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">
                      {groupBy === "tech"
                        ? "Technician"
                        : groupBy === "service"
                          ? "Service"
                          : "Date"}
                    </th>
                    <th className="px-4 py-3 text-right">Jobs</th>
                    <th className="px-4 py-3 text-right">Gross Revenue</th>
                    <th className="px-4 py-3 text-right">Tips</th>
                    <th className="px-4 py-3 text-right">Tech Commission</th>
                    <th className="px-4 py-3 text-right">Net Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.rows.map((row) => (
                    <tr key={row.groupKey} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-navy-900">
                        {row.groupLabel}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-navy-900">
                        {row.jobsCompleted}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-navy-900">
                        <Money cents={row.grossCents} />
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-700 font-medium">
                        <Money cents={row.tipsCents} />
                      </td>
                      <td className="px-4 py-3 text-right text-navy-700">
                        <Money cents={row.commissionCents} />
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-navy-900">
                        <Money cents={row.netCents} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
