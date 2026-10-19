"use client";

import * as React from "react";
import { Database, RefreshCw, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface DemoStats {
  totalJobs: number;
  demoJobs: number;
  realJobs: number;
  totalCustomers: number;
  demoCustomers: number;
  realCustomers: number;
  demoCleared: boolean;
}

interface DemoDataManagerProps {
  onDataChanged?: () => void;
  className?: string;
  compact?: boolean;
}

export function DemoDataManager({
  onDataChanged,
  className = "",
  compact = false,
}: DemoDataManagerProps) {
  const [stats, setStats] = React.useState<DemoStats | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [confirmClear, setConfirmClear] = React.useState(false);

  const fetchStats = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/catalog");
      if (res.ok) {
        const data = (await res.json()) as { demoStats?: DemoStats };
        if (data.demoStats) {
          setStats(data.demoStats);
        }
      }
    } catch {
      // Ignore network errors in demo manager poll
    }
  }, []);

  React.useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  async function handleClearDemoData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_demo_data", payload: {} }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        cleared?: { demoJobsRemoved: number; demoCustomersRemoved: number };
      };
      if (res.ok && data.ok) {
        toast.success(
          `Demo data cleared: removed ${data.cleared?.demoJobsRemoved ?? 0} sample jobs & ${data.cleared?.demoCustomersRemoved ?? 0} sample customers. Real bookings preserved!`
        );
        setConfirmClear(false);
        await fetchStats();
        onDataChanged?.();
      } else {
        toast.error("Failed to clear demo data");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRestoreDemoData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore_demo_data", payload: {} }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        restored?: { demoJobsRestored: number; demoCustomersRestored: number };
      };
      if (res.ok && data.ok) {
        toast.success(
          `Demo data restored: loaded ${data.restored?.demoJobsRestored ?? 0} sample jobs with full payment history.`
        );
        await fetchStats();
        onDataChanged?.();
      } else {
        toast.error("Failed to restore demo data");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!stats) return null;

  const hasDemoData = stats.demoJobs > 0 || stats.demoCustomers > 0;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs shadow-sm ${className}`}
      >
        <span
          className={`h-2 w-2 rounded-full ${hasDemoData ? "bg-amber-500" : "bg-emerald-500"}`}
        />
        <span className="font-semibold text-navy-900">
          {hasDemoData ? `${stats.demoJobs} Demo Jobs` : "Clean Database"}
        </span>
        <span className="text-navy-700">· {stats.realJobs} Live Bookings</span>
        {hasDemoData ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirmClear(true)}
            className="h-6 px-2 text-[11px] text-red-600 hover:text-red-700"
          >
            Clear Demo
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRestoreDemoData}
            className="h-6 px-2 text-[11px] text-blue-600 hover:text-blue-700"
          >
            Restore Demo
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border ${
        hasDemoData
          ? "border-amber-200 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-white"
          : "border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-slate-50/60 to-white"
      } p-4 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              hasDemoData
                ? "bg-amber-500 text-navy-900 shadow-sm"
                : "bg-emerald-600 text-white shadow-sm"
            }`}
          >
            <Database className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-navy-900">
                {hasDemoData ? "Sample Demo Data Active" : "Clean Production Database"}
              </h3>
              {hasDemoData ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                  <AlertTriangle className="h-3 w-3" />
                  {stats.demoJobs} Demo Jobs · {stats.demoCustomers} Demo Customers
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Only Real Bookings ({stats.realJobs})
                </span>
              )}
            </div>
            <p className="text-xs text-navy-700 mt-0.5">
              {hasDemoData
                ? `You can delete all demo data at any time with 1 click. Your ${stats.realJobs} real customer bookings, technicians, and settings will remain completely untouched.`
                : `All sample jobs have been removed. Any booking made through /book will be stored here live.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {confirmClear ? (
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-red-200 shadow-sm">
              <span className="text-xs font-semibold text-red-700 pl-2">
                Delete all sample jobs?
              </span>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                loading={loading}
                onClick={handleClearDemoData}
                className="h-7 px-3 text-xs font-bold"
              >
                Yes, Delete Demo Data
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setConfirmClear(false)}
                className="h-7 px-2 text-xs"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              {hasDemoData ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmClear(true)}
                  disabled={loading}
                  className="gap-1.5 border-amber-300 text-amber-900 hover:bg-amber-100/70"
                >
                  <Trash2 className="h-3.5 w-3.5 text-amber-700" />
                  Delete Demo Data
                </Button>
              ) : null}

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleRestoreDemoData}
                loading={loading}
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {hasDemoData ? "Reset / Re-Seed Demo" : "Restore Demo Data"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
