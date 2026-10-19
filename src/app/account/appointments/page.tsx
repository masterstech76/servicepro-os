"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  ArrowRight,
  PlusCircle,
  FileText,
  AlertCircle,
  Phone,
  User,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { formatBusinessTime, formatMoneyCents } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

const TABS = [
  { id: "all", label: "All Appointments" },
  { id: "upcoming", label: "Upcoming" },
  { id: "active", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function AppointmentsPage() {
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [jobs, setJobs] = React.useState<EnrichedJob[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAppointments = React.useCallback(async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/account/appointments?status=${status}`);
      if (!res.ok) throw new Error("Failed to load appointments");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAppointments(selectedTab);
  }, [selectedTab, fetchAppointments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
            Appointments & Service History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track current service dispatches, view past work orders, and manage schedules.
          </p>
        </div>

        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs sm:text-sm shadow-md"
        >
          <Link href="/book" className="flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span>Book New Service</span>
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
              selectedTab === tab.id
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-transparent text-slate-600 hover:text-navy-900 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center space-y-3">
          <AlertCircle className="h-7 w-7 text-red-600 mx-auto" />
          <p className="font-bold text-red-900">{error}</p>
          <Button
            onClick={() => fetchAppointments(selectedTab)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Retry
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-navy-900">No Appointments in this Category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no appointments matching your current filter. You can book an appointment or switch filters.
          </p>
          <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs">
            <Link href="/book">Schedule Service</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isLive = ["on_the_way", "in_progress"].includes(job.status);
            const canModify = ["unassigned", "assigned"].includes(job.status);

            return (
              <div
                key={job.id}
                className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-sm space-y-4 transition-all ${
                  isLive ? "border-2 border-orange-400 ring-2 ring-orange-100" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Top Row: Job #, Service Title, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      Job #{job.jobNumber}
                    </span>
                    <h3 className="text-base font-black text-navy-900">
                      {job.service.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLive && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 animate-pulse">
                        <Navigation className="h-3 w-3" />
                        <span>En Route</span>
                      </span>
                    )}
                    <StatusBadge status={job.status} />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      Scheduled Time
                    </span>
                    <p className="font-bold text-navy-900 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-orange-500" />
                      <span>{format(new Date(job.scheduledStart), "EEE, MMM d, yyyy")}</span>
                    </p>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        {formatBusinessTime(job.scheduledStart)} – {formatBusinessTime(job.scheduledEnd)}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      Service Location
                    </span>
                    <p className="font-bold text-navy-900 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-orange-500" />
                      <span className="truncate">{job.addressLine1}</span>
                    </p>
                    <p className="text-slate-600 truncate">
                      {job.city}, {job.state} {job.zip}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      Assigned Technician
                    </span>
                    {job.technician ? (
                      <div>
                        <p className="font-bold text-navy-900 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-orange-500" />
                          <span>{job.technician.name}</span>
                        </p>
                        <a
                          href={`tel:${job.technician.phone}`}
                          className="text-slate-600 hover:text-orange-600 font-medium"
                        >
                          {job.technician.phone}
                        </a>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">Assigning nearest tech...</p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-600">
                    <span>Deposit: </span>
                    <span className="font-bold text-navy-900">
                      {formatMoneyCents(job.depositCents)}
                    </span>
                    {job.totalCents && (
                      <>
                        <span className="mx-1.5">•</span>
                        <span>Total: </span>
                        <span className="font-bold text-navy-900">
                          {formatMoneyCents(job.totalCents)}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isLive && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs"
                      >
                        <Link href={`/account/appointments/${job.id}/track`}>
                          <Navigation className="h-3.5 w-3.5 mr-1 text-orange-400" />
                          <span>Track Live ETA</span>
                        </Link>
                      </Button>
                    )}

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold border-slate-300 text-navy-900"
                    >
                      <Link href={`/account/appointments/${job.id}`}>
                        <span>View Work Order</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
