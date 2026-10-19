"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  History,
  Package,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InventoryAuditRecord } from "@/lib/server/admin-portal";

export default function AdminInventoryTransactionsPage() {
  const [audits, setAudits] = React.useState<InventoryAuditRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterType, setFilterType] = React.useState<string>("all");

  const loadTransactions = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/transactions");
      if (res.ok) {
        const json = await res.json();
        setAudits(json.audits || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const filtered = audits.filter(
    (a) => filterType === "all" || a.type === filterType
  );

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
            <h1 className="text-2xl font-bold text-navy-950">Inventory Audit Movements</h1>
            <p className="text-xs text-navy-600">
              Immutable log of stock adjustments, restocks, and field van consumptions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/inventory/parts"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 hover:bg-slate-50"
          >
            <Package className="h-4 w-4 text-orange-600" />
            Parts Catalog
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void loadTransactions()}
            className="h-9 w-9 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-navy-700">Movement Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1 font-bold text-navy-900 focus:outline-none"
          >
            <option value="all">All Movements</option>
            <option value="adjustment">Manual Adjustments</option>
            <option value="restock">Restocks / Shipments</option>
            <option value="van_consumption">Field Consumptions</option>
            <option value="van_return">Truck Returns</option>
          </select>
        </div>

        <span className="font-bold text-navy-600">
          {filtered.length} Audit Records
        </span>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-navy-600">
            Loading inventory audit records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-navy-500">
            No audit records recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-navy-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Item & SKU</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Qty Change</th>
                  <th className="px-4 py-3 text-right">Previous ➔ New</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Reason & Authorizer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-navy-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] font-bold text-orange-600 block">
                        {item.sku}
                      </span>
                      <span className="font-bold text-navy-950">{item.partName}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          item.type === "restock"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.type === "adjustment"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {item.type.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold">
                      <span
                        className={
                          item.quantityChange > 0 ? "text-emerald-700" : "text-rose-600"
                        }
                      >
                        {item.quantityChange > 0 ? `+${item.quantityChange}` : item.quantityChange}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-mono text-navy-700">
                      {item.previousQuantity} ➔ {item.newQuantity}
                    </td>

                    <td className="px-4 py-3 capitalize font-semibold text-navy-800">
                      {item.location}
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy-900">{item.reason}</p>
                      <p className="text-[10px] text-navy-500 mt-0.5">By {item.actor}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
