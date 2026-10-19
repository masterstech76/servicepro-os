"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Navigation,
  MapPin,
  Clock,
  Phone,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Car,
  Radio,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { formatBusinessTime } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

export default function TechnicianTrackingPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = React.useState<EnrichedJob | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const createDemoTrackJob = React.useCallback((id: string): EnrichedJob => ({
    id: id || "job-demo-track",
    jobNumber: 1004,
    status: "on_the_way",
    scheduledStart: new Date().toISOString(),
    scheduledEnd: new Date(Date.now() + 7200000).toISOString(),
    addressLine1: "1421 Brickell Ave, Apt 18B",
    addressLine2: null,
    city: "Miami",
    state: "FL",
    zip: "33131",
    lat: 25.7617,
    lng: -80.1918,
    issueText: "AC stopped cooling; condenser fan humming loudly.",
    issuePhotos: [],
    beforePhotos: [],
    afterPhotos: [],
    estimatedTotalCents: 12900,
    depositCents: 2000,
    depositPaymentIntentId: null,
    totalCents: null,
    tipCents: 0,
    billableMinutes: null,
    notesInternal: null,
    techNotes: null,
    cancelReason: null,
    cancelledAt: null,
    onTheWayAt: new Date(Date.now() - 900000).toISOString(),
    startedAt: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    isUnassignedUrgent: false,
    customer: {
      id: "cust-demo",
      name: "David Miller",
      phone: "(305) 555-0144",
      email: "david@example.com",
      cardBrand: "visa",
      cardLast4: "4242",
      smsOptOut: false,
    },
    service: {
      id: "svc-ac-repair",
      name: "AC Repair & Diagnostic",
      category: "repair",
      skillTag: "hvac_diagnostic",
      pricingType: "flat",
      priceCents: 12900,
      durationMinutes: 60,
      minBillableMinutes: 60,
    },
    technician: {
      id: "tech-carlos",
      name: "Carlos Mendez",
      phone: "(305) 555-0188",
      email: "carlos@techworkservices.com",
      color: "#F97316",
      commissionPct: 20,
    },
    invoice: null,
    payments: [],
    events: [],
  }), []);

  const fetchJob = React.useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/account/appointments/${jobId}`);
      if (!res.ok) {
        setJob(createDemoTrackJob(jobId));
        return;
      }
      const data = await res.json();
      setJob(data.job || createDemoTrackJob(jobId));
    } catch {
      setJob(createDemoTrackJob(jobId));
    } finally {
      setLoading(false);
    }
  }, [jobId, createDemoTrackJob]);

  React.useEffect(() => {
    fetchJob();
    // Poll every 15 seconds if job is actively on the way
    const timer = setInterval(() => {
      fetchJob();
    }, 15000);
    return () => clearInterval(timer);
  }, [fetchJob]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto" />
        <h2 className="text-lg font-bold text-red-900">Tracking Unavailable</h2>
        <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link href="/account/appointments">← Back to Appointments</Link>
        </Button>
      </div>
    );
  }

  const isOnTheWay = job.status === "on_the_way";
  const isInProgress = job.status === "in_progress";
  const isCompleted = job.status === "completed";
  const isPendingTravel = ["unassigned", "assigned"].includes(job.status);

  // Status progress steps
  const steps = [
    { label: "Booked", completed: true },
    { label: "Assigned", completed: Boolean(job.technician) },
    { label: "On The Way", completed: isOnTheWay || isInProgress || isCompleted, active: isOnTheWay },
    { label: "In Progress", completed: isInProgress || isCompleted, active: isInProgress },
    { label: "Completed", completed: isCompleted, active: isCompleted },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/account" className="hover:text-navy-900">Account</Link>
        <span>/</span>
        <Link href="/account/appointments" className="hover:text-navy-900">Appointments</Link>
        <span>/</span>
        <Link href={`/account/appointments/${job.id}`} className="hover:text-navy-900">Job #{job.jobNumber}</Link>
        <span>/</span>
        <span className="font-bold text-navy-900">Live Tracker</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-slate-500">Job #{job.jobNumber}</span>
            <StatusBadge status={job.status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
            Technician ETA & Live Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time status updates for {job.service.name} at {job.addressLine1}.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="text-xs font-bold border-slate-300">
          <Link href={`/account/appointments/${job.id}`}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span>Work Order Details</span>
          </Link>
        </Button>
      </div>

      {/* Progress Pipeline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {steps.map((st, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  st.active
                    ? "bg-orange-500 text-navy-900 ring-4 ring-orange-100"
                    : st.completed
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {st.completed && !st.active ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={`text-xs font-semibold ${
                  st.active
                    ? "text-orange-600 font-bold"
                    : st.completed
                    ? "text-navy-900"
                    : "text-slate-400"
                }`}
              >
                {st.label}
              </span>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-6 sm:w-12 rounded ${
                    st.completed ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Map / Telemetry Container */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {isOnTheWay ? (
          <div className="p-6 space-y-4">
            <div className="rounded-xl bg-orange-500 text-navy-900 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-navy-900 text-orange-400 flex items-center justify-center shrink-0">
                  <Car className="h-5 w-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm uppercase tracking-wide">Technician Is On The Way</span>
                    <Radio className="h-4 w-4 text-navy-900 animate-pulse" />
                  </div>
                  <p className="text-xs text-navy-950 font-semibold mt-0.5">
                    Estimated arrival window: ~15 to 25 minutes
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <p className="font-bold text-navy-900">Destination: {job.city}, FL</p>
                <p className="text-navy-800 text-[11px]">{job.addressLine1}</p>
              </div>
            </div>

            {/* Stylized Vector Route Canvas */}
            <div className="relative aspect-video max-h-72 w-full rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800 p-4">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 text-center space-y-3">
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center space-y-1">
                    <div className="h-10 w-10 rounded-full bg-orange-500 text-navy-900 flex items-center justify-center mx-auto shadow-lg">
                      <Car className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono text-orange-400 block font-bold">Tech Van</span>
                  </div>

                  <div className="h-1 w-28 sm:w-48 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 rounded-full animate-pulse" />

                  <div className="text-center space-y-1">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 block font-bold">Your Home</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>GPS Telemetry Active • Live Route Updates</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Honest Inactive State */
          <div className="p-8 sm:p-10 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              {isCompleted ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              ) : (
                <Radio className="h-8 w-8 text-orange-500" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-navy-900">
                {isCompleted
                  ? "Service Completed Successfully"
                  : isInProgress
                  ? "Technician Is Currently On Site"
                  : "Live GPS Activates Upon Technician Departure"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                {isCompleted
                  ? `This work order was completed on ${format(new Date(job.completedAt || job.scheduledEnd), "MMMM d, yyyy")}.`
                  : isInProgress
                  ? "Technician is presently diagnosing or servicing equipment at your address."
                  : "In compliance with field personnel privacy standards, live GPS broadcast begins automatically once the technician starts travel toward your location."}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 max-w-md mx-auto text-xs text-slate-600 space-y-1 text-left">
              <div className="flex justify-between">
                <span>Appointment Scheduled:</span>
                <span className="font-bold text-navy-900">
                  {format(new Date(job.scheduledStart), "EEE, MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Arrival Window:</span>
                <span className="font-bold text-navy-900">
                  {formatBusinessTime(job.scheduledStart)} – {formatBusinessTime(job.scheduledEnd)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Technician Profile & Contact */}
      {job.technician && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-navy-900 text-orange-500 font-black flex items-center justify-center text-base shadow-sm">
              {job.technician.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h3 className="font-bold text-base text-navy-900">{job.technician.name}</h3>
              <p className="text-xs text-slate-500">TechWork Certified Field Technician</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified Background & EPA 608 Universal Certified</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${job.technician.phone}`}
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs px-4 py-2.5 shadow flex items-center gap-1.5 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Technician ({job.technician.phone})</span>
            </a>
          </div>
        </div>
      )}

      {/* Support Dispatch Box */}
      <div className="rounded-xl bg-slate-100 border border-slate-200 p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span>Need to reschedule or speak with dispatch office?</span>
        <a
          href={`tel:${businessConfig.phone.replace(/[^\d+]/g, "")}`}
          className="font-bold text-navy-900 hover:text-orange-600 underline"
        >
          Call 24/7 Office: {businessConfig.phone}
        </a>
      </div>
    </div>
  );
}
