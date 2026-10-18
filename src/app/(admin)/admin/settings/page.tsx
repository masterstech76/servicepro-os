"use client";

import * as React from "react";
import { CalendarX, Save, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  timezone: string;
  tax_rate_bps: number;
  deposit_pct: number;
  buffer_minutes: number;
  cancellation_window_hours: number;
}

interface ClosureRow {
  id: string;
  closed_on: string;
  reason: string | null;
}

export default function AdminSettingsPage() {
  const [biz, setBiz] = React.useState<BusinessRow | null>(null);
  const [closures, setClosures] = React.useState<ClosureRow[]>([]);
  const [closedOn, setClosedOn] = React.useState("");
  const [closureReason, setClosureReason] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const loadSettings = React.useCallback(async () => {
    const res = await fetch("/api/admin/catalog");
    const data = (await res.json()) as {
      business: BusinessRow;
      closures: ClosureRow[];
    };
    setBiz(data.business);
    setClosures(data.closures ?? []);
  }, []);

  React.useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  async function handleSaveBusiness(e: React.FormEvent) {
    e.preventDefault();
    if (!biz) return;
    setSaving(true);
    try {
      await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_business",
          payload: biz,
        }),
      });
      toast.success("Business settings updated");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddClosure(e: React.FormEvent) {
    e.preventDefault();
    if (!closedOn) return;
    await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_closure",
        payload: { closed_on: closedOn, reason: closureReason || "Holiday" },
      }),
    });
    toast.success(`Added shop closure on ${closedOn}`);
    setClosedOn("");
    setClosureReason("");
    await loadSettings();
  }

  if (!biz) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          Business Settings & Policies
        </h1>
        <p className="text-xs text-navy-700">
          Configure white-label shop details, tax rates, booking deposits, travel buffers, and holiday closures
        </p>
      </div>

      <form
        onSubmit={handleSaveBusiness}
        className="rounded-card border border-slate-200 bg-white p-6 shadow-sm space-y-4"
      >
        <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
          <SettingsIcon className="h-4 w-4 text-orange-600" />
          Shop Profile & Financial Rules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="biz-name">Business Name</Label>
            <Input
              id="biz-name"
              value={biz.name}
              onChange={(e) => setBiz({ ...biz, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="biz-phone">Dispatch Phone</Label>
            <Input
              id="biz-phone"
              value={biz.phone}
              onChange={(e) => setBiz({ ...biz, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="biz-email">Support Email</Label>
            <Input
              id="biz-email"
              value={biz.email}
              onChange={(e) => setBiz({ ...biz, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <Label htmlFor="biz-dep">Deposit Percentage (%)</Label>
            <Input
              id="biz-dep"
              type="number"
              value={biz.deposit_pct}
              onChange={(e) =>
                setBiz({ ...biz, deposit_pct: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="biz-tax">Parts Tax (Basis Points, 700 = 7%)</Label>
            <Input
              id="biz-tax"
              type="number"
              value={biz.tax_rate_bps}
              onChange={(e) =>
                setBiz({ ...biz, tax_rate_bps: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="biz-buf">Travel Buffer (Minutes)</Label>
            <Input
              id="biz-buf"
              type="number"
              value={biz.buffer_minutes}
              onChange={(e) =>
                setBiz({ ...biz, buffer_minutes: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="biz-cancel">Free Cancel Window (Hours)</Label>
            <Input
              id="biz-cancel"
              type="number"
              value={biz.cancellation_window_hours}
              onChange={(e) =>
                setBiz({
                  ...biz,
                  cancellation_window_hours: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="sm" loading={saving} className="gap-1.5">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </form>

      <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
          <CalendarX className="h-4 w-4 text-orange-600" />
          Holiday & Emergency Closures
        </h2>

        <form onSubmit={handleAddClosure} className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="closure-date">Closure Date</Label>
            <Input
              id="closure-date"
              type="date"
              required
              value={closedOn}
              onChange={(e) => setClosedOn(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="closure-reason">Reason</Label>
            <Input
              id="closure-reason"
              placeholder="Independence Day / Hurricane Watch"
              value={closureReason}
              onChange={(e) => setClosureReason(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" size="md">
            + Block Date
          </Button>
        </form>

        <div className="space-y-2">
          {closures.length === 0 ? (
            <p className="text-xs text-navy-700">No full-day closures scheduled.</p>
          ) : (
            closures.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-input border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs"
              >
                <span>
                  <strong>{c.closed_on}</strong> — {c.reason}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
