"use client";

import * as React from "react";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Kanban,
  Map as MapIcon,
  MapPin,
  RefreshCw,
  User,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JobDrawer } from "@/components/admin/JobDrawer";
import type { EnrichedJob } from "@/lib/server/operations";

const TIME_SLOTS = [
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export default function AdminDispatchCalendarPage() {
  const [currentDate, setCurrentDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );
  const [jobs, setJobs] = React.useState<EnrichedJob[]>([]);
  const [selectedTech, setSelectedTech] = React.useState<string>("all");
  const [selectedJob, setSelectedJob] = React.useState<EnrichedJob | null>(null);
  const [loading, setLoading] = React.useState(true);

  const tz = businessConfig.timezone;

  const loadData = React.useCallback(async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dispatch/board?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData(currentDate);
  }, [currentDate, loadData]);

  function changeDay(deltaDays: number) {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + deltaDays);
    setCurrentDate(d.toISOString().slice(0, 10));
  }

  const filteredJobs = jobs.filter(
    (j) => selectedTech === "all" || j.technician?.id === selectedTech
  );

  const unassignedJobs = jobs.filter((j) => j.status === "unassigned");

  return (
    <div className="space-y-4">
      {/* Top Dispatch Navigation Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-navy-950">Dispatch Calendar</h1>
            <p className="text-xs text-navy-600">
              Daily technician timeline and appointment schedule
            </p>
          </div>

          {/* Sub-view switcher */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <Link
              href="/admin/dispatch"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-navy-700 hover:text-navy-900"
            >
              <MapIcon className="h-3.5 w-3.5" />
              Live Map
            </Link>
            <Link
              href="/admin/dispatch/calendar"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-900 text-white shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5" />
              Calendar
            </Link>
            <Link
              href="/admin/dispatch/board"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-navy-700 hover:text-navy-900"
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </Link>
          </div>
        </div>

        {/* Date Selector & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => changeDay(-1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-bold text-navy-900"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => changeDay(1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date().toISOString().slice(0, 10))}
              className="text-xs font-bold text-orange-600"
            >
              Today
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-navy-700">Filter Technician:</label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-navy-900 focus:outline-none"
            >
              <option value="all">All Technicians</option>
              <option value="tech-carlos">Carlos Mendez</option>
              <option value="tech-danny">Danny Reyes</option>
              <option value="tech-maria">Maria Alvarez</option>
              <option value="tech-tony">Tony Brooks</option>
            </select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadData(currentDate)}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Unassigned Warning Banner */}
      {unassignedJobs.length > 0 ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {unassignedJobs.length} {unassignedJobs.length === 1 ? "work order" : "work orders"} unassigned for {currentDate}!
            </span>
          </div>
          <Link
            href="/admin/dispatch/board"
            className="text-xs font-bold text-amber-950 underline hover:text-amber-800"
          >
            Assign on Kanban Board &rarr;
          </Link>
        </div>
      ) : null}

      {/* Timeline Schedule Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-navy-700">
            {formatInTimeZone(new Date(currentDate + "T12:00:00"), tz, "EEEE, MMMM d, yyyy")}
          </span>
          <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-navy-800">
            {filteredJobs.length} Scheduled Visits
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-navy-900">No appointments scheduled for this day</h3>
            <p className="text-xs text-navy-500 mt-0.5">
              Select another date or create a new job via dispatch.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50/80 transition-colors cursor-pointer gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-orange-500 font-bold shadow-sm shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-navy-900">
                        #{job.jobNumber}
                      </span>
                      <StatusBadge status={job.status} />
                      <span className="text-xs font-bold text-orange-600">
                        {formatInTimeZone(new Date(job.scheduledStart), tz, "h:mm a")} –{" "}
                        {formatInTimeZone(new Date(job.scheduledEnd), tz, "h:mm a")}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-navy-900">{job.service.name}</h4>
                    <p className="text-xs text-navy-600 mt-0.5">
                      {job.customer.name} · {job.addressLine1}, {job.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] font-bold text-navy-500 block">
                      Assigned Tech:
                    </span>
                    <span className="text-xs font-bold text-navy-900">
                      {job.technician?.name || "Unassigned"}
                    </span>
                  </div>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-navy-900 hover:bg-slate-100"
                  >
                    Work Order &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob ? (
        <JobDrawer
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onJobUpdated={() => void loadData(currentDate)}
        />
      ) : null}
    </div>
  );
}
