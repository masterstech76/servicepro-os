/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cpu,
  Droplets,
  Flame,
  Gauge,
  HelpCircle,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Sliders,
  Smartphone,
  Snowflake,
  Sparkles,
  Star,
  Thermometer,
  UserCheck,
  Wrench,
  Zap,
  Menu,
  X,
} from "lucide-react";

// SYMPTOM DIAGNOSTIC MATRIX
interface SymptomData {
  id: string;
  name: string;
  icon: React.ElementType;
  severity: "Moderate" | "Urgent" | "Critical" | "Routine";
  severityColor: string;
  probableCause: string;
  diagnosticSteps: string;
  estimatedFixTime: string;
  recommendedServiceId: string;
  recommendedServiceName: string;
}

const SYMPTOMS: SymptomData[] = [
  {
    id: "warm-air",
    name: "AC Blowing Warm Air",
    icon: Flame,
    severity: "Urgent",
    severityColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    probableCause: "Frozen evaporator coil, failing dual capacitor, or low refrigerant level",
    diagnosticSteps: "Subcooling & superheat temperature test + capacitor microfarad reading",
    estimatedFixTime: "30 – 60 mins",
    recommendedServiceId: "svc-ac-repair",
    recommendedServiceName: "Emergency AC Repair & Diagnostics",
  },
  {
    id: "water-leak",
    name: "Water Leaking Inside",
    icon: Droplets,
    severity: "Critical",
    severityColor: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    probableCause: "Clogged condensate drain line, cracked drain pan, or iced-over coil melting",
    diagnosticSteps: "Nitrogen pressure line blowout + float safety switch inspection",
    estimatedFixTime: "40 – 75 mins",
    recommendedServiceId: "svc-ac-repair",
    recommendedServiceName: "Condensate Flush & Leak Restoration",
  },
  {
    id: "no-power",
    name: "System Won't Turn On",
    icon: Zap,
    severity: "Critical",
    severityColor: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    probableCause: "Tripped circuit breaker, blown 3A control board fuse, or failed transformer",
    diagnosticSteps: "24V low-voltage circuit test + safety switch lockout bypass audit",
    estimatedFixTime: "25 – 45 mins",
    recommendedServiceId: "svc-ac-repair",
    recommendedServiceName: "Electrical Control Board & Power Audit",
  },
  {
    id: "loud-noise",
    name: "Loud Screeching / Buzzing",
    icon: AlertTriangle,
    severity: "Urgent",
    severityColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    probableCause: "Worn blower motor bearings, loose fan blade, or high-head pressure",
    diagnosticSteps: "Decibel & vibration telemetry + motor winding resistance test",
    estimatedFixTime: "45 – 90 mins",
    recommendedServiceId: "svc-ac-repair",
    recommendedServiceName: "Precision Motor & Mechanical Overhaul",
  },
  {
    id: "tune-up",
    name: "Preventive 21-Point Tune-Up",
    icon: Gauge,
    severity: "Routine",
    severityColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    probableCause: "Seasonal maintenance, dust accumulation, efficiency loss over time",
    diagnosticSteps: "Full chemical coil rinse, electrical tightening, and SEER2 recalibration",
    estimatedFixTime: "60 – 75 mins",
    recommendedServiceId: "svc-ac-tuneup",
    recommendedServiceName: "Annual 21-Point Super Tune-Up",
  },
];

// NEIGHBORHOODS
const SERVICE_AREAS = [
  { name: "Brickell & Financial District", slug: "brickell", eta: "18m" },
  { name: "Downtown Miami", slug: "downtown-miami", eta: "22m" },
  { name: "Coral Gables", slug: "coral-gables", eta: "25m" },
  { name: "Coconut Grove", slug: "coconut-grove", eta: "24m" },
  { name: "Miami Beach & South Beach", slug: "miami-beach", eta: "28m" },
  { name: "Wynwood & Edgewater", slug: "wynwood", eta: "20m" },
  { name: "Doral & Airport West", slug: "doral", eta: "30m" },
  { name: "Kendall & Pinecrest", slug: "kendall", eta: "32m" },
];

// FAQS
const FAQS = [
  {
    q: "How fast can a certified technician arrive at my home?",
    a: "Our dispatch center deploys GPS-tracked mobile service trucks stationed across Greater Miami. For active emergency calls, our average arrival window is 24 to 45 minutes across Brickell, Downtown, Coral Gables, and surrounding neighborhoods.",
    category: "dispatch",
  },
  {
    q: "Is the diagnostic fee waived if I approve the repair?",
    a: "Yes, 100%. Our diagnostic fee covers a comprehensive digital inspection, laser thermal readings, and refrigerant telemetry. When you proceed with the recommended repair, that entire diagnostic fee is credited directly toward your total invoice.",
    category: "pricing",
  },
  {
    q: "Are your technicians licensed, background-checked, and insured?",
    a: "Every TechWork technician is an EPA Universal certified master technician, background-checked, drug-tested, and covered by our $1,000,000 Property & Cleanliness Guarantee. We never hire random subcontractors.",
    category: "guarantee",
  },
  {
    q: "What brands of AC systems do you service?",
    a: "We service and carry OEM parts on our trucks for Carrier, Trane, Lennox, Rheem, Daikin, Goodman, York, Mitsubishi Electric mini-splits, and smart thermostats (Google Nest, Ecobee, Honeywell Home).",
    category: "equipment",
  },
  {
    q: "Do you offer emergency HVAC service on weekends and nights?",
    a: "Yes. In the extreme South Florida heat, a broken AC is an emergency. Our emergency rapid dispatch team operates 24 hours a day, 7 days a week, including Sundays and holidays.",
    category: "dispatch",
  },
];

export default function UniqueLandingPage() {
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomData>(SYMPTOMS[0]);
  const [squareFootage, setSquareFootage] = useState<number>(1800);
  const [propertyType, setPropertyType] = useState<"condo" | "home" | "commercial">("home");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sqftInputId = useId();

  // Calculated tonnage & energy math
  const tonnage = (squareFootage / 500).toFixed(1);
  const btu = Math.round(parseFloat(tonnage) * 12000).toLocaleString();
  const estimatedSavings = Math.round((squareFootage * 0.18) + (propertyType === "condo" ? 60 : 140));

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* 1. TOP STATUS TICKER HUD */}
      <div className="bg-slate-950/80 border-b border-white/5 py-2 px-4 text-center text-xs backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-slate-200">LIVE DISPATCH ACTIVE</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline">6 Mobile Tech Units in Field (Greater Miami)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-cyan-400 font-mono font-medium">AVG ETA: 24 MINS</span>
            <span className="text-slate-500">•</span>
            <a
              href="tel:3055550100"
              className="text-white hover:text-cyan-400 font-bold transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              (305) 555-0100
            </a>
          </div>
        </div>
      </div>

      {/* 2. FLOATING FROSTED GLASS NAVIGATION */}
      <nav className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl px-5 py-3.5 flex items-center justify-between shadow-2xl shadow-cyan-950/20">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-1">
                TechWork <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">OS</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Precision Climate Engineering
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#diagnostics" className="hover:text-cyan-400 transition-colors">
              Live Diagnostics
            </a>
            <a href="#services" className="hover:text-cyan-400 transition-colors">
              Services
            </a>
            <a href="#estimator" className="hover:text-cyan-400 transition-colors">
              Cost Calculator
            </a>
            <a href="#comparison" className="hover:text-cyan-400 transition-colors">
              The Standard
            </a>
            <a href="#reviews" className="hover:text-cyan-400 transition-colors">
              Reviews
            </a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">
              FAQ
            </a>
          </div>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/book"
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-[1px] font-semibold text-xs transition-all hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <div className="px-5 py-2.5 rounded-[11px] bg-slate-950 transition-colors group-hover:bg-transparent">
                <span className="relative z-10 flex items-center gap-2 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
                  Book Guaranteed Slot
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-5 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl space-y-4 text-sm font-medium">
            <a
              href="#diagnostics"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-cyan-400"
            >
              Live Diagnostics
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-cyan-400"
            >
              Services
            </a>
            <a
              href="#estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-cyan-400"
            >
              Cost Calculator
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-cyan-400"
            >
              The Standard
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-cyan-400"
            >
              Reviews
            </a>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/book"
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-lg shadow-cyan-500/20"
              >
                Book Guaranteed Slot Online
              </Link>
              <a
                href="tel:3055550100"
                className="w-full text-center py-2.5 rounded-xl border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> Call (305) 555-0100
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* 3. HERO: FUTURISTIC CLIMATE COMMAND & INTERACTIVE TELEMETRY */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
        {/* Ambient Radial Lights */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[140px] -z-10" />
        <div className="pointer-events-none absolute top-1/2 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE NEXT-GEN HOME CLIMATE PLATFORM</span>
              <span className="text-cyan-500/40">•</span>
              <span className="text-slate-300">MIAMI-DADE CERTIFIED</span>
            </div>

            {/* Giant Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-white">
              Precision Air.{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Guaranteed in 60 Mins.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
              When extreme humidity and tropical heat threaten your home, TechWork deploys licensed master technicians equipped with live telemetry, infrared leak detection, and flat-rate pricing.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-white text-sm sm:text-base transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 group"
              >
                <span>Book Instant Dispatch</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:3055550100"
                className="w-full sm:w-auto px-7 py-4 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] font-semibold text-white text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 backdrop-blur-md"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call Emergency Hotline</span>
              </a>
            </div>

            {/* Social Proof Metric Strip */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="font-bold text-white">4.96/5.0</span>
                <span>(1,248+ Home Audits)</span>
              </div>
              <span className="hidden sm:inline text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>$1,000,000 Property Guarantee</span>
              </div>
              <span className="hidden sm:inline text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Subcontractors</span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE DIAGNOSTIC TELEMETRY MATRIX */}
          <div id="diagnostics" className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Interactive Symptom Triage Matrix
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  What is happening with your AC system right now?
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Click any symptom to compute triage telemetry &amp; dispatch window
              </span>
            </div>

            {/* Symptom Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6">
              {SYMPTOMS.map((symptom) => {
                const Icon = symptom.icon;
                const isSelected = selectedSymptom.id === symptom.id;
                return (
                  <button
                    key={symptom.id}
                    onClick={() => setSelectedSymptom(symptom)}
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400/30"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${symptom.severityColor}`}>
                        {symptom.severity}
                      </span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-white leading-tight">
                      {symptom.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Symptom HUD Result Deck */}
            <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                    Primary Diagnostic Telemetry:
                  </span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${selectedSymptom.severityColor}`}>
                    {selectedSymptom.severity} Triage Priority
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Estimated On-Site Fix: {selectedSymptom.estimatedFixTime}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {selectedSymptom.recommendedServiceName}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-slate-400 font-mono text-[11px] mb-1">PROBABLE ROOT CAUSE</p>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {selectedSymptom.probableCause}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-slate-400 font-mono text-[11px] mb-1">FIRST STEP TECH AUDIT</p>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {selectedSymptom.diagnosticSteps}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-slate-900/60 text-center">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Diagnostic Fee</p>
                  <p className="text-2xl font-black text-white">$89.00</p>
                  <p className="text-[11px] text-emerald-400 font-medium">
                    100% credited toward repair cost
                  </p>
                </div>
                <Link
                  href={`/book?serviceId=${selectedSymptom.recommendedServiceId}&symptom=${selectedSymptom.id}`}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5"
                >
                  <span>Dispatch Tech for This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <p className="text-[10px] text-slate-500">
                  Real-time arrival tracking link sent via SMS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENTO GRID OF NEXT-GEN SERVICES */}
      <section id="services" className="py-20 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Engineering-Grade Climate Systems
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Comprehensive HVAC &amp; Air Quality Solutions
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-white transition-colors"
            >
              <span>Explore All 8 Specialized Divisions</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Bento Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento 1: Flagship AC Repair (Span 7) */}
            <div className="md:col-span-7 rounded-3xl border border-white/10 bg-slate-900/60 overflow-hidden relative group p-7 sm:p-9 flex flex-col justify-between min-h-[380px]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                style={{ backgroundImage: `url('/images/svc-ac-repair.jpg')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                  <Snowflake className="w-3.5 h-3.5" />
                  FLAGSHIP SERVICE
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Emergency AC Repair &amp; Component Restoration
                </h3>
                <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                  Compressors, contactors, dual-run capacitors, TXV valves, and fan motors. We stock over 200 OEM parts inside our trucks to solve 92% of AC breakdowns in a single visit.
                </p>
              </div>

              <div className="relative z-10 pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> 1-Year Labor Warranty
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Digital Multi-Point Scan
                  </span>
                </div>
                <Link
                  href="/book?serviceId=svc-ac-repair"
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center gap-1"
                >
                  Book AC Repair <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento 2: Infrared Thermal Diagnostics (Span 5) */}
            <div className="md:col-span-5 rounded-3xl border border-white/10 bg-slate-900/60 p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none"
                style={{ backgroundImage: `url('/images/svc-refrigerant-recharge.jpg')` }}
              />
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
                  <Thermometer className="w-3.5 h-3.5" />
                  THERMAL TELEMETRY
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Freon Leak Detection &amp; Infrared Auditing
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Non-invasive electronic sniffer probes and ultrasonic acoustics locate micro-leaks in evaporator coils without tearing down your drywall.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <Link
                  href="/book?serviceId=svc-refrigerant-recharge"
                  className="text-xs font-bold text-amber-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Schedule Leak Scan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento 3: Smart Thermostat & Automation (Span 4) */}
            <div className="md:col-span-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Smart IoT &amp; Zone Control</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Integration of Google Nest, Ecobee Pro, and Honeywell Home with multi-zone dampers to eliminate hot spots and reduce bills by 24%.
                </p>
              </div>
              <Link
                href="/book?serviceId=svc-thermostat-install"
                className="pt-5 text-xs font-bold text-cyan-400 hover:text-white flex items-center gap-1"
              >
                Thermostat Setup <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Bento 4: Hospital-Grade Air Purification (Span 4) */}
            <div className="md:col-span-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">UV-C &amp; HEPA Duct Sanitation</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  In-duct germicidal UV light arrays and rotary brush duct cleanings eradicate Miami mold, pet dander, and bacterial airborne pathogens.
                </p>
              </div>
              <Link
                href="/book?serviceId=svc-duct-cleaning"
                className="pt-5 text-xs font-bold text-cyan-400 hover:text-white flex items-center gap-1"
              >
                Duct Sanitization <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Bento 5: 21-Point Super Tune-Up (Span 4) */}
            <div className="md:col-span-4 rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Gauge className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Annual 21-Point Super Tune-Up</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Chemical coil rinse, amp-draw calibration, electrical contact cleaning, and drain pan sterilization to guarantee peak seasonal efficiency.
                </p>
              </div>
              <Link
                href="/book?serviceId=svc-ac-tuneup"
                className="pt-5 text-xs font-bold text-cyan-400 hover:text-white flex items-center gap-1"
              >
                Book $89 Tune-Up <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE TRANSPARENT COST & TONNAGE ESTIMATOR */}
      <section id="estimator" className="py-20 bg-slate-900/40 border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Transparent Physics &amp; Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Instant Tonnage &amp; Cost Estimator
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Slide your property size to preview cooling capacity requirements and transparent price estimates.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950 p-6 sm:p-10 shadow-2xl space-y-8">
            {/* Property Type Toggles */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-3">
                Select Property Architecture
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["condo", "home", "commercial"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setPropertyType(type)}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all border ${
                      propertyType === type
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20"
                        : "bg-white/[0.03] text-slate-300 border-white/5 hover:border-white/15"
                    }`}
                  >
                    {type === "condo" ? "High-Rise Condo" : type === "home" ? "Single Family Home" : "Commercial Office"}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor={sqftInputId} className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Conditioned Living Area
                </label>
                <span className="font-mono text-xl font-black text-cyan-400">
                  {squareFootage.toLocaleString()} sq ft
                </span>
              </div>
              <input
                id={sqftInputId}
                type="range"
                min={600}
                max={4500}
                step={50}
                value={squareFootage}
                onChange={(e) => setSquareFootage(Number(e.target.value))}
                aria-label="Conditioned Living Area in square feet"
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
                <span>600 sq ft</span>
                <span>2,000 sq ft</span>
                <span>3,200 sq ft</span>
                <span>4,500+ sq ft</span>
              </div>
            </div>

            {/* Output Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-mono">RECOMMENDED SYSTEM</p>
                <p className="text-xl font-black text-white">{tonnage} Tons</p>
                <p className="text-[11px] text-slate-500">{btu} BTU/hr capacity</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-mono">EST. ANNUAL SAVINGS</p>
                <p className="text-xl font-black text-emerald-400">${estimatedSavings}/yr</p>
                <p className="text-[11px] text-slate-500">With SEER2 optimization</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-mono">DIAGNOSTIC FEE</p>
                <p className="text-xl font-black text-cyan-400">$89</p>
                <p className="text-[11px] text-emerald-400">Waived with repair</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-mono">DISPATCH WINDOW</p>
                <p className="text-xl font-black text-white">&lt; 45 Mins</p>
                <p className="text-[11px] text-slate-500">Guaranteed on-time</p>
              </div>
            </div>

            {/* Book CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-400">
                All pricing is flat-rate and guaranteed in writing before work begins. No surprises.
              </p>
              <Link
                href={`/book?sqft=${squareFootage}&type=${propertyType}`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 text-center"
              >
                Lock In This Slot &amp; Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. "THE TECHWORK STANDARD" VS TYPICAL CONTRACTORS */}
      <section id="comparison" className="py-20 bg-slate-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Why 1,248+ Homeowners Trust Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              The TechWork Standard
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              We engineered the service process to eliminate the anxiety and delays of traditional HVAC companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Typical Contractors */}
            <div className="p-7 sm:p-9 rounded-3xl border border-rose-500/10 bg-rose-950/[0.04] space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                  ✕
                </div>
                <h3 className="font-bold text-lg text-slate-300">Traditional HVAC Contractors</h3>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span>Vague 4-to-6 hour arrival windows that ruin your entire work day</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span>Mystery quotes and hidden labor charges introduced after work starts</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span>Random third-party subcontractors with unverified certifications</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span>Dirty boots on your carpets and zero cleanup responsibility</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span>Paper receipts that get lost when warranty claims arise</span>
                </li>
              </ul>
            </div>

            {/* TechWork Platform */}
            <div className="p-7 sm:p-9 rounded-3xl border border-cyan-500/30 bg-cyan-950/[0.1] space-y-5 shadow-2xl shadow-cyan-950/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="font-bold text-lg text-white">TechWork ServicePro OS</h3>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Live GPS Driver Radar:</strong> Watch your tech navigate in real-time with an exact 15-minute SMS notice</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>100% Upfront Digital Approvals:</strong> Authorize your line-item estimate on your phone before a tool is lifted</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>W-2 EPA Master Technicians:</strong> Background-checked, uniformed, drug-screened career professionals</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Shoe Booties &amp; Floor Runners:</strong> We leave your home cleaner than we found it, guaranteed</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Permanent Digital Records:</strong> All invoices, photos, and warranties stored safely in your customer portal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED JOB TELEMETRY FEED */}
      <section className="py-16 bg-slate-900/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Activity className="w-4 h-4 animate-spin text-cyan-400" />
              <span>LIVE COMPLETED SERVICE FEED • MIAMI DISPATCH</span>
            </div>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Updated 4 minutes ago
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold">#WO-8421</span>
                <span className="text-emerald-400 font-mono text-[11px]">✓ Completed in 38m</span>
              </div>
              <p className="text-white font-bold text-sm">Brickell Key Penthouse</p>
              <p className="text-slate-400 text-xs">
                Emergency capacitor replacement &amp; coil pressure balance. Indoor temp dropped from 84°F to 71°F.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/5">
                <span>Tech: Carlos M. (Tier 3)</span>
                <span className="text-amber-400 font-bold">★★★★★ 5.0</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold">#WO-8418</span>
                <span className="text-emerald-400 font-mono text-[11px]">✓ Completed in 52m</span>
              </div>
              <p className="text-white font-bold text-sm">Coral Gables Luxury Villa</p>
              <p className="text-slate-400 text-xs">
                Condensate line nitrogen blowout + Ecobee smart multi-sensor installation.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/5">
                <span>Tech: David L. (Tier 2)</span>
                <span className="text-amber-400 font-bold">★★★★★ 5.0</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold">#WO-8415</span>
                <span className="text-emerald-400 font-mono text-[11px]">✓ Completed in 45m</span>
              </div>
              <p className="text-white font-bold text-sm">Coconut Grove Waterfront</p>
              <p className="text-slate-400 text-xs">
                Thermal imaging freon leak pinpoint on Trane 4-ton rooftop heat pump.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/5">
                <span>Tech: Marcus V. (Master)</span>
                <span className="text-amber-400 font-bold">★★★★★ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REVIEWS & TESTIMONIALS */}
      <section id="reviews" className="py-20 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs font-mono mb-4">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>VERIFIED GOOGLE &amp; ANGI AUDITS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Loved by Homeowners Across Miami
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Read uncensored feedback from verified clients who survived South Florida heatwaves with our help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-slate-900/50 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  &ldquo;Our AC failed on a Saturday afternoon with family visiting and the house at 86 degrees. TechWork had a master technician at our door in 28 minutes. He tested the capacitor on his digital tablet, showed me the readings, and fixed it immediately. Lifesavers!&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-sm">
                  SJ
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Sarah Jenkins</p>
                  <p className="text-xs text-slate-500">Brickell • Verified Customer</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-slate-900/50 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  &ldquo;The GPS tracker on my phone showed Carlos moving through traffic, and he texted when he was 5 minutes away. No waiting around in a four-hour window. The digital quote before work started was 100% accurate. This is how all trade services should operate.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm">
                  RH
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Robert Hernandez</p>
                  <p className="text-xs text-slate-500">Coral Gables • Verified Customer</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-slate-900/50 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  &ldquo;We signed up for their seasonal care plan after they solved a persistent water leak that two previous companies couldn&apos;t figure out. Clean booties, zero drywall damage, completely transparent.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-sm">
                  EM
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Elena Morales</p>
                  <p className="text-xs text-slate-500">Coconut Grove • Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. NEIGHBORHOODS COVERAGE */}
      <section className="py-16 bg-slate-900/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
              Active Coverage Radius
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Serving All Greater Miami Neighborhoods
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SERVICE_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/service-areas/${area.slug}`}
                className="p-3.5 rounded-xl border border-white/5 bg-slate-950/60 hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {area.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">Avg ETA: {area.eta}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11. INTERACTIVE ACCORDION FAQ */}
      <section id="faq" className="py-20 bg-slate-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Clear Answers, No Jargon
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 transition-transform shrink-0 ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. HIGH-IMPACT CLOSING COMMAND DECK */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-[#02050e] border-t border-white/10 relative overflow-hidden">
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[140px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>FLORIDA STATE LICENSE #CAC1819420</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Never Sweat in Your Own Home Again.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Lock in a guaranteed arrival window with our top-rated technicians. Real-time GPS tracking, upfront pricing, and 100% satisfaction guaranteed.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-white text-base transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <span>Book Online (Instant Confirmation)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:3055550100"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] font-bold text-white text-base transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Call (305) 555-0100</span>
            </a>
          </div>
        </div>
      </section>

      {/* 13. SLEEK OBSIDIAN FOOTER */}
      <footer className="bg-[#020611] border-t border-white/5 py-14 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-black">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">TechWork Services</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Engineering-grade climate control, thermal diagnostics, and emergency HVAC restoration across Miami-Dade County.
            </p>
            <p className="font-mono text-[11px] text-slate-500">
              1200 Brickell Ave, Suite 400, Miami, FL 33131
            </p>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <p className="font-bold text-white font-mono uppercase text-[11px]">Services</p>
            <ul className="space-y-2">
              <li><Link href="/services/ac-repair" className="hover:text-cyan-400 transition-colors">AC Repair</Link></li>
              <li><Link href="/services/ac-tuneup" className="hover:text-cyan-400 transition-colors">21-Point Tune-Up</Link></li>
              <li><Link href="/services/emergency-hvac" className="hover:text-cyan-400 transition-colors">Emergency HVAC</Link></li>
              <li><Link href="/services/duct-cleaning" className="hover:text-cyan-400 transition-colors">Duct Cleaning</Link></li>
              <li><Link href="/services/thermostat-install" className="hover:text-cyan-400 transition-colors">Smart Thermostats</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <p className="font-bold text-white font-mono uppercase text-[11px]">Platform</p>
            <ul className="space-y-2">
              <li><Link href="/how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing &amp; Guarantee</Link></li>
              <li><Link href="/reviews" className="hover:text-cyan-400 transition-colors">Customer Reviews</Link></li>
              <li><Link href="/areas" className="hover:text-cyan-400 transition-colors">Service Areas</Link></li>
              <li><Link href="/specials" className="hover:text-cyan-400 transition-colors">Seasonal Specials</Link></li>
            </ul>
          </div>

          {/* Col 4: Portals & Legal */}
          <div className="space-y-3">
            <p className="font-bold text-white font-mono uppercase text-[11px]">Portals &amp; Legal</p>
            <ul className="space-y-2">
              <li><Link href="/account" className="hover:text-cyan-400 transition-colors">Customer Portal</Link></li>
              <li><Link href="/tech" className="hover:text-cyan-400 transition-colors">Technician Portal</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-400 transition-colors">Admin Dispatch</Link></li>
              <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} TechWork Services LLC. Florida HVAC License #CAC1819420. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500 font-mono">
            <span>SECURE 256-BIT ENCRYPTION</span>
            <span>•</span>
            <span>EPA UNIVERSAL CERTIFIED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
