"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
  Wrench,
  Award,
  DollarSign,
  Briefcase,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

interface TechnicianDetailData {
  technician: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    color: string;
    active: boolean;
    commissionPct: number;
    skills: string[];
    zipCodes: string[];
    vehicle: {
      model: string;
      plate: string;
      status: string;
    };
  };
  jobs: EnrichedJob[];
  stats: {
    totalJobs: number;
    completedJobs: number;
    inProgressJobs: number;
    revenueGeneratedCents: number;
  };
}

export default function AdminTechnicianDetailPage() {
  const params = useParams<{ id: string }>();
  const techId = params?.id ?? "";

  const [detail, setDetail] = React.useState<TechnicianDetailData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [toggling, setToggling] = React.useState(false);

  const loadTech = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/technicians/${encodeURIComponent(techId)}`);
      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      }
    } finally {
      setLoading(false);
    }
  }, [techId]);

  React.useEffect(() => {
    void loadTech();
  }, [loadTech]);

  async function toggleActiveStatus() {
    if (!detail) return;
    setToggling(true);
    try {
      const res = await fetch(`/api/admin/technicians/${encodeURIComponent(techId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !detail.technician.active }),
      });
      if (res.ok) {
        toast.success(`Technician ${!detail.technician.active ? "activated" : "deactivated"}!`);
        await loadTech();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error updating status");
    } finally {
      setToggling(false);
    }
  }

  if (loading || !detail) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  const { technician: tech, stats, jobs } = detail;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/technicians"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-navy-800 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-navy-950">{tech.name}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  tech.active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                }`}
              >
                {tech.active ? "Active On Roster" : "Inactive / Deactivated"}
              </span>
            </div>
            <p className="text-xs text-navy-600">
              Senior Field Technician · ID: {tech.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/technicians/${tech.id}/schedule`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50"
          >
            <Calendar className="h-3.5 w-3.5 text-orange-600" />
            Manage Shift Schedule
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void toggleActiveStatus()}
            disabled={toggling}
            className={`text-xs font-bold rounded-xl ${
              tech.active ? "border-rose-300 text-rose-700 hover:bg-rose-50" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {tech.active ? "Deactivate Tech" : "Reactivate Tech"}
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
            Total Assigned Jobs
          </span>
          <span className="text-2xl font-black text-navy-900 mt-1 block">
            {stats.totalJobs}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
            Completed Visits
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {stats.completedJobs}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
            Revenue Generated
          </span>
          <span className="text-2xl font-black text-navy-900 mt-1 block">
            {formatMoney(stats.revenueGeneratedCents)}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
            Commission Rate
          </span>
          <span className="text-2xl font-black text-orange-600 mt-1 block">
            {tech.commissionPct}%
          </span>
        </div>
      </div>

      {/* Technician Info & Assigned Vehicle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact & Skills */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy-700">
            Contact & Qualifications
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-navy-800">
              <Phone className="h-4 w-4 text-slate-400" />
              <a href={`tel:${tech.phone}`} className="hover:underline font-semibold">
                {tech.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-navy-800">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{tech.email || "No email on file"}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-navy-600 block">
              Certified Skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tech.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-semibold text-navy-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-navy-600 block">
              Assigned Service ZIPs ({tech.zipCodes.length}):
            </span>
            <div className="flex flex-wrap gap-1">
              {tech.zipCodes.slice(0, 15).map((z, idx) => (
                <span
                  key={idx}
                  className="rounded bg-orange-50 border border-orange-200 px-1.5 py-0.5 text-[10px] font-mono font-bold text-orange-800"
                >
                  {z}
                </span>
              ))}
              {tech.zipCodes.length > 15 ? (
                <span className="text-[10px] text-navy-500 font-bold self-center">
                  +{tech.zipCodes.length - 15} more
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Assigned Vehicle */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-700">
            <Truck className="h-4 w-4 text-orange-600" />
            <span>Assigned Service Vehicle</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-navy-600 font-semibold">Model:</span>
              <span className="font-bold text-navy-900">{tech.vehicle.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-600 font-semibold">License Plate:</span>
              <span className="font-mono font-bold text-navy-900">{tech.vehicle.plate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-600 font-semibold">Van Inventory Status:</span>
              <span className="font-bold text-emerald-700">{tech.vehicle.status}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-navy-700 block">
              Active Trade Licenses:
            </span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-navy-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>EPA Section 608 Universal Certification</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-navy-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>NATE Certified HVAC Diagnostic Specialist</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-navy-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>OSHA 10-Hour Construction Safety</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Work Orders History */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-navy-950">
            Work Order History ({jobs.length})
          </h3>
          <span className="text-xs text-navy-500">
            Showing all jobs assigned to {tech.name}
          </span>
        </div>

        {jobs.length === 0 ? (
          <p className="text-xs text-navy-500 italic py-4">No jobs assigned yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-navy-900">
                      #{job.jobNumber}
                    </span>
                    <StatusBadge status={job.status} />
                    <span className="text-navy-500">
                      {new Date(job.scheduledStart).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-navy-900">{job.service.name}</h4>
                  <p className="text-navy-600">
                    {job.customer.name} · {job.addressLine1}, {job.city}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-navy-900">
                    {formatMoney(job.totalCents || job.estimatedTotalCents)}
                  </span>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-navy-900 hover:bg-slate-100"
                  >
                    Inspect &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
