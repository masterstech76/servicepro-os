"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Lock,
  ChevronRight,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>("svc-ac-repair");

  const servicesList = [
    {
      id: "svc-ac-repair",
      name: "AC Repair",
      desc: "Diagnose & fix AC problems fast",
      price: "$129",
      rateType: "Flat Rate",
      icon: Snowflake,
      iconBg: "bg-blue-50 text-blue-600",
      image: "/images/svc-ac-repair.jpg",
    },
    {
      id: "svc-ac-tuneup",
      name: "AC Tune-Up",
      desc: "Prevent breakdowns & save energy",
      price: "$89",
      rateType: "Flat Rate",
      icon: Wrench,
      iconBg: "bg-slate-100 text-slate-700",
      image: "/images/svc-ac-tuneup.jpg",
    },
    {
      id: "svc-thermostat-install",
      name: "Thermostat Installation",
      desc: "Install smart thermostat",
      price: "$149",
      rateType: "Flat Rate",
      icon: Sliders,
      iconBg: "bg-slate-100 text-slate-700",
      image: "/images/svc-thermostat-install.jpg",
    },
    {
      id: "svc-furnace-repair",
      name: "Furnace Repair",
      desc: "Heating repair & maintenance",
      price: "$129",
      rateType: "Flat Rate",
      icon: Flame,
      iconBg: "bg-orange-50 text-orange-600",
      image: "/images/svc-furnace-repair.jpg",
    },
  ];

  const stepsList = [
    { num: 1, label: "Service", active: true },
    { num: 2, label: "Zip Code", active: false },
    { num: 3, label: "Issue", active: false },
    { num: 4, label: "Time", active: false },
    { num: 5, label: "Details", active: false },
    { num: 6, label: "Pay", active: false },
    { num: 7, label: "Confirm", active: false },
  ];

  function handleQuickWizardContinue() {
    router.push(`/book?serviceId=${selectedServiceId}`);
  }

  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <main className="flex-1">
        {/* ========================================================
            HERO SECTION: 3-Column Split exactly as in design mock
            Left: Headline, Subtitle, 4 Perks, 2 CTAs, Rating & Avatars
            Center: High-res Technician in TechWork Navy Uniform
            Right: Floating Interactive 60-Second Booking Card
            ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF]/70 via-white to-white pt-6 pb-12 lg:pt-10 lg:pb-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* LEFT COLUMN: Main Typography & Value Props */}
              <div className="lg:col-span-5 space-y-6 z-10 text-left">
                {/* 60-Minute Arrival Guarantee Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/70 px-3.5 py-1 text-xs font-bold text-blue-700 tracking-wide">
                  <Zap className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
                  <span>60-MINUTE ARRIVAL GUARANTEE</span>
                </div>

                {/* Main Headline */}
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#0F172A] leading-[1.08]">
                  HVAC Service You Can{" "}
                  <span className="text-[#0066FF]">Count On. Every Time.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg">
                  Fast, reliable HVAC repair, installation &amp; maintenance with upfront pricing and live technician tracking. Book online in 60 seconds.
                </p>

                {/* 4 Feature Badges (2x2 Grid) */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">60-Minute</div>
                      <div className="text-[11px] text-slate-500">Arrival Window</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">Upfront</div>
                      <div className="text-[11px] text-slate-500">Flat-Rate Pricing</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">100% Deposit</div>
                      <div className="text-[11px] text-slate-500">Credited to Bill</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">Real-Time SMS</div>
                      <div className="text-[11px] text-slate-500">Updates</div>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link
                    href="/book"
                    className="flex-1 flex items-center justify-between rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 py-3.5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm sm:text-base leading-tight">Book Online</div>
                        <div className="text-[11px] text-blue-100 font-medium">Schedule in 60 Seconds</div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white ml-2" />
                  </Link>

                  <a
                    href={cleanPhoneHref}
                    className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-slate-800 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Phone className="h-4 w-4 text-blue-600" />
                    <div className="text-left">
                      <div className="text-xs text-slate-500 leading-none">Call Now</div>
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight mt-0.5">(888) 555-0198</div>
                    </div>
                  </a>
                </div>

                {/* Reviews & Trust Badges */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900">4.9/5 from 1,200+ Customers</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-400 overflow-hidden relative">
                      <Image src="/images/svc-ac-repair.jpg" alt="Reviewer" fill className="object-cover" />
                    </div>
                    <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-300 overflow-hidden relative">
                      <Image src="/images/svc-ac-tuneup.jpg" alt="Reviewer" fill className="object-cover" />
                    </div>
                    <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden relative">
                      <Image src="/images/svc-thermostat-install.jpg" alt="Reviewer" fill className="object-cover" />
                    </div>
                    <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-100 overflow-hidden relative">
                      <Image src="/images/svc-furnace-repair.jpg" alt="Reviewer" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                    <span>Licensed</span>
                    <span>•</span>
                    <span>Insured</span>
                    <span>•</span>
                    <span>Background Checked</span>
                  </div>
                </div>
              </div>

              {/* CENTER COLUMN: Technician Image with Floating CA License Badge */}
              <div className="lg:col-span-3 relative flex items-center justify-center my-4 lg:my-0">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none h-[380px] sm:h-[460px] lg:h-[500px]">
                  <Image
                    src="/images/hero.jpg"
                    alt="TechWork HVAC technician"
                    fill
                    priority
                    className="object-cover object-top rounded-3xl"
                  />
                  {/* Floating CA License Badge at Bottom of Technician */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-5 py-2.5 shadow-xl flex items-center gap-2 whitespace-nowrap">
                    <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">CA License</div>
                      <div className="text-xs font-black text-slate-900 leading-tight">#CAC1819420</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive 60-Second Booking Card */}
              <div className="lg:col-span-4 z-10">
                <div className="rounded-[24px] border border-slate-200/90 bg-white p-6 shadow-2xl space-y-5">
                  {/* Card Title & 60 Sec Icon */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold text-slate-900">
                      Book Your Service in 60 Seconds
                    </h2>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      <Clock className="h-3 w-3" />
                      <span>60 SEC</span>
                    </div>
                  </div>

                  {/* 7-Step Indicator */}
                  <div className="flex items-center justify-between text-center border-b border-slate-100 pb-3">
                    {stepsList.map((st) => (
                      <div key={st.num} className="flex flex-col items-center">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            st.active
                              ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/30"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {st.num}
                        </div>
                        <span className={`text-[9px] mt-1 font-semibold ${st.active ? "text-blue-600 font-bold" : "text-slate-400"}`}>
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Question */}
                  <div>
                    <div className="text-xs font-bold text-slate-900 mb-2.5">
                      What service do you need?
                    </div>

                    {/* 4 Interactive Service Option Cards */}
                    <div className="space-y-2">
                      {servicesList.map((svc) => {
                        const isSelected = selectedServiceId === svc.id;
                        const Icon = svc.icon;
                        return (
                          <div
                            key={svc.id}
                            onClick={() => setSelectedServiceId(svc.id)}
                            className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-2 border-[#0066FF] bg-blue-50/40 shadow-sm"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${svc.iconBg}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="text-left">
                                <div className="text-xs font-extrabold text-slate-900">{svc.name}</div>
                                <div className="text-[11px] text-slate-500">{svc.desc}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <div className="text-right">
                                <div className="text-xs font-black text-slate-900">{svc.price}</div>
                                <div className="text-[9px] text-slate-400 font-medium">{svc.rateType}</div>
                              </div>
                              <div
                                className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                  isSelected ? "bg-[#0066FF] text-white" : "border border-slate-300"
                                }`}
                              >
                                {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={handleQuickWizardContinue}
                    size="md"
                    className="w-full h-12 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* Secure Booking Tag */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-1">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span>Secure Booking</span>
                    <span>•</span>
                    <span>Your info is always protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            TRUST STRIP: Dark Navy Full-Width Bar with 4 Badges
            ======================================================== */}
        <section className="bg-[#090D1A] text-white py-8 border-y border-slate-800 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* 1. 5-Star Rated & Google Reviews */}
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                <Star className="h-5 w-5 fill-cyan-400 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">5-Star Rated</div>
                <div className="text-xs text-slate-400">1,200+ Google Reviews</div>
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

            {/* 2. Licensed & Certified */}
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Licensed &amp; Certified</div>
                <div className="text-xs text-slate-400">CA License #CAC1819420</div>
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

            {/* 3. 60-Minute Guarantee */}
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">60-Minute Guarantee</div>
                <div className="text-xs text-slate-400">On-Time or $50 Off</div>
                <div className="text-[11px] text-cyan-400 font-semibold mt-1 flex items-center gap-1">
                  <span>🚚 Tracked Live Van</span>
                </div>
              </div>
            </div>

            {/* 4. Upfront Pricing */}
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Upfront Pricing</div>
                <div className="text-xs text-slate-400">No Hidden Fees Ever</div>
                <div className="text-[10px] font-bold text-cyan-300 mt-1 uppercase tracking-wider">
                  100% Deposit Credited
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            OUR MOST POPULAR HVAC SERVICES: 4-Column Grid
            ======================================================== */}
        <section id="services" className="py-16 bg-white px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Our Most Popular HVAC Services
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Expert solutions for your home comfort needs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: AC Repair */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Snowflake className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900">AC Repair</h3>
                      <p className="text-xs text-slate-500">Fast diagnosis &amp; repair</p>
                    </div>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image src="/images/svc-ac-repair.jpg" alt="AC Repair unit" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-base font-black text-slate-900">$129</div>
                    <div className="text-[10px] text-slate-400 font-medium">Flat Rate</div>
                  </div>
                  <Link
                    href="/book?serviceId=svc-ac-repair"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Card 2: AC Tune-Up */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900">AC Tune-Up</h3>
                      <p className="text-xs text-slate-500">Keep your system running</p>
                    </div>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image src="/images/svc-ac-tuneup.jpg" alt="Technicians servicing AC" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-base font-black text-slate-900">$89</div>
                    <div className="text-[10px] text-slate-400 font-medium">Flat Rate</div>
                  </div>
                  <Link
                    href="/book?serviceId=svc-ac-tuneup"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Thermostat Install */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Sliders className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900">Thermostat Install</h3>
                      <p className="text-xs text-slate-500">Smart thermostat experts</p>
                    </div>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image src="/images/svc-thermostat-install.jpg" alt="Smart thermostat 72 degrees" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-base font-black text-slate-900">$149</div>
                    <div className="text-[10px] text-slate-400 font-medium">Flat Rate</div>
                  </div>
                  <Link
                    href="/book?serviceId=svc-thermostat-install"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Card 4: Furnace Repair */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900">Furnace Repair</h3>
                      <p className="text-xs text-slate-500">Heating repair &amp; safety</p>
                    </div>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image src="/images/svc-furnace-repair.jpg" alt="Furnace heating equipment" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-base font-black text-slate-900">$129</div>
                    <div className="text-[10px] text-slate-400 font-medium">Flat Rate</div>
                  </div>
                  <Link
                    href="/book?serviceId=svc-ac-repair"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            BOTTOM BLUE CONVERSION BAND: Exact match to mock
            Left: Calendar icon + Ready to Book? Join 1,200+ happy customers
            Center: 60-Minute, Upfront, 100% Deposit Credited
            Right: White High-Converting Button "Book Online Now"
            ======================================================== */}
        <section className="bg-[#0066FF] text-white py-6 px-4 sm:px-8 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Ready to Book */}
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-lg font-black text-white leading-tight">Ready to Book?</div>
                <div className="text-xs text-blue-100 font-medium">Join 1,200+ happy customers</div>
              </div>
            </div>

            {/* Center: 3 Mini Value Props */}
            <div className="hidden md:flex items-center gap-8 text-left text-xs font-medium text-blue-50">
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-cyan-300" />
                <div>
                  <div className="font-extrabold text-white">60-Minute</div>
                  <div className="text-blue-100">Arrival Window</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <div>
                  <div className="font-extrabold text-white">Upfront</div>
                  <div className="text-blue-100">Flat-Rate Pricing</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <DollarSign className="h-4 w-4 text-cyan-300" />
                <div>
                  <div className="font-extrabold text-white">100% Deposit</div>
                  <div className="text-blue-100">Credited to Bill</div>
                </div>
              </div>
            </div>

            {/* Right: White High-Converting Button */}
            <div>
              <Link
                href="/book"
                className="inline-flex items-center justify-between gap-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 px-7 py-3.5 shadow-2xl transition-all group"
              >
                <div className="text-left">
                  <div className="font-black text-sm text-slate-900 leading-tight">Book Online Now</div>
                  <div className="text-[11px] text-blue-600 font-bold">Schedule in 60 Seconds</div>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
