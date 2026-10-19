"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Wrench,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const SERVICES_OPTIONS = [
  { id: "svc-ac-repair", name: "AC Repair Diagnostic & Fix", priceDollars: 99 },
  { id: "svc-ac-tuneup", name: "21-Point AC Seasonal Tune-Up", priceDollars: 89 },
  { id: "svc-thermostat-install", name: "Smart Thermostat Installation", priceDollars: 149 },
  { id: "svc-duct-cleaning", name: "Whole-Home Air Duct Cleaning", priceDollars: 249 },
  { id: "svc-refrigerant-recharge", name: "R-410A Refrigerant Recharge & Leak Test", priceDollars: 125 },
];

const DEMO_TECH_OPTIONS = [
  { id: "tech-carlos", name: "Carlos Mendez" },
  { id: "tech-danny", name: "Danny Reyes" },
  { id: "tech-maria", name: "Maria Alvarez" },
  { id: "tech-tony", name: "Tony Brooks" },
];

export default function AdminCreateJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  // Form state
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");

  const [addressLine1, setAddressLine1] = React.useState("");
  const [addressLine2, setAddressLine2] = React.useState("");
  const [city, setCity] = React.useState("Miami");
  const [state, setState] = React.useState("FL");
  const [zip, setZip] = React.useState("33131");

  const [serviceId, setServiceId] = React.useState("svc-ac-repair");
  const [scheduledDate, setScheduledDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );
  const [scheduledTime, setScheduledTime] = React.useState("09:00");
  const [technicianId, setTechnicianId] = React.useState("");
  const [issueText, setIssueText] = React.useState("");
  const [notesInternal, setNotesInternal] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Customer name and phone number are required");
      return;
    }
    if (!addressLine1.trim() || !zip.trim()) {
      toast.error("Service address and ZIP code are required");
      return;
    }

    const scheduledStart = `${scheduledDate}T${scheduledTime}:00`;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: customerEmail.trim() || undefined,
          addressLine1,
          addressLine2: addressLine2.trim() || undefined,
          city,
          state,
          zip,
          serviceId,
          scheduledStart,
          issueText: issueText.trim() || undefined,
          notesInternal: notesInternal.trim() || undefined,
          technicianId: technicianId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Failed to create work order");
        return;
      }

      toast.success(`Work Order #${data.job?.jobNumber || ""} created successfully!`);
      router.push(`/admin/jobs/${data.job.id}`);
    } catch {
      toast.error("Network error while creating work order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs List
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-orange-500 font-bold shadow-sm">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-950">Create New Work Order</h1>
            <p className="text-xs text-navy-600">
              Manual dispatch booking with customer details and technician scheduling
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Customer Info */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-700">
              <User className="h-4 w-4 text-orange-600" />
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Robert Smith"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Customer Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(305) 555-0199"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Customer Email (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="robert.smith@example.com"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Service Location */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-700">
              <MapPin className="h-4 w-4 text-orange-600" />
              <span>Service Location</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="1240 Brickell Bay Dr"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Suite / Apt / Unit (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apt 14B"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="33131"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Service & Scheduling */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-700">
              <Clock className="h-4 w-4 text-orange-600" />
              <span>Service & Appointment Schedule</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Selected Service *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 focus:border-orange-500 focus:outline-none"
                >
                  {SERVICES_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (${s.priceDollars}.00)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Start Window Time *
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 focus:border-orange-500 focus:outline-none"
                >
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Assign Technician (Optional)
                </label>
                <select
                  value={technicianId}
                  onChange={(e) => setTechnicianId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Leave Unassigned (Queue for Dispatch)</option>
                  {DEMO_TECH_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Customer Problem & Notes */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-700">
              <Wrench className="h-4 w-4 text-orange-600" />
              <span>Job Issue & Dispatcher Notes</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Reported Issue Description
                </label>
                <textarea
                  rows={2}
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder="e.g. AC unit blowing warm air, outdoor unit making rattling noise..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-navy-700 block mb-1">
                  Internal Dispatcher Notes (Not visible to customer)
                </label>
                <textarea
                  rows={2}
                  value={notesInternal}
                  onChange={(e) => setNotesInternal(e.target.value)}
                  placeholder="Gate code #4412, dog in backyard, call 15 min before arrival..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/jobs"
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-navy-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-navy-950 shadow-md hover:bg-orange-400"
            >
              {submitting ? "Creating..." : "Create Work Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
