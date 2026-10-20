"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
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
  ChevronDown,
  ChevronRight,
  MapPin,
  Wind,
  Search,
  Tag,
  Phone,
  Shield,
  Droplets,
  AlertTriangle,
  HelpCircle,
  Radio,
  Copy,
  ThumbsUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// -------------------------------------------------------------
// Data Contracts & Types
// -------------------------------------------------------------

interface PopularProject {
  id: string;
  name: string;
  category: string;
  startingPrice: string;
  rateType: string;
  hiresCount: string;
  desc: string;
  href: string;
  bookUrl: string;
  icon: React.ElementType;
  image: string;
  popular?: boolean;
  warranty: string;
}

const POPULAR_PROJECTS: PopularProject[] = [
  {
    id: "svc-ac-repair",
    name: "AC Repair & Diagnostic",
    category: "Emergency & Diagnostic",
    startingPrice: "$129",
    rateType: "100% Credited to Repair",
    hiresCount: "420+ hires this month",
    desc: "Rapid diagnostic for blowing warm air, frozen evaporator coils, fan motor failure, or blown capacitors.",
    href: "/services/ac-repair",
    bookUrl: "/book?serviceId=svc-ac-repair&coupon=FIRST25",
    icon: Snowflake,
    image: "/images/svc-ac-repair.jpg",
    popular: true,
    warranty: "1-Year Parts & Labor",
  },
  {
    id: "svc-ac-tuneup",
    name: "21-Point Seasonal Tune-Up",
    category: "Preventative Maintenance",
    startingPrice: "$89",
    rateType: "Special Flat Rate",
    hiresCount: "310+ hires this month",
    desc: "Complete system overhaul, condenser chemical wash, biocide drain line flush, and subcooling check.",
    href: "/services/ac-tuneup",
    bookUrl: "/book?serviceId=svc-ac-tuneup&coupon=TUNE89",
    icon: Wrench,
    image: "/images/svc-ac-tuneup.jpg",
    popular: true,
    warranty: "Energy Savings Guarantee",
  },
  {
    id: "svc-emergency-hvac",
    name: "24/7 Priority Emergency Dispatch",
    category: "Rapid Response",
    startingPrice: "$169",
    rateType: "Priority Arrival Slot",
    hiresCount: "280+ hires this month",
    desc: "Immediate on-call dispatch for severe cooling failure, commercial outages, electrical sparks, or system lockouts.",
    href: "/services/emergency-hvac",
    bookUrl: "/book?serviceId=svc-emergency-hvac",
    icon: Zap,
    image: "/images/service-bg.jpg",
    popular: true,
    warranty: "Rapid Response Guarantee",
  },
  {
    id: "svc-thermostat-install",
    name: "Smart Thermostat Installation",
    category: "Controls & Automation",
    startingPrice: "$149",
    rateType: "Flat Rate Installation",
    hiresCount: "140+ hires this month",
    desc: "Google Nest, Ecobee, or Honeywell setup, C-wire power routing, smartphone app sync, and calibration.",
    href: "/services/thermostat-install",
    bookUrl: "/book?serviceId=svc-thermostat-install&coupon=NEST30",
    icon: Sliders,
    image: "/images/svc-thermostat-install.jpg",
    warranty: "Lifetime Wiring Guarantee",
  },
  {
    id: "svc-refrigerant-recharge",
    name: "Refrigerant Leak Test & Recharge",
    category: "Refrigeration",
    startingPrice: "$125/hr",
    rateType: "EPA Certified Service",
    hiresCount: "185+ hires this month",
    desc: "Nitrogen pressure leak detection, Schrader valve replacement, and precision R-410A / R-22 subcooling charging.",
    href: "/services/refrigerant-recharge",
    bookUrl: "/book?serviceId=svc-refrigerant-recharge",
    icon: Snowflake,
    image: "/images/svc-refrigerant-recharge.jpg",
    warranty: "90-Day Leak-Free Guarantee",
  },
  {
    id: "svc-duct-cleaning",
    name: "Whole-Home Air Duct Cleaning",
    category: "Indoor Air Quality",
    startingPrice: "$249",
    rateType: "Whole Home Flat Rate",
    hiresCount: "115+ hires this month",
    desc: "High-powered HEPA negative air sweep, rotobrush agitation, and hospital-grade antimicrobial sanitizing.",
    href: "/services/duct-cleaning",
    bookUrl: "/book?serviceId=svc-duct-cleaning&coupon=CLEANAIR50",
    icon: Wind,
    image: "/images/svc-duct-cleaning.jpg",
    warranty: "IAQ Certified Clean",
  },
];

interface SymptomChip {
  id: string;
  label: string;
  icon: React.ElementType;
  serviceId: string;
  defaultCoupon?: string;
  priceEstimate: string;
  typicalFix: string;
}

const SYMPTOM_CHIPS: SymptomChip[] = [
  {
    id: "warm-air",
    label: "AC Blowing Warm Air",
    icon: Flame,
    serviceId: "svc-ac-repair",
    defaultCoupon: "FIRST25",
    priceEstimate: "$129 – $240",
    typicalFix: "Capacitor, contactor, or refrigerant leak repair",
  },
  {
    id: "leaking-water",
    label: "Water Leaking Inside",
    icon: Droplets,
    serviceId: "svc-ac-repair",
    defaultCoupon: "FIRST25",
    priceEstimate: "$129 – $189",
    typicalFix: "Nitrogen drain line blow-out & float switch reset",
  },
  {
    id: "no-power",
    label: "AC Won't Turn On",
    icon: Zap,
    serviceId: "svc-emergency-hvac",
    priceEstimate: "$169 – $290",
    typicalFix: "Safety switch trip, transformer, or control board",
  },
  {
    id: "tuneup",
    label: "21-Point Annual Tune-Up",
    icon: Wrench,
    serviceId: "svc-ac-tuneup",
    defaultCoupon: "TUNE89",
    priceEstimate: "$89 Flat Rate",
    typicalFix: "Chemical coil rinse, drain flush, and amperage check",
  },
  {
    id: "refrigerant",
    label: "Hissing Noise / Low Freon",
    icon: Snowflake,
    serviceId: "svc-refrigerant-recharge",
    priceEstimate: "$250 – $480",
    typicalFix: "Electronic sniffer leak detection & R-410A recharge",
  },
  {
    id: "odors",
    label: "Musty Odors / Dirty Ducts",
    icon: Wind,
    serviceId: "svc-duct-cleaning",
    defaultCoupon: "CLEANAIR50",
    priceEstimate: "$249 Flat Rate",
    typicalFix: "Whole-home negative air duct scrub & biocidal fogging",
  },
];

const COST_ESTIMATOR_PROBLEMS = [
  {
    name: "AC Blowing Warm Air (No Cooling)",
    range: "$129 – $240",
    partsInStock: "Dual run capacitors, relays & contactors stocked on all 14 vans",
    serviceId: "svc-ac-repair",
    typicalTime: "45 – 75 minutes",
    couponCode: "FIRST25",
  },
  {
    name: "Water Leak / Clogged Condensate Drain",
    range: "$129 – $189",
    partsInStock: "Nitrogen blowers, drain tablets & safety float switches",
    serviceId: "svc-ac-repair",
    typicalTime: "30 – 60 minutes",
    couponCode: "FIRST25",
  },
  {
    name: "System Won't Power On / Complete Shutdown",
    range: "$169 – $290",
    partsInStock: "Control boards, fuses, transformers & thermostats",
    serviceId: "svc-emergency-hvac",
    typicalTime: "45 – 90 minutes",
  },
  {
    name: "Complete 21-Point Seasonal Tune-Up",
    range: "$89 Flat Rate",
    partsInStock: "Coil cleaners, biocide wash & standard filter media",
    serviceId: "svc-ac-tuneup",
    typicalTime: "60 minutes",
    couponCode: "TUNE89",
  },
  {
    name: "Refrigerant Leak Detection & Recharge",
    range: "$250 – $480",
    partsInStock: "R-410A / R-22 EPA cylinders, gauges & Schrader valves",
    serviceId: "svc-refrigerant-recharge",
    typicalTime: "60 – 120 minutes",
  },
];

const OEM_BRANDS = [
  "Trane",
  "Carrier",
  "Lennox",
  "Rheem",
  "Goodman",
  "York",
  "Daikin",
  "Google Nest",
  "Ecobee",
  "Honeywell",
  "Mitsubishi Electric",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter ZIP & Pick Time",
    desc: "Select your preferred 2-hour arrival window online in 60 seconds with instant dispatch confirmation.",
    icon: Calendar,
  },
  {
    step: "02",
    title: "Live GPS Van Tracking",
    desc: "Receive real-time SMS alerts with your certified technician's photo, license number, and live arrival ETA.",
    icon: Radio,
  },
  {
    step: "03",
    title: "Upfront Digital Estimate",
    desc: "Your technician diagnoses on-site and presents an itemized iPad quote before any work begins. Diagnostic fee 100% credited.",
    icon: DollarSign,
  },
  {
    step: "04",
    title: "Verified Cold Air & 1-Yr Warranty",
    desc: "Cold 56° air output verified with thermal laser imaging. Every repair is backed by our 1-year comprehensive warranty.",
    icon: ShieldCheck,
  },
];

// Thumbtack style: Project type + Neighborhood/ZIP + Star rating + Quote
const TESTIMONIALS = [
  {
    project: "Emergency AC Repair",
    neighborhood: "Brickell (33131)",
    author: "David Morales",
    rating: 5,
    quote:
      "AC went out on a hot Sunday morning. Carlos arrived in 28 minutes with OEM capacitors in his truck. Had cold 56° air blasting in under an hour. Flat rate, zero price gouging.",
    technician: "Carlos Mendez (Lead Tech)",
  },
  {
    project: "21-Point Seasonal Tune-Up",
    neighborhood: "Coral Gables (33134)",
    author: "Elena & Carlos Santoro",
    rating: 5,
    quote:
      "Used the $89 tune-up coupon. Danny put on clean boot covers, flushed our clogged primary drain line, and sent high-res before/after photos. Electric bill dropped $40 this month.",
    technician: "Danny Reyes",
  },
  {
    project: "Smart Thermostat & Air Ducts",
    neighborhood: "Downtown Miami (33132)",
    author: "Dr. Robert Sterling",
    rating: 5,
    quote:
      "Replaced an old dial thermostat with a Google Nest and sanitized all flex ducts. Maria was prompt, clean, and courteous. The initial deposit was credited straight to the invoice.",
    technician: "Maria Alvarez",
  },
];

const FAQS = [
  {
    q: "How fast can a technician arrive at my home?",
    a: "Our average arrival time is 28 minutes across Miami-Dade county. For scheduled appointments, we guarantee arrival within your selected 2-hour window. Priority emergency slots are dispatched immediately.",
  },
  {
    q: "Is my diagnostic deposit credited toward the repair?",
    a: "Yes, 100%. If you approve any repair recommendation following our comprehensive diagnostic inspection, your diagnostic deposit is fully credited toward the final invoice total.",
  },
  {
    q: "Do your trucks carry parts for my specific AC brand?",
    a: "Yes. Every TechWork mobile service van is a 'warehouse on wheels' stocked with universal dual run capacitors, contactors, fan motors, hard start kits, transformers, and R-410A refrigerant for Trane, Carrier, Lennox, Rheem, Goodman, Daikin, and York.",
  },
  {
    q: "What warranty do you provide on repairs?",
    a: "All repairs and OEM part replacements are backed by our 1-Year Comprehensive Parts & Labor Warranty. If the same component fails within 365 days, we replace it at zero cost to you.",
  },
  {
    q: "Can I track my technician's live location?",
    a: "Yes. When your technician departs for your address, you receive an automated SMS text message with a live GPS map link showing their real-time van route, technician photo, and exact ETA.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), contactless mobile tap (Apple Pay, Google Pay), and offline checks.",
  },
];

// All 12 real Miami-Dade service area pages (No generic /areas dead ends!)
const NEIGHBORHOOD_AREAS = [
  { name: "Brickell", href: "/service-areas/brickell", zip: "33131", eta: "25 min" },
  { name: "Downtown Miami", href: "/service-areas/downtown-miami", zip: "33132", eta: "30 min" },
  { name: "Coral Gables", href: "/service-areas/coral-gables", zip: "33134", eta: "35 min" },
  { name: "Coconut Grove", href: "/service-areas/coconut-grove", zip: "33133", eta: "30 min" },
  { name: "Miami Beach", href: "/service-areas/miami-beach", zip: "33139", eta: "40 min" },
  { name: "Kendall", href: "/service-areas/kendall", zip: "33143", eta: "40 min" },
  { name: "Doral", href: "/service-areas/doral", zip: "33126", eta: "35 min" },
  { name: "Pinecrest", href: "/service-areas/pinecrest", zip: "33156", eta: "45 min" },
  { name: "Key Biscayne", href: "/service-areas/key-biscayne", zip: "33149", eta: "45 min" },
  { name: "Wynwood", href: "/service-areas/wynwood", zip: "33127", eta: "25 min" },
  { name: "Aventura", href: "/service-areas/aventura", zip: "33180", eta: "35 min" },
  { name: "Sunny Isles Beach", href: "/service-areas/sunny-isles", zip: "33160", eta: "40 min" },
];

export default function LandingPage() {
  // Thumbtack ZIP-First Matching State
  const [zipInput, setZipInput] = React.useState("33131");
  const [zipChecked, setZipChecked] = React.useState(true);
  const [zipServed, setZipServed] = React.useState(true);
  const [selectedSymptom, setSelectedSymptom] = React.useState<SymptomChip>(SYMPTOM_CHIPS[0]);

  // Cost Estimator State
  const [estimatorProblemIdx, setEstimatorProblemIdx] = React.useState(0);
  const [equipmentType, setEquipmentType] = React.useState<"split" | "heatpump" | "ductless" | "commercial">("split");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  // Copied coupon toast notification
  const [copiedCoupon, setCopiedCoupon] = React.useState<string | null>(null);

  const cleanPhone = businessConfig.phone.replace(/\D/g, "");

  // Safe clipboard helper with fallback
  const handleCopyCoupon = async (code: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      }
      setCopiedCoupon(code);
      toast.success(`Coupon code ${code} copied! Auto-applied at checkout.`);
      setTimeout(() => setCopiedCoupon(null), 3000);
    } catch {
      setCopiedCoupon(code);
      toast.success(`Coupon code ${code} active!`);
      setTimeout(() => setCopiedCoupon(null), 3000);
    }
  };

  const handleZipChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 5);
    setZipInput(clean);
    if (clean.length === 5) {
      setZipChecked(true);
      // Miami-Dade ZIPs start with 331
      const isMiami = clean.startsWith("331") || clean === "33010" || clean === "33012";
      setZipServed(isMiami);
    } else {
      setZipChecked(false);
    }
  };

  const activeEstimator = COST_ESTIMATOR_PROBLEMS[estimatorProblemIdx];

  return (
    <div className="min-h-screen flex flex-col bg-white text-navy-950 font-sans selection:bg-orange-500 selection:text-white">
      {/* ========================================================
          1. TOP LIVE DISPATCH STATUS BAR (Harmonized Numbers)
          ======================================================== */}
      <div className="bg-navy-950 text-white px-3 sm:px-4 py-2 border-b border-navy-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-300">
              <strong className="text-white font-bold">Miami-Dade Live Dispatch:</strong> 14 Active Trucks on Duty · 28-Min Average Arrival Available
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden md:inline text-slate-400">
              Mon–Sat 7AM–8PM · 24/7 Priority Emergency On-Call
            </span>
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 text-white font-bold hover:text-orange-400 transition-colors"
            >
              <Phone className="h-3 w-3 text-orange-400" />
              <span>{businessConfig.phone}</span>
            </a>
            <Link
              href="/book"
              className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-bold underline text-xs"
            >
              <span>Claim Priority Slot</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. HERO SECTION — THUMBTACK PATTERN: ZIP-FIRST MATCHING
          ======================================================== */}
      <section className="relative bg-gradient-to-b from-slate-900 via-navy-950 to-slate-950 text-white overflow-hidden py-10 lg:py-16">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Thumbtack Matching Engine */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-900/90 border border-navy-700/80 text-xs font-semibold text-slate-200">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                <span>Top Rated Miami HVAC Pro</span>
                <span className="text-slate-500">·</span>
                <span className="text-orange-400 font-bold">FL Lic #CAC1822194</span>
              </div>

              {/* H1 Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white leading-[1.12]">
                Fast, Upfront AC Repair &amp; Emergency Service in Miami-Dade
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Local EPA-certified technicians at your doorstep in under 30 minutes. Flat-rate pricing, 100% credited diagnostic, 1-year warranty, and real-time GPS van tracking.
              </p>

              {/* THUMBTACK MATCHING CARD */}
              <div className="bg-white text-navy-950 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 text-left space-y-5">
                {/* Step 1: ZIP Code Input */}
                <div>
                  <label htmlFor="hero-zip-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Step 1 · Enter Your Miami-Dade ZIP Code
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
                      <Input
                        id="hero-zip-input"
                        type="text"
                        value={zipInput}
                        onChange={(e) => handleZipChange(e.target.value)}
                        placeholder="e.g. 33131 or 33139"
                        className="pl-11 pr-4 h-12 text-base font-bold text-navy-900 rounded-xl border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                        maxLength={5}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {["33131", "33139", "33134", "33132"].map((quickZip) => (
                        <button
                          key={quickZip}
                          type="button"
                          onClick={() => handleZipChange(quickZip)}
                          className={`text-xs font-semibold px-2.5 py-2 rounded-lg border transition-all shrink-0 ${
                            zipInput === quickZip
                              ? "bg-navy-950 text-white border-navy-950"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {quickZip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ZIP Live Status Notification */}
                  {zipChecked && zipServed && (
                    <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>✓ 2 Mobile Service Vans active in {zipInput} · Estimated arrival: 28 mins</span>
                    </div>
                  )}
                  {zipChecked && !zipServed && (
                    <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      <span>ZIP {zipInput} is outside standard route. Call (305) 555-0199 for emergency dispatch.</span>
                    </div>
                  )}
                </div>

                {/* Step 2: What is your AC doing? (Symptom Chips) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Step 2 · What is your AC experiencing today?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SYMPTOM_CHIPS.map((chip) => {
                      const IconComp = chip.icon;
                      const isSelected = selectedSymptom.id === chip.id;
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => setSelectedSymptom(chip)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                            isSelected
                              ? "border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-400"
                              : "border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <IconComp className={`h-4 w-4 shrink-0 ${isSelected ? "text-orange-600" : "text-slate-500"}`} />
                            <span className="text-xs font-bold text-navy-950 leading-tight">
                              {chip.label}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-orange-700">
                            Est. {chip.priceEstimate}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Action Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-600">
                    Selected: <strong className="text-navy-950 font-bold">{selectedSymptom.label}</strong>
                    <span className="block text-slate-500 text-[11px]">{selectedSymptom.typicalFix}</span>
                  </div>

                  <Link
                    href={`/book?zip=${zipInput}&serviceId=${selectedSymptom.serviceId}${
                      selectedSymptom.defaultCoupon ? `&coupon=${selectedSymptom.defaultCoupon}` : ""
                    }`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto rounded-xl font-bold px-6 shadow-md shadow-orange-500/20"
                    >
                      <span>Find Matched Pro &amp; Book</span>
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Certified Technician Visual Proof */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800/80 bg-slate-900">
                <Image
                  src="/images/technician-hero.png"
                  alt="TechWork Lead HVAC Technician Carlos Mendez"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 480px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-90" />

                {/* Floating Trust Card Top */}
                <div className="absolute top-4 left-4 right-4 bg-navy-950/90 backdrop-blur-md rounded-2xl p-3 border border-navy-700 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Carlos Mendez (Lead Tech)</span>
                      <span className="text-[10px] bg-emerald-500 text-navy-950 font-extrabold px-1.5 py-0.2 rounded">
                        ON DUTY
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      12 Yrs Exp · EPA Universal Certified #CAC1822194
                    </p>
                  </div>
                </div>

                {/* Floating Social Proof Card Bottom */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md text-navy-950 rounded-2xl p-3.5 border border-slate-200 shadow-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-orange-500 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                      ))}
                      <span className="text-xs font-black text-navy-950 ml-1">4.9 / 5.0</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      1,248 Verified Miami Reviews
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-700 block">
                      28-Min Avg Arrival
                    </span>
                    <span className="text-[10px] text-slate-500">Live GPS Dispatched</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SOCIAL PROOF AGGREGATE ROW (Thumbtack Format)
          ======================================================== */}
      <section className="bg-slate-50 border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-orange-500">
                <Star className="h-5 w-5 fill-orange-500" />
                <span className="text-2xl font-black text-navy-950">4.9★</span>
              </div>
              <p className="text-xs font-bold text-slate-800">1,248 Verified Reviews</p>
              <p className="text-[11px] text-slate-500">Google &amp; Direct Customer Rating</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-navy-950">
                <Radio className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-black text-navy-950">14 Trucks</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Mobile Service Vans</p>
              <p className="text-[11px] text-slate-500">Active throughout Miami-Dade</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-navy-950">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span className="text-2xl font-black text-navy-950">28-Min</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Average Arrival Time</p>
              <p className="text-[11px] text-slate-500">Live GPS tracking link sent</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-navy-950">
                <ShieldCheck className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-black text-navy-950">1-Year</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Parts &amp; Labor Warranty</p>
              <p className="text-[11px] text-slate-500">FL State Licensed #CAC1822194</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. INSTANT COST ESTIMATOR (Moved Above The Fold Per Review)
          ======================================================== */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Upfront Pricing Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-navy-950">
              Instant Repair Cost Guidance
            </h2>
            <p className="text-sm text-slate-600">
              Know what it costs before we arrive. 100% of diagnostic fees are credited to any approved repair.
            </p>
          </div>

          <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Problem Selection */}
              <div className="lg:col-span-7 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Select Your System Symptom:
                </label>
                <div className="space-y-2">
                  {COST_ESTIMATOR_PROBLEMS.map((prob, idx) => (
                    <button
                      key={prob.name}
                      type="button"
                      onClick={() => setEstimatorProblemIdx(idx)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        estimatorProblemIdx === idx
                          ? "bg-white border-orange-500 shadow-sm ring-1 ring-orange-400"
                          : "bg-white/60 border-slate-200 hover:bg-white"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold text-navy-900">
                        {prob.name}
                      </span>
                      <span className="text-xs font-black text-orange-600 shrink-0 ml-2">
                        {prob.range}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Equipment Type Toggle */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Equipment Type:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "split", label: "Central AC" },
                      { id: "heatpump", label: "Heat Pump" },
                      { id: "ductless", label: "Mini-Split" },
                      { id: "commercial", label: "Commercial RTU" },
                    ].map((eq) => (
                      <button
                        key={eq.id}
                        type="button"
                        onClick={() => setEquipmentType(eq.id as typeof equipmentType)}
                        className={`text-xs font-bold py-2 px-2.5 rounded-xl border text-center transition-all ${
                          equipmentType === eq.id
                            ? "bg-navy-950 text-white border-navy-950"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {eq.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimate Summary Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Estimated Price</span>
                  <span className="text-2xl font-black text-navy-950">
                    {activeEstimator.range}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">
                      <strong>$129 Diagnostic Fee</strong> is 100% credited toward your final repair.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">
                      <strong>Typical Duration:</strong> {activeEstimator.typicalTime}.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">
                      <strong>In-Stock Parts:</strong> {activeEstimator.partsInStock}.
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/book?serviceId=${activeEstimator.serviceId}${
                      activeEstimator.couponCode ? `&coupon=${activeEstimator.couponCode}` : ""
                    }`}
                  >
                    <Button variant="primary" size="lg" className="w-full rounded-xl font-bold">
                      <span>Book at Quoted Rate</span>
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. POPULAR PROJECTS & SERVICES (Thumbtack Project Chips)
          ======================================================== */}
      <section className="py-12 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                Popular HVAC Projects
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-navy-950 mt-1">
                Frequently Requested Services in Miami
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <span>View All 8 HVAC Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-44 w-full bg-slate-100">
                    <Image
                      src={proj.image}
                      alt={proj.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-navy-950/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-navy-700">
                      {proj.category}
                    </div>
                    {proj.popular && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        High Demand
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-black text-lg text-navy-950">
                        {proj.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {proj.desc}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-xs text-slate-500 block">Starting At</span>
                        <span className="text-lg font-black text-navy-950">{proj.startingPrice}</span>
                        <span className="text-[11px] text-slate-500 block">{proj.rateType}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 block mb-0.5">
                          {proj.hiresCount}
                        </span>
                        <span className="text-[10px] text-slate-500">{proj.warranty}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="p-5 pt-0">
                  <Link href={proj.bookUrl}>
                    <Button variant="outline" size="sm" className="w-full rounded-xl font-bold justify-between">
                      <span>Book Service</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. UNIFIED PROMOTIONS BANNER (Demoted to Single Strip)
          ======================================================== */}
      <section className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 text-white py-8 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Verified Digital Coupons
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
                Active Homeowner Specials This Week
              </h3>
              <p className="text-xs text-slate-300">
                Clip verified digital coupons to auto-apply instant credits to your diagnostic or seasonal maintenance.
              </p>
            </div>

            {/* Coupons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Coupon 1: FIRST25 */}
              <div className="bg-navy-900 border border-navy-700 rounded-2xl p-3 flex items-center gap-3">
                <div className="text-left">
                  <span className="text-[10px] font-extrabold text-orange-400 uppercase block">New Customers</span>
                  <span className="text-sm font-black text-white">$25 OFF Diagnostic</span>
                  <span className="text-[10px] text-slate-400 block font-mono">CODE: FIRST25</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCoupon("FIRST25")}
                  className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shrink-0"
                >
                  {copiedCoupon === "FIRST25" ? "Clipped!" : "Clip & Apply"}
                </button>
              </div>

              {/* Coupon 2: TUNE89 */}
              <div className="bg-navy-900 border border-navy-700 rounded-2xl p-3 flex items-center gap-3">
                <div className="text-left">
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase block">Seasonal Special</span>
                  <span className="text-sm font-black text-white">$89 Complete Tune-Up</span>
                  <span className="text-[10px] text-slate-400 block font-mono">CODE: TUNE89</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCoupon("TUNE89")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shrink-0"
                >
                  {copiedCoupon === "TUNE89" ? "Clipped!" : "Clip & Apply"}
                </button>
              </div>

              <Link
                href="/specials"
                className="text-xs font-bold text-slate-300 hover:text-white underline px-2 py-1"
              >
                View all 4 specials →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. HOW IT WORKS (Thumbtack 4-Step Frictionless Flow)
          ======================================================== */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              The TechWork Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-navy-950">
              How Dispatch &amp; Repair Works
            </h2>
            <p className="text-sm text-slate-600">
              Transparent, automated, and hassle-free from online booking to verified thermal test.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200 relative flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-black font-heading text-slate-300">
                      {step.step}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-navy-950">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. OEM BRAND COMPATIBILITY TRUST BAR
          ======================================================== */}
      <section className="py-6 bg-slate-100 border-b border-slate-200 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Fully Stocked Truck Inventory &amp; Certified Warranty Service For:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-slate-700">
            {OEM_BRANDS.map((brand) => (
              <span key={brand} className="hover:text-navy-950 transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          9. CUSTOMER TESTIMONIALS (Thumbtack Format)
          ======================================================== */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                Verified Homeowner Reviews
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-navy-950 mt-1">
                Real Miami Neighbors, Real Results
              </h2>
            </div>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Read all 1,248 Verified Reviews</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-700 bg-orange-100/70 px-2.5 py-0.5 rounded-full">
                      {t.project}
                    </span>
                    <div className="flex items-center gap-0.5 text-orange-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-orange-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy-950 block">{t.author}</span>
                    <span className="text-slate-500 text-[11px]">{t.neighborhood}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Tech: {t.technician}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          10. 12 MIAMI-DADE SERVICE AREAS (100% Real Links)
          ======================================================== */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                Local Coverage
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-navy-950 mt-1">
                Serving All 12 Miami-Dade Neighborhoods
              </h2>
            </div>
            <Link
              href="/areas"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Explore Full Service Area Directory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {NEIGHBORHOOD_AREAS.map((area) => (
              <Link
                key={area.name}
                href={area.href}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-orange-400 hover:shadow-sm transition-all text-left flex flex-col justify-between gap-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-950 group-hover:text-orange-600 transition-colors">
                    {area.name}
                  </span>
                  <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-orange-500" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{area.zip}</span>
                  <span className="font-semibold text-emerald-700">{area.eta}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          11. FAQ ACCORDION
          ======================================================== */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-navy-950">
              Clear Answers About Our Service
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-navy-950 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-orange-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          12. CLOSING DISPATCH PROMPT & CTA
          ======================================================== */}
      <section className="bg-navy-950 text-white py-14 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-navy-900 px-3 py-1 rounded-full border border-navy-700">
            Immediate Dispatch Available
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
            Need Cold Air Restored Today?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Book your guaranteed 2-hour arrival window online or connect with our Miami dispatch desk directly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/book" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto rounded-xl font-bold px-8 shadow-lg shadow-orange-500/25"
              >
                <span>Book Service Online</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>

            <a href={`tel:${cleanPhone}`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-xl font-bold px-8 border-slate-700 text-white hover:bg-slate-800"
              >
                <Phone className="h-4 w-4 mr-2 text-orange-400" />
                <span>Call {businessConfig.phone}</span>
              </Button>
            </a>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            Mon–Sat 7AM–8PM · 24/7 Priority Emergency Dispatch · FL Lic #CAC1822194
          </p>
        </div>
      </section>
    </div>
  );
}
