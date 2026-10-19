"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  History,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import type { VanPartItem, InventoryMovement } from "@/lib/server/tech-portal";
import type { EnrichedJob } from "@/lib/server/operations";

export default function JobPartsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "";

  const [job, setJob] = React.useState<EnrichedJob | null>(null);
  const [vanStock, setVanStock] = React.useState<VanPartItem[]>([]);
  const [movements, setMovements] = React.useState<InventoryMovement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Consume modal/action state
  const [selectedPart, setSelectedPart] = React.useState<VanPartItem | null>(null);
  const [actionQuantity, setActionQuantity] = React.useState<number>(1);
  const [actionNotes, setActionNotes] = React.useState("");

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [jobRes, partsRes] = await Promise.all([
        fetch(`/api/jobs/${encodeURIComponent(jobId)}`),
        fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/parts`),
      ]);

      if (jobRes.ok) {
        const jobData = await jobRes.json();
        setJob(jobData.job);
      }

      if (partsRes.ok) {
        const partsData = await partsRes.json();
        setVanStock(partsData.vanInventory || []);
        setMovements(partsData.movements || []);
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleLogPart(action: "consume" | "return") {
    if (!selectedPart) return;

    if (actionQuantity <= 0) {
      toast.error("Please enter a quantity greater than zero");
      return;
    }

    if (action === "consume" && actionQuantity > selectedPart.quantity) {
      toast.error(
        `Insufficient van stock! Available: ${selectedPart.quantity} ${selectedPart.unit}`
      );
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/technicians/jobs/${encodeURIComponent(jobId)}/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          partId: selectedPart.id,
          quantity: actionQuantity,
          notes: actionNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to update inventory");
        return;
      }

      toast.success(
        action === "consume"
          ? `Logged ${actionQuantity}x ${selectedPart.name} to Job #${job?.jobNumber}`
          : `Returned ${actionQuantity}x ${selectedPart.name} back to truck stock`
      );

      setSelectedPart(null);
      setActionQuantity(1);
      setActionNotes("");
      await loadData();
    } catch {
      toast.error("Network error while recording part usage");
    } finally {
      setBusy(false);
    }
  }

  const filteredStock = vanStock.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalUsedCents = movements
    .filter((m) => m.type === "consumed")
    .reduce((sum, m) => sum + m.totalCents, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />
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

      {/* Van Stock Header Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-orange-500 font-bold shadow-sm">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-navy-900">Van Truck Stock</h1>
              <p className="text-xs text-navy-600">Truck Inventory & Parts Consumption</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-navy-800">
            {vanStock.length} SKUs in Truck
          </span>
        </div>

        {/* Search & Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by part name or SKU (e.g. capacitor, 410A)..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 pl-9 pr-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
            {["all", "electrical", "refrigerant", "safety", "piping", "controls"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`capitalize px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? "bg-navy-900 text-white"
                      : "bg-slate-100 text-navy-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Parts Logged on Current Job */}
      {movements.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900">
              <History className="h-4 w-4 text-orange-600" />
              <span>Parts Logged on This Job</span>
            </div>
            <span className="text-xs font-bold text-orange-600">
              Total: {formatMoney(totalUsedCents)}
            </span>
          </div>

          <div className="space-y-2">
            {movements.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-2 text-xs"
              >
                <div>
                  <span className="font-bold text-navy-900 block">{m.partName}</span>
                  <span className="text-[10px] text-navy-500">
                    SKU: {m.sku} · {m.type === "consumed" ? "Used:" : "Returned:"}{" "}
                    {m.quantity} · {formatMoney(m.unitPriceCents)} ea
                  </span>
                  {m.notes ? (
                    <span className="text-[10px] text-slate-600 italic block">
                      Note: {m.notes}
                    </span>
                  ) : null}
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold block ${
                      m.type === "consumed" ? "text-navy-950" : "text-emerald-700"
                    }`}
                  >
                    {m.type === "consumed" ? "+" : "-"}
                    {formatMoney(m.totalCents)}
                  </span>
                  <span className="text-[9px] text-slate-500">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Van Stock Catalog Grid */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-navy-600 px-1">
          Available Van Inventory ({filteredStock.length})
        </h2>

        {filteredStock.map((part) => {
          const isLowStock = part.quantity <= part.minQuantity;

          return (
            <div
              key={part.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm space-y-2.5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                      {part.sku}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-navy-500">
                      {part.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-navy-900">{part.name}</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-navy-900 block">
                    {formatMoney(part.unitPriceCents)}
                  </span>
                  <span className="text-[10px] text-navy-500">per {part.unit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-navy-600">On Truck:</span>
                  <span
                    className={`font-bold ${
                      part.quantity === 0
                        ? "text-rose-600"
                        : isLowStock
                        ? "text-amber-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {part.quantity} {part.unit}
                  </span>
                  {isLowStock ? (
                    <span className="flex items-center text-[10px] text-amber-600 font-semibold gap-0.5">
                      <AlertTriangle className="h-3 w-3" />
                      Low
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={part.quantity <= 0}
                    onClick={() => {
                      setSelectedPart(part);
                      setActionQuantity(1);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-2.5 py-1 text-xs font-bold text-navy-950 hover:bg-orange-400 disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Use Part
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Part Usage Modal / Drawer */}
      {selectedPart ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-orange-600">
                  {selectedPart.sku}
                </span>
                <h3 className="text-sm font-bold text-navy-900">{selectedPart.name}</h3>
                <p className="text-xs text-navy-500">
                  Stock: {selectedPart.quantity} {selectedPart.unit} available
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPart(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-navy-700 font-bold block mb-1">
                  Quantity ({selectedPart.unit}):
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActionQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-navy-900 hover:bg-slate-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedPart.quantity}
                    value={actionQuantity}
                    onChange={(e) =>
                      setActionQuantity(
                        Math.max(1, Math.min(selectedPart.quantity, parseInt(e.target.value) || 1))
                      )
                    }
                    className="h-9 w-16 text-center font-bold text-sm rounded-xl border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setActionQuantity((q) => Math.min(selectedPart.quantity, q + 1))
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-navy-900 hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-navy-900 ml-auto text-sm">
                    {formatMoney(actionQuantity * selectedPart.unitPriceCents)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-navy-700 font-bold block mb-1">
                  Installation / Placement Note:
                </label>
                <input
                  type="text"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g. Installed on condenser fan motor circuit"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                type="button"
                onClick={() => void handleLogPart("consume")}
                disabled={busy}
                className="w-full rounded-xl bg-orange-500 py-2.5 text-xs font-bold text-navy-950 shadow-md hover:bg-orange-400"
              >
                Log to Job
              </Button>
              <Button
                type="button"
                onClick={() => void handleLogPart("return")}
                disabled={busy}
                variant="outline"
                className="w-full rounded-xl border-slate-300 text-xs font-bold text-navy-800 hover:bg-slate-50"
              >
                Return to Van
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
