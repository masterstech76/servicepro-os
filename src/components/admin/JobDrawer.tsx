/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  FileText,
  History,
  Image as ImageIcon,
  MapPin,
  Receipt,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Money, formatMoney } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PhoneLink } from "@/components/shared/PhoneLink";
import type { EnrichedJob } from "@/lib/server/operations";
import type { TechSuggestionResult } from "@/lib/domain/dispatch-score";
import type { JobStatus } from "@/lib/supabase/types";

interface JobDrawerProps {
  job: EnrichedJob | null;
  onClose: () => void;
  onJobUpdated: (updated: EnrichedJob) => void;
  onJobDeleted?: (jobId: string) => void;
}

export function JobDrawer({ job, onClose, onJobUpdated, onJobDeleted }: JobDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<
    "details" | "photos" | "invoice" | "history"
  >("details");
  const [suggestions, setSuggestions] = React.useState<TechSuggestionResult[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [internalNotes, setInternalNotes] = React.useState("");
  const [savingNotes, setSavingNotes] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("");
  const [refundPolicy, setRefundPolicy] = React.useState<"auto" | "yes" | "no">("auto");
  const [showCancelBox, setShowCancelBox] = React.useState(false);
  const [partDesc, setPartDesc] = React.useState("");
  const [partPriceDollars, setPartPriceDollars] = React.useState("");
  const [busyAction, setBusyAction] = React.useState(false);

  // Payments & Refund Modals
  const [refundModal, setRefundModal] = React.useState<{
    open: boolean;
    amountDollars: string;
    reason: string;
  } | null>(null);
  const [showCheckModal, setShowCheckModal] = React.useState(false);
  const [checkRefInput, setCheckRefInput] = React.useState("");
  const [showNewCardModal, setShowNewCardModal] = React.useState(false);
  const [newCardNumber, setNewCardNumber] = React.useState("");
  const [newCardBrand, setNewCardBrand] = React.useState("Visa");
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deletingJob, setDeletingJob] = React.useState(false);

  React.useEffect(() => {
    if (!job) return;
    setInternalNotes(job.notesInternal ?? "");
    setShowCancelBox(false);
    setLoadingSuggestions(true);
    fetch(`/api/dispatch/suggest?jobId=${encodeURIComponent(job.id)}`)
      .then((r) => r.json())
      .then((d: { suggestions?: TechSuggestionResult[] }) => {
        setSuggestions(d.suggestions ?? []);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoadingSuggestions(false));
  }, [job]);

  if (!job) return null;

  const tz = businessConfig.timezone;

  async function handleAssignTech(techId: string | null, force = false) {
    if (!job) return;
    setBusyAction(true);
    try {
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
      if (!res.ok || !data.job) {
        toast.error(data.error?.message ?? "Failed to assign technician");
        return;
      }
      toast.success(
        techId
          ? `Assigned Job #${job.jobNumber} to ${data.job.technician?.name}`
          : `Moved Job #${job.jobNumber} back to Unassigned`
      );
      onJobUpdated(data.job);
    } finally {
      setBusyAction(false);
    }
  }

  async function handleTransitionStatus(toStatus: JobStatus) {
    if (!job) return;
    setBusyAction(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toStatus, actor: "owner" }),
      });
      const data = (await res.json()) as {
        job?: EnrichedJob;
        error?: { message: string };
      };
      if (!res.ok || !data.job) {
        toast.error(data.error?.message ?? "Transition not allowed");
        return;
      }
      toast.success(`Job #${job.jobNumber} marked ${toStatus.replace(/_/g, " ")}`);
      onJobUpdated(data.job);
    } finally {
      setBusyAction(false);
    }
  }

  async function handleSaveNotes() {
    if (!job) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notesInternal: internalNotes }),
      });
      const data = (await res.json()) as { job?: EnrichedJob };
      if (data.job) {
        toast.success("Internal notes saved");
        onJobUpdated(data.job);
      }
    } finally {
      setSavingNotes(false);
    }
  }

  async function handleCancelJob(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;
    setBusyAction(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: cancelReason || "Customer requested cancellation",
          refundDeposit: refundPolicy,
        }),
      });
      const data = (await res.json()) as {
        job?: EnrichedJob;
        refundCents?: number;
        error?: { message: string };
      };
      if (!res.ok || !data.job) {
        toast.error(data.error?.message ?? "Cancel failed");
        return;
      }
      toast.success(
        data.refundCents && data.refundCents > 0
          ? `Job cancelled & ${formatMoney(data.refundCents)} deposit refunded`
          : "Job cancelled (deposit retained per policy)"
      );
      onJobUpdated(data.job);
      setShowCancelBox(false);
    } finally {
      setBusyAction(false);
    }
  }

  async function handleAddPart(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;
    const priceCents = Math.round(Number(partPriceDollars) * 100);
    if (!partDesc.trim() || !Number.isFinite(priceCents) || priceCents <= 0) {
      toast.error("Enter a valid part description and dollar amount");
      return;
    }

    setBusyAction(true);
    try {
      const existingItems = job.invoice?.lineItems.map((li) => ({
        kind: li.kind,
        description: li.description,
        quantity: li.quantity,
        unitPriceCents: li.unitPriceCents,
        taxable: li.taxable,
      })) ?? [
        {
          kind: "labor" as const,
          description: `${job.service.name} Labor`,
          quantity: 1,
          unitPriceCents: job.service.priceCents,
          taxable: false,
        },
      ];

      const res = await fetch(`/api/jobs/${job.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems: [
            ...existingItems,
            {
              kind: "parts",
              description: partDesc.trim(),
              quantity: 1,
              unitPriceCents: priceCents,
              taxable: true,
            },
          ],
        }),
      });
      const data = (await res.json()) as { job?: EnrichedJob };
      if (data.job) {
        toast.success("Added line item and recalculated tax & balance");
        setPartDesc("");
        setPartPriceDollars("");
        onJobUpdated(data.job);
      }
    } finally {
      setBusyAction(false);
    }
  }

  async function handleCollectPayment(
    method: "card_on_file" | "cash" | "send_pay_link" | "check" | "tap_card",
    extras?: { cardBrand?: string; cardLast4?: string; checkReference?: string }
  ) {
    if (!job) return;
    setBusyAction(true);
    try {
      if (method === "send_pay_link" || method === "card_on_file" || method === "cash") {
        const res = await fetch(`/api/jobs/${job.id}/finish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method }),
        });
        const data = (await res.json()) as {
          job?: EnrichedJob;
          payLinkUrl?: string;
        };
        if (data.job) {
          onJobUpdated(data.job);
          if (method === "send_pay_link") {
            toast.success(`Payment link texted to ${job.customer.phone}`);
          } else {
            toast.success("Payment collected & receipt sent!");
          }
        }
      } else {
        const res = await fetch("/api/payments/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: job.id,
            method,
            tipCents: 0,
            cardBrand: extras?.cardBrand,
            cardLast4: extras?.cardLast4,
            checkReference: extras?.checkReference,
          }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          job?: EnrichedJob;
          error?: { message?: string };
        };
        if (data.job) {
          onJobUpdated(data.job);
          toast.success("Payment recorded & transaction saved!");
        } else {
          toast.error(data.error?.message ?? "Payment failed to record");
        }
      }
    } finally {
      setBusyAction(false);
      setShowCheckModal(false);
      setShowNewCardModal(false);
    }
  }

  async function handleIssueRefund(amountCents?: number, reason?: string) {
    if (!job) return;
    setBusyAction(true);
    try {
      const res = await fetch("/api/stripe/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          amountCents,
          reason: reason || "Owner initiated refund",
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        refundId?: string;
        amountCents?: number;
        mode?: string;
        job?: EnrichedJob;
        error?: { message?: string };
      };
      if (data.ok && data.job) {
        toast.success(
          `Refund of ${formatMoney(data.amountCents ?? 0)} issued (${data.mode === "stripe" ? "Stripe" : "Simulated"})!`
        );
        onJobUpdated(data.job);
        setRefundModal(null);
      } else {
        toast.error(data.error?.message ?? "Refund could not be processed");
      }
    } finally {
      setBusyAction(false);
    }
  }

  async function handleDeleteJob() {
    if (!job) return;
    setDeletingJob(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
      const data = (await res.json()) as { ok?: boolean; error?: { message?: string } };
      if (data.ok) {
        toast.success(`Job #${job.jobNumber} deleted successfully`);
        onJobDeleted?.(job.id);
        onClose();
      } else {
        toast.error(data.error?.message ?? "Could not delete job");
      }
    } finally {
      setDeletingJob(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={`Job #${job.jobNumber} details`}
      data-testid="job-drawer"
    >
      <div
        className="fixed inset-0 bg-navy-900/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl border-l border-slate-200">
        {/* Drawer Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-navy-700">
                Job #{job.jobNumber}
              </span>
              <StatusBadge status={job.status} />
              {job.isDemo ? (
                <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 text-[10px] font-bold">
                  DEMO DATA
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                  LIVE BOOKING
                </span>
              )}
              {job.isUnassignedUrgent ? (
                <span className="inline-flex items-center gap-1 rounded-pill bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
                  <AlertTriangle className="h-3 w-3" />
                  Starts &lt;2h
                </span>
              ) : null}
            </div>
            <h2 className="text-lg font-bold text-navy-900 mt-1">
              {job.service.name} — {job.customer.name}
            </h2>
            <p className="text-xs text-navy-700 mt-0.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {job.addressLine1}, {job.city}, {job.state} {job.zip}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-input p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete this job"
              aria-label="Delete this job"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              data-testid="close-job-drawer"
              className="rounded-input p-2 text-navy-700 hover:bg-slate-200"
              aria-label="Close job drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 4 Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          {(
            [
              { id: "details", label: "Details", icon: Calendar },
              {
                id: "photos",
                label: `Photos (${
                  job.issuePhotos.length +
                  job.beforePhotos.length +
                  job.afterPhotos.length
                })`,
                icon: ImageIcon,
              },
              { id: "invoice", label: "Invoice & Pay", icon: FileText },
              {
                id: "history",
                label: `History (${job.events.length})`,
                icon: History,
              },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                data-testid={`drawer-tab-${t.id}`}
                className={`flex items-center gap-1.5 border-b-2 px-3.5 py-3 text-xs font-semibold transition-colors ${
                  active
                    ? "border-orange-500 text-navy-900"
                    : "border-transparent text-navy-700 hover:text-navy-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "details" ? (
            <>
              {/* Customer & Schedule Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-card border border-slate-200 bg-slate-50/60 p-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-700">
                    Customer
                  </span>
                  <p className="text-sm font-bold text-navy-900 mt-0.5">
                    {job.customer.name}
                  </p>
                  <div className="mt-1">
                    <PhoneLink phone={job.customer.phone} className="text-xs" />
                  </div>
                  {job.customer.email ? (
                    <p className="text-xs text-navy-700 mt-0.5 truncate">
                      {job.customer.email}
                    </p>
                  ) : null}
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-700">
                    Arrival Window ({tz})
                  </span>
                  <p className="text-sm font-bold text-navy-900 mt-0.5 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-600" />
                    {formatInTimeZone(
                      new Date(job.scheduledStart),
                      tz,
                      "EEE, MMM d"
                    )}
                  </p>
                  <p className="text-xs font-medium text-navy-700 mt-0.5">
                    {formatInTimeZone(new Date(job.scheduledStart), tz, "h:mm a")}{" "}
                    – {formatInTimeZone(new Date(job.scheduledEnd), tz, "h:mm a")}
                  </p>
                  <p className="text-xs text-emerald-700 font-medium mt-1">
                    Deposit Paid: <Money cents={job.depositCents} />
                  </p>
                </div>
              </div>

              {/* Customer Issue Description */}
              <div className="rounded-card border border-slate-200 p-4 space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-700">
                  Reported Issue
                </span>
                <p className="text-sm text-navy-900">
                  {job.issueText || "No issue notes provided."}
                </p>
              </div>

              {/* Technician Assignment & Dispatch Scoring */}
              <div className="rounded-card border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-orange-600" />
                      Technician Assignment & Smart Score
                    </h3>
                    <p className="text-xs text-navy-700">
                      Ranked by workload, travel distance, ZIP cluster & skill match
                    </p>
                  </div>
                  {job.technician &&
                  job.status !== "completed" &&
                  job.status !== "cancelled" ? (
                    <button
                      type="button"
                      onClick={() => handleAssignTech(null)}
                      disabled={busyAction}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Unassign
                    </button>
                  ) : null}
                </div>

                {loadingSuggestions ? (
                  <div className="h-24 animate-pulse rounded bg-slate-100" />
                ) : (
                  <div className="space-y-2">
                    {suggestions.map((s, idx) => {
                      const isCurrent = job.technician?.id === s.technicianId;
                      return (
                        <div
                          key={s.technicianId}
                          data-testid={`suggest-tech-${s.technicianId}`}
                          className={`flex items-center justify-between gap-3 rounded-input border p-3 transition-colors ${
                            isCurrent
                              ? "border-orange-500 bg-orange-50/40"
                              : s.eligible
                              ? "border-slate-200 bg-white hover:border-slate-300"
                              : "border-slate-200 bg-slate-50/70 opacity-85"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: s.color }}
                              />
                              <span className="text-sm font-semibold text-navy-900">
                                {s.technicianName}
                              </span>
                              {idx === 0 && s.eligible ? (
                                <span className="rounded-pill bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                  Best Match · Score {s.score}
                                </span>
                              ) : s.eligible ? (
                                <span className="rounded-pill bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-navy-700">
                                  Score {s.score}
                                </span>
                              ) : (
                                <span className="rounded-pill bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                                  {s.reason}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-navy-700 mt-0.5">
                              Load {s.breakdown.load} · Travel {s.breakdown.travelPrev} ·
                              ZIP Cluster +{s.breakdown.cluster} · Skill +{s.breakdown.skill}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {isCurrent ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-700">
                                <CheckCircle2 className="h-4 w-4" />
                                Assigned
                              </span>
                            ) : s.eligible ? (
                              <Button
                                type="button"
                                size="sm"
                                variant={idx === 0 ? "primary" : "secondary"}
                                disabled={
                                  busyAction ||
                                  job.status === "completed" ||
                                  job.status === "cancelled"
                                }
                                onClick={() => handleAssignTech(s.technicianId, false)}
                              >
                                Assign
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                disabled={
                                  busyAction ||
                                  job.status === "completed" ||
                                  job.status === "cancelled"
                                }
                                onClick={() => handleAssignTech(s.technicianId, true)}
                                className="text-xs text-amber-800 hover:bg-amber-50"
                              >
                                Force Assign
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Status Progression for Owner */}
              {job.status !== "completed" && job.status !== "cancelled" ? (
                <div className="rounded-card border border-slate-200 p-4 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-navy-700">
                    Field Status Progression
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {job.status === "assigned" ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleTransitionStatus("on_the_way")}
                        disabled={busyAction}
                      >
                        Mark On The Way (Sends ETA SMS)
                      </Button>
                    ) : null}
                    {job.status === "on_the_way" ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleTransitionStatus("in_progress")}
                        disabled={busyAction}
                      >
                        Start Work (In Progress)
                      </Button>
                    ) : null}
                    {job.status === "in_progress" ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setActiveTab("invoice")}
                      >
                        Complete & Collect Payment →
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Internal Dispatcher Notes */}
              <div className="space-y-2">
                <Label htmlFor="drawer-internal-notes">
                  Internal Dispatcher Notes
                </Label>
                <Textarea
                  id="drawer-internal-notes"
                  rows={2}
                  placeholder="Gate code, dog in yard, special parts needed..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    loading={savingNotes}
                    onClick={handleSaveNotes}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>

              {/* Cancel Job Section (Decision D12) */}
              {job.status !== "completed" && job.status !== "cancelled" ? (
                <div className="border-t border-slate-200 pt-4">
                  {!showCancelBox ? (
                    <button
                      type="button"
                      onClick={() => setShowCancelBox(true)}
                      data-testid="open-cancel-job-btn"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Cancel Job & Apply Deposit Refund Policy...
                    </button>
                  ) : (
                    <form
                      onSubmit={handleCancelJob}
                      className="rounded-card border border-red-200 bg-red-50/50 p-4 space-y-3"
                    >
                      <h4 className="text-sm font-bold text-red-900">
                        Cancel Job #{job.jobNumber}
                      </h4>
                      <div>
                        <Label htmlFor="cancel-reason">Cancellation Reason</Label>
                        <Input
                          id="cancel-reason"
                          required
                          placeholder="Customer rescheduled / issue resolved"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="refund-policy">
                          Deposit Refund Policy ({formatMoney(job.depositCents)})
                        </Label>
                        <select
                          id="refund-policy"
                          value={refundPolicy}
                          onChange={(e) =>
                            setRefundPolicy(e.target.value as "auto" | "yes" | "no")
                          }
                          className="mt-1 block w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900"
                        >
                          <option value="auto">
                            Auto (Full refund if ≥{businessConfig.policy.cancellationWindowHours}h before start)
                          </option>
                          <option value="yes">Force Full Refund</option>
                          <option value="no">Retain Deposit</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          type="submit"
                          variant="destructive"
                          size="sm"
                          loading={busyAction}
                        >
                          Confirm Cancellation
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCancelBox(false)}
                        >
                          Keep Job
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              ) : null}
            </>
          ) : null}

          {activeTab === "photos" ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-navy-900">
                  Customer Booking Photos ({job.issuePhotos.length})
                </h3>
                {job.issuePhotos.length === 0 ? (
                  <p className="text-xs text-navy-700 mt-1">
                    No photos uploaded during booking.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {job.issuePhotos.map((src, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-card border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center"
                      >
                        <img
                          src={src}
                          alt={`Customer issue photo ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-navy-900">
                  Technician Before Photos ({job.beforePhotos.length})
                </h3>
                {job.beforePhotos.length === 0 ? (
                  <p className="text-xs text-navy-700 mt-1">
                    No before photos captured yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {job.beforePhotos.map((src, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-card border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center"
                      >
                        <img
                          src={src}
                          alt={`Technician before photo ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-navy-900">
                  Technician After Photos ({job.afterPhotos.length})
                </h3>
                {job.afterPhotos.length === 0 ? (
                  <p className="text-xs text-navy-700 mt-1">
                    No after photos captured yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {job.afterPhotos.map((src, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-card border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center"
                      >
                        <img
                          src={src}
                          alt={`Technician after photo ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {activeTab === "invoice" ? (
            <div className="space-y-5">
              <div className="rounded-card border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-700">
                    {job.invoice
                      ? `Invoice #${job.invoice.invoiceNumber} (${job.invoice.status.toUpperCase()})`
                      : "Estimate / Draft Invoice"}
                  </span>
                  {job.invoice ? (
                    <Link
                      href={`/pay/${job.invoice.publicPayToken}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:underline"
                    >
                      Open Customer Pay Page
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : null}
                </div>

                <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                  {job.invoice ? (
                    job.invoice.lineItems.map((li) => (
                      <div key={li.id} className="flex justify-between">
                        <span className="text-navy-900">
                          {li.description}{" "}
                          <span className="text-xs text-navy-700">({li.kind})</span>
                        </span>
                        <Money cents={li.amountCents} className="font-medium" />
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-navy-900">
                        {job.service.name} Estimate
                      </span>
                      <Money cents={job.estimatedTotalCents} className="font-medium" />
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-navy-700">
                    <span>Subtotal</span>
                    <Money
                      cents={job.invoice?.subtotalCents ?? job.estimatedTotalCents}
                    />
                  </div>
                  <div className="flex justify-between text-navy-700">
                    <span>Parts Sales Tax (7.0%)</span>
                    <Money cents={job.invoice?.taxCents ?? 0} />
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Deposit Paid</span>
                    <span>
                      -<Money cents={job.depositCents} />
                    </span>
                  </div>
                  {job.tipCents > 0 ? (
                    <div className="flex justify-between text-navy-700">
                      <span>Technician Tip</span>
                      <Money cents={job.tipCents} />
                    </div>
                  ) : null}
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-navy-900">
                    <span>Remaining Balance Due</span>
                    <Money
                      cents={
                        job.invoice
                          ? job.invoice.amountDueCents
                          : Math.max(0, job.estimatedTotalCents - job.depositCents)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Add Part or Fee Form */}
              <form
                onSubmit={handleAddPart}
                className="rounded-card border border-slate-200 bg-slate-50/70 p-4 space-y-3"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  Add Part / Material Line Item (Taxable)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <Input
                      placeholder="OEM Run Capacitor 45/5 MFD"
                      value={partDesc}
                      onChange={(e) => setPartDesc(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="85.00"
                      value={partPriceDollars}
                      onChange={(e) => setPartPriceDollars(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  loading={busyAction}
                >
                  + Add Line Item
                </Button>
              </form>

              {/* Payment Transactions Ledger */}
              <div className="rounded-card border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-orange-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                      Payment Transactions Ledger ({job.payments.length})
                    </h4>
                  </div>
                  {job.depositPaymentIntentId ? (
                    <span className="font-mono text-[10px] text-navy-700 bg-slate-100 px-2 py-0.5 rounded">
                      PI: {job.depositPaymentIntentId}
                    </span>
                  ) : null}
                </div>

                {job.payments.length === 0 ? (
                  <p className="text-xs text-navy-700 py-2">
                    No payment transactions recorded yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {job.payments.map((p) => {
                      const isRefund = p.kind === "refund";
                      const txId = p.stripeRefundId ?? p.stripeChargeId ?? p.stripePaymentIntentId ?? p.id;
                      return (
                        <div
                          key={p.id}
                          className={`rounded-lg border p-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            isRefund
                              ? "border-red-200 bg-red-50/50"
                              : "border-slate-100 bg-slate-50/60"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                  isRefund
                                    ? "bg-red-600 text-white"
                                    : p.kind === "deposit"
                                    ? "bg-navy-900 text-white"
                                    : "bg-emerald-700 text-white"
                                }`}
                              >
                                {p.kind}
                              </span>
                              <span className="font-semibold text-navy-900 capitalize">
                                {p.method.replace(/_/g, " ")}
                              </span>
                              <span className="text-navy-700 font-mono text-[11px]">
                                {txId}
                              </span>
                            </div>
                            <p className="text-[11px] text-navy-700">
                              Recorded by {p.recordedBy ?? "system"} ·{" "}
                              {formatInTimeZone(new Date(p.createdAt), tz, "MMM d, yyyy h:mm a")}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`font-bold tabular-nums text-sm ${
                                isRefund ? "text-red-700" : "text-emerald-700"
                              }`}
                            >
                              {isRefund ? "-" : "+"}
                              {formatMoney(p.amountCents)}
                            </span>

                            {!isRefund && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRefundModal({
                                    open: true,
                                    amountDollars: (p.amountCents / 100).toFixed(2),
                                    reason: "Customer refund request",
                                  })
                                }
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline px-1.5 py-0.5 rounded hover:bg-red-50"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Refund
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment Collection Actions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-700">
                    Collect Balance Payment
                  </h4>
                  {job.customer.cardLast4 ? (
                    <span className="text-[11px] text-navy-700 font-medium">
                      Card on file: {job.customer.cardBrand ?? "Card"} •••• {job.customer.cardLast4}
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleCollectPayment("card_on_file")}
                    disabled={busyAction}
                    className="gap-1 text-xs"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Saved Card
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewCardModal(true)}
                    disabled={busyAction}
                    className="gap-1 text-xs"
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    New Card
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowCheckModal(true)}
                    disabled={busyAction}
                    className="gap-1 text-xs"
                  >
                    Check / ACH
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCollectPayment("cash")}
                    disabled={busyAction}
                    className="text-xs"
                  >
                    Cash
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCollectPayment("send_pay_link")}
                    disabled={busyAction}
                    className="gap-1 text-xs col-span-2 sm:col-span-1"
                  >
                    <Send className="h-3.5 w-3.5" />
                    SMS Link
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "history" ? (
            <div className="space-y-3">
              {job.events.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-start justify-between gap-3 rounded-input border border-slate-200 bg-slate-50/50 p-3 text-xs"
                >
                  <div>
                    <span className="font-bold uppercase text-navy-900">
                      {evt.eventType.replace(/_/g, " ")}
                    </span>
                    {evt.fromStatus || evt.toStatus ? (
                      <span className="ml-2 text-navy-700">
                        {evt.fromStatus ?? "new"} → {evt.toStatus}
                      </span>
                    ) : null}
                    <p className="text-navy-700 mt-0.5">
                      Actor: <span className="font-medium">{evt.actorLabel ?? "system"}</span>
                    </p>
                  </div>
                  <span className="text-navy-700 tabular-nums shrink-0">
                    {formatInTimeZone(new Date(evt.createdAt), tz, "MMM d, h:mm a")}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Modal: Issue Refund */}
        {refundModal?.open ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-navy-900 text-base flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-red-600" />
                  Issue Payment Refund
                </h3>
                <button
                  type="button"
                  onClick={() => setRefundModal(null)}
                  className="rounded-input p-1.5 text-navy-700 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <Label htmlFor="refund-amount">Refund Amount ($)</Label>
                  <Input
                    id="refund-amount"
                    type="number"
                    step="0.01"
                    value={refundModal.amountDollars}
                    onChange={(e) =>
                      setRefundModal({ ...refundModal, amountDollars: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="refund-reason">Reason</Label>
                  <Input
                    id="refund-reason"
                    value={refundModal.reason}
                    onChange={(e) =>
                      setRefundModal({ ...refundModal, reason: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRefundModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  loading={busyAction}
                  onClick={() => {
                    const cents = Math.round(Number(refundModal.amountDollars) * 100);
                    void handleIssueRefund(cents, refundModal.reason);
                  }}
                >
                  Confirm Refund
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modal: Record Check */}
        {showCheckModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-navy-900 text-base">
                  Record Check Payment
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCheckModal(false)}
                  className="rounded-input p-1.5 text-navy-700 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <Label htmlFor="check-ref-input">Check / Reference #</Label>
                  <Input
                    id="check-ref-input"
                    placeholder="e.g. Check #4402"
                    value={checkRefInput}
                    onChange={(e) => setCheckRefInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCheckModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  loading={busyAction}
                  onClick={() =>
                    void handleCollectPayment("check", { checkReference: checkRefInput })
                  }
                >
                  Record Check
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modal: Charge New Card */}
        {showNewCardModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-navy-900 text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-orange-600" />
                  Charge New Card
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewCardModal(false)}
                  className="rounded-input p-1.5 text-navy-700 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <Label htmlFor="new-card-num">Card Number</Label>
                  <Input
                    id="new-card-num"
                    placeholder="4242 4242 4242 4242"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewCardNumber("4242 4242 4242 4242");
                      setNewCardBrand("Visa");
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Fill Test 4242
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewCardModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  loading={busyAction}
                  onClick={() => {
                    const clean = newCardNumber.replace(/\D/g, "");
                    const last4 = clean.slice(-4) || "4242";
                    void handleCollectPayment("tap_card", {
                      cardBrand: newCardBrand,
                      cardLast4: last4,
                    });
                  }}
                >
                  Charge Card
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modal: Confirm Delete Job */}
        {confirmDelete ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-navy-900 text-base">
                    Delete Job #{job.jobNumber}?
                  </h3>
                  <p className="text-xs text-navy-700 mt-0.5">
                    This permanently removes this job and all associated invoices, events, and photos. Real customer profiles remain safe.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Keep Job
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  loading={deletingJob}
                  onClick={handleDeleteJob}
                >
                  Yes, Delete Job
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
