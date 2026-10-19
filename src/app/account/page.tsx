"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Wrench,
  Navigation,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { formatBusinessTime } from "@/lib/domain/format";
import { formatMoneyCents } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

export default function AccountDashboardPage() {
  const [data, setData] = React.useState<{
    customer: { id: string; name: string; email: string; phone: string; isDemo: boolean };
    metrics: { activeAppointments: number; completedServices: number; balanceDueCents: number; savedAddresses: number };
    nextAppointment: EnrichedJob | null;
    recentAppointments: EnrichedJob[];
    recentInvoices: any[];
    addresses: any[];
  } | null>(null);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDashboard = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/dashboard");
      if (res.status === 401) {
        window.location.href = "/login?redirectTo=/account";
        return;
      }
      if (!res.ok) {
        throw new Error("Unable to load customer dashboard data");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center space-y-3">
        <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
        <p className="font-bold text-red-900">Dashboard Unavailable</p>
        <p className="text-xs text-red-700">{error || "Could not retrieve account details"}</p>
        <Button onClick={fetchDashboard} size="sm" variant="outline" className="text-xs">
          Try Again
        </Button>
      </div>
    );
  }

  const { customer, metrics, nextAppointment, recentAppointments, recentInvoices } = data;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-navy-900 text-white p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-orange-500">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Customer Portal
            </span>
            {customer.isDemo && (
              <span className="px-2 py-0.2 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                Preview Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Hello, {customer.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track appointments, download invoices, and request HVAC service anytime.
          </p>
        </div>

        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-black text-xs sm:text-sm px-5 py-2.5 shadow-md shrink-0"
        >
          <Link href="/book" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Book New Service</span>
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Jobs
          </p>
          <p className="text-2xl sm:text-3xl font-black text-navy-900">
            {metrics.activeAppointments}
          </p>
          <Link
            href="/account/appointments"
            className="text-[11px] font-bold text-orange-600 hover:underline inline-flex items-center gap-0.5 pt-1"
          >
            <span>View schedule</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Completed Visits
          </p>
          <p className="text-2xl sm:text-3xl font-black text-navy-900">
            {metrics.completedServices}
          </p>
          <span className="text-[11px] text-slate-500 pt-1 block">
            Maintenance record
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Balance Due
          </p>
          <p
            className={`text-2xl sm:text-3xl font-black ${
              metrics.balanceDueCents > 0 ? "text-orange-600" : "text-emerald-600"
            }`}
          >
            {formatMoneyCents(metrics.balanceDueCents)}
          </p>
          <Link
            href="/account/invoices"
            className="text-[11px] font-bold text-orange-600 hover:underline inline-flex items-center gap-0.5 pt-1"
          >
            <span>Review invoices</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Saved Properties
          </p>
          <p className="text-2xl sm:text-3xl font-black text-navy-900">
            {metrics.savedAddresses}
          </p>
          <Link
            href="/account/addresses"
            className="text-[11px] font-bold text-orange-600 hover:underline inline-flex items-center gap-0.5 pt-1"
          >
            <span>Manage addresses</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Next Appointment Spotlight */}
      {nextAppointment ? (
        <div className="rounded-2xl border-2 border-orange-400 bg-white p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wide">
                Next Appointment • Job #{nextAppointment.jobNumber}
              </span>
              <StatusBadge status={nextAppointment.status} />
            </div>
            {nextAppointment.status === "on_the_way" && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 animate-pulse">
                <Navigation className="h-3.5 w-3.5" />
                <span>Technician En Route</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Service
              </p>
              <h3 className="text-lg font-bold text-navy-900">
                {nextAppointment.service.name}
              </h3>
              <p className="text-xs text-slate-600">
                {nextAppointment.issueText || "Scheduled inspection & tune-up"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Date & Arrival Window
              </p>
              <p className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-orange-500" />
                <span>{format(new Date(nextAppointment.scheduledStart), "EEEE, MMMM d, yyyy")}</span>
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {formatBusinessTime(nextAppointment.scheduledStart)} – {formatBusinessTime(nextAppointment.scheduledEnd)}
                </span>
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Service Address
              </p>
              <p className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>{nextAppointment.addressLine1}</span>
              </p>
              <p className="text-xs text-slate-600">
                {nextAppointment.city}, {nextAppointment.state} {nextAppointment.zip}
              </p>
            </div>
          </div>

          {/* Assigned Technician Banner */}
          {nextAppointment.technician && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-navy-900 text-orange-500 font-bold flex items-center justify-center text-sm shadow-sm">
                  {nextAppointment.technician.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-bold text-navy-900">
                    Assigned Tech: {nextAppointment.technician.name}
                  </p>
                  <p className="text-slate-500 text-[11px]">Licensed HVAC Field Technician</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  asChild
                  size="sm"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs"
                >
                  <Link href={`/account/appointments/${nextAppointment.id}/track`}>
                    <Navigation className="h-3.5 w-3.5 mr-1 text-orange-400" />
                    <span>Track Technician</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs font-bold border-slate-300 text-navy-900"
                >
                  <Link href={`/account/appointments/${nextAppointment.id}`}>
                    Details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-navy-900">No Upcoming Appointments</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don&apos;t have any active service appointments scheduled. Need an AC diagnostic or seasonal tune-up?
          </p>
          <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs">
            <Link href="/book">Book Service Online</Link>
          </Button>
        </div>
      )}

      {/* Two Column Grid: Recent Appointments & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-navy-900">Recent Appointments</h2>
            <Link
              href="/account/appointments"
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No appointment history found.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentAppointments.map((job) => (
                <div key={job.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-navy-900">{job.service.name}</p>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Job #{job.jobNumber} • {format(new Date(job.scheduledStart), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Link
                    href={`/account/appointments/${job.id}`}
                    className="text-xs font-bold text-slate-600 hover:text-navy-900 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-navy-900">Recent Invoices</h2>
            <Link
              href="/account/invoices"
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentInvoices.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No billing statements generated yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentInvoices.map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-navy-900">
                        {inv.invoiceNumber || "INV-1000"}
                      </p>
                      <span
                        className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          inv.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {inv.status === "paid" ? "Paid" : "Balance Due"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Total: {formatMoneyCents(inv.totalCents)}
                    </p>
                  </div>

                  {inv.status === "paid" ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Settled</span>
                    </span>
                  ) : (
                    <Link
                      href={`/pay/${inv.publicPayToken}`}
                      className="text-xs font-bold bg-orange-500 hover:bg-orange-600 text-navy-900 px-3 py-1 rounded-lg shadow-sm"
                    >
                      Pay {formatMoneyCents(inv.amountDueCents)}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
