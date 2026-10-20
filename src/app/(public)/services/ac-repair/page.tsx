import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Snowflake,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Phone,
  Zap,
  Wrench,
  HelpCircle,
  AlertTriangle,
  Flame,
  Gauge,
  ThermometerSnowflake,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Same-Day AC Repair & Diagnostic | ${businessConfig.businessName}`,
  description: `Emergency AC diagnostic and repair across ${businessConfig.city}. 60-minute arrival window, upfront $129 flat rate, and 1-year parts and labor warranty.`,
};

export default function AcRepairServicePage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const diagnosticPhases = [
    {
      phase: "Phase 1",
      title: "Electrical & Capacitor Health Check",
      desc: "Microfarad tolerance verification on dual-run capacitors, contactor point pitting inspection, and motor starting amp draw testing.",
      icon: Zap,
    },
    {
      phase: "Phase 2",
      title: "Refrigerant & Pressure Balance",
      desc: "Digital manifold gauge check for subcooling/superheat deltas, Schrader core leak testing, and electronic sniffer inspection for coil micro-leaks.",
      icon: Gauge,
    },
    {
      phase: "Phase 3",
      title: "Airflow, Blower & Static Pressure",
      desc: "Static pressure drop measurement across evaporator coils, blower wheel balance, and CFM airflow velocity verification.",
      icon: ThermometerSnowflake,
    },
    {
      phase: "Phase 4",
      title: "Safety Controls & Condensate Line",
      desc: "Secondary drain float switch electrical test, condensate P-trap nitrogen blow-out, and high/low pressure cut-off safety verification.",
      icon: ShieldCheck,
    },
  ];

  const truckStockParts = [
    { name: "Dual-Run Capacitors (35/5, 40/5, 45/5)", spec: "OEM Heavy-Duty 440V" },
    { name: "Single & Double Pole Contactors", spec: "30A - 40A Sealed Contacts" },
    { name: "ECM & PSC Condenser Fan Motors", spec: "Multi-Horsepower 1/3 to 1/6 HP" },
    { name: "Hard Start Assist Kits (SPP6 / 5-2-1)", spec: "Relay & Start Capacitor" },
    { name: "Condensate Overflow Float Switches", spec: "Magnetic Reed Sensor" },
    { name: "Universal Defrost & Time-Delay Boards", spec: "Solid-State 5-Min Lockout" },
  ];

  const commonIssues = [
    {
      symptom: "AC blowing warm or room-temperature air",
      cause: "Failed run capacitor, blown contactor, or low refrigerant charge.",
    },
    {
      symptom: "Outdoor condenser fan humming but not spinning",
      cause: "Weak capacitor or seized motor bearings requiring immediate replacement.",
    },
    {
      symptom: "Water leaking around air handler or ceiling",
      cause: "Clogged condensate drain line or cracked primary drain pan.",
    },
    {
      symptom: "Frozen evaporator coils or ice on copper lines",
      cause: "Severe refrigerant leak or restricted airflow from blocked coils.",
    },
    {
      symptom: "AC short-cycling on and off every few minutes",
      cause: "High-pressure safety trip, overheating compressor, or failing thermostat.",
    },
    {
      symptom: "Circuit breaker tripping immediately on start",
      cause: "Grounded compressor windings or shorted fan motor wiring.",
    },
  ];

  const faqs = [
    {
      q: "How fast can a technician arrive at my home?",
      a: "Our dispatchers monitor live traffic and GPS van telemetry across South Florida. For emergency cooling loss calls, our guaranteed arrival window is 60 minutes.",
    },
    {
      q: "Is the $129 diagnostic fee applied toward my repair?",
      a: "Yes. Your $20 booking reservation deposit and diagnostic fee are credited directly toward any approved repair exceeding $200 on the same visit.",
    },
    {
      q: "What if my AC system cannot be repaired?",
      a: "If your compressor has suffered catastrophic internal failure or your evaporator coil is beyond safe repair, our technician provides a transparent, itemized replacement estimate with same-day emergency mobile AC unit options.",
    },
    {
      q: "Do you offer a warranty on AC repair work?",
      a: "Every repair performed by TechWork Services LLC is backed by our 1-year limited parts and labor warranty, along with manufacturer warranties on all OEM parts.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: "AC Repair & Diagnostic" },
        ]}
      />

      {/* Hero Section (Apple Product Style) */}
      <section className="bg-gradient-to-b from-orange-50/60 via-white to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
              <Snowflake className="h-3.5 w-3.5" />
              Emergency Cooling Dispatch
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight leading-tight">
              Rapid AC Diagnostic &amp; Repair Within{" "}
              <span className="text-orange-600">60 Minutes</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              When South Florida heat peaks, a broken AC is an emergency. Our master certified technicians arrive in fully equipped rolling warehouses to test, diagnose, and repair your air conditioner on the first visit.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-orange-600" /> 1-Year Labor Warranty
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-orange-600" /> 60-Minute Arrival Window
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> $129 Upfront Flat Diagnostic
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black h-12 px-6 shadow-md transition-all"
              >
                <Link href="/book?serviceId=svc-ac-repair">
                  <span>Schedule Diagnostic ($129 Flat Rate)</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 font-bold text-sm text-navy-900 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Phone className="mr-2 h-4 w-4 text-orange-600" />
                <span>Call {businessConfig.phone}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image
                src="/images/svc-ac-repair.jpg"
                alt="AC Condenser Diagnostic and Repair"
                fill
                quality={85}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
              <div className="absolute bottom-4 left-4 right-4 bg-navy-900/90 backdrop-blur-md text-white p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-orange-400 block">Mobile Warehouse Van</span>
                  <span className="text-[11px] text-slate-300">Over 300 OEM HVAC Parts Onboard</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  94% 1st-Trip Fix
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Phase Diagnostic Protocol */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
            Engineering Precision
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
            Our 4-Phase Systematic Diagnostic Protocol
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We don&apos;t guess or swap parts blindly. Every service call follows our rigorous digital diagnostic standard to identify the true root cause before presenting your upfront quote.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {diagnosticPhases.map((phase, idx) => {
            const Icon = phase.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {phase.phase}
                    </span>
                    <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-navy-950">{phase.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Common Problems Solved Grid */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto bg-slate-50 rounded-3xl border border-slate-200 my-8 space-y-8">
        <div className="max-w-3xl space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
            AC Symptoms &amp; Root Causes We Resolve
          </h2>
          <p className="text-sm text-slate-600">
            If your cooling system displays any of these symptoms, our technicians can resolve it on-site today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commonIssues.map((issue, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="font-bold text-navy-950 text-sm leading-snug">{issue.symptom}</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                <strong className="text-slate-800">Probable Cause:</strong> {issue.cause}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Truck Stock Inventory Spec */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
              Rolling Inventory
            </span>
            <h2 className="font-heading text-2xl font-black text-navy-950 mt-1">
              OEM Replacement Parts Carried on Every Dispatch Van
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            State License #{businessConfig.licenseNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {truckStockParts.map((part, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-1 shadow-sm"
            >
              <Wrench className="h-3.5 w-3.5 text-orange-500 mb-1" />
              <p className="font-bold text-navy-950 leading-tight">{part.name}</p>
              <p className="text-[11px] text-slate-500">{part.spec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <HelpCircle className="h-7 w-7 text-orange-500 mx-auto" />
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
            Frequently Asked Questions About AC Repair
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about our dispatch process, pricing, and warranty.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2"
            >
              <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center shrink-0 font-bold">
                  Q
                </span>
                {faq.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Booking Banner */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto pt-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-navy-800">
          <div className="space-y-1.5 text-left">
            <span className="text-xs uppercase tracking-wider text-orange-400 font-black">
              Same-Day Emergency Dispatch
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Restore Cold Air in Your Home Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Book online in 60 seconds with our upfront $129 diagnostic fee. Your $20 reservation deposit is applied directly to your invoice upon arrival.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black h-12 px-8 shadow-lg"
            >
              <Link href="/book?serviceId=svc-ac-repair">
                Book AC Repair Online
              </Link>
            </Button>
            <a
              href={cleanPhoneHref}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 font-bold text-sm text-white hover:bg-white/20 transition-all"
            >
              <Phone className="mr-2 h-4 w-4 text-orange-400" />
              <span>Call Dispatch</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
