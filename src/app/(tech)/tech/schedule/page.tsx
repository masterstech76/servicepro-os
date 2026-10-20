"use client";

import * as React from "react";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Navigation,
  ChevronRight,
  ClipboardCheck,
  Package,
  AlertTriangle,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

const DEMO_TECH_OPTIONS = [
  { id: "tech-carlos", name: "Carlos Mendez" },
  { id: "tech-danny", name: "Danny Reyes" },
  { id: "tech-maria", name: "Maria Alvarez" },
  { id: "tech-tony", name: "Tony Brooks" },
];

export default function TechSchedulePage() {
  const [techId, setTechId] = React.useState("tech-carlos");
  const [viewFilter, setViewFilter] = React.useState<"today" | "tomorrow" | "week">("today");
  const [jobs, setJobs] = React.useState<EnrichedJob[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchSchedule = React.useCallback(async (activeTechId: string, filter: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/technicians/schedule?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchSchedule(techId, viewFilter);
  }, [techId, viewFilter, fetchSchedule]);

  const tz = businessConfig.timezone;

  return (
    <div className="space-y-4">
      {/* Top Banner & Technician Profile Context */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-orange-500 font-bold shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-navy-900">Technician Schedule</h1>
              <p className="text-xs text-navy-600">Assigned field dispatch roster</p>
            </div>
          </div>
          <select
            aria-label="Select technician schedule"
            value={techId}
            onChange={async (e) => {
              const newId = e.target.value;
              setTechId(newId);
              try {
                await fetch("/api/auth/demo-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ role: "technician", technicianId: newId }),
                });
              } catch {
                // silent
              }
            }}
            className="rounded-input border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-bold text-navy-900 focus:outline-none focus:border-orange-500"
          >
            {DEMO_TECH_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-3 gap-1.5 rounded-input bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setViewFilter("today")}
            className={`rounded-md py-1.5 text-xs font-bold transition-colors ${
              viewFilter === "today"
                ? "bg-navy-900 text-white shadow-sm"
                : "text-navy-700 hover:text-navy-900"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setViewFilter("tomorrow")}
            className={`rounded-md py-1.5 text-xs font-bold transition-colors ${
              viewFilter === "tomorrow"
                ? "bg-navy-900 text-white shadow-sm"
                : "text-navy-700 hover:text-navy-900"
            }`}
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => setViewFilter("week")}
            className={`rounded-md py-1.5 text-xs font-bold transition-colors ${
              viewFilter === "week"
                ? "bg-navy-900 text-white shadow-sm"
                : "text-navy-700 hover:text-navy-900"
            }`}
          >
            Next 7 Days
          </button>
        </div>
      </div>

      {/* Schedule Summary Bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-navy-600">
          {viewFilter === "today" ? "Today's Work Orders" : viewFilter === "tomorrow" ? "Tomorrow's Schedule" : "Weekly Schedule"}
        </span>
        <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-800">
          {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"} Assigned
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="text-sm font-bold text-navy-900">No scheduled visits in this window</h3>
          <p className="mt-1 text-xs text-navy-600">
            Check back later or contact dispatch for emergency calls and standby assignments.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, idx) => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              `${job.addressLine1}, ${job.city}, ${job.state} ${job.zip}`
            )}`;

            return (
              <div
                key={job.id}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Job Card Header */}
                <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-xs font-bold text-navy-800">
                      #{job.jobNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status} />
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatInTimeZone(new Date(job.scheduledStart), tz, "EEE, MMM d · h:mm a")} –{" "}
                      {formatInTimeZone(new Date(job.scheduledEnd), tz, "h:mm a")}
                    </div>
                    <h3 className="text-base font-bold text-navy-900">{job.service.name}</h3>
                    <p className="text-xs font-semibold text-navy-700 mt-0.5">{job.customer.name}</p>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-1.5 text-xs text-navy-600">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {job.addressLine1}, {job.city}, {job.state} {job.zip}
                    </span>
                  </div>

                  {/* Customer issue */}
                  {job.issueText ? (
                    <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-2 text-xs text-navy-800 line-clamp-2">
                      <strong className="text-navy-900 font-semibold">Issue: </strong>
                      {job.issueText}
                    </div>
                  ) : null}

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${job.customer.phone}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-navy-800 hover:bg-slate-50"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      Call Customer
                    </a>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-navy-800 hover:bg-slate-50"
                    >
                      <Navigation className="h-3.5 w-3.5 text-blue-600" />
                      Directions
                    </a>
                  </div>

                  {/* Sub-routes Links */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-1.5 pt-1 border-t border-slate-100">
                    <Link
                      href={`/tech/jobs/${job.id}/checklist`}
                      className="flex flex-col items-center justify-center rounded-xl bg-orange-50/70 border border-orange-200/60 p-1.5 sm:p-2 text-center text-[10px] sm:text-[11px] font-bold text-orange-900 hover:bg-orange-100/70"
                    >
                      <ClipboardCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 mb-0.5" />
                      Checklist
                    </Link>
                    <Link
                      href={`/tech/jobs/${job.id}/estimate`}
                      className="flex flex-col items-center justify-center rounded-xl bg-blue-50/70 border border-blue-200/60 p-1.5 sm:p-2 text-center text-[10px] sm:text-[11px] font-bold text-blue-900 hover:bg-blue-100/70"
                    >
                      <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mb-0.5" />
                      Estimate
                    </Link>
                    <Link
                      href={`/tech/jobs/${job.id}/parts`}
                      className="flex flex-col items-center justify-center rounded-xl bg-slate-100 border border-slate-200 p-1.5 sm:p-2 text-center text-[10px] sm:text-[11px] font-bold text-navy-800 hover:bg-slate-200"
                    >
                      <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 mb-0.5" />
                      Parts
                    </Link>
                  </div>

                  {/* Full Details Button */}
                  <Link
                    href={`/tech/jobs/${job.id}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-navy-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-navy-800"
                  >
                    Open Work Order
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
