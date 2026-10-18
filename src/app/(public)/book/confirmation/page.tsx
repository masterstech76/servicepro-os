"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Phone } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { getBookingApi, type ConfirmedJobDTO } from "@/lib/api";
import {
  formatBusinessDate,
  formatBusinessTimeWithZone,
  formatDisplayPhone,
} from "@/lib/domain/format";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const pi = searchParams.get("pi") ?? "";
  const [job, setJob] = React.useState<ConfirmedJobDTO | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!pi) {
      setLoading(false);
      return;
    }
    let active = true;
    const api = getBookingApi();

    async function poll() {
      for (let i = 0; i < 20; i++) {
        if (!active) return;
        const found = await api.getJobByIntent(pi);
        if (found) {
          if (active) {
            setJob(found);
            setLoading(false);
          }
          return;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      if (active) setLoading(false);
    }

    poll();
    return () => {
      active = false;
    };
  }, [pi]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-navy-900">
        Confirming your booking…
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-navy-900">Booking Not Found</h1>
        <p className="text-sm text-navy-700">
          We couldn&apos;t find a booking matching that reference.
        </p>
        <Button asChild>
          <Link href="/book">Return to Booking</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12 text-center space-y-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-success">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="text-[28px] leading-[34px] font-bold text-navy-900">
        You&apos;re booked!
      </h1>
      <p data-testid="confirmed-job-number" className="text-base font-semibold text-orange-700">
        Job #{job.jobNumber}
      </p>
      <div className="rounded-card border border-slate-200 bg-slate-50 p-5 text-left space-y-2 text-sm">
        <div className="font-bold text-base text-navy-900">{job.serviceName}</div>
        <div className="text-navy-900 font-medium">
          {formatBusinessDate(job.scheduledStart)} ·{" "}
          {formatBusinessTimeWithZone(job.scheduledStart)}
        </div>
        <div className="text-navy-700">
          {job.addressLine1}, {job.city}, {job.state} {job.zip}
        </div>
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-navy-700">
          <span>Deposit paid</span>
          <Money cents={job.depositCents} emphasis />
        </div>
      </div>
      <p className="text-sm text-navy-700">
        We texted a confirmation to {formatDisplayPhone(job.customerPhone)}.
      </p>
      <Button asChild variant="secondary">
        <a href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}>
          <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Call us</span>
        </a>
      </Button>
    </main>
  );
}

export default function BookingConfirmationPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
      <ConfirmationContent />
    </React.Suspense>
  );
}
