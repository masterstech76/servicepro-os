"use client";

import * as React from "react";
import Link from "next/link";
import {
  Tag,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import { toast } from "sonner";
import type { AdminCouponItem } from "@/lib/server/admin-portal";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<AdminCouponItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Form fields
  const [code, setCode] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"fixed" | "percentage">("fixed");
  const [discountValueDollars, setDiscountValueDollars] = React.useState("25");
  const [minSpendDollars, setMinSpendDollars] = React.useState("89");
  const [expiresAt, setExpiresAt] = React.useState("2026-12-31");

  const tz = businessConfig.timezone;

  const loadCoupons = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const json = await res.json();
        setCoupons(json.coupons || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  async function handleToggle(couponId: string) {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: couponId }),
      });
      if (res.ok) {
        toast.success("Coupon status updated");
        await loadCoupons();
      }
    } catch {
      toast.error("Failed to update coupon");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          description,
          discountType,
          discountValue: discountType === "fixed" ? Math.round(Number(discountValueDollars) * 100) : Number(discountValueDollars),
          minSpendCents: Math.round(Number(minSpendDollars) * 100),
          expiresAt: new Date(expiresAt + "T23:59:59").toISOString(),
        }),
      });

      if (res.ok) {
        toast.success(`Coupon ${code.toUpperCase()} created!`);
        setModalOpen(false);
        setCode("");
        setDescription("");
        await loadCoupons();
      } else {
        const json = await res.json();
        toast.error(json.error?.message || "Failed to create coupon");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight flex items-center gap-2">
            <Tag className="h-6 w-6 text-orange-500" />
            Coupon &amp; Discount Management
          </h1>
          <p className="text-xs text-navy-600 mt-1">
            Configure promotional promo codes for seasonal campaigns and customer bookings.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create New Coupon
        </Button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-navy-700 uppercase font-bold tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Min Spend</th>
                <th className="px-4 py-3">Redemptions</th>
                <th className="px-4 py-3">Expiry Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading promotional coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No promo coupons registered.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-black text-navy-900 bg-orange-50 text-orange-700 px-2.5 py-1 rounded-lg border border-orange-200 text-xs">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs font-medium text-navy-800">
                      {c.description}
                    </td>
                    <td className="px-4 py-3 font-bold text-navy-900">
                      {c.discountType === "fixed" ? formatMoney(c.discountValue) : `${c.discountValue}% Off`}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatMoney(c.minSpendCents)}
                    </td>
                    <td className="px-4 py-3 font-bold text-navy-800">
                      {c.redemptionCount} times
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatInTimeZone(new Date(c.expiresAt), tz, "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {c.active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(c.id)}
                        className={`h-7 px-2.5 text-xs font-bold rounded-lg ${
                          c.active ? "border-slate-300 text-navy-700" : "border-emerald-300 text-emerald-700"
                        }`}
                      >
                        {c.active ? "Disable" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-navy-900">Create Promotional Coupon</h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-navy-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER30"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-navy-700 block mb-1">Offer Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. $30 off AC Tune-Up Diagnostic"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="fixed">Fixed Dollar ($)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-navy-700 block mb-1">Discount Amount</label>
                  <input
                    type="number"
                    required
                    value={discountValueDollars}
                    onChange={(e) => setDiscountValueDollars(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-700 block mb-1">Min Order ($)</label>
                  <input
                    type="number"
                    value={minSpendDollars}
                    onChange={(e) => setMinSpendDollars(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy-700 block mb-1">Expiration Date</label>
                  <input
                    type="date"
                    required
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  {submitting ? "Saving..." : "Create Coupon"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
