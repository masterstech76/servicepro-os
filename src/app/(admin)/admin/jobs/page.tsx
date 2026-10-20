"use client";

import * as React from "react";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { Download, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JobDrawer } from "@/components/admin/JobDrawer";
import { DemoDataManager } from "@/components/admin/DemoDataManager";
import type { EnrichedJob } from "@/lib/server/operations";

export default function AdminJobsListPage() {
  const [jobs, setJobs] = React.useState<EnrichedJob[]>([]);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedJob, setSelectedJob] = React.useState<EnrichedJob | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Debounce search query by 300ms
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadJobs = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) {
        setJobs([]);
        return;
      }
      const data = (await res.json()) as { jobs: EnrichedJob[] };
      setJobs(data.jobs ?? []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch]);

  React.useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  function exportCsv() {
    if (!jobs || jobs.length === 0) {
      toast.info("No jobs to export.");
      return;
    }
    const header = [
      "Job #",
      "Status",
      "Scheduled Start",
      "Customer",
      "Phone",
      "ZIP",
      "Service",
      "Technician",
      "Deposit ($)",
      "Total ($)",
    ];
    const rows = jobs.map((j) => {
      const deposit = typeof j.depositCents === "number" ? (j.depositCents / 100).toFixed(2) : "0.00";
      const totalNum = j.totalCents ?? j.estimatedTotalCents ?? 0;
      const total = typeof totalNum === "number" ? (totalNum / 100).toFixed(2) : "0.00";
      const custName = j.customer?.name ? `"${j.customer.name.replace(/"/g, '""')}"` : '""';
      const svcName = j.service?.name ? `"${j.service.name.replace(/"/g, '""')}"` : '""';
      const techName = j.technician?.name ? `"${j.technician.name.replace(/"/g, '""')}"` : '"Unassigned"';
      return [
        j.jobNumber ?? "",
        j.status ?? "",
        j.scheduledStart ?? "",
        custName,
        j.customer?.phone ?? "",
        j.zip ?? "",
        svcName,
        techName,
        deposit,
        total,
      ];
    });
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `servicepro-jobs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">All Jobs</h1>
          <p className="text-xs text-navy-700">
            Search, filter, inspect invoices, or export your complete job history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/jobs/create"
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-navy-950 shadow-sm hover:bg-orange-400"
          >
            <Plus className="h-4 w-4" />
            Create Work Order
          </Link>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={exportCsv}
            className="gap-1.5"
          >
            <Download className="h-4 w-4" />
            Export CSV ({jobs.length})
          </Button>
        </div>
      </div>

      {/* Demo Data Manager Toolbar */}
      <DemoDataManager onDataChanged={() => void loadJobs()} />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-card border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by Job #, customer name, phone, ZIP, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              "all",
              "unassigned",
              "assigned",
              "on_the_way",
              "in_progress",
              "completed",
              "cancelled",
            ] as const
          ).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-pill px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? "bg-navy-900 text-white"
                  : "bg-slate-100 text-navy-700 hover:bg-slate-200"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="rounded-card border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-navy-700">
            Loading jobs...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-navy-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Job #</th>
                  <th className="px-4 py-3">Date & Window</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Technician</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-navy-900">
                      <div className="flex items-center gap-1.5">
                        <span>#{job.jobNumber}</span>
                        {job.isDemo ? (
                          <span className="rounded bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 text-[9px] font-bold">
                            DEMO
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 text-[9px] font-bold">
                            LIVE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-navy-700 whitespace-nowrap">
                      {formatInTimeZone(
                        new Date(job.scheduledStart),
                        businessConfig.timezone,
                        "MMM d, yyyy · h:mm a"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-navy-900">
                        {job.customer.name}
                      </div>
                      <div className="text-xs text-navy-700">
                        {job.addressLine1} ({job.zip})
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-navy-900">
                      {job.service.name}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-navy-900">
                      {job.technician?.name ?? (
                        <span className="text-amber-800">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-navy-900">
                      <Money cents={job.totalCents ?? job.estimatedTotalCents} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-navy-900 hover:bg-slate-100 inline-block"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <JobDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onJobUpdated={(updated) => {
          setSelectedJob(updated);
          void loadJobs();
        }}
        onJobDeleted={(_deletedId) => {
          setSelectedJob(null);
          void loadJobs();
        }}
      />
    </div>
  );
}
