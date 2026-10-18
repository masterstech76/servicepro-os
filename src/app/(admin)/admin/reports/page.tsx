"use client";

import * as React from "react";
import { BarChart3, Download, TrendingUp } from "lucide-react";
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
  const [groupBy, setGroupBy] = React.useState<"tech" | "service" | "day">("tech");
  const [report, setReport] = React.useState<ReportResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadReport = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/revenue?groupBy=${groupBy}`);
      const data = (await res.json()) as ReportResponse;
      setReport(data);
    } finally {
      setLoading(false);
    }
  }, [groupBy]);

  React.useEffect(() => {
    void loadReport();
  }, [loadReport]);

  function exportReportCsv() {
    if (!report) return;
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
      `"${r.groupLabel}"`,
      r.jobsCompleted,
      (r.grossCents / 100).toFixed(2),
      (r.tipsCents / 100).toFixed(2),
      (r.refundsCents / 100).toFixed(2),
      (r.netCents / 100).toFixed(2),
      (r.commissionCents / 100).toFixed(2),
    ]);
    const csv = [headers.join(","), ...lines.map((l) => l.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `servicepro-revenue-${groupBy}-${report.toDate}.csv`;
    a.click();
  }

  const maxGross = Math.max(
    1,
    ...(report?.rows.map((r) => r.grossCents) ?? [1])
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Revenue & Commission Reports
          </h1>
          <p className="text-xs text-navy-700">
            Last 14 days financial performance ({report?.fromDate} → {report?.toDate})
          </p>
        </div>

        <div className="flex items-center gap-2">
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
              <span className="text-[11px] text-navy-700">Per completed job</span>
            </div>

            <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-semibold text-navy-700">
                Tech Tips Collected
              </span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                <Money cents={report.summary.tipsCents} />
              </p>
              <span className="text-[11px] text-navy-700">100% pass-through</span>
            </div>

            <div className="col-span-2 lg:col-span-1 rounded-card border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-semibold text-navy-700">
                Tech Commissions
              </span>
              <p className="text-2xl font-bold text-navy-900 mt-1">
                <Money cents={report.summary.commissionCents} />
              </p>
              <span className="text-[11px] text-navy-700">Earned on pre-tip subtotal</span>
            </div>
          </section>

          {/* Visual Bar Chart Breakdown */}
          <section className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              Visual Revenue Breakdown (
              {groupBy === "tech"
                ? "By Technician"
                : groupBy === "service"
                ? "By Service"
                : "Daily Trend"}
              )
            </h2>

            <div className="space-y-3">
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
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
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
