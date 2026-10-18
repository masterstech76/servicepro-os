"use client";

import * as React from "react";
import { formatInTimeZone } from "date-fns-tz";
import {
  AlertTriangle,
  Calendar,
  Kanban,
  Map as MapIcon,
  MapPin,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JobDrawer } from "@/components/admin/JobDrawer";
import type { EnrichedJob } from "@/lib/server/operations";
import type { JobStatus } from "@/lib/supabase/types";

const KANBAN_COLUMNS: Array<{ status: JobStatus; title: string }> = [
  { status: "unassigned", title: "Unassigned" },
  { status: "assigned", title: "Assigned" },
  { status: "on_the_way", title: "On The Way" },
  { status: "in_progress", title: "In Progress" },
  { status: "completed", title: "Completed" },
];

interface TechSummary {
  id: string;
  name: string;
  color: string;
  skills: string[];
  zipCodes: string[];
  shift: { startTime: string; endTime: string } | null;
  jobsCountToday: number;
  maxRecommendedJobs: number;
  statusLabel: string;
  homeLat: number;
  homeLng: number;
  jobsToday: EnrichedJob[];
}

export default function AdminDispatchBoardPage() {
  const [viewMode, setViewMode] = React.useState<"kanban" | "map" | "calendar">(
    "kanban"
  );
  const [jobs, setJobs] = React.useState<EnrichedJob[]>([]);
  const [technicians, setTechnicians] = React.useState<TechSummary[]>([]);
  const [selectedTechFilter, setSelectedTechFilter] = React.useState<string>("all");
  const [selectedJob, setSelectedJob] = React.useState<EnrichedJob | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [forceModal, setForceModal] = React.useState<{
    job: EnrichedJob;
    techId: string;
    techName: string;
    reason: string;
  } | null>(null);

  const loadDispatch = React.useCallback(async () => {
    try {
      const res = await fetch("/api/dispatch/board");
      const data = (await res.json()) as {
        jobs: EnrichedJob[];
        technicians: TechSummary[];
      };
      setJobs(data.jobs ?? []);
      setTechnicians(data.technicians ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadDispatch();
  }, [loadDispatch]);

  const tz = businessConfig.timezone;

  const filteredJobs = React.useMemo(() => {
    if (selectedTechFilter === "all") return jobs;
    return jobs.filter(
      (j) =>
        j.technician?.id === selectedTechFilter || j.status === "unassigned"
    );
  }, [jobs, selectedTechFilter]);

  async function assignJobToTech(
    job: EnrichedJob,
    techId: string,
    force = false
  ) {
    const tech = technicians.find((t) => t.id === techId);
    const res = await fetch("/api/dispatch/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job.id,
        technicianId: techId,
        force,
      }),
    });

    const data = (await res.json()) as {
      job?: EnrichedJob;
      error?: { code: string; message: string };
    };

    if (res.status === 409 && !force) {
      setForceModal({
        job,
        techId,
        techName: tech?.name ?? "Technician",
        reason: data.error?.message ?? "Outside working window or coverage area",
      });
      return;
    }

    if (!res.ok || !data.job) {
      toast.error(data.error?.message ?? "Could not assign technician");
      return;
    }

    toast.success(
      `Job #${job.jobNumber} assigned to ${data.job.technician?.name}`
    );
    setForceModal(null);
    await loadDispatch();
  }

  return (
    <div className="space-y-5">
      {/* Top Dispatch Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dispatch Board</h1>
          <p className="text-xs text-navy-700">
            Assign jobs, resolve schedule conflicts, and track live technician locations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Dispatch view mode"
            className="inline-flex rounded-input border border-slate-300 bg-white p-1"
          >
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              data-testid="view-mode-kanban"
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "kanban"
                  ? "bg-navy-900 text-white"
                  : "text-navy-700 hover:text-navy-900"
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              data-testid="view-mode-map"
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "map"
                  ? "bg-navy-900 text-white"
                  : "text-navy-700 hover:text-navy-900"
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" />
              Live Map
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              data-testid="view-mode-calendar"
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "calendar"
                  ? "bg-navy-900 text-white"
                  : "text-navy-700 hover:text-navy-900"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              Day Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Technician Fleet Filter & Drop Rail */}
      <section
        aria-label="Technician Fleet Rail"
        data-testid="technician-rail"
        className="rounded-card border border-slate-200 bg-white p-3.5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-700 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-orange-600" />
            Technician Fleet ({technicians.length})
          </span>
          {selectedTechFilter !== "all" ? (
            <button
              type="button"
              onClick={() => setSelectedTechFilter("all")}
              className="text-xs font-semibold text-orange-700 hover:underline"
            >
              Clear Filter (Show All)
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {technicians.map((tech) => {
            const active = selectedTechFilter === tech.id;
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() =>
                  setSelectedTechFilter(active ? "all" : tech.id)
                }
                data-testid={`tech-rail-card-${tech.id}`}
                className={`flex items-center justify-between rounded-input border p-3 text-left transition-all ${
                  active
                    ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-500"
                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: tech.color }}
                    />
                    <span className="text-sm font-bold text-navy-900 truncate">
                      {tech.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-navy-700 mt-0.5 truncate">
                    {tech.statusLabel} ·{" "}
                    {tech.shift
                      ? `${tech.shift.startTime}–${tech.shift.endTime}`
                      : "Off"}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="inline-block rounded-pill bg-white border border-slate-200 px-2 py-0.5 text-xs font-bold text-navy-900 tabular-nums">
                    {tech.jobsCountToday}/{tech.maxRecommendedJobs}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Board Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-card bg-slate-200" />
          ))}
        </div>
      ) : viewMode === "kanban" ? (
        <div
          data-testid="dispatch-kanban-board"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start"
        >
          {KANBAN_COLUMNS.map((col) => {
            const colJobs = filteredJobs.filter((j) => j.status === col.status);
            return (
              <div
                key={col.status}
                data-testid={`kanban-col-${col.status}`}
                className="rounded-card border border-slate-200 bg-slate-100/80 p-3 space-y-3 min-h-[420px]"
              >
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                    {col.title}
                  </h2>
                  <span className="rounded-pill bg-white border border-slate-200 px-2 py-0.5 text-xs font-bold text-navy-900 tabular-nums">
                    {colJobs.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colJobs.length === 0 ? (
                    <div className="rounded-input border border-dashed border-slate-300 p-6 text-center text-xs text-navy-700">
                      No {col.title.toLowerCase()} jobs
                    </div>
                  ) : (
                    colJobs.map((job) => (
                      <div
                        key={job.id}
                        data-testid={`dispatch-job-card-${job.jobNumber}`}
                        className={`rounded-card border bg-white p-3.5 shadow-sm transition-all hover:shadow-md ${
                          job.isUnassignedUrgent
                            ? "border-red-400 ring-1 ring-red-200"
                            : "border-slate-200"
                        }`}
                      >
                        <div
                          onClick={() => setSelectedJob(job)}
                          className="cursor-pointer space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-navy-900">
                              #{job.jobNumber}
                            </span>
                            {job.isUnassignedUrgent ? (
                              <span className="inline-flex items-center gap-1 rounded-pill bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                                <AlertTriangle className="h-3 w-3" />
                                Urgent &lt;2h
                              </span>
                            ) : (
                              <StatusBadge status={job.status} />
                            )}
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-navy-900 leading-snug">
                              {job.service.name}
                            </h3>
                            <p className="text-xs font-medium text-navy-700 mt-0.5">
                              {job.customer.name}
                            </p>
                          </div>

                          <div className="text-xs text-navy-700 space-y-1 pt-1 border-t border-slate-100">
                            <p className="font-semibold text-navy-900">
                              {formatInTimeZone(
                                new Date(job.scheduledStart),
                                tz,
                                "h:mm a"
                              )}{" "}
                              –{" "}
                              {formatInTimeZone(
                                new Date(job.scheduledEnd),
                                tz,
                                "h:mm a"
                              )}
                            </p>
                            <p className="flex items-center gap-1 truncate">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              {job.addressLine1} ({job.zip})
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {job.technician ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900">
                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{
                                    backgroundColor: job.technician.color,
                                  }}
                                />
                                {job.technician.name}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
                                <Sparkles className="h-3 w-3" />
                                Smart Match Ready
                              </span>
                            )}
                            <Money
                              cents={job.totalCents ?? job.estimatedTotalCents}
                              className="text-xs font-bold text-navy-900"
                            />
                          </div>
                        </div>

                        {/* Quick Assign Bar on Unassigned Cards */}
                        {job.status === "unassigned" ? (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                            <UserPlus className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <select
                              aria-label={`Assign technician for Job #${job.jobNumber}`}
                              data-testid={`quick-assign-select-${job.jobNumber}`}
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  void assignJobToTech(job, e.target.value, false);
                                  e.target.value = "";
                                }
                              }}
                              className="w-full rounded border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-navy-900"
                            >
                              <option value="" disabled>
                                Quick Assign Tech...
                              </option>
                              {technicians.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} ({t.jobsCountToday}/5)
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === "map" ? (
        /* Interactive Miami Dispatch Map View */
        <div
          data-testid="dispatch-map-view"
          className="rounded-card border border-slate-200 bg-white shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3"
        >
          <div className="lg:col-span-2 relative bg-navy-900 min-h-[480px] p-6 flex flex-col justify-between overflow-hidden">
            {/* Stylized Interactive SVG Miami Metro Dispatch Map */}
            <svg
              viewBox="0 0 800 500"
              className="absolute inset-0 h-full w-full opacity-25 pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="miami-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#miami-grid)" />
              <path
                d="M 560 0 Q 520 200 490 500 L 800 500 L 800 0 Z"
                fill="#0284c7"
                opacity="0.35"
              />
              <path
                d="M 100 250 L 700 250 M 450 0 L 420 500"
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>

            <div className="relative z-10 flex items-center justify-between">
              <div className="rounded-input bg-navy-900/90 border border-slate-700 px-3.5 py-2 text-xs text-white">
                <span className="font-bold text-orange-400">
                  Miami-Dade Service Area
                </span>{" "}
                · {filteredJobs.length} Active Pins
              </div>
              <div className="flex items-center gap-3 rounded-input bg-navy-900/90 border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  Unassigned
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                  Assigned / En Route
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Completed
                </span>
              </div>
            </div>

            {/* Interactive Pins Grid */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              {filteredJobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="group rounded-input border border-slate-700 bg-navy-800/90 hover:border-orange-500 p-3 text-left text-white transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-orange-400">
                      #{job.jobNumber}
                    </span>
                    <span className="text-[11px] text-slate-300">{job.zip}</span>
                  </div>
                  <p className="text-xs font-bold mt-1 truncate">
                    {job.customer.name}
                  </p>
                  <p className="text-[11px] text-slate-300 truncate">
                    {job.addressLine1}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <StatusBadge status={job.status} />
                    {job.technician ? (
                      <span className="text-[10px] text-slate-300">
                        {job.technician.name.split(" ")[0]}
                      </span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>

            <div className="relative z-10 text-[11px] text-slate-300">
              Click any pin card above to open full dispatch drawer & route breakdown.
            </div>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto max-h-[520px]">
            <h3 className="text-sm font-bold text-navy-900">
              Technician Active Routes
            </h3>
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="rounded-input border border-slate-200 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: tech.color }}
                    />
                    {tech.name}
                  </span>
                  <span className="text-xs text-navy-700">
                    {tech.jobsToday.length} stops
                  </span>
                </div>
                {tech.jobsToday.map((stop, idx) => (
                  <div
                    key={stop.id}
                    onClick={() => setSelectedJob(stop)}
                    className="cursor-pointer flex items-center justify-between rounded bg-slate-50 px-2.5 py-1.5 text-xs hover:bg-orange-50/50"
                  >
                    <span className="truncate">
                      {idx + 1}. #{stop.jobNumber} {stop.addressLine1} ({stop.zip})
                    </span>
                    <span className="font-medium text-navy-900 ml-2 shrink-0">
                      {formatInTimeZone(new Date(stop.scheduledStart), tz, "h:mm a")}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Day Timeline Calendar View */
        <div
          data-testid="dispatch-calendar-view"
          className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-4"
        >
          <h2 className="text-base font-bold text-navy-900">
            Chronological Day Schedule ({tz})
          </h2>
          <div className="space-y-2.5">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-input border border-slate-200 p-3.5 hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-32 shrink-0 text-xs font-bold text-navy-900 tabular-nums">
                    {formatInTimeZone(new Date(job.scheduledStart), tz, "h:mm a")}{" "}
                    – {formatInTimeZone(new Date(job.scheduledEnd), tz, "h:mm a")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-navy-900">
                        #{job.jobNumber}
                      </span>
                      <span className="text-sm font-bold text-navy-900">
                        {job.service.name}
                      </span>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="text-xs text-navy-700">
                      {job.customer.name} · {job.addressLine1} ({job.zip})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
                  <Money
                    cents={job.totalCents ?? job.estimatedTotalCents}
                    className="text-sm font-bold text-navy-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Force Assign Modal */}
      {forceModal ? (
        <div
          role="dialog"
          aria-modal="true"
          data-testid="force-assign-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4"
        >
          <div className="w-full max-w-md rounded-card border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Override Dispatch Constraint?
                </h3>
                <p className="text-xs text-navy-700 mt-1">
                  Assigning <strong>{forceModal.techName}</strong> to{" "}
                  <strong>Job #{forceModal.job.jobNumber}</strong> flagged a
                  warning: <span className="font-semibold text-amber-900">{forceModal.reason}</span>.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setForceModal(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                data-testid="confirm-force-assign-btn"
                onClick={() =>
                  void assignJobToTech(
                    forceModal.job,
                    forceModal.techId,
                    true
                  )
                }
              >
                Force Assign Anyway
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <JobDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onJobUpdated={(updated) => {
          setSelectedJob(updated);
          void loadDispatch();
        }}
      />
    </div>
  );
}
