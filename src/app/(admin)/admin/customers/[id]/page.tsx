"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
  DollarSign,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

interface CustomerDetailResponse {
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    cardBrand: string | null;
    cardLast4: string | null;
    smsOptOut: boolean;
    createdAt: string;
  };
  stats: {
    jobsCount: number;
    completedCount: number;
    totalSpentCents: number;
  };
  addresses: Array<{
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
  }>;
  jobs: EnrichedJob[];
}

export default function AdminCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const customerId = params?.id ?? "";

  const [detail, setDetail] = React.useState<CustomerDetailResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const loadCustomer = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(customerId)}`);
      if (res.ok) {
        const data = (await res.json()) as CustomerDetailResponse;
        setDetail(data);
        setName(data.customer.name);
        setPhone(data.customer.phone);
        setEmail(data.customer.email || "");
      }
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  React.useEffect(() => {
    void loadCustomer();
  }, [loadCustomer]);

  async function handleUpdateContact(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(customerId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
        }),
      });

      if (res.ok) {
        toast.success("Customer contact details updated!");
        setEditing(false);
        await loadCustomer();
      } else {
        toast.error("Failed to update customer");
      }
    } catch {
      toast.error("Network error updating customer");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !detail) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  const { customer, stats, addresses, jobs } = detail;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-navy-800 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-navy-950">{customer.name}</h1>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-navy-800">
                Customer 360
              </span>
            </div>
            <p className="text-xs text-navy-600">
              Account registered {new Date(customer.createdAt).toLocaleDateString()} · ID: {customer.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditing(!editing)}
            className="text-xs font-bold rounded-xl"
          >
            {editing ? "Cancel Editing" : "Edit Profile"}
          </Button>
          <a
            href={`tel:${customer.phone}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-navy-800"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-400" />
            Call Customer
          </a>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
            Total Lifetime Spend
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {formatMoney(stats.totalSpentCents)}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
            Total Service Visits
          </span>
          <span className="text-2xl font-black text-navy-900 mt-1 block">
            {stats.jobsCount}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-500 block">
            Completed Visits
          </span>
          <span className="text-2xl font-black text-navy-900 mt-1 block">
            {stats.completedCount}
          </span>
        </div>
      </div>

      {/* Profile & Service Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Info / Edit Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy-700">
            Contact & Billing Profile
          </h2>

          {editing ? (
            <form onSubmit={handleUpdateContact} className="space-y-3 text-xs">
              <div>
                <label className="text-navy-700 font-bold block mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-navy-900"
                />
              </div>

              <div>
                <label className="text-navy-700 font-bold block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-navy-900"
                />
              </div>

              <div>
                <label className="text-navy-700 font-bold block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-navy-900"
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-orange-500 py-2 text-xs font-bold text-navy-950 hover:bg-orange-400"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-navy-800">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="font-semibold">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-navy-800">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{customer.email || "No email provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-navy-800">
                <CreditCard className="h-4 w-4 text-slate-400" />
                <span>
                  {customer.cardBrand ? (
                    <>
                      {customer.cardBrand.toUpperCase()} ending in •••• {customer.cardLast4}
                    </>
                  ) : (
                    "No card on file"
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-navy-600">SMS Notifications:</span>
                <span
                  className={`font-bold ${
                    customer.smsOptOut ? "text-rose-600" : "text-emerald-700"
                  }`}
                >
                  {customer.smsOptOut ? "Opted Out" : "Subscribed & Verified"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Saved Service Addresses */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-700">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span>Service Properties ({addresses.length})</span>
          </div>

          {addresses.length === 0 ? (
            <p className="text-xs text-navy-500 italic py-2">No service addresses recorded.</p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs"
                >
                  <span className="font-bold text-navy-900 block">{addr.addressLine1}</span>
                  <span className="text-navy-600">
                    {addr.city}, {addr.state} {addr.zip}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Appointment History */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-navy-950">
            Work Orders & Service History ({jobs.length})
          </h3>
        </div>

        {jobs.length === 0 ? (
          <p className="text-xs text-navy-500 italic py-4">No appointments recorded.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-navy-900">
                      #{job.jobNumber}
                    </span>
                    <StatusBadge status={job.status} />
                    <span className="text-navy-500">
                      {new Date(job.scheduledStart).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-navy-900">{job.service.name}</h4>
                  <p className="text-navy-600">
                    Tech: {job.technician?.name || "Unassigned"} · {job.addressLine1}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-navy-900">
                    {formatMoney(job.totalCents || job.estimatedTotalCents)}
                  </span>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-navy-900 hover:bg-slate-100"
                  >
                    Inspect &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
