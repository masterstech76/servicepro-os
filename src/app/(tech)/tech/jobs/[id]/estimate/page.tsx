"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  AlertCircle,
  FileText,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { businessConfig } from "@config/business.config";
import type { JobEstimate, EstimateLineItem } from "@/lib/server/tech-portal";
import type { EnrichedJob } from "@/lib/server/operations";

export default function JobEstimatePage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "";

  const [job, setJob] = React.useState<EnrichedJob | null>(null);
  const [estimates, setEstimates] = React.useState<JobEstimate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  // New Estimate Form State
  const [title, setTitle] = React.useState("Recommended Additional HVAC Repairs");
  const [description, setDescription] = React.useState("");
  const [lineItems, setLineItems] = React.useState<Array<{
    kind: "labor" | "parts";
    description: string;
    quantity: number;
    unitPriceDollars: string;
  }>>([
    {
      kind: "parts",
      description: "Dual Run Capacitor 45/5 MFD 440V Replacement",
      quantity: 1,
      unitPriceDollars: "85.00",
    },
    {
      kind: "labor",
      description: "Capacitor & Contactor Electrical Diagnostics & Installation Labor",
      quantity: 1,
      unitPriceDollars: "95.00",
    },
  ]);

  // Customer Approval Input State
  const [customerName, setCustomerName] = React.useState("");

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [jobRes, estRes] = await Promise.all([
        fetch(`/api/jobs/${encodeURIComponent(jobId)}`),
        fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/estimate`),
      ]);

      if (jobRes.ok) {
        const jobData = await jobRes.json();
        setJob(jobData.job);
        if (jobData.job?.customer?.name) {
          setCustomerName(jobData.job.customer.name);
        }
      }

      if (estRes.ok) {
        const estData = await estRes.json();
        setEstimates(estData.estimates || []);
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  function addEmptyLineItem() {
    setLineItems((prev) => [
      ...prev,
      { kind: "parts", description: "", quantity: 1, unitPriceDollars: "0.00" },
    ]);
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLineItem(
    index: number,
    field: "kind" | "description" | "quantity" | "unitPriceDollars",
    val: string | number
  ) {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  }

  // Calculate live preview totals
  const subtotalCents = lineItems.reduce((acc, it) => {
    const qty = Math.max(1, it.quantity);
    const unitPrice = Math.round(Number(it.unitPriceDollars || "0") * 100);
    return acc + (Number.isFinite(unitPrice) ? qty * unitPrice : 0);
  }, 0);

  const taxBps = businessConfig.tax?.rateBps ?? 700;
  const taxRate = taxBps / 10000;
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;

  async function handleCreateEstimate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter an estimate title");
      return;
    }

    const validItems = lineItems.filter(
      (it) => it.description.trim().length > 0 && Number(it.unitPriceDollars) > 0
    );

    if (validItems.length === 0) {
      toast.error("Please add at least one line item with a description and price");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          items: validItems.map((it) => ({
            kind: it.kind,
            description: it.description.trim(),
            quantity: Number(it.quantity) || 1,
            unitPriceCents: Math.round(Number(it.unitPriceDollars) * 100),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to create estimate");
        return;
      }

      toast.success("Estimate generated and presented for customer approval!");
      await loadData();
    } catch {
      toast.error("Network error creating estimate");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCustomerDecision(
    estimateId: string,
    decision: "approved" | "declined"
  ) {
    if (decision === "approved" && !customerName.trim()) {
      toast.error("Customer signature or name confirmation is required to approve work");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/estimate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estimateId,
          decision,
          customerSignatureName: customerName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to record customer decision");
        return;
      }

      toast.success(
        decision === "approved"
          ? "Estimate approved by customer! Work authorized."
          : "Estimate marked as declined by customer."
      );
      await loadData();
    } catch {
      toast.error("Network error recording decision");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/tech/jobs/${jobId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Work Order
        </Link>
        <span className="font-mono text-xs font-bold text-navy-700">
          Job #{job?.jobNumber || jobId.slice(0, 8)}
        </span>
      </div>

      {/* Existing Estimates List */}
      {estimates.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy-600 px-1">
            Job Estimates ({estimates.length})
          </h2>

          {estimates.map((est) => (
            <div
              key={est.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 flex items-center justify-between">
                <span className="font-bold text-sm text-navy-900">{est.title}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    est.status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : est.status === "declined"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {est.status === "approved"
                    ? "Approved"
                    : est.status === "declined"
                    ? "Declined"
                    : "Pending Customer Approval"}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {est.description ? (
                  <p className="text-xs text-navy-600 italic">{est.description}</p>
                ) : null}

                {/* Line items table */}
                <div className="space-y-1.5">
                  {est.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
                    >
                      <div>
                        <span className="font-semibold text-navy-900">{it.description}</span>
                        <span className="text-[10px] text-navy-500 block">
                          Qty: {it.quantity} · {formatMoney(it.unitPriceCents)} ea
                        </span>
                      </div>
                      <span className="font-bold text-navy-900">
                        {formatMoney(it.amountCents)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals Summary */}
                <div className="rounded-xl bg-slate-50 p-2.5 space-y-1 text-xs">
                  <div className="flex justify-between text-navy-600">
                    <span>Subtotal:</span>
                    <span>{formatMoney(est.subtotalCents)}</span>
                  </div>
                  <div className="flex justify-between text-navy-600">
                    <span>Florida Sales Tax ({((businessConfig.tax?.rateBps ?? 700) / 100).toFixed(1)}%):</span>
                    <span>{formatMoney(est.taxCents)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-navy-950 pt-1 border-t border-slate-200">
                    <span>Estimate Total:</span>
                    <span className="text-orange-600">{formatMoney(est.totalCents)}</span>
                  </div>
                </div>

                {/* Customer Decision Section */}
                {est.status === "pending_customer_approval" ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <UserCheck className="h-4 w-4 text-amber-600" />
                      <span>Customer On-Site Authorization</span>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-navy-700 block mb-1">
                        Signatory Customer Name:
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Full name authorizing repairs"
                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        type="button"
                        onClick={() => void handleCustomerDecision(est.id, "approved")}
                        disabled={submitting}
                        className="rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Approve & Authorize
                      </Button>
                      <Button
                        type="button"
                        onClick={() => void handleCustomerDecision(est.id, "declined")}
                        disabled={submitting}
                        variant="outline"
                        className="rounded-xl border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Customer Declined
                      </Button>
                    </div>
                  </div>
                ) : est.status === "approved" ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900 flex items-center justify-between">
                    <span className="font-semibold">
                      Authorized by: <strong>{est.customerSignatureName}</strong>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono">
                      {est.decisionAt ? new Date(est.decisionAt).toLocaleTimeString() : ""}
                    </span>
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-100 p-2 text-xs text-slate-700">
                    Declined by customer on {est.decisionAt ? new Date(est.decisionAt).toLocaleDateString() : "today"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* New Estimate Builder Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-orange-500 font-bold shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-navy-900">Create New On-Site Estimate</h2>
            <p className="text-xs text-navy-600">Provide upfront pricing before performing extra work</p>
          </div>
        </div>

        <form onSubmit={handleCreateEstimate} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-navy-700 block mb-1">
              Estimate Title / Problem Diagnosed
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Refrigerant Leak Repair & Filter Dryer Replacement"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-navy-700 block mb-1">
              Notes for Customer (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain why parts are worn out and what will happen if not serviced..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Line Items List */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-600">
                Line Items ({lineItems.length})
              </span>
              <button
                type="button"
                onClick={addEmptyLineItem}
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            {lineItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <select
                    value={item.kind}
                    onChange={(e) =>
                      updateLineItem(idx, "kind", e.target.value as "labor" | "parts")
                    }
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-navy-800"
                  >
                    <option value="parts">Part</option>
                    <option value="labor">Labor</option>
                  </select>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                    placeholder="Description / Part Name"
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                  />
                  {lineItems.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeLineItem(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-navy-600 font-semibold">Qty:</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(idx, "quantity", parseInt(e.target.value) || 1)
                      }
                      className="w-14 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-navy-900 text-center"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-navy-600 font-semibold">Price ($):</span>
                    <input
                      type="text"
                      value={item.unitPriceDollars}
                      onChange={(e) => updateLineItem(idx, "unitPriceDollars", e.target.value)}
                      placeholder="0.00"
                      className="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-navy-900"
                    />
                  </div>
                  <span className="font-bold text-navy-900">
                    ${(
                      (Math.max(1, item.quantity) * Number(item.unitPriceDollars || 0))
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="rounded-xl bg-navy-900 p-3 text-white space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span>{formatMoney(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Sales Tax ({((businessConfig.tax?.rateBps ?? 700) / 100).toFixed(1)}%):</span>
              <span>{formatMoney(taxCents)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-white pt-1.5 border-t border-slate-700">
              <span>Total Work Estimate:</span>
              <span className="text-orange-400">{formatMoney(totalCents)}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-navy-950 shadow-md hover:bg-orange-400"
          >
            {submitting ? "Generating..." : "Generate & Present to Customer"}
          </Button>
        </form>
      </div>
    </div>
  );
}
