"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  History,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import type { CentralPartItem } from "@/lib/server/admin-portal";

export default function AdminInventoryPartsPage() {
  const [parts, setParts] = React.useState<CentralPartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  // Adjustment Modal State
  const [selectedPart, setSelectedPart] = React.useState<CentralPartItem | null>(null);
  const [adjustmentQty, setAdjustmentQty] = React.useState<number>(1);
  const [adjustmentType, setAdjustmentType] = React.useState<"add" | "remove">("add");
  const [reason, setReason] = React.useState("");
  const [adjusting, setAdjusting] = React.useState(false);

  const loadParts = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/parts");
      if (res.ok) {
        const json = await res.json();
        setParts(json.parts || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadParts();
  }, [loadParts]);

  const filtered = parts.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  async function handleAdjustStock(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPart) return;
    if (!reason.trim() || reason.trim().length < 5) {
      toast.error("A detailed reason (at least 5 characters) is required for audit records");
      return;
    }

    const delta = adjustmentType === "add" ? adjustmentQty : -adjustmentQty;
    if (selectedPart.warehouseQuantity + delta < 0) {
      toast.error(
        `Adjustment would cause negative inventory! Available: ${selectedPart.warehouseQuantity}`
      );
      return;
    }

    setAdjusting(true);
    try {
      const res = await fetch("/api/admin/inventory/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partId: selectedPart.id,
          adjustmentQuantity: delta,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to adjust stock");
        return;
      }

      toast.success(
        `Stock updated for ${selectedPart.sku}! New quantity: ${data.part?.warehouseQuantity}`
      );
      setSelectedPart(null);
      setReason("");
      setAdjustmentQty(1);
      await loadParts();
    } catch {
      toast.error("Network error during stock adjustment");
    } finally {
      setAdjusting(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-navy-800 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy-950">Parts Catalog & Stock</h1>
            <p className="text-xs text-navy-600">
              Manage warehouse SKUs, price schedules, and stock adjustments
            </p>
          </div>
        </div>

        <Link
          href="/admin/inventory/transactions"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50"
        >
          <History className="h-4 w-4 text-orange-600" />
          Audit Movements Trail
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by part name or SKU (e.g. CAP, 410A, Contactor)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 pl-9 pr-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="electrical">Electrical</option>
              <option value="refrigerant">Refrigerant</option>
              <option value="motors">Motors</option>
              <option value="controls">Controls</option>
              <option value="piping">Piping & Traps</option>
              <option value="safety">Safety Switches</option>
            </select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadParts()}
              className="h-9 w-9 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Parts Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-navy-600">
            Loading central inventory catalog...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-navy-500">
            No matching inventory items found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-navy-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">SKU & Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Warehouse Stock</th>
                  <th className="px-4 py-3 text-right">Min Reorder</th>
                  <th className="px-4 py-3 text-right">Cost</th>
                  <th className="px-4 py-3 text-right">Retail Price</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const isLow = p.warehouseQuantity <= p.minWarehouseQuantity;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] font-bold text-orange-600 block">
                          {p.sku}
                        </span>
                        <span className="font-bold text-navy-950 text-xs">{p.name}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-700">
                          {p.category}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-xs">
                        <span
                          className={
                            p.warehouseQuantity === 0
                              ? "text-rose-600 font-black"
                              : isLow
                              ? "text-amber-600"
                              : "text-navy-900"
                          }
                        >
                          {p.warehouseQuantity} {p.unit}
                        </span>
                        {isLow ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-600 font-bold ml-1.5">
                            <AlertTriangle className="h-3 w-3" />
                            Low
                          </span>
                        ) : null}
                      </td>

                      <td className="px-4 py-3 text-right text-navy-500 font-mono">
                        {p.minWarehouseQuantity} {p.unit}
                      </td>

                      <td className="px-4 py-3 text-right text-navy-600 font-semibold">
                        {formatMoney(p.unitCostCents)}
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-navy-950">
                        {formatMoney(p.unitPriceCents)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            setSelectedPart(p);
                            setAdjustmentQty(1);
                            setReason("");
                          }}
                          className="h-7 rounded-lg bg-navy-900 px-2.5 text-[11px] font-bold text-white hover:bg-navy-800"
                        >
                          Adjust Stock
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {selectedPart ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-orange-600">
                  {selectedPart.sku}
                </span>
                <h3 className="text-base font-bold text-navy-950">{selectedPart.name}</h3>
                <p className="text-xs text-navy-500">
                  Current warehouse stock: <strong>{selectedPart.warehouseQuantity} {selectedPart.unit}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPart(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div>
                <label className="text-navy-700 font-bold block mb-1">Adjustment Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType("add")}
                    className={`rounded-xl py-2 font-bold transition-colors ${
                      adjustmentType === "add"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-navy-800 hover:bg-slate-50"
                    }`}
                  >
                    + Add Inventory (Restock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType("remove")}
                    className={`rounded-xl py-2 font-bold transition-colors ${
                      adjustmentType === "remove"
                        ? "bg-rose-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-navy-800 hover:bg-slate-50"
                    }`}
                  >
                    - Deduct Inventory (Write-off)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-navy-700 font-bold block mb-1">
                  Quantity ({selectedPart.unit}):
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-sm text-navy-950"
                />
              </div>

              <div>
                <label className="text-navy-700 font-bold block mb-1">
                  Mandatory Audit Reason (min 5 chars) *:
                </label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Received shipment PO-8831 from Lennox supply depot..."
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedPart(null)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={adjusting}
                  className="rounded-xl bg-orange-500 px-5 text-xs font-bold text-navy-950 hover:bg-orange-400"
                >
                  {adjusting ? "Recording..." : "Confirm Stock Adjustment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
