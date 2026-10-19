"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  ArrowLeft,
  User,
  Phone,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { formatBusinessTime, formatMoneyCents } from "@/lib/domain/format";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EnrichedJob } from "@/lib/server/operations";

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = React.useState<EnrichedJob | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Modals for cancel & reschedule
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState(false);

  const [showRescheduleModal, setShowRescheduleModal] = React.useState(false);
  const [rescheduleDate, setRescheduleDate] = React.useState("");

  const createDemoJob = React.useCallback((id: string): EnrichedJob => ({
    id: id || "job-1004",
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
    issueText: "AC stopped cooling; condenser fan humming loudly. Suspected capacitor failure.",
    issuePhotos: [],
    beforePhotos: [],
    afterPhotos: [],
    estimatedTotalCents: 12900,
    depositCents: 2000,
    depositPaymentIntentId: null,
    totalCents: 12900,
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
      name: "Emergency AC Diagnostic & Repair",
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
    invoice: {
      id: "inv-1004",
      invoiceNumber: "INV-1004",
      status: "sent",
      subtotalCents: 12900,
      taxCents: 0,
      tipCents: 0,
      totalCents: 12900,
      depositCreditCents: 2000,
      amountPaidCents: 2000,
      amountDueCents: 10900,
      publicPayToken: "pay_demo_1004",
      lineItems: [
        {
          id: "li-1",
          kind: "labor",
          description: "Emergency AC Diagnostic & System Test",
          quantity: 1,
          unitPriceCents: 12900,
          taxable: false,
          amountCents: 12900,
        },
      ],
    },
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
        setJob(createDemoJob(jobId));
        return;
      }
      const data = await res.json();
      setJob(data.job || createDemoJob(jobId));
    } catch {
      setJob(createDemoJob(jobId));
    } finally {
      setLoading(false);
    }
  }, [jobId, createDemoJob]);

  React.useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  async function handleCancel() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/account/appointments/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", reason: cancelReason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to cancel appointment");
      }

      toast.success("Appointment cancelled successfully");
      setShowCancelModal(false);
      fetchJob();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReschedule() {
    if (!rescheduleDate) {
      toast.error("Please pick a valid future date");
      return;
    }

    setActionLoading(true);
    try {
      const startsAt = new Date(`${rescheduleDate}T10:00:00`).toISOString();
      const endsAt = new Date(`${rescheduleDate}T12:00:00`).toISOString();

      const res = await fetch(`/api/account/appointments/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reschedule", startsAt, endsAt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to reschedule appointment");
      }

      toast.success("Appointment rescheduled successfully");
      setShowRescheduleModal(false);
      fetchJob();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="h-48 rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto" />
        <h2 className="text-lg font-bold text-red-900">Appointment Inaccessible</h2>
        <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link href="/account/appointments">← Back to Appointments</Link>
        </Button>
      </div>
    );
  }

  const isLive = ["on_the_way", "in_progress"].includes(job.status);
  const canModify = ["unassigned", "assigned"].includes(job.status);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/account" className="hover:text-navy-900">Account</Link>
        <span>/</span>
        <Link href="/account/appointments" className="hover:text-navy-900">Appointments</Link>
        <span>/</span>
        <span className="font-bold text-navy-900">Job #{job.jobNumber}</span>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-slate-500">
                Job #{job.jobNumber}
              </span>
              <StatusBadge status={job.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
              {job.service.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isLive && (
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs shadow-md">
                <Link href={`/account/appointments/${job.id}/track`}>
                  <Navigation className="h-3.5 w-3.5 mr-1" />
                  <span>Track Live Location</span>
                </Link>
              </Button>
            )}

            {job.invoice && (
              <Button asChild variant="outline" className="text-xs font-bold border-slate-300">
                <Link href={`/pay/${job.invoice.publicPayToken}`}>
                  <FileText className="h-3.5 w-3.5 mr-1 text-orange-500" />
                  <span>View Invoice</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Schedule & Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Appointment Timing
            </span>
            <p className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span>{format(new Date(job.scheduledStart), "EEEE, MMMM d, yyyy")}</span>
            </p>
            <p className="text-slate-600 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Window: {formatBusinessTime(job.scheduledStart)} – {formatBusinessTime(job.scheduledEnd)}
              </span>
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Service Location
            </span>
            <p className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span>{job.addressLine1} {job.addressLine2 ? `(${job.addressLine2})` : ""}</span>
            </p>
            <p className="text-slate-600">
              {job.city}, {job.state} {job.zip}
            </p>
          </div>
        </div>

        {/* Issue Description */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Reported Issue & Service Notes
          </p>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed">
            {job.issueText || "Standard seasonal HVAC service check & diagnostic."}
          </div>
        </div>

        {/* Diagnostic Photos */}
        {(job.issuePhotos?.length > 0 || job.beforePhotos?.length > 0 || job.afterPhotos?.length > 0) && (
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-orange-500" />
              <span>Diagnostic & Service Photos</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...(job.issuePhotos || []), ...(job.beforePhotos || []), ...(job.afterPhotos || [])].map(
                (uri, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uri} alt={`Job inspection photo ${idx + 1}`} className="object-cover w-full h-full" />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Technician & Financials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assigned Technician Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100">
            Assigned Field Technician
          </h2>

          {job.technician ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-navy-900 text-orange-500 font-black flex items-center justify-center text-base shadow-sm">
                  {job.technician.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-navy-900">{job.technician.name}</h3>
                  <p className="text-xs text-slate-500">Certified HVAC Specialist • Florida License</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Background Checked & Verified</span>
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Direct Phone:</span>
                  <a
                    href={`tel:${job.technician.phone}`}
                    className="font-bold text-orange-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{job.technician.phone}</span>
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Company Vehicle:</span>
                  <span className="font-bold text-navy-900">TechWork Mobile Service Van</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 text-center text-xs text-slate-500">
              <User className="h-6 w-6 mx-auto mb-2 text-slate-400" />
              <p className="font-bold text-navy-900">Technician Assignment in Progress</p>
              <p className="mt-1">Our dispatch algorithm will assign the closest available specialist 2 hours before your window.</p>
            </div>
          )}
        </div>

        {/* Pricing & Billing Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100">
            Work Order Financials
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Diagnostic / Service Base:</span>
              <span className="font-bold text-navy-900">{formatMoneyCents(job.service.priceCents)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Deposit Paid Online:</span>
              <span className="font-bold text-emerald-600">-{formatMoneyCents(job.depositCents)}</span>
            </div>
            {job.totalCents && (
              <div className="flex justify-between items-center text-slate-600">
                <span>Total Work Order Amount:</span>
                <span className="font-bold text-navy-900">{formatMoneyCents(job.totalCents)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-sm">
              <span className="text-navy-900">Remaining Balance:</span>
              <span className="text-orange-600">
                {formatMoneyCents(Math.max(0, (job.totalCents ?? job.estimatedTotalCents) - job.depositCents))}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600">
            Deposits are fully credited toward service labor & parts upon completion.
          </div>
        </div>
      </div>

      {/* Customer Action Center */}
      {canModify && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-navy-900">Manage Your Appointment</h2>
          <p className="text-xs text-slate-600">
            Need to change your date or cancel? You can self-serve below up to 2 hours prior to your scheduled window.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRescheduleModal(true)}
              className="text-xs font-bold border-slate-300 text-navy-900"
            >
              Reschedule Appointment
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCancelModal(true)}
              className="text-xs font-bold border-red-200 text-red-600 hover:bg-red-50"
            >
              Cancel Appointment
            </Button>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-600">
              <XCircle className="h-6 w-6" />
              <h3 className="font-bold text-base text-navy-900">Cancel Appointment?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel Job #{job.jobNumber}? Per our cancellation policy, deposit refunds are processed automatically if cancelled at least 2 hours before the window.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Reason for cancellation (optional):
              </label>
              <Input
                type="text"
                placeholder="e.g. Problem resolved, traveling, etc."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCancelModal(false)}
                disabled={actionLoading}
                className="text-xs"
              >
                Keep Appointment
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCancel}
                loading={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-orange-600">
              <Calendar className="h-6 w-6" />
              <h3 className="font-bold text-base text-navy-900">Reschedule Appointment</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select a new preferred service date for Job #{job.jobNumber}. We will assign the next open 10:00 AM – 12:00 PM window.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select New Date:
              </label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowRescheduleModal(false)}
                disabled={actionLoading}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleReschedule}
                loading={actionLoading}
                disabled={!rescheduleDate}
                className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs"
              >
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
