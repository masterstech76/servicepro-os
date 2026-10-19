import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Phone,
  Sparkles,
  Zap,
  Droplets,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `AC Tune-Up & 21-Point Maintenance Special | ${businessConfig.businessName}`,
  description: `Keep your AC running at peak efficiency with our $89 21-point seasonal maintenance special across ${businessConfig.city}. 100% breakdown-free guarantee.`,
};

export default function AcTuneupServicePage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const checklist = [
    {
      title: "Clean & Rinse Outdoor Condenser Coils",
      desc: "Remove dirt, leaves, and salt crust to restore maximum heat transfer and reduce compressor strain.",
    },
    {
      title: "Flush Condensate Drain & Algae Treatment",
      desc: "Clear drain line sludge with pressurized nitrogen and insert preventative slow-release biocidal tablets.",
    },
    {
      title: "Test Dual Run Capacitor Microfarads",
      desc: "Verify capacitance tolerances (±5%) to prevent unexpected fan motor or compressor start failures.",
    },
    {
      title: "Measure Operating Refrigerant Pressures",
      desc: "Digital manifold gauge check to ensure precise manufacturer subcooling and superheat levels.",
    },
    {
      title: "Inspect & Tighten High-Voltage Terminals",
      desc: "Torque electrical contactors and disconnect box lugs to prevent arcing and melted wiring.",
    },
    {
      title: "Evaluate Blower Motor & Amperage Draw",
      desc: "Test indoor blower run amps, check wheel balance, and inspect squirrel-cage cleanliness.",
    },
    {
      title: "Thermostat Calibration & Temperature Split",
      desc: "Measure supply vs return temperature delta (ideal 18°-22°F split) for optimal dehumidification.",
    },
    {
      title: "Safety Float Switch Operation",
      desc: "Test secondary overflow shut-off switch to protect drywall and ceilings from water overflow.",
    },
  ];

  const faqs = [
    {
      q: "How long does a comprehensive AC tune-up take?",
      a: "Our master technician spends approximately 60 to 75 minutes performing our full 21-point mechanical and electrical checklist.",
    },
    {
      q: "What is your Breakdown-Free Guarantee?",
      a: "If your AC system breaks down within 60 days of our tune-up, we will return and apply 100% of your $89 tune-up cost toward any required repair.",
    },
    {
      q: "Will this seasonal tune-up lower my electric bill?",
      a: "Yes. By rinsing dirty condenser coils and balancing refrigerant pressures, your system draws fewer amps, frequently reducing summer energy bills by 15% to 20%.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: "AC Tune-Up & Maintenance" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              Seasonal Preventive Maintenance
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight leading-tight">
              21-Point AC Tune-Up for Just{" "}
              <span className="text-orange-600">$89</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Prevent costly summer breakdowns, lower monthly electric bills, and extend your cooling equipment&apos;s lifespan. Our master technicians restore peak manufacturer performance with guaranteed arrival windows.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-orange-600" /> 60-Day Breakdown Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-orange-600" /> 60-Min Comprehensive Visit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Digital Health Report
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-7 shadow-md"
              >
                <Link href="/book?serviceId=svc-ac-tuneup">
                  <span>Book $89 Tune-Up Online</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-navy-950 font-bold text-sm px-6 shadow-sm transition-all"
              >
                <Phone className="mr-2 h-4 w-4 text-orange-600" />
                <span>Call {businessConfig.phone}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image
                src="/images/svc-ac-tuneup.jpg"
                alt="Certified HVAC technician performing AC seasonal tune up"
                fill
                quality={85}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 21-Point Inspection Checklist */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Comprehensive Inspection
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-1">
            What Our 21-Point Seasonal Tune-Up Covers
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every inspection includes digital before-and-after photos, capacitor voltage test ratings, and an itemized system health certificate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-orange-300 transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-6 rounded-lg bg-orange-50 text-orange-600 text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h3 className="font-heading font-bold text-sm sm:text-base text-navy-950">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-navy-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-navy-800">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-orange-400">
              Limited-Time Seasonal Special
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
              $89 Complete Seasonal AC Tune-Up
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Includes full condenser coil chemical rinse, electrical safety checks, drain line biocide treatment, and a 60-day breakdown guarantee. Valid when booked online.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-8 shadow-lg w-full sm:w-auto"
            >
              <Link href="/book?serviceId=svc-ac-tuneup">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Reserve $89 Slot</span>
              </Link>
            </Button>
            <a
              href={cleanPhoneHref}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-navy-950 hover:bg-white hover:text-navy-950 text-white font-bold text-xs sm:text-sm px-6 transition-all"
            >
              Call {businessConfig.phone}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-heading text-2xl font-black text-navy-950">
            Tune-Up FAQs
          </h2>
          <p className="text-xs text-slate-500">
            Common questions regarding our seasonal HVAC tune-up and guarantee.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-sm space-y-2"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <h3 className="font-heading font-bold text-sm sm:text-base text-navy-950">
                  {f.q}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
