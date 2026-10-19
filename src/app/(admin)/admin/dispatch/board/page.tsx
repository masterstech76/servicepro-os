"use client";

import * as React from "react";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import {
  Calendar,
  Clock,
  Kanban,
  Map as MapIcon,
  MapPin,
  RefreshCw,
  UserPlus,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JobDrawer } from "@/components/admin/JobDrawer";
import type { EnrichedJob } from "@/lib/server/operations";
import type { JobStatus } from "@/lib/supabase/types";

const KANBAN_STAGES: Array<{ status: JobStatus; title: string; color: string }> = [
  { status: "unassigned", title: "Unassigned Queue", color: "border-amber-400 bg-amber-50/40" },
  { status: "assigned", title: "Assigned & Scheduled", color: "border-blue-400 bg-blue-50/40" },
  { status: "on_the_way", title: "En Route (On The Way)", color: "border-purple-400 bg-purple-50/40" },
  { status: "in_progress", title: "In Progress (On-Site)", color: "border-orange-400 bg-orange-50/40" },
  { status: "completed", title: "Completed Today", color: "border-emerald-400 bg-emerald-50/40" },
];

const DEMO_TECH_OPTIONS = [
  { id: "tech-carlos", name: "Carlos Mendez" },
  { id: "tech-danny", name: "Danny Reyes" },
  { id: "tech-maria", name: "Maria Alvarez" },
  { id: "tech-tony", name: "Tony Brooks" },
];

export default function AdminDispatchKanbanBoardPage() {
  const [currentDate, setCurrentDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );
  const [jobs, setJobs] = React.useState<EnrichedJob[]>([]);
  const [selectedJob, setSelectedJob] = React.useState<EnrichedJob | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [assigningId, setAssigningId] = React.useState<string | null>(null);

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

  async function handleQuickAssign(jobId: string, techId: string) {
    setAssigningId(jobId);
    try {
      const res = await fetch("/api/dispatch/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, technicianId: techId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Assignment failed");
        return;
      }
      toast.success("Technician assigned and dispatched!");
      await loadData(currentDate);
    } catch {
      toast.error("Network error during assignment");
    } finally {
      setAssigningId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-navy-950">Dispatch Kanban Board</h1>
            <p className="text-xs text-navy-600">
              High-density drag & stage assignment queue for field dispatchers
            </p>
          </div>

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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-navy-700 hover:text-navy-900"
            >
              <Calendar className="h-3.5 w-3.5" />
              Calendar
            </Link>
            <Link
              href="/admin/dispatch/board"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-900 text-white shadow-sm"
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </Link>
          </div>
        </div>

        {/* Date Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy-700">Dispatch Date:</span>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-2.5 py-1 font-bold text-navy-900"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadData(currentDate)}
              className="h-7 w-7 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <span className="font-bold text-navy-700">
            {jobs.length} Total Work Orders
          </span>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-4">
        {KANBAN_STAGES.map((stage) => {
          const stageJobs = jobs.filter((j) => j.status === stage.status);

          return (
            <div
              key={stage.status}
              className={`rounded-2xl border p-3 flex flex-col min-w-[240px] max-h-[750px] overflow-hidden ${stage.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                <span className="text-xs font-bold text-navy-900">
                  {stage.title}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-navy-900 shadow-xs">
                  {stageJobs.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {stageJobs.length === 0 ? (
                  <div className="p-4 text-center rounded-xl border border-dashed border-slate-300/60 bg-white/40 text-[11px] text-navy-500">
                    No jobs in this stage
                  </div>
                ) : (
                  stageJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs hover:shadow-md transition-shadow cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-navy-900">
                          #{job.jobNumber}
                        </span>
                        <span className="text-[10px] font-bold text-orange-600">
                          {formatInTimeZone(new Date(job.scheduledStart), tz, "h:mm a")}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-navy-900 line-clamp-1">
                          {job.service.name}
                        </h4>
                        <p className="text-[11px] text-navy-600 mt-0.5">
                          {job.customer.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-navy-500">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{job.addressLine1}, {job.zip}</span>
                      </div>

                      {/* Unassigned Quick Tech Assign Dropdown */}
                      {stage.status === "unassigned" ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="pt-1.5 border-t border-slate-100"
                        >
                          <label className="text-[10px] font-bold text-navy-700 block mb-1">
                            Quick Dispatch:
                          </label>
                          <select
                            disabled={assigningId === job.id}
                            onChange={(e) => {
                              if (e.target.value) {
                                void handleQuickAssign(job.id, e.target.value);
                              }
                            }}
                            defaultValue=""
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] font-bold text-navy-900 focus:outline-none"
                          >
                            <option value="" disabled>
                              Select Technician...
                            </option>
                            {DEMO_TECH_OPTIONS.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                          <span className="text-navy-500 font-semibold">
                            {job.technician?.name || "Unassigned"}
                          </span>
                          <Link
                            href={`/admin/jobs/${job.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-orange-600 font-bold hover:underline"
                          >
                            Order &rarr;
                          </Link>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
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
