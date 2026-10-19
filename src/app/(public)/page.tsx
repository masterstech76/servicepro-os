"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Calendar,
  ArrowRight,
  Star,
  Check,
  Zap,
  Flame,
  Wrench,
  Snowflake,
  Sliders,
  DollarSign,
  MessageSquare,
  ChevronRight,
  MapPin,
  Wind,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const allServices = [
    {
      id: "svc-ac-repair",
      name: "AC Repair & Diagnostic",
      desc: "Fast diagnostics, troubleshooting, and OEM part replacements for warm air, leaks, or noises.",
      price: "$129",
      rateType: "Flat Rate Diagnostic",
      href: "/services/ac-repair",
      icon: Snowflake,
      image: "/images/svc-ac-repair.jpg",
    },
    {
      id: "svc-ac-tuneup",
      name: "AC Tune-Up & Maintenance",
      desc: "21-point seasonal inspection, coil rinse, drain line flush, and refrigerant pressure check.",
      price: "$89",
      rateType: "Seasonal Special",
      href: "/services/ac-tuneup",
      icon: Wrench,
      image: "/images/svc-ac-tuneup.jpg",
    },
    {
      id: "svc-emergency-hvac",
      name: "24/7 Emergency HVAC",
      desc: "Priority dispatch within 60 minutes for complete cooling loss, frozen coils, or electrical failure.",
      price: "$169",
      rateType: "Priority Dispatch",
      href: "/services/emergency-hvac",
      icon: Zap,
      image: "/images/svc-ac-repair.jpg",
    },
    {
      id: "svc-duct-cleaning",
      name: "Air Duct Cleaning & Sanitizing",
      desc: "Whole-home negative air pressure duct vacuuming, antimicrobial fogging, and dryer vent sweep.",
      price: "$299",
      rateType: "Flat Rate",
      href: "/services/duct-cleaning",
      icon: Wind,
      image: "/images/svc-duct-cleaning.jpg",
    },
    {
      id: "svc-thermostat-install",
      name: "Smart Thermostat Installation",
      desc: "Google Nest, Ecobee, or Honeywell smart thermostat install, C-wire wiring, and phone app setup.",
      price: "$149",
      rateType: "Flat Rate",
      href: "/services/thermostat-install",
      icon: Sliders,
      image: "/images/svc-thermostat-install.jpg",
    },
    {
      id: "svc-refrigerant-recharge",
      name: "Refrigerant Recharge & Leak Test",
      desc: "Nitrogen pressure leak detection, Schrader valve tightening, and R410A / R22 subcooling balance.",
      price: "$189",
      rateType: "Diagnostic + First Lb",
      href: "/services/refrigerant-recharge",
      icon: Snowflake,
      image: "/images/svc-refrigerant-recharge.jpg",
    },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Book in 60 Seconds",
      desc: "Pick your exact 2-hour arrival window online. Zero waiting on hold.",
    },
    {
      step: "02",
      title: "Live Tech Tracking",
      desc: "Receive real-time SMS alerts with your certified technician's photo and GPS ETA.",
    },
    {
      step: "03",
      title: "Upfront Digital Quote",
      desc: "Detailed digital estimate before any repair begins. Deposit 100% credited to invoice.",
    },
    {
      step: "04",
      title: "100% Fixed-Right",
      desc: "Cold air restored and backed by our 1-year limited parts and labor warranty.",
    },
  ];

  const featuredReviews = [
    {
      author: "David M.",
      location: "Brickell, Miami",
      rating: 5,
      date: "October 14, 2026",
      text: "AC stopped blowing cold on a 92° Sunday. Carlos arrived in 35 mins, replaced the dual run capacitor, and had cold 56° air blasting before noon. Truly upfront pricing.",
      tag: "AC Repair",
    },
    {
      author: "Elena & Carlos S.",
      location: "Downtown Miami",
      rating: 5,
      date: "October 8, 2026",
      text: "Booked the $89 tune-up. Marcus put on boot covers, cleared our drain line with biocidal wash, and sent high-res before/after photos. Electric bill is already dropping!",
      tag: "Tune-Up",
    },
    {
      author: "Marcus K.",
      location: "Coral Gables",
      rating: 5,
      date: "September 29, 2026",
      text: "Installed Google Nest with custom C-wire in our 1950s house. Clean installation, paired to both our phones, and deposit applied directly to the final bill.",
      tag: "Smart Thermostat",
    },
  ];

  const neighborhoodChips = [
    { name: "Brickell", href: "/service-areas/brickell" },
    { name: "Downtown Miami", href: "/service-areas/downtown-miami" },
    { name: "Coral Gables", href: "/service-areas/coral-gables" },
    { name: "Coconut Grove", href: "/areas" },
    { name: "Kendall", href: "/areas" },
    { name: "Doral", href: "/areas" },
    { name: "Miami Beach", href: "/areas" },
    { name: "Wynwood", href: "/areas" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-navy-900 font-sans selection:bg-orange-500 selection:text-white">
      <main className="flex-1 space-y-16 lg:space-y-20 pb-16">
        {/* ========================================================
            1. HERO SECTION: 2-Col (6+6)
            Left: Headline, 2 Buttons, Trust Proof
            Right: Technician Photo + 2 Floating Badges
            ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-white pt-8 pb-12 lg:pt-12 lg:pb-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column (6 Cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-500/40 px-3.5 py-1 text-xs font-bold text-orange-700 tracking-wide">
                  <Zap className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                  <span>60-MINUTE ARRIVAL GUARANTEE</span>
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-navy-900 leading-[1.08]">
                  HVAC Service You Can{" "}
                  <span className="text-orange-600">Count On. Every Time.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Same-day AC repair, 21-point seasonal maintenance, and certified duct cleaning across {businessConfig.city}. Upfront flat rates with guaranteed 2-hour arrival windows.
                </p>

                {/* 2 Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="#services"
                    className="flex-1 max-w-[280px] flex items-center justify-between rounded-2xl bg-orange-500 hover:bg-orange-600 text-navy-900 px-6 py-4 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all text-left font-black"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
                        <Wrench className="h-5 w-5 text-navy-900" />
                      </div>
                      <div>
                        <div className="text-base leading-tight">Explore Services</div>
                        <div className="text-xs text-navy-900/80 font-semibold">View Upfront Pricing</div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-navy-900 ml-2 shrink-0" />
                  </Link>

                  <a
                    href={cleanPhoneHref}
                    className="flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-300 bg-white px-6 py-4 text-navy-900 font-bold text-sm hover:border-orange-500 hover:bg-orange-50 transition-all shadow-sm"
                  >
                    <Phone className="h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="text-[11px] text-slate-500 leading-none uppercase tracking-wider font-semibold">24/7 Dispatch</div>
                      <div className="font-black text-sm text-navy-900 leading-tight mt-0.5">{businessConfig.phone}</div>
                    </div>
                  </a>
                </div>

                {/* Trust Proof Row */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-navy-900">4.9/5 from 1,200+ Verified Customers</span>
                  </div>
                  <div className="text-slate-400">•</div>
                  <div className="font-medium text-slate-600">
                    State Lic #{businessConfig.licenseNumber} • $2M Insured
                  </div>
                </div>
              </div>

              {/* Right Column (5 Cols): Photo + 2 Floating Badges */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full max-w-[440px] h-[460px] sm:h-[500px]">
                  <Image
                    src="/images/technician-hero.png"
                    alt="Certified TechWork HVAC technician"
                    fill
                    priority
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-contain object-bottom drop-shadow-xl"
                  />
                  
                  {/* Floating Badge 1: State Mechanical License */}
                  <div className="absolute top-4 right-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2.5 z-10">
                    <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">State Mechanical</div>
                      <div className="text-xs font-black text-navy-900 leading-tight mt-0.5">Lic #{businessConfig.licenseNumber}</div>
                    </div>
                  </div>

                  {/* Floating Badge 2: 60-Minute Arrival */}
                  <div className="absolute bottom-6 left-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2.5 z-10">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">Guaranteed Arrival</div>
                      <div className="text-xs font-black text-navy-900 leading-tight mt-0.5">60-Min Emergency</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. QUICK ACCESS: 4 Horizontal Icon Pills
            ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/services/ac-repair"
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Snowflake className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-navy-950">AC Repair</span>
                <span className="block text-[11px] text-slate-500 font-medium">From $129</span>
              </div>
            </Link>

            <Link
              href="/services/ac-tuneup"
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-navy-950">Tune-Up Special</span>
                <span className="block text-[11px] text-slate-500 font-medium">Just $89</span>
              </div>
            </Link>

            <Link
              href="/services/emergency-hvac"
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-navy-950">24/7 Emergency</span>
                <span className="block text-[11px] text-rose-600 font-medium">60-Min Dispatch</span>
              </div>
            </Link>

            <Link
              href="/services/duct-cleaning"
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Wind className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-navy-950">Duct Sanitizing</span>
                <span className="block text-[11px] text-slate-500 font-medium">From $299</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ========================================================
            3. SERVICES GRID: 3 Cols x 2 Rows = 6 Cards + 7th View All
            Uniform Card Skeleton
            ======================================================== */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                Our Most Popular HVAC Services
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Upfront flat rates. Click any service to view full diagnostics, warranty, and pricing details.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>View All 8 Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="group rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Modern Image Container with Tags */}
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                      <Image
                        src={svc.image}
                        alt={svc.name}
                        fill
                        quality={85}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-navy-900 font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
                        <Icon className="h-3 w-3 text-orange-600" />
                        <span>{svc.rateType}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-navy-900/95 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                        {svc.price}
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <h3 className="font-heading text-lg font-bold text-navy-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {svc.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={svc.href}
                      className="text-xs font-bold text-slate-700 hover:text-orange-600 flex items-center gap-1 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <Button asChild size="sm" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black text-xs px-4 h-9 shadow-sm">
                      <Link href={`/book?serviceId=${svc.id}`}>
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* 7th Card: Commercial or Other HVAC */}
            <div className="rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/30 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-navy-950 flex items-center justify-center shadow-sm">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-navy-950">Commercial &amp; Custom HVAC</h3>
              <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                Looking for multi-unit retail, rooftop packaged units, or customized preventative maintenance?
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <span>Browse All 8 Services</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. HOW IT WORKS: 4 Numbered Horizontal Steps
            ======================================================== */}
        <section className="bg-slate-50/70 border-y border-slate-200 py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
                Transparent &amp; Streamlined
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
                How Online Service Booking Works
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorksSteps.map((s, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 relative">
                  <div className="font-heading font-black text-2xl text-orange-500">
                    {s.step}
                  </div>
                  <h3 className="font-heading text-base font-bold text-navy-950">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            5. REVIEWS: 3-Col Review Cards with Avatars on Top
            ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-navy-950">4.9 / 5.0 Rating</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
                Verified Customer Feedback
              </h2>
            </div>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Explore Community Feed</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredReviews.map((rev, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-xs">
                        {rev.author[0]}
                      </div>
                      <div>
                        <span className="block font-bold text-xs text-navy-950">{rev.author}</span>
                        <span className="block text-[11px] text-slate-400 font-medium">{rev.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      {rev.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{rev.date}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified Job
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            6. AREAS STRIP: 8 Neighborhood Chips
            ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-navy-950 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  Service Areas Across {businessConfig.city}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  60-minute emergency arrival coverage across major neighborhoods.
                </p>
              </div>
              <Link href="/areas" className="text-xs font-bold text-orange-600 hover:underline">
                View All Areas Directory →
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {neighborhoodChips.map((chip, i) => (
                <Link
                  key={i}
                  href={chip.href}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-orange-500 hover:text-orange-600 shadow-sm transition-all"
                >
                  {chip.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
