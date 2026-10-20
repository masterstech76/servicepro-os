"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileText,
  MapPin,
  Navigation,
  Package,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

const DEMO_TECH_OPTIONS = [
  { id: "tech-carlos", name: "Carlos Mendez" },
  { id: "tech-danny", name: "Danny Reyes" },
  { id: "tech-maria", name: "Maria Alvarez" },
  { id: "tech-tony", name: "Tony Brooks" },
];

export default function TechMyJobsTodayPage() {
  const router = useRouter();
  const [techId, setTechId] = React.useState("tech-carlos");
  const [jobs, setJobs] = React.useState<EnrichedJob[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [startingRouteId, setStartingRouteId] = React.useState<string | null>(
    null
  );

  const loadMyJobs = React.useCallback(async (activeTechId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/dispatch/board");
      const data = (await res.json()) as { jobs: EnrichedJob[] };
      const myJobs = (data.jobs ?? []).filter(
        (j) => j.technician?.id === activeTechId && j.status !== "cancelled"
      );
      setJobs(myJobs);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadMyJobs(techId);
  }, [techId, loadMyJobs]);

  const activeJobs = jobs.filter((j) => j.status !== "completed");
  const completedJobs = jobs.filter((j) => j.status === "completed");
  const nextJob = activeJobs[0] ?? null;
  const upcomingJobs = activeJobs.slice(1);
  const tz = businessConfig.timezone;

  async function handleStartNextJob(job: EnrichedJob) {
    setStartingRouteId(job.id);
    try {
      if (job.status === "assigned") {
        const res = await fetch(`/api/jobs/${job.id}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toStatus: "on_the_way", actor: "technician" }),
        });
        if (res.ok) {
          toast.success(`ETA SMS sent to ${job.customer.name}`);
        }
      }
      router.push(`/tech/jobs/${job.id}`);
    } finally {
      setStartingRouteId(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Technician Selector & Shift Status */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-orange-500 shadow-sm">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              On Shift Today
            </span>
            <select
              aria-label="Select active technician profile"
              data-testid="tech-switcher-select"
              value={techId}
              onChange={(e) => setTechId(e.target.value)}
              className="font-heading text-sm font-bold text-navy-900 bg-transparent focus:outline-none"
            >
              {DEMO_TECH_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-extrabold text-navy-900 tabular-nums block">
            {activeJobs.length} Remaining
          </span>
          <span className="text-[11px] font-semibold text-navy-700 block">
            {completedJobs.length} Completed
          </span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-52 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      ) : (
        <>
          {/* Highlighted NEXT Job Card */}
          {nextJob ? (
            <section
              aria-label="Next scheduled job"
              data-testid="tech-next-job-card"
              className="rounded-2xl border-2 border-orange-500 bg-white p-5 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-navy-900 shadow-sm">
                  Next Up · #{nextJob.jobNumber}
                </span>
                <StatusBadge status={nextJob.status} />
              </div>

              <div>
                <h1 className="font-heading text-xl font-extrabold text-navy-900">
                  {nextJob.service.name}
                </h1>
                <p className="text-sm font-bold text-navy-700 mt-0.5">
                  {nextJob.customer.name} · {nextJob.customer.phone}
                </p>
              </div>

              <div className="space-y-2 text-xs text-navy-700 border-t border-slate-100 pt-3">
                <p className="flex items-center gap-2 font-bold text-navy-900">
                  <Clock className="h-4 w-4 text-orange-700 shrink-0" />
                  Window:{" "}
                  {formatInTimeZone(new Date(nextJob.scheduledStart), tz, "h:mm a")}{" "}
                  – {formatInTimeZone(new Date(nextJob.scheduledEnd), tz, "h:mm a")}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-700 shrink-0" />
                  <span>
                    {nextJob.addressLine1}, {nextJob.city} {nextJob.zip}
                  </span>
                </p>
                {nextJob.issueText ? (
                  <p className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-navy-900 mt-1.5">
                    “{nextJob.issueText}”
                  </p>
                ) : null}
              </div>

              {/* Quick Sub-route Action Pills */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1 border-t border-slate-100">
                <Link
                  href={`/tech/jobs/${nextJob.id}/checklist`}
                  className="flex flex-col items-center justify-center rounded-xl bg-orange-50/80 border border-orange-200/70 p-1.5 sm:p-2 text-center text-[10px] sm:text-[11px] font-bold text-orange-950 hover:bg-orange-100"
                >
                  <ClipboardCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 mb-0.5" />
                  Checklist
                </Link>
                <Link
                  href={`/tech/jobs/${nextJob.id}/estimate`}
                  className="flex flex-col items-center justify-center rounded-xl bg-blue-50/80 border border-blue-200/70 p-1.5 sm:p-2 text-center text-[10px] sm:text-[11px] font-bold text-blue-950 hover:bg-blue-100"
                >
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mb-0.5" />
                  Estimate
                </Link>
                <Link
                  href={`/tech/jobs/${nextJob.id}/parts`}
                  className="flex flex-col items-center justify-center rounded-xl bg-slate-100 border border-slate-200 p-1.5 sm:p-2 text-center text-[10px] sm:text-[11px] font-bold text-navy-900 hover:bg-slate-200"
                >
                  <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 mb-0.5" />
                  Parts
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-1">
                <Button
                  type="button"
                  size="lg"
                  loading={startingRouteId === nextJob.id}
                  data-testid="tech-start-next-job-btn"
                  onClick={() => void handleStartNextJob(nextJob)}
                  className="w-full gap-2 rounded-full font-bold shadow-lg"
                >
                  <Navigation className="h-4 w-4" />
                  {nextJob.status === "assigned"
                    ? "Start Route & Text ETA ▶"
                    : nextJob.status === "on_the_way"
                    ? "Open Job & Mark Arrived ▶"
                    : "Continue Job & Collect Payment ▶"}
                </Button>
              </div>
            </section>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl space-y-2">
              <CheckCircle2 className="h-9 w-9 text-emerald-600 mx-auto" />
              <h2 className="font-heading text-base font-bold text-navy-900">
                All Active Jobs Complete!
              </h2>
              <p className="text-xs text-navy-700">
                You have no remaining active stops on your route today.
              </p>
            </div>
          )}

          {/* Later Today Queue */}
          {upcomingJobs.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-700 px-1">
                Later Today ({upcomingJobs.length})
              </h2>
              {upcomingJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/tech/jobs/${job.id}`}
                  className="block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-lg hover:border-orange-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-navy-700">
                      #{job.jobNumber} ·{" "}
                      {formatInTimeZone(new Date(job.scheduledStart), tz, "h:mm a")}
                    </span>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <h3 className="font-heading text-sm font-bold text-navy-900">
                        {job.service.name}
                      </h3>
                      <p className="text-xs text-navy-700">
                        {job.customer.name} · {job.addressLine1}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-navy-700" />
                  </div>
                </Link>
              ))}
            </section>
          ) : null}

          {/* Completed Today */}
          {completedJobs.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-700 px-1">
                Completed Today ({completedJobs.length})
              </h2>
              {completedJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/tech/jobs/${job.id}`}
                  className="block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-md hover:border-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900">
                      #{job.jobNumber} · {job.service.name}
                    </span>
                    <Money
                      cents={job.totalCents ?? job.estimatedTotalCents}
                      className="text-xs font-bold text-emerald-700"
                    />
                  </div>
                  <p className="text-xs text-navy-700 mt-0.5">
                    {job.customer.name} · Paid in full
                  </p>
                </Link>
              ))}
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
