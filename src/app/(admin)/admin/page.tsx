"use client";

import * as React from "react";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Truck,
  Users,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JobDrawer } from "@/components/admin/JobDrawer";
import type { EnrichedJob } from "@/lib/server/operations";

interface BoardResponse {
  date: string;
  timezone: string;
  jobs: EnrichedJob[];
  technicians: Array<{
    id: string;
    name: string;
    color: string;
    skills: string[];
    shift: { startTime: string; endTime: string } | null;
    jobsCountToday: number;
    maxRecommendedJobs: number;
    statusLabel: string;
    jobsToday: EnrichedJob[];
  }>;
  kpis: {
    totalJobsToday: number;
    unassignedCount: number;
    unassignedUrgentCount: number;
    inFieldCount: number;
    completedTodayCount: number;
    revenueTodayCents: number;
  };
  alerts: Array<{
    id: string;
    severity: "critical" | "warning" | "info";
    title: string;
    description: string;
    jobId?: string;
    createdAt: string;
  }>;
}

export default function AdminOverviewPage() {
  const [data, setData] = React.useState<BoardResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedJob, setSelectedJob] = React.useState<EnrichedJob | null>(null);

  const loadBoard = React.useCallback(async () => {
    try {
      const res = await fetch("/api/dispatch/board");
      const json = (await res.json()) as BoardResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-card bg-slate-200" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-card bg-slate-200" />
      </div>
    );
  }

  const tz = data.timezone || businessConfig.timezone;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Operations Overview
          </h1>
          <p className="text-xs text-navy-700 mt-0.5">
            Today’s live dispatch command center for {businessConfig.businessName}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/admin/dispatch">
            <Button size="sm" className="gap-1.5">
              <CalendarClock className="h-4 w-4" />
              Open Dispatch Board
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* SLA Alert Banner */}
      {data.alerts.length > 0 ? (
        <section
          aria-label="Dispatch SLA Alerts"
          data-testid="sla-alert-banner"
          className="rounded-card border border-red-200 bg-red-50/90 p-4 shadow-sm space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-800">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Action Required ({data.alerts.length} Active Alert
              {data.alerts.length === 1 ? "" : "s"})
            </span>
            <Link
              href="/admin/dispatch"
              className="text-xs font-semibold text-red-800 underline"
            >
              Go to Unassigned Queue →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {data.alerts.map((alert) => {
              const jobMatch = data.jobs.find((j) => j.id === alert.jobId);
              return (
                <div
                  key={alert.id}
                  className="flex items-center justify-between gap-3 rounded-input border border-red-200 bg-white p-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy-900 truncate">
                      {alert.title}
                    </p>
                    <p className="text-[11px] text-navy-700 truncate">
                      {alert.description}
                    </p>
                  </div>
                  {jobMatch ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setSelectedJob(jobMatch)}
                    >
                      Assign Now
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* 5 KPI Summary Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
            <span>Jobs Today</span>
            <CalendarClock className="h-4 w-4 text-navy-700" />
          </div>
          <p className="text-2xl font-bold text-navy-900 mt-2 tabular-nums">
            {data.kpis.totalJobsToday}
          </p>
          <p className="text-[11px] text-navy-700 mt-1">
            Scheduled across {data.technicians.length} techs
          </p>
        </div>

        <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
            <span>Unassigned</span>
            <AlertTriangle
              className={`h-4 w-4 ${
                data.kpis.unassignedCount > 0 ? "text-amber-600" : "text-slate-400"
              }`}
            />
          </div>
          <p className="text-2xl font-bold text-navy-900 mt-2 tabular-nums">
            {data.kpis.unassignedCount}
          </p>
          <p className="text-[11px] text-amber-800 font-medium mt-1">
            {data.kpis.unassignedUrgentCount} starting within 2h
          </p>
        </div>

        <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
            <span>In Field Now</span>
            <Truck className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900 mt-2 tabular-nums">
            {data.kpis.inFieldCount}
          </p>
          <p className="text-[11px] text-navy-700 mt-1">
            En route or actively working
          </p>
        </div>

        <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
            <span>Completed Today</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900 mt-2 tabular-nums">
            {data.kpis.completedTodayCount}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Invoices settled
          </p>
        </div>

        <div className="col-span-2 lg:col-span-1 rounded-card border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-navy-700">
            <span>Today’s Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900 mt-2">
            <Money cents={data.kpis.revenueTodayCents} />
          </p>
          <p className="text-[11px] text-navy-700 mt-1">
            From completed jobs today
          </p>
        </div>
      </section>

      {/* Technician Fleet Schedule & Load */}
      <section className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              Technician Fleet Schedule & Load
            </h2>
            <p className="text-xs text-navy-700">
              Click any job pill to inspect details, reassign, or message customer
            </p>
          </div>
          <Link
            href="/admin/technicians"
            className="text-xs font-semibold text-orange-700 hover:underline"
          >
            Manage Shifts & Time Off →
          </Link>
        </div>

        <div className="space-y-3">
          {data.technicians.map((tech) => (
            <div
              key={tech.id}
              className="rounded-input border border-slate-200 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-[210px]">
                <span
                  className="h-3.5 w-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: tech.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-navy-900">
                      {tech.name}
                    </span>
                    <span className="rounded-pill bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-navy-700">
                      {tech.jobsCountToday}/{tech.maxRecommendedJobs} jobs
                    </span>
                  </div>
                  <p className="text-xs text-navy-700">
                    {tech.shift
                      ? `Shift ${tech.shift.startTime}–${tech.shift.endTime}`
                      : "Off Today"}{" "}
                    · {tech.statusLabel}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-wrap gap-2">
                {tech.jobsToday.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">
                    No jobs assigned today
                  </span>
                ) : (
                  tech.jobsToday.map((j) => (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => setSelectedJob(j)}
                      className="flex items-center gap-2 rounded-input border border-slate-200 bg-slate-50 hover:border-orange-500 hover:bg-orange-50/30 px-3 py-1.5 text-left transition-colors"
                    >
                      <span className="font-mono text-xs font-bold text-navy-900">
                        #{j.jobNumber}
                      </span>
                      <span className="text-xs font-medium text-navy-900">
                        {formatInTimeZone(new Date(j.scheduledStart), tz, "h:mm a")}
                      </span>
                      <span className="text-xs text-navy-700 truncate max-w-[140px]">
                        {j.service.name}
                      </span>
                      <StatusBadge status={j.status} />
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Dispatch Queue Table */}
      <section className="rounded-card border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-navy-900">
            Today’s Jobs ({data.jobs.length})
          </h2>
          <Link
            href="/admin/jobs"
            className="text-xs font-semibold text-orange-700 hover:underline"
          >
            View All Historical Jobs →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-navy-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Window</th>
                <th className="px-4 py-3">Customer & ZIP</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Estimate / Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.jobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-bold text-navy-900">
                    #{job.jobNumber}
                  </td>
                  <td className="px-4 py-3 text-xs text-navy-700 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-medium text-navy-900">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatInTimeZone(new Date(job.scheduledStart), tz, "h:mm a")} –{" "}
                      {formatInTimeZone(new Date(job.scheduledEnd), tz, "h:mm a")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy-900">
                      {job.customer.name}
                    </div>
                    <div className="text-xs text-navy-700 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {job.addressLine1} ({job.zip})
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-navy-900">
                    {job.service.name}
                  </td>
                  <td className="px-4 py-3">
                    {job.technician ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: job.technician.color }}
                        />
                        {job.technician.name}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-800">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-navy-900">
                    <Money cents={job.totalCents ?? job.estimatedTotalCents} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <JobDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onJobUpdated={(updated) => {
          setSelectedJob(updated);
          void loadBoard();
        }}
      />
    </div>
  );
}
