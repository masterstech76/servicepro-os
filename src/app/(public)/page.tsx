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
  Sparkles,
  MapPin,
  Award,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();

  // Interactive 7-step wizard state
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>("svc-ac-repair");
  const [zipInput, setZipInput] = React.useState<string>("");
  const [zipChecking, setZipChecking] = React.useState<boolean>(false);
  const [zipResult, setZipResult] = React.useState<{ covered: boolean; message: string } | null>(null);
  const [issueText, setIssueText] = React.useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<string>("Today, 2:00 PM - 3:00 PM");

  const servicesList = [
    {
      id: "svc-ac-repair",
      name: "AC Repair",
      desc: "Diagnose & fix AC problems fast",
      price: "$129",
      rateType: "Flat Rate",
      icon: Snowflake,
      iconBg: "bg-[#F1F8FF] text-[#075BFF]",
    },
    {
      id: "svc-ac-tuneup",
      name: "AC Tune-Up",
      desc: "Prevent breakdowns & save energy",
      price: "$89",
      rateType: "Flat Rate",
      icon: Wrench,
      iconBg: "bg-slate-100 text-[#071633]",
    },
    {
      id: "svc-thermostat-install",
      name: "Thermostat Installation",
      desc: "Install smart thermostat",
      price: "$149",
      rateType: "Flat Rate",
      icon: Sliders,
      iconBg: "bg-slate-100 text-[#071633]",
    },
    {
      id: "svc-furnace-repair",
      name: "Furnace Repair",
      desc: "Heating repair & maintenance",
      price: "$129",
      rateType: "Flat Rate",
      icon: Flame,
      iconBg: "bg-[#F1F8FF] text-[#08BDEB]",
    },
  ];

  const stepsList = [
    { num: 1, label: "Service" },
    { num: 2, label: "Zip Code" },
    { num: 3, label: "Issue" },
    { num: 4, label: "Time" },
    { num: 5, label: "Details" },
    { num: 6, label: "Pay" },
    { num: 7, label: "Confirm" },
  ];

  function handleWizardNext() {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      if (zipInput.trim().length < 5) {
        setZipResult({ covered: false, message: "Please enter a valid 5-digit ZIP code." });
        return;
      }
      setZipChecking(true);
      setTimeout(() => {
        setZipChecking(false);
        setZipResult({ covered: true, message: "Great news! Technicians available in your area today." });
        setTimeout(() => {
          router.push(`/book?serviceId=${selectedServiceId}`);
        }, 600);
      }, 500);
      return;
    }
    router.push(`/book?serviceId=${selectedServiceId}`);
  }

  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#101A35] font-sans selection:bg-[#0866FF] selection:text-white pb-28">
      <main className="flex-1">
        {/* ========================================================
            HERO SECTION: Two-column layout with central technician photograph
            Exact Palette:
            - Deep navy: #071633
            - Primary blue: #075BFF
            - Electric blue: #0866FF
            - Cyan: #08BDEB
            - Pale blue bg: #F1F8FF
            ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F1F8FF]/80 via-white to-white pt-6 pb-12 lg:pt-10 lg:pb-16 px-4 sm:px-6">
          {/* Subtle pale-blue radial glow and decorative geometric polygon behind technician */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[560px] w-[900px] rounded-full bg-gradient-to-tr from-[#0866FF]/10 via-[#08BDEB]/10 to-transparent blur-3xl" />
          </div>

          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* LEFT CONTENT COLUMN: ~60% Width */}
              <div className="lg:col-span-7 space-y-6 z-10 text-left">
                {/* 1. Hero Trust Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F8FF] border border-[#0866FF]/30 px-3.5 py-1 text-xs font-bold text-[#075BFF] tracking-wider">
                  <Zap className="h-3.5 w-3.5 fill-[#0866FF] text-[#0866FF]" />
                  <span>60-MINUTE ARRIVAL GUARANTEE</span>
                </div>

                {/* 2. Main Hero Headline */}
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-[#071633] leading-[1.05]">
                  HVAC Service You Can{" "}
                  <span className="bg-gradient-to-r from-[#075BFF] via-[#0866FF] to-[#08BDEB] bg-clip-text text-transparent">
                    Count On. Every Time.
                  </span>
                </h1>

                {/* 3. Hero Description */}
                <p className="text-[#52617B] text-base sm:text-lg leading-relaxed max-w-[550px]">
                  Fast, reliable HVAC repair, installation &amp; maintenance with upfront pricing and live technician tracking. Book online in 60 seconds.
                </p>

                {/* 4. Four Benefit Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs text-[#101A35] font-semibold">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#F1F8FF] text-[#075BFF] flex items-center justify-center shrink-0 border border-[#0866FF]/20">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[#071633] leading-tight">60-Minute</div>
                      <div className="text-[11px] text-[#52617B] font-medium">Arrival Window</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#F1F8FF] text-[#075BFF] flex items-center justify-center shrink-0 border border-[#0866FF]/20">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[#071633] leading-tight">Upfront</div>
                      <div className="text-[11px] text-[#52617B] font-medium">Flat-Rate Pricing</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#F1F8FF] text-[#075BFF] flex items-center justify-center shrink-0 border border-[#0866FF]/20">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[#071633] leading-tight">100% Deposit</div>
                      <div className="text-[11px] text-[#52617B] font-medium">Credited to Bill</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#F1F8FF] text-[#075BFF] flex items-center justify-center shrink-0 border border-[#0866FF]/20">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[#071633] leading-tight">Real-Time SMS</div>
                      <div className="text-[11px] text-[#52617B] font-medium">Updates</div>
                    </div>
                  </div>
                </div>

                {/* 5. Hero Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/book"
                    className="flex-1 max-w-[280px] flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#075BFF] to-[#0866FF] hover:from-[#064ed8] hover:to-[#075BFF] text-white px-6 py-4 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-extrabold text-base leading-tight">Book Online</div>
                        <div className="text-xs text-blue-100 font-medium">Schedule in 60 Seconds</div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white ml-2 shrink-0" />
                  </Link>

                  <a
                    href={cleanPhoneHref}
                    className="flex items-center justify-center gap-3 rounded-2xl border-2 border-[#E2E9F2] bg-white px-6 py-4 text-[#071633] font-bold text-sm hover:border-[#0866FF] hover:bg-[#F1F8FF] transition-all shadow-sm"
                  >
                    <Phone className="h-5 w-5 text-[#075BFF]" />
                    <div className="text-left">
                      <div className="text-[11px] text-[#52617B] leading-none uppercase tracking-wider font-semibold">Call Now</div>
                      <div className="font-black text-sm text-[#071633] leading-tight mt-0.5">(888) 555-0198</div>
                    </div>
                  </a>
                </div>

                {/* 6. Rating and Technician Verification */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-[#071633]">4.9/5 from 1,200+ Customers</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#52617B] font-semibold">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-300 overflow-hidden relative">
                      <Image src="/images/svc-ac-repair.jpg" alt="Verified customer" fill className="object-cover" />
                    </div>
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden relative">
                      <Image src="/images/svc-ac-tuneup.jpg" alt="Verified customer" fill className="object-cover" />
                    </div>
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 overflow-hidden relative">
                      <Image src="/images/svc-thermostat-install.jpg" alt="Verified customer" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#52617B]">
                    <Check className="h-4 w-4 text-[#16B982] stroke-[3]" />
                    <span>Licensed</span>
                    <span>•</span>
                    <span>Insured</span>
                    <span>•</span>
                    <span>Background Checked</span>
                  </div>
                </div>
              </div>

              {/* RIGHT BOOKING COLUMN (~40% Width) WITH INTEGRATED TECHNICIAN PORTRAIT */}
              <div className="lg:col-span-5 relative flex flex-col items-center">
                
                {/* Central Technician Photograph (User Uploaded Hero Asset) */}
                <div className="relative w-full max-w-[420px] h-[340px] sm:h-[400px] mb-[-40px] z-0">
                  <Image
                    src="/images/technician-hero.png"
                    alt="Friendly professional American HVAC technician"
                    fill
                    priority
                    className="object-contain object-bottom"
                  />

                  {/* Credential Badge on technician */}
                  <div className="absolute bottom-10 left-4 bg-white/95 backdrop-blur-md border border-[#E2E9F2] rounded-2xl px-4 py-2 shadow-xl flex items-center gap-2 z-10">
                    <div className="h-6 w-6 rounded-lg bg-[#F1F8FF] text-[#075BFF] flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#52617B] leading-none">CA License</div>
                      <div className="text-xs font-black text-[#071633] leading-tight">#CAC1819420</div>
                    </div>
                  </div>
                </div>

                {/* Premium Online Booking Wizard Card */}
                <div className="w-full rounded-[24px] border border-[#E2E9F2] bg-white p-6 sm:p-7 shadow-2xl relative z-10 space-y-5">
                  {/* Wizard Heading */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#071633]">
                      Book Your Service in 60 Seconds
                    </h2>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#075BFF] bg-[#F1F8FF] px-2.5 py-1 rounded-full border border-[#0866FF]/20">
                      <Clock className="h-3 w-3" />
                      <span>60 SEC</span>
                    </div>
                  </div>

                  {/* Seven-step progress indicator */}
                  <div className="flex items-center justify-between text-center border-b border-slate-100 pb-3">
                    {stepsList.map((st) => {
                      const isActive = st.num === currentStep;
                      const isCompleted = st.num < currentStep;
                      return (
                        <div key={st.num} className="flex flex-col items-center">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                              isActive
                                ? "bg-[#0866FF] text-white shadow-md shadow-blue-500/30"
                                : isCompleted
                                ? "bg-[#16B982] text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : st.num}
                          </div>
                          <span
                            className={`text-[9px] mt-1 font-semibold ${
                              isActive ? "text-[#0866FF] font-bold" : "text-slate-400"
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* STEP 1: Service Selection */}
                  {currentStep === 1 && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-[#071633]">
                        What service do you need?
                      </div>

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
                                  ? "border-2 border-[#0866FF] bg-[#F1F8FF] shadow-sm"
                                  : "border-[#E2E9F2] hover:border-slate-300 bg-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${svc.iconBg}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-extrabold text-[#071633]">{svc.name}</div>
                                  <div className="text-[11px] text-[#52617B]">{svc.desc}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5">
                                <div className="text-right">
                                  <div className="text-xs font-black text-[#071633]">{svc.price}</div>
                                  <div className="text-[9px] text-[#52617B] font-medium">{svc.rateType}</div>
                                </div>
                                <div
                                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                    isSelected ? "bg-[#0866FF] text-white" : "border border-slate-300"
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
                  )}

                  {/* STEP 2: ZIP Code Coverage */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-[#071633]">
                        What&apos;s your service ZIP code?
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={5}
                          placeholder="e.g. 33131 or 90210"
                          value={zipInput}
                          onChange={(e) => setZipInput(e.target.value.replace(/\D/g, ""))}
                          className="w-full h-12 px-4 rounded-xl border border-[#E2E9F2] text-sm font-bold text-[#071633] focus:outline-none focus:border-[#0866FF]"
                        />
                      </div>
                      {zipChecking && (
                        <div className="text-xs text-[#075BFF] flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 animate-spin" />
                          <span>Checking technician availability...</span>
                        </div>
                      )}
                      {zipResult && (
                        <div
                          className={`p-3 rounded-xl text-xs font-semibold ${
                            zipResult.covered
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {zipResult.message}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Continue Button */}
                  <Button
                    onClick={handleWizardNext}
                    size="md"
                    className="w-full h-12 rounded-xl bg-[#0866FF] hover:bg-[#075BFF] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* Secure Booking Tag */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#52617B] text-center pt-1">
                    <Lock className="h-3 w-3 text-[#52617B]" />
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
            DARK TRUST AND GUARANTEES STRIP
            Background: #071633
            4 Evenly Distributed Columns with thin separators
            ======================================================== */}
        <section className="bg-[#071633] text-white py-8 border-y border-slate-800 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* COLUMN 1 — CUSTOMER RATINGS */}
            <div className="flex items-start gap-3.5 sm:border-r border-slate-800/80 pr-4">
              <div className="h-10 w-10 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0 text-[#08BDEB]">
                <Star className="h-5 w-5 fill-[#08BDEB] text-[#08BDEB]" />
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

            {/* COLUMN 2 — LICENSED & CERTIFIED */}
            <div className="flex items-start gap-3.5 sm:border-r border-slate-800/80 pr-4">
              <div className="h-10 w-10 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0 text-[#08BDEB]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Licensed &amp; Certified</div>
                <div className="text-xs text-slate-400">CA License #CAC1819420</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                    NATE
                  </span>
                  <span className="text-[10px] font-bold bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                    EPA CERTIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* COLUMN 3 — ARRIVAL GUARANTEE */}
            <div className="flex items-start gap-3.5 sm:border-r border-slate-800/80 pr-4">
              <div className="h-10 w-10 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0 text-[#08BDEB]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">60-Minute Guarantee</div>
                <div className="text-xs text-slate-400">On-Time or $50 Off</div>
                <div className="text-[11px] text-[#08BDEB] font-semibold mt-1 flex items-center gap-1">
                  <span>🚚 Tracked Live Van</span>
                </div>
              </div>
            </div>

            {/* COLUMN 4 — UPFRONT PRICING */}
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0 text-[#08BDEB]">
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
            POPULAR HVAC SERVICES: 4-Column Layout
            ======================================================== */}
        <section id="services" className="py-16 bg-white px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#071633] tracking-tight">
                Our Most Popular HVAC Services
              </h2>
              <p className="text-sm text-[#52617B] mt-1">
                Expert solutions for your home comfort needs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: AC Repair */}
              <div className="rounded-2xl border border-[#E2E9F2] bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-[#F1F8FF] text-[#075BFF] flex items-center justify-center">
                      <Snowflake className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#071633]">AC Repair</h3>
                      <p className="text-xs text-[#52617B]">Fast diagnosis &amp; repair</p>
                    </div>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image src="/images/svc-ac-repair.jpg" alt="AC Repair condenser" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-base font-black text-[#071633]">$129</div>
                    <div className="text-[10px] text-[#52617B] font-medium">Flat Rate</div>
                  </div>
                  <Link
                    href="/book?serviceId=svc-ac-repair"
                    className="text-xs font-bold text-[#0866FF] hover:text-[#075BFF] flex items-center gap-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Card 2: AC Tune-Up */}
              <div className="rounded-2xl border border-[#E2E9F2] bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 text-[#071633] flex items-center justify-center">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#071633]">AC Tune-Up</h3>
                      <p className="text-xs text-[#52617B]">Keep your system running</p>
                    </div>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image src="/images/svc-ac-tuneup.jpg" alt="Technicians servicing AC" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-base font-black text-[#071633]">$89</div>
                    <div className="text-[10px] text-[#52617B] font-medium">Flat Rate</div>
                  </div>
                  <Link
                    href="/book?serviceId=svc-ac-tuneup"
                    className="text-xs font-bold text-[#0866FF] hover:text-[#075BFF] flex items-center gap-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Thermostat Install */}
              <div className="rounded-2xl border border-[#E2E9F2] bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 text-[#071633] flex items-center justify-center">
                      <Sliders className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#071633]">Thermostat Install</h3>
                      <p className="text-xs text-[#52617B]">Smart thermostat experts</p>
                    </div>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image src="/images/svc-thermostat-install.jpg" alt="Modern wall mounted smart thermostat" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-base font-black text-[#071633]">$149</div>
                    <div className="text-[10px] text-[#52617B] font-medium">Flat Rate</div>
                  </div>
                  <Link
                    href="/book?serviceId=svc-thermostat-install"
                    className="text-xs font-bold text-[#0866FF] hover:text-[#075BFF] flex items-center gap-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Card 4: Furnace Repair */}
              <div className="rounded-2xl border border-[#E2E9F2] bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-[#F1F8FF] text-[#08BDEB] flex items-center justify-center">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#071633]">Furnace Repair</h3>
                      <p className="text-xs text-[#52617B]">Heating repair &amp; safety</p>
                    </div>
                  </div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image src="/images/svc-furnace-repair.jpg" alt="Residential furnace heating unit" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-base font-black text-[#071633]">$129</div>
                    <div className="text-[10px] text-[#52617B] font-medium">Flat Rate</div>
                  </div>
                  <Link
                    href="/book?serviceId=svc-furnace-repair"
                    className="text-xs font-bold text-[#0866FF] hover:text-[#075BFF] flex items-center gap-1"
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
            ADDITIONAL SECTIONS BELOW THE FOLD:
            1. How It Works (3 Steps)
            2. Customer Reviews & Testimonials
            3. Final CTA Banner
            ======================================================== */}
        <section id="how-it-works" className="py-16 bg-[#F8FBFF] border-t border-[#E2E9F2] px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto text-center space-y-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#075BFF] bg-[#F1F8FF] px-3.5 py-1 rounded-full border border-[#0866FF]/20">
                Simple Booking Workflow
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-[#071633] mt-3">
                How It Works
              </h2>
              <p className="text-sm text-[#52617B] mt-1 max-w-lg mx-auto">
                No phone tag. No waiting half a day. Get guaranteed arrival slots in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white border border-[#E2E9F2] shadow-sm text-left space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#F1F8FF] text-[#075BFF] flex items-center justify-center font-black">
                  01
                </div>
                <h3 className="font-heading text-lg font-bold text-[#071633]">
                  Choose Your Service
                </h3>
                <p className="text-xs text-[#52617B] leading-relaxed">
                  Select your HVAC diagnostic, tune-up, or repair need with transparent upfront flat pricing.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#E2E9F2] shadow-sm text-left space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#F1F8FF] text-[#075BFF] flex items-center justify-center font-black">
                  02
                </div>
                <h3 className="font-heading text-lg font-bold text-[#071633]">
                  Select Your Appointment
                </h3>
                <p className="text-xs text-[#52617B] leading-relaxed">
                  Pick a guaranteed 60-minute arrival window and receive real-time technician SMS tracking.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#E2E9F2] shadow-sm text-left space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#F1F8FF] text-[#075BFF] flex items-center justify-center font-black">
                  03
                </div>
                <h3 className="font-heading text-lg font-bold text-[#071633]">
                  Relax &amp; Digital Checkout
                </h3>
                <p className="text-xs text-[#52617B] leading-relaxed">
                  Technician completes the repair with photo documentation and transparent digital invoicing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section id="reviews" className="py-16 bg-white px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto text-center space-y-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#16B982] bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                Verified Reviews
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-[#071633] mt-3">
                Trusted by Homeowners Everywhere
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-2xl border border-[#E2E9F2] bg-[#F8FBFF] space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#101A35] leading-relaxed italic">
                  &ldquo;AC died in the middle of a heat wave. Booked online in 45 seconds, technician arrived in 35 minutes with the exact capacitor replacement. Ice cold air within an hour!&rdquo;
                </p>
                <div className="text-xs font-bold text-[#071633]">David M. · Los Angeles, CA</div>
              </div>

              <div className="p-6 rounded-2xl border border-[#E2E9F2] bg-[#F8FBFF] space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#101A35] leading-relaxed italic">
                  &ldquo;The upfront pricing is real. No surprise charges, shoe covers indoors, and the technician showed before-and-after photos of the coils. Super clean work.&rdquo;
                </p>
                <div className="text-xs font-bold text-[#071633]">Elena S. · San Diego, CA</div>
              </div>

              <div className="p-6 rounded-2xl border border-[#E2E9F2] bg-[#F8FBFF] space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#101A35] leading-relaxed italic">
                  &ldquo;Love that the deposit was automatically credited to our final bill. Tech helped setup our smart thermostat before leaving. Highly recommend TechWork!&rdquo;
                </p>
                <div className="text-xs font-bold text-[#071633]">Marcus K. · Irvine, CA</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="bg-gradient-to-r from-[#071633] via-[#0E2452] to-[#071633] text-white py-16 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white">
              Ready to Get Your Comfort Back?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Book your HVAC service online and choose a convenient appointment with certified technicians.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button asChild size="md" className="rounded-xl bg-[#0866FF] hover:bg-[#075BFF] text-white font-bold px-8 h-12 shadow-lg">
                <Link href="/book">Book Online Now</Link>
              </Button>
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center px-6 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-bold text-sm hover:bg-white hover:text-[#071633] transition-all"
              >
                Call (888) 555-0198
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          FIXED BOTTOM BOOKING BAR:
          Full-width electric-blue (#0866FF) booking bar fixed to the bottom
          Desktop: 90px height, Left Ready to Book, Center 3 perks, Right white button
          ======================================================== */}
      <aside
        aria-label="Fixed quick booking"
        className="fixed bottom-0 inset-x-0 z-40 bg-[#0866FF] text-white shadow-2xl border-t border-blue-400/30 py-3.5 px-4 sm:px-8"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Ready to Book? */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm sm:text-base font-black text-white leading-tight">Ready to Book?</div>
              <div className="text-[11px] sm:text-xs text-blue-100 font-medium">Join 1,200+ happy customers</div>
            </div>
          </div>

          {/* Middle: 3 benefit indicators */}
          <div className="hidden lg:flex items-center gap-8 text-left text-xs font-semibold text-blue-50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#08BDEB]" />
              <div>
                <div className="font-extrabold text-white">60-Minute</div>
                <div className="text-blue-100 font-normal">Arrival Window</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#08BDEB]" />
              <div>
                <div className="font-extrabold text-white">Upfront</div>
                <div className="text-blue-100 font-normal">Flat-Rate Pricing</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#08BDEB]" />
              <div>
                <div className="font-extrabold text-white">100% Deposit</div>
                <div className="text-blue-100 font-normal">Credited to Bill</div>
              </div>
            </div>
          </div>

          {/* Right: Large White Button */}
          <div>
            <Link
              href="/book"
              className="inline-flex items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-[#071633] px-5 sm:px-7 py-2.5 sm:py-3.5 shadow-xl transition-all group"
            >
              <div className="text-left">
                <div className="font-black text-xs sm:text-sm text-[#071633] leading-tight">Book Online Now</div>
                <div className="text-[10px] sm:text-[11px] text-[#0866FF] font-bold">Schedule in 60 Seconds</div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#0866FF] group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
