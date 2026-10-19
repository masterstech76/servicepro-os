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
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const featuredServices = [
    {
      id: "svc-ac-repair",
      name: "AC Repair",
      desc: "Fast diagnostics, troubleshooting, and OEM part replacements for warm air, leaks, or noises.",
      price: "$129",
      rateType: "Flat Rate Diagnostic",
      href: "/services/ac-repair",
      icon: Snowflake,
      iconBg: "bg-orange-50 text-orange-600",
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
      iconBg: "bg-slate-100 text-navy-900",
      image: "/images/svc-ac-tuneup.jpg",
    },
    {
      id: "svc-thermostat-install",
      name: "Thermostat Installation",
      desc: "Smart or programmable thermostat installation, C-wire verification, and mobile app setup.",
      price: "$149",
      rateType: "Flat Rate",
      href: "/services/thermostat-install",
      icon: Sliders,
      iconBg: "bg-slate-100 text-navy-900",
      image: "/images/svc-thermostat-install.jpg",
    },
    {
      id: "svc-furnace-repair",
      name: "Furnace & Heating Repair",
      desc: "Ignition system repair, heat exchanger safety check, and blower motor maintenance.",
      price: "$129",
      rateType: "Flat Rate",
      href: "/services/furnace-repair",
      icon: Flame,
      iconBg: "bg-orange-50 text-orange-600",
      image: "/images/svc-furnace-repair.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-navy-900 font-sans selection:bg-orange-500 selection:text-white">
      <main className="flex-1">
        {/* ========================================================
            HERO SECTION: Two-Column Layout (Orange & Deep Navy Theme)
            Left: Headline, Benefits, Action Buttons, Trust Stack
            Right: Professional HVAC Technician Photo in Orange Border Frame
            ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-white pt-8 pb-16 lg:pt-14 lg:pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* LEFT COLUMN: ~60% Width */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* 60-Minute Arrival Guarantee Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-500/40 px-3.5 py-1 text-xs font-bold text-orange-700 tracking-wide">
                  <Zap className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                  <span>60-MINUTE ARRIVAL GUARANTEE</span>
                </div>

                {/* Main Headline */}
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-navy-900 leading-[1.08]">
                  HVAC Service You Can{" "}
                  <span className="text-orange-600">Count On. Every Time.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                  Fast, reliable HVAC repair, installation &amp; maintenance with upfront pricing and live technician tracking. Certified, background-checked technicians ready same-day.
                </p>

                {/* 4 Feature Badges */}
                <div className="grid grid-cols-2 gap-4 pt-1 text-xs text-slate-800 font-semibold">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 leading-tight">60-Minute</div>
                      <div className="text-[11px] text-slate-500 font-normal">Arrival Window</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 leading-tight">Upfront</div>
                      <div className="text-[11px] text-slate-500 font-normal">Flat-Rate Pricing</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 leading-tight">100% Deposit</div>
                      <div className="text-[11px] text-slate-500 font-normal">Credited to Bill</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 leading-tight">Real-Time SMS</div>
                      <div className="text-[11px] text-slate-500 font-normal">Updates</div>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
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

                {/* Verified Reviews Stack */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-navy-900">4.9/5 from 1,200+ Verified Customers</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Check className="h-4 w-4 text-emerald-600 stroke-[3]" />
                    <span>State Licensed #{businessConfig.licenseNumber}</span>
                    <span>•</span>
                    <span>$2M Insured</span>
                    <span>•</span>
                    <span>Background Checked</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Professional Technician Photo */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full max-w-[460px] h-[480px] sm:h-[540px]">
                  <Image
                    src="/images/technician-hero.png"
                    alt="Certified TechWork HVAC technician"
                    fill
                    priority
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 460px"
                    className="object-contain object-bottom drop-shadow-xl"
                  />
                  
                  {/* Floating CA License Badge */}
                  <div className="absolute top-6 right-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2 shadow-xl flex items-center gap-2 z-10">
                    <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">State Lic</div>
                      <div className="text-xs font-black text-navy-900 leading-tight">#{businessConfig.licenseNumber}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            DARK TRUST AND GUARANTEES STRIP (Deep Navy)
            4 Evenly Distributed Columns
            ======================================================== */}
        <section className="bg-navy-900 text-white py-8 border-y border-navy-800 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Col 1: Customer Ratings */}
            <div className="flex items-start gap-3.5 sm:border-r border-slate-800 pr-4">
              <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-500">
                <Star className="h-5 w-5 fill-orange-500 text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">5-Star Rated</div>
                <div className="text-xs text-slate-400">1,200+ Customer Reviews</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-extrabold text-white">Google</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2: Licensed & Certified */}
            <div className="flex items-start gap-3.5 sm:border-r border-slate-800 pr-4">
              <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Licensed &amp; Certified</div>
                <div className="text-xs text-slate-400">Lic #{businessConfig.licenseNumber}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                    NATE
                  </span>
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                    EPA CERTIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Col 3: Arrival Guarantee */}
            <div className="flex items-start gap-3.5 sm:border-r border-slate-800 pr-4">
              <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-500">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">60-Minute Guarantee</div>
                <div className="text-xs text-slate-400">On-Time or $50 Credit</div>
                <div className="text-[11px] text-orange-400 font-semibold mt-1 flex items-center gap-1">
                  <span>🚚 Live Tracked Dispatch</span>
                </div>
              </div>
            </div>

            {/* Col 4: Upfront Pricing */}
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-500">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Upfront Pricing</div>
                <div className="text-xs text-slate-400">No Hidden Fees Ever</div>
                <div className="text-[10px] font-bold text-orange-400 mt-1 uppercase tracking-wider">
                  100% Deposit Credited
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            POPULAR HVAC SERVICES: 4-Column Card Grid with real links
            ======================================================== */}
        <section id="services" className="py-16 bg-white px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
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
                className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                <span>View All Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${svc.iconBg}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-heading text-base font-bold text-navy-900">{svc.name}</h3>
                          <p className="text-[11px] text-slate-500">{svc.rateType}</p>
                        </div>
                      </div>
                      <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-3.5">
                        <Image
                          src={svc.image}
                          alt={svc.name}
                          fill
                          quality={85}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {svc.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <div className="text-base font-black text-navy-900">{svc.price}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Flat Rate</div>
                      </div>
                      <Link
                        href={svc.href}
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200 transition-colors"
                      >
                        <span>View Details</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            ADDITIONAL SECTIONS:
            1. How It Works (Links to /how-it-works)
            2. Customer Reviews (Links to /reviews)
            3. Specials (Links to /specials)
            4. Service Areas (Links to /areas)
            ======================================================== */}
        <section className="py-16 bg-orange-50/30 border-y border-slate-200/80 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider">01. Simple Process</span>
              <h3 className="font-heading text-xl font-bold text-navy-900">How Online Booking Works</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick your arrival window, get real-time SMS updates with your technician&apos;s photo, and pay digitally after inspection.
              </p>
              <Link href="/how-it-works" className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline pt-2">
                <span>Learn How It Works</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider">02. Seasonal Savings</span>
              <h3 className="font-heading text-xl font-bold text-navy-900">Coupons &amp; Specials</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save $25 on your first AC repair diagnostic or book our $89 21-point seasonal maintenance special.
              </p>
              <Link href="/specials" className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline pt-2">
                <span>View All Specials</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider">03. Rapid Coverage</span>
              <h3 className="font-heading text-xl font-bold text-navy-900">Service Areas &amp; Dispatch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technicians dispatched locally across Miami-Dade and surrounding areas with 60-minute guaranteed arrival.
              </p>
              <Link href="/areas" className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline pt-2">
                <span>Explore Service Areas</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="bg-gradient-to-b from-navy-900 via-navy-900/95 to-navy-950 text-white py-12 px-4 sm:px-6 text-center border-t border-navy-800/80">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white">
              Ready to Get Your AC Running Cold?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Book online in 60 seconds with upfront pricing and guaranteed arrival windows.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button asChild size="md" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black px-8 h-12 shadow-lg">
                <Link href="/book">Book Online Now</Link>
              </Button>
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center px-6 rounded-xl border border-slate-700 bg-navy-900 text-white font-bold text-sm hover:bg-white hover:text-navy-900 transition-all"
              >
                Call {businessConfig.phone}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
