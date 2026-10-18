"use client";

import * as React from "react";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Money } from "@/components/shared/Money";

interface AreaRow {
  id: string;
  zip: string;
  city: string;
  state: string;
  surcharge_cents: number;
  active: boolean;
}

export default function AdminServiceAreasPage() {
  const [areas, setAreas] = React.useState<AreaRow[]>([]);
  const [newZip, setNewZip] = React.useState("");
  const [surchargeDollars, setSurchargeDollars] = React.useState("0");

  const loadAreas = React.useCallback(async () => {
    const res = await fetch("/api/admin/catalog");
    const data = (await res.json()) as { serviceAreas: AreaRow[] };
    setAreas(data.serviceAreas ?? []);
  }, []);

  React.useEffect(() => {
    void loadAreas();
  }, [loadAreas]);

  async function handleAddZip(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upsert_zip",
        payload: {
          zip: newZip.trim(),
          surcharge_cents: Math.round(Number(surchargeDollars) * 100),
          active: true,
        },
      }),
    });
    if (!res.ok) {
      toast.error("Please enter a valid 5-digit US ZIP code");
      return;
    }
    toast.success(`Added ZIP code ${newZip}`);
    setNewZip("");
    setSurchargeDollars("0");
    await loadAreas();
  }

  async function toggleZipActive(area: AreaRow) {
    await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upsert_zip",
        payload: {
          zip: area.zip,
          surcharge_cents: area.surcharge_cents,
          active: !area.active,
        },
      }),
    });
    toast.success(`ZIP ${area.zip} ${!area.active ? "activated" : "paused"}`);
    await loadAreas();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          Service Areas & ZIP Codes
        </h1>
        <p className="text-xs text-navy-700">
          Manage served Miami-Dade ZIP codes and island/bridge travel surcharges
        </p>
      </div>

      <form
        onSubmit={handleAddZip}
        className="rounded-card border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row items-end gap-4"
      >
        <div className="w-full sm:w-48">
          <Label htmlFor="new-zip">5-Digit US ZIP Code</Label>
          <Input
            id="new-zip"
            required
            maxLength={5}
            placeholder="33154"
            value={newZip}
            onChange={(e) => setNewZip(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Label htmlFor="zip-surcharge">Travel Surcharge ($)</Label>
          <Input
            id="zip-surcharge"
            type="number"
            step="1"
            value={surchargeDollars}
            onChange={(e) => setSurchargeDollars(e.target.value)}
          />
        </div>
        <Button type="submit" size="md" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add / Update ZIP
        </Button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {areas.map((a) => (
          <div
            key={a.id}
            className={`rounded-card border p-3.5 shadow-sm flex flex-col justify-between gap-2 ${
              a.active
                ? "border-slate-200 bg-white"
                : "border-slate-200 bg-slate-100 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-bold text-navy-900 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-orange-600" />
                {a.zip}
              </span>
              <button
                type="button"
                onClick={() => void toggleZipActive(a)}
                className={`text-[11px] font-semibold underline ${
                  a.active ? "text-emerald-700" : "text-slate-600"
                }`}
              >
                {a.active ? "Active" : "Paused"}
              </button>
            </div>
            <div className="text-xs text-navy-700">
              {a.city}, {a.state}
              {a.surcharge_cents > 0 ? (
                <span className="block text-[11px] font-semibold text-orange-700">
                  +<Money cents={a.surcharge_cents} /> surcharge
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
