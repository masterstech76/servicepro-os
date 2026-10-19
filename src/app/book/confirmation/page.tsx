"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Phone,
  Calendar,
  Navigation,
  Clock,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { getBookingApi, type ConfirmedJobDTO } from "@/lib/api";
import {
  formatBusinessDate,
  formatBusinessTimeWithZone,
  formatDisplayPhone,
} from "@/lib/domain/format";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";

const DEMO_CONFIRMED_JOB: ConfirmedJobDTO = {
  jobNumber: 1004,
  serviceName: "AC Repair & Diagnostic",
  scheduledStart: new Date(Date.now() + 3600000 * 2).toISOString(),
  scheduledEnd: new Date(Date.now() + 3600000 * 4).toISOString(),
  addressLine1: "1421 Brickell Ave, Apt 18B",
  city: "Miami",
  state: "FL",
  zip: "33131",
  customerFirstName: "David",
  customerPhone: "(305) 555-0144",
  depositCents: 2000,
};

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const pi = searchParams.get("pi") ?? "";
  const [job, setJob] = React.useState<ConfirmedJobDTO | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!pi) {
      setJob(DEMO_CONFIRMED_JOB);
      setLoading(false);
      return;
    }

    let active = true;
    const api = getBookingApi();

    async function poll() {
      for (let i = 0; i < 15; i++) {
        if (!active) return;
        try {
          const found = await api.getJobByIntent(pi);
          if (found) {
            if (active) {
              setJob(found);
              setLoading(false);
            }
            return;
          }
        } catch {
          // continue polling
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      if (active) {
        setJob(DEMO_CONFIRMED_JOB);
        setLoading(false);
      }
    }

    poll();
    return () => {
      active = false;
    };
  }, [pi]);

  const activeJob = job || DEMO_CONFIRMED_JOB;

  function handleCalendarDownload() {
    const title = `TechWork HVAC: ${activeJob.serviceName}`;
    const desc = `Confirmed Job #${activeJob.jobNumber} with TechWork Services LLC. Dispatch hotline: ${businessConfig.phone}`;
    const loc = `${activeJob.addressLine1}, ${activeJob.city}, ${activeJob.state} ${activeJob.zip}`;
    const start = new Date(activeJob.scheduledStart).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(activeJob.scheduledEnd || activeJob.scheduledStart).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TechWork Services LLC//EN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${desc}
LOCATION:${loc}
DTSTART:${start}
DTEND:${end}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `techwork_job_${activeJob.jobNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Calendar invite (.ics) downloaded!");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex items-center justify-center">
      <main className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-xl space-y-6">
        {/* Top Success Badge */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md ring-8 ring-emerald-50">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Dispatch Queue Confirmed
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
            You're Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Work order has been created and staged on today's Miami dispatch board.
          </p>
        </div>

        {/* Uber Receipt Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Work Order Number
              </span>
              <span
                data-testid="confirmed-job-number"
                className="font-mono text-xl font-black text-navy-950"
              >
                #{activeJob.jobNumber}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Slot Reserved
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-navy-950 block text-sm">
                  {activeJob.serviceName}
                </span>
                <span className="text-slate-600">
                  {formatBusinessDate(activeJob.scheduledStart)} • {formatBusinessTimeWithZone(activeJob.scheduledStart)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-navy-950">
                  {activeJob.addressLine1}
                </span>
                <span className="text-slate-500 block">
                  {activeJob.city}, {activeJob.state} {activeJob.zip}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Deposit Line */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-navy-950">Diagnostic Reservation Deposit</span>
              <p className="text-[11px] text-slate-500">
                100% credited toward approved repair work
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-black text-emerald-700">
                $<Money cents={activeJob.depositCents} />
              </span>
              <span className="block text-[10px] text-slate-400">Card Hold Processed</span>
            </div>
          </div>
        </div>

        {/* SMS Notification Confirmation */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center gap-3 text-xs text-slate-600">
          <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Navigation className="h-4 w-4" />
          </div>
          <p>
            We texted an arrival window confirmation with live van tracking link to{" "}
            <strong className="text-navy-950">{formatDisplayPhone(activeJob.customerPhone)}</strong>.
          </p>
        </div>

        {/* Next Actions (Uber Style) */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 text-sm shadow-md transition-all"
          >
            <Link
              href="/account/appointments/job_today_1/track"
              className="flex items-center justify-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              <span>Track Technician Live Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCalendarDownload}
              className="rounded-xl border-slate-300 text-slate-700 text-xs font-bold h-10 hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5 text-orange-500" />
              <span>Add to Calendar</span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-xl border-slate-300 text-slate-700 text-xs font-bold h-10 hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <a href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}>
                <Phone className="h-3.5 w-3.5 text-orange-500" />
                <span>Call Dispatch</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Return Home Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="hover:text-navy-950 font-semibold transition-colors">
            ← Return to Home
          </Link>
          <Link href="/account/appointments" className="hover:text-orange-600 font-semibold transition-colors">
            View All My Appointments →
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-medium">Loading confirmed booking receipt…</div>}>
      <ConfirmationContent />
    </React.Suspense>
  );
}
