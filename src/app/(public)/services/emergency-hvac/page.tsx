import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Zap,
  Flame,
  Droplets,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `24/7 Priority Emergency HVAC Dispatch | ${businessConfig.businessName}`,
  description: `Emergency AC and heating repair dispatched 24/7 across ${businessConfig.city}. 60-minute arrival window with upfront pricing and fully stocked service vans.`,
};

export default function EmergencyHvacPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const emergencySituations = [
    {
      title: "Complete AC Failure During High Heat",
      desc: "System suddenly stops blowing air or trips breakers during extreme humidity and heat waves.",
      icon: Flame,
    },
    {
      title: "Indoor Air Handler Water Leaks",
      desc: "Clogged condensate lines causing water overflow into ceilings, drywall, or utility closets.",
      icon: Droplets,
    },
    {
      title: "Electrical Burning Odors or Smoke",
      desc: "Burning insulation or failing blower motor capacitors posing immediate electrical safety hazards.",
      icon: Zap,
    },
    {
      title: "Frozen Coils & Ice on Refrigerant Lines",
      desc: "Airflow restriction or low refrigerant causing thick ice buildup on evaporator coils and exterior pipes.",
      icon: Clock,
    },
    {
      title: "Loud Screeching or Clanking Compressor",
      desc: "Internal mechanical breakdown in the outdoor condenser fan motor or seized scroll compressor.",
      icon: AlertCircle,
    },
    {
      title: "Thermostat Screen Blank & System Offline",
      desc: "Tripped float switch, blown 3A control board fuse, or failed transformer halting whole-house cooling.",
      icon: ShieldCheck,
    },
  ];

  const responseSteps = [
    {
      step: "01",
      title: "Instant 5-Minute Dispatch",
      desc: "Your booking immediately pings on-call mobile vans staged throughout the metro area.",
    },
    {
      step: "02",
      title: "Live GPS En-Route Tracking",
      desc: "Receive an SMS text with your certified technician's photo, truck ID, and real-time arrival map.",
    },
    {
      step: "03",
      title: "Mobile Warehouse on Wheels",
      desc: "Vans carry 95% of universal OEM capacitors, fan motors, contactors, and refrigerant.",
    },
    {
      step: "04",
      title: "Upfront Quote Before Repairs",
      desc: "Technician inspects the unit and gives a guaranteed flat quote before turning a wrench.",
    },
  ];

  const faqs = [
    {
      q: "How fast can an emergency technician arrive at my property?",
      a: "Our emergency mobile vans are geographically staged across the metro area. In active cooling emergencies, average arrival time is under 45-60 minutes.",
    },
    {
      q: "Do you charge extra hidden fees for night or weekend calls?",
      a: "No. TechWork operates on transparent flat-rate pricing. You will receive an exact diagnostic fee of $129 with zero surprise travel surcharges.",
    },
    {
      q: "What should I do while waiting for the emergency technician?",
      a: "Turn your thermostat to 'OFF' to prevent compressor burnout, especially if you notice ice on copper lines or water leaking near indoor electrical components.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: "24/7 Emergency HVAC" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50/70 via-white to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-red-700 uppercase tracking-wider bg-red-100 px-3.5 py-1 rounded-full border border-red-200 inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
              Priority Emergency Dispatch
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight leading-tight">
              24/7 Emergency HVAC Repair in{" "}
              <span className="text-red-600">60 Minutes</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              When your air conditioning fails during peak heat or water starts leaking from your ceiling, our emergency technicians are on standby around the clock with fully stocked mobile units.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-red-600" /> 60-Minute Rapid Arrival
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-red-600" /> Licensed &amp; Insured Masters
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Upfront Flat Pricing
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white font-black px-7 shadow-lg shadow-red-500/25 transition-all text-sm gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>Call Emergency Dispatch: {businessConfig.phone}</span>
              </a>
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-6 shadow-md"
              >
                <Link href="/book?serviceId=svc-ac-repair">
                  <span>Book Slot Online ($129 Diagnostic)</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image
                src="/images/svc-ac-repair.jpg"
                alt="Emergency HVAC technician on site"
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

      {/* Emergency Scenarios */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Critical Situations
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-1">
            Common HVAC Emergencies We Resolve Immediately
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Don&apos;t risk major compressor destruction or indoor water damage. Our master technicians carry OEM parts to resolve issues on the initial trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencySituations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-red-300 transition-all space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-navy-950">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Protocol Steps */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              Our 60-Minute Emergency Protocol
            </h2>
            <p className="text-sm text-slate-600">
              From the second you book to your AC blowing cold air again, here is how our rapid dispatch works:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {responseSteps.map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <span className="font-heading font-black text-3xl text-orange-500">
                  {s.step}
                </span>
                <h3 className="font-heading font-bold text-base text-navy-950">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Guarantee Box */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-navy-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-navy-800">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-orange-400">
              Transparent Emergency Pricing
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
              $129 Flat-Rate Diagnostic Call
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Includes comprehensive electrical testing, motor diagnostics, refrigerant pressure analysis, and clear upfront pricing before any repair begins. Your $20 reservation fee is 100% credited to your final bill.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-8 shadow-lg w-full sm:w-auto"
            >
              <Link href="/book?serviceId=svc-ac-repair">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Reserve Arrival Slot</span>
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
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Answers to common questions regarding emergency HVAC dispatch.
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
