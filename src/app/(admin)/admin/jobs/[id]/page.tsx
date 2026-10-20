"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileCheck,
  History,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  User,
  Wrench,
  AlertTriangle,
  XCircle,
  DollarSign,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatMoney } from "@/components/shared/Money";
import type { EnrichedJob } from "@/lib/server/operations";
import type { ChecklistItem, JobEstimate, InventoryMovement } from "@/lib/server/tech-portal";

interface JobDetailResponse {
  job: EnrichedJob;
  checklist: ChecklistItem[];
  estimates: JobEstimate[];
  inventoryMovements: InventoryMovement[];
}

export default function AdminJobDetailPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "";

  const [detail, setDetail] = React.useState<JobDetailResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [internalNotes, setInternalNotes] = React.useState("");
  const [savingNotes, setSavingNotes] = React.useState(false);
  const [reassignTechId, setReassignTechId] = React.useState("");
  const [reassigning, setReassigning] = React.useState(false);

  const tz = businessConfig.timezone;

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${encodeURIComponent(jobId)}`);
      if (res.ok) {
        const data = (await res.json()) as JobDetailResponse;
        setDetail(data);
        setInternalNotes(data.job?.notesInternal || "");
        setReassignTechId(data.job?.technician?.id || "");
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleSaveNotes() {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/jobs/${encodeURIComponent(jobId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notesInternal: internalNotes }),
      });
      if (res.ok) {
        toast.success("Dispatcher notes saved!");
        await loadData();
      } else {
        toast.error("Failed to save notes");
      }
    } catch {
      toast.error("Network error saving notes");
    } finally {
      setSavingNotes(false);
    }
  }

  async function handleReassignTechnician() {
    setReassigning(true);
    try {
      const res = await fetch(`/api/admin/jobs/${encodeURIComponent(jobId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicianId: reassignTechId || null, force: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Reassignment failed");
        return;
      }
      toast.success("Technician assignment updated!");
      await loadData();
    } catch {
      toast.error("Network error during assignment");
    } finally {
      setReassigning(false);
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

  const { job, checklist, estimates, inventoryMovements } = detail;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${job.addressLine1}, ${job.city}, ${job.state} ${job.zip}`
  )}`;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/jobs"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-navy-800 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-navy-950">
                Work Order #{job.jobNumber}
              </span>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-xs text-navy-600">
              Created {new Date(job.createdAt).toLocaleString()} · ID: {job.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-navy-900 hover:bg-slate-50"
          >
            <MapPin className="h-3.5 w-3.5 text-orange-600" />
            Maps
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
          <a
            href={`tel:${job.customer.phone}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-800"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-400" />
            Call Customer
          </a>
        </div>
      </div>

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Job & Customer Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Job Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  {job.service.category}
                </span>
                <h2 className="text-lg font-bold text-navy-950">{job.service.name}</h2>
                <p className="text-xs text-navy-600">
                  Pricing: {job.service.pricingType === "flat" ? "Flat Rate" : "Hourly Rate"} ·{" "}
                  {formatMoney(job.service.priceCents)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatInTimeZone(new Date(job.scheduledStart), tz, "h:mm a")} –{" "}
                  {formatInTimeZone(new Date(job.scheduledEnd), tz, "h:mm a")}
                </span>
                <span className="text-[11px] text-navy-500 block">
                  {formatInTimeZone(new Date(job.scheduledStart), tz, "EEE, MMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-navy-500 uppercase tracking-wider text-[10px] block mb-1">
                  Customer
                </span>
                <Link
                  href={`/admin/customers/${job.customer.id}`}
                  className="font-bold text-navy-900 hover:text-orange-600"
                >
                  {job.customer.name}
                </Link>
                <p className="text-navy-600 mt-0.5">{job.customer.phone}</p>
                {job.customer.email ? (
                  <p className="text-navy-500">{job.customer.email}</p>
                ) : null}
              </div>

              <div>
                <span className="font-bold text-navy-500 uppercase tracking-wider text-[10px] block mb-1">
                  Service Address
                </span>
                <p className="font-bold text-navy-900">{job.addressLine1}</p>
                {job.addressLine2 ? (
                  <p className="text-navy-700">{job.addressLine2}</p>
                ) : null}
                <p className="text-navy-600">
                  {job.city}, {job.state} {job.zip}
                </p>
              </div>
            </div>

            {/* Customer issue */}
            <div className="rounded-xl bg-slate-50 p-3 space-y-1 text-xs">
              <span className="font-bold text-navy-900 block">Reported Problem:</span>
              <p className="text-navy-700">
                {job.issueText || "Standard service maintenance and inspection."}
              </p>
            </div>

            {/* Dispatcher internal notes editor */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-navy-800">
                  Internal Dispatcher Notes:
                </label>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void handleSaveNotes()}
                  disabled={savingNotes}
                  className="h-7 rounded-lg bg-navy-900 px-3 text-[11px] font-bold text-white hover:bg-navy-800"
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </Button>
              </div>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Access codes, customer preferences, or dispatcher instructions..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Card 2: 10-Point HVAC Diagnostic Checklist */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-orange-600" />
                <h3 className="text-sm font-bold text-navy-950">
                  10-Point Technical Diagnostic Inspection
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-navy-800">
                {checklist.filter((c) => c.status !== "pending").length} / {checklist.length} Inspected
              </span>
            </div>

            <div className="divide-y divide-slate-100 space-y-1">
              {checklist.map((item, idx) => (
                <div key={item.id} className="pt-2 pb-2 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-navy-900">{idx + 1}. {item.label}</span>
                      <span className="text-[10px] uppercase font-bold text-navy-400">
                        ({item.category})
                      </span>
                    </div>
                    {item.notes ? (
                      <p className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded mt-1 font-semibold">
                        Diagnostic Note: {item.notes}
                      </p>
                    ) : null}
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                      item.status === "pass"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "fail"
                        ? "bg-rose-100 text-rose-800"
                        : item.status === "na"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: On-Site Estimates & Van Parts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Estimates */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileCheck className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  On-Site Estimates ({estimates.length})
                </h3>
              </div>

              {estimates.length === 0 ? (
                <p className="text-xs text-navy-500 italic py-2">
                  No additional on-site quotes created for this job.
                </p>
              ) : (
                <div className="space-y-2">
                  {estimates.map((est) => (
                    <div key={est.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-navy-900">{est.title}</span>
                        <span className="text-orange-600">{formatMoney(est.totalCents)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-navy-600">
                        <span>Status:</span>
                        <span className="font-semibold capitalize">{est.status.replace(/_/g, " ")}</span>
                      </div>
                      {est.customerSignatureName ? (
                        <p className="text-[10px] text-emerald-700 font-semibold">
                          Authorized by: {est.customerSignatureName}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Van Parts Used */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Package className="h-4 w-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  Parts & Truck Stock ({inventoryMovements.length})
                </h3>
              </div>

              {inventoryMovements.length === 0 ? (
                <p className="text-xs text-navy-500 italic py-2">
                  No warehouse or van parts logged for this job.
                </p>
              ) : (
                <div className="space-y-2">
                  {inventoryMovements.map((m) => (
                    <div key={m.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-navy-900">{m.partName}</span>
                        <span>{formatMoney(m.totalCents)}</span>
                      </div>
                      <p className="text-[10px] text-navy-500">
                        {m.quantity}x @ {formatMoney(m.unitPriceCents)} ({m.sku})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dispatcher Actions & Financials (1 Col) */}
        <div className="space-y-4">
          {/* Dispatch Assignment Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
              Technician Assignment
            </h3>

            <div>
              <label className="text-[11px] font-bold text-navy-600 block mb-1">
                Assigned Tech:
              </label>
              <select
                value={reassignTechId}
                onChange={(e) => setReassignTechId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 focus:outline-none"
              >
                <option value="">Unassigned (Queue)</option>
                <option value="tech-carlos">Carlos Mendez</option>
                <option value="tech-danny">Danny Reyes</option>
                <option value="tech-maria">Maria Alvarez</option>
                <option value="tech-tony">Tony Brooks</option>
              </select>
            </div>

            <Button
              type="button"
              onClick={() => void handleReassignTechnician()}
              disabled={reassigning}
              className="w-full rounded-xl bg-navy-900 py-2 text-xs font-bold text-white hover:bg-navy-800"
            >
              {reassigning ? "Updating..." : "Confirm Reassignment"}
            </Button>
          </div>

          {/* Financials & Invoice Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
              Billing & Invoicing
            </h3>

            <div className="rounded-xl bg-slate-50 p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-navy-600">Estimated Total:</span>
                <span className="font-bold text-navy-900">
                  {formatMoney(job.estimatedTotalCents)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-600">Deposit Paid:</span>
                <span className="font-bold text-emerald-700">
                  {formatMoney(job.depositCents)}
                </span>
              </div>
              {job.invoice ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-navy-600">Invoice Status:</span>
                    <span className="font-bold uppercase text-navy-900">
                      {job.invoice.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-600">Tip:</span>
                    <span className="font-bold text-navy-900">
                      {formatMoney(job.invoice.tipCents)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-navy-950 pt-2 border-t border-slate-200">
                    <span>Balance Due:</span>
                    <span className="text-orange-600">
                      {formatMoney(job.invoice.amountDueCents)}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Audit Event History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-700">
              <History className="h-4 w-4 text-orange-600" />
              <span>Event Timeline ({job.events.length})</span>
            </div>

            <div className="space-y-2 text-xs">
              {job.events.map((evt) => (
                <div key={evt.id} className="border-l-2 border-orange-500 pl-2.5 py-0.5">
                  <span className="font-bold text-navy-900 block capitalize">
                    {evt.eventType.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-navy-500 block">
                    {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · By {evt.actorLabel || "System"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
