"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  History,
  Layers,
  Search,
  Plus,
  Truck,
  DollarSign,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import type { CentralPartItem } from "@/lib/server/admin-portal";

interface InventoryOverviewData {
  totalSkus: number;
  totalWarehouseUnits: number;
  totalValuationCostCents: number;
  totalValuationRetailCents: number;
  lowStockCount: number;
  parts: CentralPartItem[];
}

export default function AdminInventoryOverviewPage() {
  const [data, setData] = React.useState<InventoryOverviewData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadOverview = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  const lowStockParts = data.parts.filter(
    (p) => p.warehouseQuantity <= p.minWarehouseQuantity
  );

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Central Inventory & Supply</h1>
          <p className="text-xs text-navy-600">
            Warehouse stock control, SKU valuation, and parts movement audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/inventory/parts"
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-navy-950 shadow-sm hover:bg-orange-400"
          >
            <Package className="h-4 w-4" />
            Manage Parts Catalog
          </Link>
          <Link
            href="/admin/inventory/transactions"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50"
          >
            <History className="h-4 w-4 text-orange-600" />
            Audit Movements
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500">
              Active SKUs
            </span>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>
          <span className="text-2xl font-black text-navy-900 mt-1 block">
            {data.totalSkus}
          </span>
          <span className="text-[11px] text-navy-600 font-semibold mt-0.5 block">
            Across 6 categories
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500">
              Warehouse Stock
            </span>
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-navy-900 mt-1 block">
            {data.totalWarehouseUnits}
          </span>
          <span className="text-[11px] text-navy-600 font-semibold mt-0.5 block">
            Total units in depot
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500">
              Valuation (Cost)
            </span>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <span className="text-2xl font-black text-navy-900 mt-1 block">
            {formatMoney(data.totalValuationCostCents)}
          </span>
          <span className="text-[11px] text-navy-600 font-semibold mt-0.5 block">
            Asset book value
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500">
              Low Stock Alerts
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <span
            className={`text-2xl font-black mt-1 block ${
              data.lowStockCount > 0 ? "text-amber-600" : "text-emerald-700"
            }`}
          >
            {data.lowStockCount}
          </span>
          <span className="text-[11px] text-navy-600 font-semibold mt-0.5 block">
            Below reorder min
          </span>
        </div>
      </div>

      {/* Critical Reorder Warnings */}
      {lowStockParts.length > 0 ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {lowStockParts.length} {lowStockParts.length === 1 ? "SKU requires" : "SKUs require"} purchase order reordering:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {lowStockParts.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-amber-200 bg-white p-2.5 text-xs flex justify-between items-center"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-orange-600 block">
                    {p.sku}
                  </span>
                  <span className="font-bold text-navy-900 line-clamp-1">{p.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-amber-700 block">
                    {p.warehouseQuantity} {p.unit}
                  </span>
                  <span className="text-[10px] text-navy-500">Min: {p.minWarehouseQuantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Parts Quick Preview Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-navy-950">Central Inventory Catalog</h3>
            <p className="text-xs text-navy-500">Showing top warehouse SKUs</p>
          </div>
          <Link
            href="/admin/inventory/parts"
            className="text-xs font-bold text-orange-600 hover:text-orange-700"
          >
            View All Parts &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {data.parts.slice(0, 7).map((p) => (
            <div
              key={p.id}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded">
                    {p.sku}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-navy-500">
                    {p.category}
                  </span>
                </div>
                <span className="font-bold text-navy-900">{p.name}</span>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="font-bold text-navy-900 block">
                    {p.warehouseQuantity} {p.unit}
                  </span>
                  <span className="text-[10px] text-navy-500">
                    Min: {p.minWarehouseQuantity}
                  </span>
                </div>
                <span className="font-bold text-navy-900">
                  {formatMoney(p.unitPriceCents)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
