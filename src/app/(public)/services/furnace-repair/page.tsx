import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Gauge,
  Thermometer,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Furnace & Heat Pump Repair | ${businessConfig.businessName}`,
  description: `Same-day furnace repair, electric heat strip replacement, and heat pump troubleshooting in ${businessConfig.city}. Upfront $129 flat diagnostic rate.`,
};

export default function FurnaceRepairPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const heatingIssues = [
    {
      title: "Furnace Blowing Cold Air",
      desc: "Faulty electronic ignition, bad flame sensor, or failed electric heating element sequencers.",
      icon: Thermometer,
    },
    {
      title: "Heat Pump Stuck in Cooling Mode",
      desc: "Failed reversing valve solenoid or defrost control board keeping the system locked in AC mode.",
      icon: Gauge,
    },
    {
      title: "Blower Motor Continuously Running",
      desc: "Stuck high-limit safety switch or faulty fan relay failing to shut down the indoor blower.",
      icon: Zap,
    },
    {
      title: "Strange Burning Odor or Rattling Noises",
      desc: "Overheating heat exchanger, cracked draft inducer motor housing, or loose blower bearings.",
      icon: AlertTriangle,
    },
    {
      title: "Frequent Short-Cycling Every Few Minutes",
      desc: "Restricted return airflow causing the primary limit switch to trip and shut off burners for safety.",
      icon: Clock,
    },
    {
      title: "Blank Thermostat or Tripped Breaker",
      desc: "Blown 3-amp low-voltage fuse or overloaded high-voltage circuit breaker during heating demand.",
      icon: ShieldCheck,
    },
  ];

  const safetySteps = [
    {
      step: "01",
      title: "Carbon Monoxide & Gas Safety",
      desc: "Electronic sniffer inspection to verify heat exchanger integrity and combustion safety.",
    },
    {
      step: "02",
      title: "Igniter & Sensor Diagnostics",
      desc: "Testing hot-surface igniter resistance and microamp signal output on the flame rod.",
    },
    {
      step: "03",
      title: "Limit Switch & Airflow Check",
      desc: "Inspecting high-temperature roll-out switches and checking static duct pressure.",
    },
    {
      step: "04",
      title: "Flat Upfront Repair Quote",
      desc: "You receive an exact price for parts and labor before any replacement work begins.",
    },
  ];

  const faqs = [
    {
      q: "Can you repair both electric furnaces and heat pump systems?",
      a: "Yes. Our technicians are factory-trained on electric air handlers, auxiliary heat strips, variable-speed heat pumps, and dual-fuel systems.",
    },
    {
      q: "What is included in the $129 diagnostic call?",
      a: "The $129 fee covers complete diagnostic troubleshooting, electrical circuit verification, safety switch tests, and an upfront repair estimate. Your $20 online deposit is credited to the total.",
    },
    {
      q: "Do your trucks carry heating replacement parts?",
      a: "Yes. We maintain universal igniters, sequencers, heating contactors, limit switches, and transformers inside our service vans for same-day fixes.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: "Furnace & Heating Repair" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5" />
              Heating &amp; Heat Pump Solutions
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight leading-tight">
              Furnace &amp; Heat Pump Repair in{" "}
              <span className="text-orange-600">60 Minutes</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Don&apos;t get left in the cold when seasonal drops hit. Our NATE-certified technicians diagnose heating failures, faulty heat strips, and heat pump issues on the first visit.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-orange-600" /> 60-Minute Rapid Arrival
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-orange-600" /> 1-Year Workmanship Warranty
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> $129 Flat Diagnostic
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-7 shadow-md"
              >
                <Link href="/book?serviceId=svc-furnace-repair">
                  <span>Book Furnace Repair ($129 Flat Rate)</span>
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
                src="/images/svc-furnace-repair.jpg"
                alt="HVAC technician inspecting electric heat handler"
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

      {/* Common Heating Problems */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Heating Diagnostics
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-1">
            Common Heating &amp; Heat Pump Problems We Fix
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Whether your heat pump is blowing cold air or your electric heat strips won&apos;t engage, we pinpoint the root cause fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heatingIssues.map((issue, idx) => {
            const Icon = issue.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-orange-300 transition-all space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-navy-950">
                  {issue.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {issue.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety Protocol */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              Our 4-Step Heating Safety Check
            </h2>
            <p className="text-sm text-slate-600">
              Safety always comes first. Every heating inspection includes thorough electrical and combustion testing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetySteps.map((s) => (
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

      {/* Pricing Card */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-navy-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-navy-800">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-orange-400">
              Transparent Heating Diagnostic
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
              $129 Complete Diagnostic Call
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Full safety check, electrical sequencer testing, high-limit switch verification, and an upfront flat quote before repair. Your $20 online deposit is 100% credited.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-8 shadow-lg w-full sm:w-auto"
            >
              <Link href="/book?serviceId=svc-furnace-repair">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Schedule Heating Repair</span>
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
            Furnace Repair FAQs
          </h2>
          <p className="text-xs text-slate-500">
            Answers to common questions about heating diagnostics and emergency service.
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
