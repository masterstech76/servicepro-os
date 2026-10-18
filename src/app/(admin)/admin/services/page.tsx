"use client";

import * as React from "react";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Money } from "@/components/shared/Money";

interface ServiceRow {
  id: string;
  name: string;
  description: string;
  category: string;
  skill_tag: string;
  pricing_type: "flat" | "hourly";
  price_cents: number;
  duration_minutes: number;
  min_billable_minutes: number;
  active: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = React.useState<ServiceRow[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [pricingType, setPricingType] = React.useState<"flat" | "hourly">("flat");
  const [priceDollars, setPriceDollars] = React.useState("129");
  const [durationMinutes, setDurationMinutes] = React.useState("60");

  const loadServices = React.useCallback(async () => {
    const res = await fetch("/api/admin/catalog");
    const data = (await res.json()) as { services: ServiceRow[] };
    setServices(data.services ?? []);
  }, []);

  React.useEffect(() => {
    void loadServices();
  }, [loadServices]);

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upsert_service",
        payload: {
          name,
          description: desc,
          pricing_type: pricingType,
          price_cents: Math.round(Number(priceDollars) * 100),
          duration_minutes: Number(durationMinutes) || 60,
        },
      }),
    });
    toast.success(`Added service ${name}`);
    setName("");
    setDesc("");
    setShowForm(false);
    await loadServices();
  }

  async function toggleServiceActive(svc: ServiceRow) {
    await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upsert_service",
        payload: { id: svc.id, active: !svc.active },
      }),
    });
    toast.success(`${svc.name} ${!svc.active ? "enabled" : "disabled"}`);
    await loadServices();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Service Catalog</h1>
          <p className="text-xs text-navy-700">
            Configure flat-rate and hourly services, durations, and skill requirements
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSaveService}
          className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-4"
        >
          <h2 className="text-base font-bold text-navy-900">New Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="svc-name">Service Name</Label>
              <Input
                id="svc-name"
                required
                placeholder="Emergency Coil Replacement"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="svc-pricing">Pricing Model</Label>
              <select
                id="svc-pricing"
                value={pricingType}
                onChange={(e) =>
                  setPricingType(e.target.value as "flat" | "hourly")
                }
                className="mt-1 block w-full rounded-input border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-900"
              >
                <option value="flat">Flat Rate</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>
            <div>
              <Label htmlFor="svc-price">Price ($)</Label>
              <Input
                id="svc-price"
                type="number"
                required
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="svc-desc">Customer Description</Label>
              <Input
                id="svc-desc"
                required
                placeholder="Includes full diagnostic, safety check, and cleanup."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="svc-dur">Duration (Minutes)</Label>
              <Input
                id="svc-dur"
                type="number"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Service
            </Button>
          </div>
        </form>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="rounded-card border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-pill bg-orange-50 px-2.5 py-0.5 text-xs font-bold uppercase text-orange-800">
                  <Sparkles className="h-3 w-3" />
                  {svc.category} · {svc.skill_tag}
                </span>
                <span
                  className={`rounded-pill px-2 py-0.5 text-[11px] font-semibold ${
                    svc.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {svc.active ? "Active" : "Hidden"}
                </span>
              </div>
              <h2 className="text-base font-bold text-navy-900">{svc.name}</h2>
              <p className="text-xs text-navy-700">{svc.description}</p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-navy-900">
                  <Money cents={svc.price_cents} />
                  {svc.pricing_type === "hourly" ? "/hr" : ""}
                </span>
                <span className="block text-xs text-navy-700">
                  {svc.duration_minutes} min window · {svc.pricing_type}
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => void toggleServiceActive(svc)}
              >
                {svc.active ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
