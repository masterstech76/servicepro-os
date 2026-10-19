import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Gauge,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Phone,
  Clock,
  AlertTriangle,
  Zap,
  Snowflake,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Refrigerant Leak Detection & Recharge (Freon / R-410A) | ${businessConfig.businessName}`,
  description: `EPA Section 608 certified electronic leak detection, nitrogen pressure testing, and refrigerant recharge in ${businessConfig.city}. Upfront flat rate diagnostics.`,
};

export default function RefrigerantRechargePage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const symptoms = [
    {
      title: "AC Blowing Warm or Lukewarm Air",
      desc: "Low refrigerant levels prevent the evaporator coil from absorbing heat, leaving air uncooled.",
      icon: AlertTriangle,
    },
    {
      title: "Ice Formation on Copper Line or Coil",
      desc: "Reduced pressure causes coil temperature to drop below freezing, turning condensation into thick ice.",
      icon: Snowflake,
    },
    {
      title: "Hissing or Bubbling Sound Near Air Handler",
      desc: "Refrigerant escaping under high pressure through cracked copper tubing or loose Schrader valves.",
      icon: Zap,
    },
    {
      title: "AC Runs Continuously Without Reaching Setpoint",
      desc: "Compressor runs 24/7 trying to cool the house, wasting electricity and risking motor burnout.",
      icon: Clock,
    },
    {
      title: "High Indoor Humidity & Sticky Air",
      desc: "Inadequate refrigerant flow prevents the system from properly condensing moisture out of the air.",
      icon: Gauge,
    },
    {
      title: "Sudden Spike in Monthly Power Bills",
      desc: "Loss of capacity forces the outdoor condenser to draw heavy amperage for extended runtimes.",
      icon: ShieldCheck,
    },
  ];

  const protocolSteps = [
    {
      step: "01",
      title: "Electronic Sniffer Detection",
      desc: "We scan indoor coils, service ports, and line sets with heated-diode leak detectors sensitive to 0.1 oz/year.",
    },
    {
      step: "02",
      title: "Nitrogen Pressure Decay Test",
      desc: "The system is pressurized with dry nitrogen up to 250 PSI to locate pinhole leaks without wasting refrigerant.",
    },
    {
      step: "03",
      title: "Joint Brazing & Valve Seal",
      desc: "Technicians silver-solder cracked copper lines or replace leaking Schrader cores using isolation tools.",
    },
    {
      step: "04",
      title: "Factory Subcooling Balancing",
      desc: "Virgin R-410A or R-22 is digitally weighed in to exact manufacturer subcooling target specs (±1°F).",
    },
  ];

  const faqs = [
    {
      q: "Why shouldn't I just keep adding refrigerant without fixing the leak?",
      a: "AC systems are closed loops that never 'consume' refrigerant. Adding freon without fixing the leak is illegal under EPA regulations, damages the compressor, and wastes money as gas leaks back into the atmosphere.",
    },
    {
      q: "Do you carry both R-410A and older R-22 Freon?",
      a: "Yes. Our mobile warehouse trucks stock virgin EPA-certified R-410A and reclaimed R-22 for legacy air conditioning systems.",
    },
    {
      q: "How much does a refrigerant recharge cost?",
      a: "Our flat diagnostic fee is $129, which includes leak detection and pressure testing. Labor is $125/hr, plus refrigerant charged per pound with transparent pricing.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: "Refrigerant Leak Test & Recharge" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5" />
              EPA Section 608 Universal Certified
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight leading-tight">
              Refrigerant Leak Detection &amp;{" "}
              <span className="text-orange-600">Precision Recharge</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              If your AC is blowing warm air or ice is forming on copper lines, topping off refrigerant without finding the leak won&apos;t fix it. Our EPA-certified technicians pinpoint leaks, seal fittings, and digitally weigh in refrigerant.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-orange-600" /> EPA 608 Universal License
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-orange-600" /> 60-Minute Rapid Arrival
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Digital Scales Calibration
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-7 shadow-md"
              >
                <Link href="/book?serviceId=svc-refrigerant-recharge">
                  <span>Schedule Diagnostic ($129 Flat Rate)</span>
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
                src="/images/svc-refrigerant-recharge.jpg"
                alt="Manifold gauges connected to AC condenser for refrigerant recharge"
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

      {/* Warning Symptoms */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Warning Signs
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-1">
            Common Signs Your AC Has a Refrigerant Leak
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Operating a system low on refrigerant causes compressor overheating and permanent mechanical seizure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symptoms.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-orange-300 transition-all space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
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

      {/* 4-Step Protocol */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              Our 4-Stage Leak Test &amp; Calibration Protocol
            </h2>
            <p className="text-sm text-slate-600">
              We ensure your cooling system holds pressure and operates at peak energy efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {protocolSteps.map((st) => (
              <div
                key={st.step}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <span className="font-heading font-black text-3xl text-orange-500">
                  {st.step}
                </span>
                <h3 className="font-heading font-bold text-base text-navy-950">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-navy-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-navy-800">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-orange-400">
              Upfront Diagnostic Pricing
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
              $129 Leak Test &amp; Diagnostic
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Includes full electronic sniffer leak detection, operating pressure test, and an itemized repair estimate before any work begins. Your $20 online deposit is credited to the bill.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-8 shadow-lg w-full sm:w-auto"
            >
              <Link href="/book?serviceId=svc-refrigerant-recharge">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Schedule Refrigerant Service</span>
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
            Refrigerant Service FAQs
          </h2>
          <p className="text-xs text-slate-500">
            Answers regarding freon leak repairs, R-410A, and EPA compliance.
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
