"use client";

import * as React from "react";
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building,
  Home,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomerAddress } from "@/lib/server/customer-portal";

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<CustomerAddress[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // New address modal state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [label, setLabel] = React.useState("Primary Residence");
  const [line1, setLine1] = React.useState("");
  const [line2, setLine2] = React.useState("");
  const [city, setCity] = React.useState("Miami");
  const [state, setState] = React.useState("FL");
  const [zip, setZip] = React.useState("33131");
  const [isDefault, setIsDefault] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const fetchAddresses = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/addresses");
      if (!res.ok) throw new Error("Failed to load saved addresses");
      const data = await res.json();
      setAddresses(data.addresses || []);
    } catch (err: any) {
      setError(err.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!line1.trim() || !zip.trim()) {
      toast.error("Please fill in the street address and ZIP code.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          line1,
          line2: line2 || null,
          city,
          state,
          zip,
          isDefault,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Failed to save address");
      }

      toast.success("Address added successfully");
      setShowAddModal(false);
      setLine1("");
      setLine2("");
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(addressId: string) {
    if (!confirm("Are you sure you want to remove this service address?")) return;

    try {
      const res = await fetch(`/api/account/addresses?id=${encodeURIComponent(addressId)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete address");
      toast.success("Address removed");
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
            Saved Service Locations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your home, rental properties, and commercial service addresses for 1-click dispatch.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs sm:text-sm shadow-md"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Add New Address</span>
        </Button>
      </div>

      {/* Address Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-800">
          {error}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
          <MapPin className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-navy-900 text-base">No Saved Addresses</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your primary residence or service property to streamline future HVAC service bookings.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs"
          >
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm space-y-3 relative transition-all ${
                addr.isDefault ? "border-orange-400 ring-2 ring-orange-100" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Home className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-navy-900">{addr.label}</h3>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-orange-600">
                        Primary Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Area</span>
                  </span>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-navy-900 text-sm">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""}
                </p>
                <p className="text-slate-500">
                  {addr.city}, {addr.state} {addr.zip}
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Miami-Dade Dispatch Zone • Direct Coverage
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-navy-900">Add Service Location</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-navy-900 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3.5">
              <div>
                <Label htmlFor="addr-label" className="text-xs font-bold text-slate-700">
                  Location Label *
                </Label>
                <Input
                  id="addr-label"
                  required
                  placeholder="e.g. Primary Home, Condo, Rental Unit"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="addr-line1" className="text-xs font-bold text-slate-700">
                  Street Address *
                </Label>
                <Input
                  id="addr-line1"
                  required
                  placeholder="123 Brickell Ave"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="addr-line2" className="text-xs font-bold text-slate-700">
                  Unit / Suite / Apt (Optional)
                </Label>
                <Input
                  id="addr-line2"
                  placeholder="Apt 14B"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="addr-city" className="text-xs font-bold text-slate-700">
                    City *
                  </Label>
                  <Input
                    id="addr-city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="addr-state" className="text-xs font-bold text-slate-700">
                    State *
                  </Label>
                  <Input
                    id="addr-state"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="addr-zip" className="text-xs font-bold text-slate-700">
                    ZIP Code *
                  </Label>
                  <Input
                    id="addr-zip"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span>Set as primary default dispatch address</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  disabled={saving}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  loading={saving}
                  className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs"
                >
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
