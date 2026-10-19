"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Save,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ChecklistItem } from "@/lib/server/tech-portal";
import type { EnrichedJob } from "@/lib/server/operations";

export default function JobChecklistPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "";

  const [job, setJob] = React.useState<EnrichedJob | null>(null);
  const [items, setItems] = React.useState<ChecklistItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [jobRes, checkRes] = await Promise.all([
        fetch(`/api/jobs/${encodeURIComponent(jobId)}`),
        fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/checklist`),
      ]);

      if (jobRes.ok) {
        const jobData = await jobRes.json();
        setJob(jobData.job);
      }

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        setItems(checkData.checklist || []);
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  function handleStatusChange(itemId: string, newStatus: ChecklistItem["status"]) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          return {
            ...it,
            status: newStatus,
            inspectedAt: new Date().toISOString(),
          };
        }
        return it;
      })
    );
  }

  function handleNotesChange(itemId: string, notes: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, notes } : it))
    );
  }

  async function handleSaveChecklist() {
    // Validate fail notes
    for (const it of items) {
      if (it.status === "fail" && (!it.notes || it.notes.trim().length < 3)) {
        toast.error(`Please provide an explanatory note for failed item: "${it.label}"`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to save checklist");
        return;
      }

      setItems(data.checklist || items);
      toast.success("Inspection checklist saved successfully!");
    } catch {
      toast.error("Network error while saving checklist");
    } finally {
      setSaving(false);
    }
  }

  const completedCount = items.filter((it) => it.status !== "pending").length;
  const isAllComplete = items.length > 0 && completedCount === items.length;
  const failCount = items.filter((it) => it.status === "fail").length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
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

      {/* Progress Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-navy-900">HVAC Safety Checklist</h1>
              <p className="text-xs text-navy-600">10-Point Technical Diagnostic Inspection</p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              isAllComplete
                ? "bg-emerald-100 text-emerald-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {completedCount} / {items.length} Inspected
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 mt-3">
          <div
            className={`h-full transition-all duration-300 ${
              isAllComplete ? "bg-emerald-500" : "bg-orange-500"
            }`}
            style={{ width: `${(completedCount / Math.max(1, items.length)) * 100}%` }}
          />
        </div>

        {failCount > 0 ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-2 text-xs font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {failCount} {failCount === 1 ? "component failed" : "components failed"} inspection. Detail notes are required for replacement recommendations.
            </span>
          </div>
        ) : null}
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.map((it, idx) => {
          return (
            <div
              key={it.id}
              className={`rounded-2xl border p-4 transition-colors ${
                it.status === "pass"
                  ? "border-emerald-200 bg-emerald-50/20"
                  : it.status === "fail"
                  ? "border-rose-200 bg-rose-50/30"
                  : it.status === "na"
                  ? "border-slate-200 bg-slate-50/50"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500">
                      {it.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy-900">{it.label}</h3>
                  <p className="text-xs text-navy-600">{it.description}</p>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleStatusChange(it.id, "pass")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                    it.status === "pass"
                      ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1"
                      : "border border-slate-200 bg-white text-navy-700 hover:bg-emerald-50"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Pass
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(it.id, "fail")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                    it.status === "fail"
                      ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-600 ring-offset-1"
                      : "border border-slate-200 bg-white text-navy-700 hover:bg-rose-50"
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                  Fail
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(it.id, "na")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                    it.status === "na"
                      ? "bg-slate-700 text-white shadow-sm ring-2 ring-slate-700 ring-offset-1"
                      : "border border-slate-200 bg-white text-navy-700 hover:bg-slate-100"
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                  N/A
                </button>
              </div>

              {/* Required Failure / Diagnostic Note */}
              {it.status === "fail" || it.notes ? (
                <div className="mt-3 space-y-1.5">
                  <label className="text-[11px] font-bold text-navy-700 flex items-center justify-between">
                    <span>
                      Defect & Diagnostics Note {it.status === "fail" ? "(Mandatory)" : "(Optional)"}
                    </span>
                    {it.status === "fail" && (!it.notes || it.notes.trim().length < 3) ? (
                      <span className="text-[10px] text-rose-600 font-bold">Required</span>
                    ) : null}
                  </label>
                  <textarea
                    rows={2}
                    value={it.notes || ""}
                    onChange={(e) => handleNotesChange(it.id, e.target.value)}
                    placeholder="Enter microfarad readings, amperage, burnt wiring details, or code violation..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Floating Save Button */}
      <div className="sticky bottom-4 pt-2">
        <Button
          type="button"
          onClick={() => void handleSaveChecklist()}
          disabled={saving}
          className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-navy-950 shadow-lg hover:bg-orange-400"
        >
          {saving ? (
            "Saving Inspection..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save Checklist Progress
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
