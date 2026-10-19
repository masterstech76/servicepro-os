"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, CalendarOff, Plus, Trash2, UserPlus, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneLink } from "@/components/shared/PhoneLink";

interface TechRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  skills: string[];
  zip_codes: string[];
  commission_pct: number;
  color: string;
  active: boolean;
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

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminTechniciansPage() {
  const [techs, setTechs] = React.useState<TechRow[]>([]);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [commissionPct, setCommissionPct] = React.useState("20");
  const [zipList, setZipList] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const loadTechs = React.useCallback(async () => {
    const res = await fetch("/api/technicians");
    const data = (await res.json()) as { technicians: TechRow[] };
    setTechs(data.technicians ?? []);
  }, []);

  React.useEffect(() => {
    void loadTechs();
  }, [loadTechs]);

  async function handleCreateTech(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const zips = zipList
        .split(",")
        .map((z) => z.trim())
        .filter(Boolean);
      const res = await fetch("/api/technicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          commissionPct: Number(commissionPct) || 20,
          zipCodes: zips,
        }),
      });
      if (!res.ok) {
        toast.error("Could not create technician");
        return;
      }
      toast.success(`Added technician ${name}`);
      setName("");
      setPhone("");
      setEmail("");
      setZipList("");
      setShowAddModal(false);
      await loadTechs();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(tech: TechRow) {
    await fetch("/api/technicians", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tech.id, active: !tech.active }),
    });
    toast.success(
      `${tech.name} marked ${!tech.active ? "Active" : "Inactive"}`
    );
    await loadTechs();
  }

  async function addQuickTimeOff(tech: TechRow) {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    await fetch("/api/technicians", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: tech.id,
        addTimeOff: {
          startsAt: `${tomorrow}T00:00:00.000Z`,
          endsAt: `${tomorrow}T23:59:59.000Z`,
          reason: "Scheduled PTO Day",
        },
      }),
    });
    toast.success(`Added PTO block for ${tech.name}`);
    await loadTechs();
  }

  async function removeTimeOff(techId: string, timeOffId: string) {
    await fetch("/api/technicians", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: techId,
        removeTimeOffId: timeOffId,
      }),
    });
    toast.success("Removed time-off block");
    await loadTechs();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Technicians & Shifts
          </h1>
          <p className="text-xs text-navy-700">
            Manage field roster, working hours, ZIP territories, commissions, and time off
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setShowAddModal(!showAddModal)}
          className="gap-1.5"
        >
          <UserPlus className="h-4 w-4" />
          Add Technician
        </Button>
      </div>

      {showAddModal ? (
        <form
          onSubmit={handleCreateTech}
          className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-4"
        >
          <h2 className="text-base font-bold text-navy-900">
            New Field Technician
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="tech-name">Full Name</Label>
              <Input
                id="tech-name"
                required
                placeholder="Alex Morales"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tech-phone">Mobile Phone</Label>
              <Input
                id="tech-phone"
                required
                placeholder="(305) 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tech-email">Email</Label>
              <Input
                id="tech-email"
                type="email"
                required
                placeholder="alex@coolairmiami.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tech-comm">Commission (%)</Label>
              <Input
                id="tech-comm"
                type="number"
                value={commissionPct}
                onChange={(e) => setCommissionPct(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="tech-zips">
              Covered ZIP Codes (comma-separated, leave blank for all Miami ZIPs)
            </Label>
            <Input
              id="tech-zips"
              placeholder="33131, 33133, 33139"
              value={zipList}
              onChange={(e) => setZipList(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={saving}>
              Save Technician
            </Button>
          </div>
        </form>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {techs.map((tech) => (
          <div
            key={tech.id}
            className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full shrink-0"
                  style={{ backgroundColor: tech.color }}
                />
                <div>
                  <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                    {tech.name}
                    <span
                      className={`rounded-pill px-2 py-0.5 text-[11px] font-semibold ${
                        tech.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tech.active ? "Active" : "Inactive"}
                    </span>
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-navy-700 mt-0.5">
                    <PhoneLink phone={tech.phone} />
                    <span>·</span>
                    <span>{tech.email}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void toggleActive(tech)}
                className="text-xs font-semibold text-navy-700 hover:underline"
              >
                {tech.active ? "Deactivate" : "Activate"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-input bg-slate-50 p-3 text-xs">
              <div>
                <span className="text-navy-700 block">Skills</span>
                <span className="font-bold text-navy-900 uppercase">
                  {tech.skills.join(", ")}
                </span>
              </div>
              <div>
                <span className="text-navy-700 block">Commission</span>
                <span className="font-bold text-navy-900 tabular-nums">
                  {tech.commission_pct}%
                </span>
              </div>
              <div>
                <span className="text-navy-700 block">Territory</span>
                <span className="font-bold text-navy-900">
                  {tech.zip_codes.length === 0
                    ? "All Served ZIPs"
                    : `${tech.zip_codes.length} ZIPs (${tech.zip_codes[0]}–${
                        tech.zip_codes[tech.zip_codes.length - 1]
                      })`}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-navy-700 flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-orange-600" />
                Weekly Shift Schedule
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tech.hours.map((h) => (
                  <span
                    key={h.id}
                    className="rounded-input border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-navy-900"
                  >
                    <strong>{DAY_NAMES[h.day_of_week]}</strong>: {h.start_time}–
                    {h.end_time}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-navy-700 flex items-center gap-1.5">
                  <CalendarOff className="h-3.5 w-3.5 text-amber-600" />
                  Time Off ({tech.timeOff.length})
                </span>
                <button
                  type="button"
                  onClick={() => void addQuickTimeOff(tech)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add PTO Tomorrow
                </button>
              </div>
              {tech.timeOff.length === 0 ? (
                <p className="text-xs text-navy-700">No upcoming time off.</p>
              ) : (
                tech.timeOff.map((to) => (
                  <div
                    key={to.id}
                    className="flex items-center justify-between rounded bg-amber-50/70 border border-amber-200 px-3 py-1.5 text-xs"
                  >
                    <span className="text-navy-900">
                      <strong>{to.starts_at.slice(0, 10)}</strong> ·{" "}
                      {to.reason ?? "Time off"}
                    </span>
                    <button
                      type="button"
                      onClick={() => void removeTimeOff(tech.id, to.id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove time off"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
              <Link
                href={`/admin/technicians/${tech.id}`}
                className="inline-flex items-center gap-1 text-navy-800 hover:text-orange-600"
              >
                <Wrench className="h-3.5 w-3.5 text-orange-600" />
                Profile & Details &rarr;
              </Link>
              <Link
                href={`/admin/technicians/${tech.id}/schedule`}
                className="inline-flex items-center gap-1 text-navy-800 hover:text-orange-600"
              >
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                Shift Roster &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
