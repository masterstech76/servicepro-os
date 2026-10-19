"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CalendarOff,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ScheduleResponse {
  technicianId: string;
  technicianName: string;
  hours: Array<{
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
  timeOff: Array<{
    id: string;
    starts_at: string;
    ends_at: string;
    reason: string | null;
  }>;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminTechnicianSchedulePage() {
  const params = useParams<{ id: string }>();
  const techId = params?.id ?? "";

  const [data, setData] = React.useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Time off form
  const [startsAt, setStartsAt] = React.useState("");
  const [endsAt, setEndsAt] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [submittingTimeOff, setSubmittingTimeOff] = React.useState(false);

  // Shift edit state
  const [selectedDay, setSelectedDay] = React.useState(1);
  const [startTime, setStartTime] = React.useState("08:00");
  const [endTime, setEndTime] = React.useState("17:00");
  const [savingShift, setSavingShift] = React.useState(false);

  const loadSchedule = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/technicians/${encodeURIComponent(techId)}/schedule`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, [techId]);

  React.useEffect(() => {
    void loadSchedule();
  }, [loadSchedule]);

  async function handleAddTimeOff(e: React.FormEvent) {
    e.preventDefault();
    if (!startsAt || !endsAt) {
      toast.error("Start and end dates are required for time off");
      return;
    }

    setSubmittingTimeOff(true);
    try {
      const res = await fetch(`/api/admin/technicians/${encodeURIComponent(techId)}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "time_off",
          startsAt,
          endsAt,
          reason: reason.trim() || undefined,
        }),
      });

      if (res.ok) {
        toast.success("Time off scheduled successfully!");
        setStartsAt("");
        setEndsAt("");
        setReason("");
        await loadSchedule();
      } else {
        toast.error("Failed to add time off");
      }
    } catch {
      toast.error("Network error adding time off");
    } finally {
      setSubmittingTimeOff(false);
    }
  }

  async function handleUpdateShift(e: React.FormEvent) {
    e.preventDefault();
    setSavingShift(true);
    try {
      const res = await fetch(`/api/admin/technicians/${encodeURIComponent(techId)}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hours",
          dayOfWeek: selectedDay,
          startTime,
          endTime,
        }),
      });

      if (res.ok) {
        toast.success(`Updated shift for ${DAY_NAMES[selectedDay]}!`);
        await loadSchedule();
      } else {
        toast.error("Failed to update shift");
      }
    } catch {
      toast.error("Network error updating shift");
    } finally {
      setSavingShift(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/technicians/${techId}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-navy-800 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-navy-950">
              Shift Schedule & Time-Off
            </h1>
            <p className="text-xs text-navy-600">
              Roster management for {data.technicianName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Shifts Grid */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="h-4 w-4 text-orange-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900">
              Weekly Working Hours
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {DAY_NAMES.map((dayName, idx) => {
              const hourRecord = data.hours.find((h) => h.day_of_week === idx);

              return (
                <div
                  key={idx}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-navy-800">{dayName}</span>
                  {hourRecord ? (
                    <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {hourRecord.start_time} – {hourRecord.end_time}
                    </span>
                  ) : (
                    <span className="text-navy-400 italic">Off Duty</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Edit shift form */}
          <form
            onSubmit={handleUpdateShift}
            className="pt-3 border-t border-slate-100 space-y-3 text-xs"
          >
            <span className="font-bold text-navy-900 block">Update Day Shift:</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-navy-600 block mb-1">Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs font-bold text-navy-900"
                >
                  {DAY_NAMES.map((n, i) => (
                    <option key={i} value={i}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-navy-600 block mb-1">Start</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs text-navy-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-navy-600 block mb-1">End</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs text-navy-900"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={savingShift}
              className="w-full rounded-xl bg-navy-900 py-2 text-xs font-bold text-white hover:bg-navy-800"
            >
              {savingShift ? "Saving..." : "Save Shift Hours"}
            </Button>
          </form>
        </div>

        {/* Scheduled Time-Off & Blackout Windows */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CalendarOff className="h-4 w-4 text-orange-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900">
              Approved Time-Off ({data.timeOff.length})
            </h2>
          </div>

          {data.timeOff.length === 0 ? (
            <p className="text-xs text-navy-500 italic py-2">
              No upcoming leaves or blackout windows scheduled.
            </p>
          ) : (
            <div className="space-y-2">
              {data.timeOff.map((to) => (
                <div
                  key={to.id}
                  className="rounded-xl border border-amber-200 bg-amber-50/60 p-2.5 text-xs space-y-1"
                >
                  <div className="flex justify-between font-bold text-navy-900">
                    <span>{to.reason || "Approved Leave"}</span>
                    <span className="text-amber-800 text-[10px] uppercase font-bold">
                      Blackout
                    </span>
                  </div>
                  <p className="text-[11px] text-navy-600">
                    {new Date(to.starts_at).toLocaleDateString()} –{" "}
                    {new Date(to.ends_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Time-Off Form */}
          <form
            onSubmit={handleAddTimeOff}
            className="pt-3 border-t border-slate-100 space-y-3 text-xs"
          >
            <span className="font-bold text-navy-900 block">Schedule New Time-Off:</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-navy-600 block mb-1">Starts At *</label>
                <input
                  type="date"
                  required
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs text-navy-900"
                />
              </div>

              <div>
                <label className="text-[10px] text-navy-600 block mb-1">Ends At *</label>
                <input
                  type="date"
                  required
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs text-navy-900"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-navy-600 block mb-1">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Training seminar, Doctor appointment, Vacation..."
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs text-navy-900"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submittingTimeOff}
              className="w-full rounded-xl bg-orange-500 py-2 text-xs font-bold text-navy-950 hover:bg-orange-400"
            >
              {submittingTimeOff ? "Scheduling..." : "Add Time-Off"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
