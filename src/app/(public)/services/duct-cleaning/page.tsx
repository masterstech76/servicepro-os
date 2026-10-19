import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wind,
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  HeartPulse,
  Filter,
  Check,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Air Duct Cleaning & Sanitization | ${businessConfig.businessName}`,
  description: `Breathe cleaner air with whole-home negative-pressure duct cleaning, allergen removal, and botanical fogging in ${businessConfig.city}. Upfront flat rate of $249.`,
};

export default function DuctCleaningServicePage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const warningSigns = [
    {
      title: "Visible Dust & Soot on Supply Registers",
      desc: "Black streaks or fluffy gray lint gathering around ceiling grilles and return vents.",
    },
    {
      title: "Musty or Stale Odors When AC Kicks On",
      desc: "Organic mildew or bacteria thriving inside the dark, humid interior of older duct lines.",
    },
    {
      title: "Allergy Flare-Ups & Morning Congestion",
      desc: "Air recirculation blowing dust mites, pet dander, and pollen back into occupied bedrooms.",
    },
    {
      title: "Recent Home Renovation or Drywall Dust",
      desc: "Fine sheetrock particulate, sawdust, and paint spray settling into HVAC returns.",
    },
    {
      title: "Uneven Airflow Between Rooms",
      desc: "Debris clogs or collapsed flex ducts restricting CFM airflow into specific bedrooms.",
    },
    {
      title: "Higher Than Normal Electric Bills",
      desc: "Clogged return ducts force the blower motor to pull high amperage trying to breathe.",
    },
  ];

  const processStages = [
    {
      step: "01",
      title: "Negative Pressure Hookup",
      desc: "We attach a commercial-grade HEPA negative-air collector to isolate and seal the air handler.",
    },
    {
      step: "02",
      title: "Rotary Brush Agitation",
      desc: "Motorized flexible cable brushes dislodge stubborn dirt, lint, and drywall dust from duct walls.",
    },
    {
      step: "03",
      title: "High-Pressure Air Whipping",
      desc: "Compressed air sweepers blast dust toward the vacuum, leaving trunk lines completely cleared.",
    },
    {
      step: "04",
      title: "Botanical Antimicrobial Fog",
      desc: "We mist an EPA-registered hospital-grade disinfectant that neutralizes mold spores and bacteria.",
    },
  ];

  const faqs = [
    {
      q: "How often should residential air ducts be professionally cleaned?",
      a: "The National Air Duct Cleaners Association (NADCA) recommends professional cleaning every 2 to 3 years, or immediately following home renovations or moving into a new residence.",
    },
    {
      q: "Does your $249 flat rate cover all vents in my home?",
      a: "Our $249 flat package covers whole-home duct sanitization for standard single-system homes (up to 10 vents). Additional supply vents or second HVAC systems are priced transparently at $20/vent.",
    },
    {
      q: "Is the disinfectant spray safe for pets and children?",
      a: "Yes. We use 100% EPA-registered, plant-based thyme oil botanical disinfectants that require zero evacuation time and leave no chemical residue.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: "Air Duct Cleaning" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
              <HeartPulse className="h-3.5 w-3.5" />
              Indoor Air Quality &amp; Allergen Defense
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight leading-tight">
              Whole-Home Air Duct Cleaning for{" "}
              <span className="text-orange-600">$249</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Remove years of trapped dust, pet dander, mold spores, and airborne allergens. We use commercial negative-pressure HEPA extractors and botanical sanitizers to restore fresh, crisp airflow.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Wind className="h-4 w-4 text-orange-600" /> High-Powered HEPA Vacuum
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-orange-600" /> EPA Botanical Disinfectant
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Whole-House Coverage
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-7 shadow-md"
              >
                <Link href="/book?serviceId=svc-duct-cleaning">
                  <span>Book Duct Cleaning ($249 Flat Rate)</span>
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
                src="/images/svc-duct-cleaning.jpg"
                alt="Air duct cleaning technician with rotary brush"
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

      {/* Warning Signs */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Diagnostic Checklist
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-1">
            Signs Your HVAC Ducts Require Immediate Sanitization
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            The EPA states indoor air can be 2 to 5 times more polluted than outside air. Look out for these common warning signs:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warningSigns.map((w, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-orange-300 transition-all space-y-2.5"
            >
              <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Check className="h-4 w-4" />
              </div>
              <h3 className="font-heading font-bold text-base text-navy-950">
                {w.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              Our 4-Stage Negative-Pressure Process
            </h2>
            <p className="text-sm text-slate-600">
              We never blow dust back into your living space. Everything is sealed and drawn outdoors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processStages.map((st) => (
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
              Upfront Flat Package
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
              $249 Whole-Home Duct Cleaning &amp; Sanitize
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Includes comprehensive multi-vent negative-pressure HEPA extraction, rotary whip cleaning, return plenum clearing, and hospital-grade EPA botanical fogging.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-8 shadow-lg w-full sm:w-auto"
            >
              <Link href="/book?serviceId=svc-duct-cleaning">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Schedule Duct Cleaning</span>
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
            Duct Cleaning FAQs
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about whole-home duct sanitization.
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
