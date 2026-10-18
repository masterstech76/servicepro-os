import Link from "next/link";
import {
  Snowflake,
  Wrench,
  Zap,
  Sparkles,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { formatMoneyCents } from "@/lib/domain/format";
import { Button } from "@/components/ui/button";
import { PhoneLink } from "@/components/shared/PhoneLink";

function getServiceIcon(category: string) {
  const lower = category.toLowerCase();
  if (lower.includes("cool") || lower.includes("hvac")) return Snowflake;
  if (lower.includes("control") || lower.includes("elec")) return Zap;
  if (lower.includes("air") || lower.includes("clean")) return Sparkles;
  return Wrench;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-navy-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg text-navy-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 rounded-input"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-input bg-navy-900 text-orange-500">
              <Snowflake className="h-5 w-5" aria-hidden="true" />
            </div>
            <span>{businessConfig.businessName}</span>
          </Link>
          <div className="flex items-center gap-2">
            <PhoneLink phone={businessConfig.phone} label="Call" />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/book">Book Now</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-navy-900 text-white py-12 sm:py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-navy-800 border border-navy-700 px-3.5 py-1.5 text-xs font-semibold text-orange-50 mb-6">
              <ShieldCheck className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <span>
                Licensed & Insured · #{businessConfig.licenseNumber} · Serving Greater{" "}
                {businessConfig.city}
              </span>
            </div>
            <h1 className="text-[32px] leading-[36px] sm:text-[40px] sm:leading-[44px] font-bold tracking-[-0.02em] text-white mb-4">
              {businessConfig.seo.heroHeadline}
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-200 mb-8">
              {businessConfig.seo.heroSubheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto min-w-[240px]">
                <Link href="/book" data-testid="hero-book-cta">
                  <span>Book online in 60 seconds</span>
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-input border border-navy-700 bg-navy-800 px-6 text-base font-semibold text-white hover:bg-navy-700 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500"
              >
                <Phone className="h-5 w-5 text-orange-500" aria-hidden="true" />
                <span>{businessConfig.phone}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section
          aria-label="Trust guarantees"
          className="border-b border-slate-200 bg-slate-50 py-5 px-4"
        >
          <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center gap-2.5 text-navy-900 font-medium">
              <ShieldCheck className="h-5 w-5 text-orange-700 shrink-0" aria-hidden="true" />
              <span>FL State License #{businessConfig.licenseNumber}</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-navy-900 font-medium">
              <Clock className="h-5 w-5 text-orange-700 shrink-0" aria-hidden="true" />
              <span>Real-Time Arrival Windows & Text Alerts</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-navy-900 font-medium">
              <Star className="h-5 w-5 text-orange-700 shrink-0" aria-hidden="true" />
              <a
                href={businessConfig.sms.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-orange-700 hover:text-navy-900 font-semibold"
              >
                4.9★ Rated Local Miami Pros
              </a>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 sm:py-16 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-8">
              <h2 className="text-[22px] leading-[28px] font-semibold text-navy-900">
                Upfront Pricing on Every Service
              </h2>
              <p className="text-sm text-navy-700 mt-1">
                Pick a service to see live technician availability in your neighborhood.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessConfig.services.map((service) => {
                const Icon = getServiceIcon(service.category);
                const priceDisplay =
                  service.pricing === "hourly"
                    ? `${formatMoneyCents(service.price, { omitZeroCents: true })}/hr`
                    : formatMoneyCents(service.price, { omitZeroCents: true });

                return (
                  <Link
                    key={service.id}
                    href={`/book?serviceId=${encodeURIComponent(service.id)}`}
                    className="group flex flex-col justify-between rounded-card border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-orange-500 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-input bg-orange-50 text-orange-700 group-hover:bg-orange-500 group-hover:text-navy-900 transition-colors">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-navy-900">
                            {service.name}
                          </h3>
                          <p className="text-xs font-medium text-navy-700 mt-0.5">
                            ~{service.durationMinutes} min
                            {service.pricing === "hourly" &&
                              ` · ${Math.round((service.minBillableMinutes ?? 60) / 60)} hr minimum`}
                          </p>
                          <p className="text-sm text-navy-700 mt-2">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold tabular-nums text-navy-900 shrink-0">
                        {priceDisplay}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-end text-sm font-semibold text-orange-700 group-hover:underline">
                      <span>Book this service</span>
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works (3 steps) */}
        <section className="bg-slate-50 border-t border-slate-200 py-12 sm:py-16 px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-[22px] leading-[28px] font-semibold text-navy-900 mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-card border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-navy-900 font-bold text-sm mb-3">
                  1
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-1">
                  Pick Your Time Window
                </h3>
                <p className="text-sm text-navy-700">
                  See live technician availability in your ZIP code and lock in a convenient arrival window.
                </p>
              </div>
              <div className="rounded-card border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-navy-900 font-bold text-sm mb-3">
                  2
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-1">
                  Reserve With a {businessConfig.booking.depositPct}% Deposit
                </h3>
                <p className="text-sm text-navy-700">
                  Your deposit is credited 100% toward the service total. Full refund if cancelled 24+ hours ahead.
                </p>
              </div>
              <div className="rounded-card border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-navy-900 font-bold text-sm mb-3">
                  3
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-1">
                  We Text When On the Way
                </h3>
                <p className="text-sm text-navy-700">
                  Your certified technician texts an ETA before arrival, completes the job, and sends a digital receipt.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-navy-900 text-slate-200 py-10 px-4 text-sm">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="font-bold text-white text-base mb-1">
              {businessConfig.businessName}
            </div>
            <p className="text-slate-300">{businessConfig.address}</p>
            <p className="text-slate-300 mt-1">
              Hours: Mon–Fri 7:00 AM – 7:00 PM · Sat 8:00 AM – 4:00 PM · Sun Closed
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <a
              href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}
              className="font-semibold text-white hover:underline"
            >
              {businessConfig.phone}
            </a>
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <span>License #{businessConfig.licenseNumber}</span>
              <Link href="/demo" className="underline hover:text-white">
                Interactive Demo
              </Link>
              <Link href="/login" className="underline hover:text-white">
                Staff login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
