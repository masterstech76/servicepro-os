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
  MessageSquare,
  ChevronRight,
  ChevronDown,
  MapPin,
  Wind,
  Search,
  Sparkles,
  Tag,
  ThumbsUp,
  Phone,
  Shield,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Layers,
  Award,
  Radio,
  X,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

interface ServiceItem {
  id: string;
  name: string;
  desc: string;
  price: string;
  rateType: string;
  href: string;
  icon: React.ElementType;
  image: string;
  popular?: boolean;
  warranty: string;
}

const ALL_SERVICES: ServiceItem[] = [
  {
    id: "svc-ac-repair",
    name: "AC Repair & Diagnostic",
    desc: "Fast electrical diagnostics, troubleshooting, and OEM part replacements for warm air, refrigerant leaks, or humming motors.",
    price: "$129",
    rateType: "Flat Diagnostic (100% Credited)",
    href: "/services/ac-repair",
    icon: Snowflake,
    image: "/images/svc-ac-repair.jpg",
    popular: true,
    warranty: "1-Year Parts & Labor",
  },
  {
    id: "svc-ac-tuneup",
    name: "AC Tune-Up & Maintenance",
    desc: "21-point comprehensive seasonal inspection, condenser coil rinse, biocide drain line flush, and subcooling pressure balance.",
    price: "$89",
    rateType: "Seasonal Special",
    href: "/services/ac-tuneup",
    icon: Wrench,
    image: "/images/svc-ac-tuneup.jpg",
    popular: true,
    warranty: "Energy Savings Guarantee",
  },
  {
    id: "svc-emergency-hvac",
    name: "24/7 Emergency HVAC Dispatch",
    desc: "Priority dispatch within 60 minutes for complete cooling loss, frozen evaporator coils, electrical trips, or compressor lockdown.",
    price: "$169",
    rateType: "Priority Dispatch",
    href: "/services/emergency-hvac",
    icon: Zap,
    image: "/images/svc-ac-repair.jpg",
    popular: true,
    warranty: "Guaranteed 60-Min Arrival",
  },
  {
    id: "svc-duct-cleaning",
    name: "Air Duct Cleaning & Sanitizing",
    desc: "Whole-home negative air vacuuming, rotobrush agitation, EPA registered antimicrobial fogging, and dryer vent lint sweep.",
    price: "$249",
    rateType: "Flat Rate Whole Home",
    href: "/services/duct-cleaning",
    icon: Wind,
    image: "/images/svc-duct-cleaning.jpg",
    warranty: "IAQ Certified Clean",
  },
  {
    id: "svc-thermostat-install",
    name: "Smart Thermostat Installation",
    desc: "Google Nest, Ecobee, or Honeywell smart thermostat setup, custom C-wire power routing, smartphone app pairing, and schedule calibration.",
    price: "$149",
    rateType: "Flat Rate Installation",
    href: "/services/thermostat-install",
    icon: Sliders,
    image: "/images/svc-thermostat-install.jpg",
    warranty: "Lifetime Wiring Warranty",
  },
  {
    id: "svc-refrigerant-recharge",
    name: "Refrigerant Recharge & Leak Test",
    desc: "Nitrogen pressure leak detection, Schrader valve tightening, electronic sniffer test, and R410A / R22 precision subcooling charging.",
    price: "$125/hr",
    rateType: "EPA Certified Service",
    href: "/services/refrigerant-recharge",
    icon: Snowflake,
    image: "/images/svc-refrigerant-recharge.jpg",
    warranty: "90-Day Leak-Free Guarantee",
  },
  {
    id: "svc-furnace-repair",
    name: "Heat Pump & Heating Repair",
    desc: "Heat pump reversing valve diagnosis, electric auxiliary heat strips replacement, limit switches, and winter thermostat cycling.",
    price: "$139",
    rateType: "Flat Diagnostic",
    href: "/services/furnace-repair",
    icon: Flame,
    image: "/images/svc-furnace-repair.jpg",
    warranty: "1-Year Heating Guarantee",
  },
  {
    id: "svc-commercial-hvac",
    name: "Commercial HVAC & Rooftop Units",
    desc: "Commercial RTUs, package systems, server room cooling, multi-zone VRF systems, and commercial preventative service contracts.",
    price: "Custom",
    rateType: "Commercial Quote",
    href: "/services/commercial-hvac",
    icon: Layers,
    image: "/images/svc-commercial-hvac.jpg",
    warranty: "Commercial SLA Compliance",
  },
];

const SYMPTOM_OPTIONS = [
  {
    label: "Blowing Warm Air",
    icon: "🔥",
    serviceId: "svc-ac-repair",
    serviceName: "AC Repair & Diagnostic",
    price: "$129",
    eta: "Today, within 60 mins",
    cause: "Common: Bad capacitor, refrigerant leak, or tripped outdoor breaker",
  },
  {
    label: "Water Leaking Inside",
    icon: "💧",
    serviceId: "svc-ac-repair",
    serviceName: "Condensate Drain Clear & AC Repair",
    price: "$129",
    eta: "Today, within 45 mins",
    cause: "Common: Clogged drain line, cracked drain pan, or frozen coil thawing",
  },
  {
    label: "Loud Buzzing / Clicking",
    icon: "⚡",
    serviceId: "svc-ac-repair",
    serviceName: "Electrical Diagnostic & Repair",
    price: "$129",
    eta: "Today, within 60 mins",
    cause: "Common: Worn contactor, failing dual run capacitor, or seized fan motor",
  },
  {
    label: "AC Won't Turn On",
    icon: "🔌",
    serviceId: "svc-emergency-hvac",
    serviceName: "24/7 Priority Emergency Dispatch",
    price: "$169",
    eta: "Immediate (Under 60 Mins)",
    cause: "Common: Float switch safety trip, blown control fuse, or dead thermostat",
  },
  {
    label: "High Electric Bills",
    icon: "📈",
    serviceId: "svc-ac-tuneup",
    serviceName: "21-Point Energy Tune-Up",
    price: "$89",
    eta: "Tomorrow or Same-Day",
    cause: "Common: Dirty coils, low airflow, or overworked compressor drawing excess amps",
  },
  {
    label: "Musty Odors / Dust",
    icon: "🌬️",
    serviceId: "svc-duct-cleaning",
    serviceName: "Air Duct Cleaning & Biocidal Sanitizing",
    price: "$249",
    eta: "Scheduled 2-Hour Window",
    cause: "Common: Microbial mold buildup in return plenum or saturated flex ducting",
  },
];

const COST_ESTIMATOR_PROBLEMS = [
  {
    name: "AC Blowing Warm / No Cold Air",
    range: "$129 – $240",
    partsInStock: "Capacitors, Relays & Contactors on all vans",
    serviceId: "svc-ac-repair",
    typicalTime: "45 – 75 minutes",
  },
  {
    name: "Water Leak / Clogged Drain Line",
    range: "$129 – $189",
    partsInStock: "Nitrogen blowers, drain tablets & safety float switches",
    serviceId: "svc-ac-repair",
    typicalTime: "30 – 60 minutes",
  },
  {
    name: "System Won't Power On / Complete Shutdown",
    range: "$129 – $290",
    partsInStock: "Control boards, fuses & contactors",
    serviceId: "svc-emergency-hvac",
    typicalTime: "45 – 90 minutes",
  },
  {
    name: "Seasonal Maintenance & Coil Wash",
    range: "$89 Flat Rate",
    partsInStock: "Coil cleaner, biocide wash & standard filters",
    serviceId: "svc-ac-tuneup",
    typicalTime: "60 minutes",
  },
  {
    name: "Refrigerant Leak Detection & Recharge",
    range: "$250 – $480",
    partsInStock: "R-410A / R-22 EPA cylinders & Schrader valves",
    serviceId: "svc-refrigerant-recharge",
    typicalTime: "60 – 120 minutes",
  },
];

const PROMOTIONAL_DEALS = [
  {
    badge: "Amazon Deal of the Day",
    badgeColor: "bg-orange-500 text-navy-950",
    title: "$89 Seasonal AC Tune-Up",
    origPrice: "$149",
    salePrice: "$89",
    discount: "Save $60 (40% OFF)",
    desc: "Complete 21-point system overhaul, condenser chemical wash, biocide drain flush, and subcooling check.",
    code: "SUMMER89",
    serviceId: "svc-ac-tuneup",
    expires: "Valid for next 14 bookings",
  },
  {
    badge: "First-Time Homeowner Credit",
    badgeColor: "bg-emerald-600 text-white",
    title: "$30 OFF Any AC Diagnostic",
    origPrice: "$129",
    salePrice: "$99",
    discount: "Save $30 Instantly",
    desc: "Book your first diagnostic with TechWork. 100% of diagnostic fee credited to any repair if work approved.",
    code: "TECHWORK30",
    serviceId: "svc-ac-repair",
    expires: "New customers only",
  },
  {
    badge: "Whole-Home IAQ Bundle",
    badgeColor: "bg-blue-600 text-white",
    title: "$50 OFF Duct Sanitizing",
    origPrice: "$249",
    salePrice: "$199",
    discount: "Save $50 This Week",
    desc: "Breathe cleaner air. High-powered negative pressure HEPA vacuuming + hospital-grade antimicrobial fogging.",
    code: "AIRPURE50",
    serviceId: "svc-duct-cleaning",
    expires: "Limited seasonal slots",
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
    title: "Book Online in 60s",
    desc: "Choose your exact 2-hour arrival window online. Instant confirmation — zero telephone hold music.",
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
    desc: "Your technician inspects the system and presents an itemized iPad quote before any work begins. Deposit 100% credited.",
    icon: DollarSign,
  },
  {
    step: "04",
    title: "100% Fixed-Right Guarantee",
    desc: "Cold air restored and fully verified with thermal laser imaging. Backed by our 1-year parts & labor warranty.",
    icon: ShieldCheck,
  },
];

const TESTIMONIALS = [
  {
    name: "David Morales",
    location: "Brickell (High-Rise Condo)",
    date: "October 16, 2026",
    rating: 5,
    tag: "Emergency AC Repair",
    text: "AC went out on a 92° Sunday morning with a humming sound. Booked on my phone, and Carlos arrived in 38 minutes with OEM capacitors in his truck. Had cold 56° air blasting within the hour. No price gouging whatsoever.",
    technician: "Carlos Mendez (Lead Tech)",
  },
  {
    name: "Elena & Carlos Santoro",
    location: "Coral Gables (Single Family)",
    date: "October 9, 2026",
    rating: 5,
    tag: "$89 Seasonal Tune-Up",
    text: "Used the $89 tune-up special. Danny put on clean boot covers before stepping inside, cleared our clogged primary drain line, and sent high-res before/after photos directly to my email. Our electricity bill is already $40 lower this month.",
    technician: "Danny Reyes",
  },
  {
    name: "Dr. Marcus Vance",
    location: "Downtown Miami",
    date: "September 28, 2026",
    rating: 5,
    tag: "Smart Thermostat & Air Ducts",
    text: "Replaced an old mercury thermostat with a Google Nest and sanitized all our flex ducts. Clean, professional, on-time, and the initial booking deposit was credited straight to the invoice. This is how home service should work.",
    technician: "Maria Alvarez",
  },
];

const FAQS = [
  {
    q: "How fast can a technician arrive at my home?",
    a: "We guarantee arrival within your selected 2-hour window. For emergencies, our priority dispatch guarantees a certified technician at your door in under 60 minutes across Miami-Dade county.",
  },
  {
    q: "Is my diagnostic deposit credited toward the repair?",
    a: "Yes, 100%. If you approve any repair recommendation following our comprehensive diagnostic inspection, your deposit is fully credited toward the final invoice total.",
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

const NEIGHBORHOOD_AREAS = [
  { name: "Brickell", href: "/service-areas/brickell" },
  { name: "Downtown Miami", href: "/service-areas/downtown-miami" },
  { name: "Coral Gables", href: "/service-areas/coral-gables" },
  { name: "Coconut Grove", href: "/areas" },
  { name: "Kendall", href: "/areas" },
  { name: "Doral", href: "/areas" },
  { name: "Miami Beach", href: "/areas" },
  { name: "Wynwood", href: "/areas" },
  { name: "Aventura", href: "/areas" },
  { name: "Sunny Isles", href: "/areas" },
  { name: "South Miami", href: "/areas" },
  { name: "Pinecrest", href: "/areas" },
];

export default function LandingPage() {
  // Search and filter state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSymptom, setSelectedSymptom] = React.useState<typeof SYMPTOM_OPTIONS[0] | null>(null);

  // Cost estimator widget state
  const [estimatorProblemIdx, setEstimatorProblemIdx] = React.useState(0);
  const [homeSize, setHomeSize] = React.useState<"small" | "medium" | "large">("medium");

  // FAQ accordion state
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  // Copied coupon toast notification
  const [copiedCoupon, setCopiedCoupon] = React.useState<string | null>(null);

  const cleanPhone = businessConfig.phone.replace(/\D/g, "");

  const filteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) return ALL_SERVICES;
    const q = searchQuery.toLowerCase();
    return ALL_SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.rateType.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-navy-950 font-sans selection:bg-orange-500 selection:text-white">
      {/* ========================================================
          TOP EMERGENCY NOTIFICATION BANNER (Angi / Alert Style)
          ======================================================== */}
      <div className="bg-navy-950 text-white px-3 sm:px-4 py-2 border-b border-navy-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-300">
              <strong className="text-white font-bold">Miami-Dade Live Dispatch:</strong> 4 Mobile Service Vans on Duty · 60-Min Arrival Available
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-slate-400">Average ETA: 38 Mins</span>
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

      <main className="flex-1 space-y-16 lg:space-y-24 pb-16">
        {/* ========================================================
            1. HERO SECTION: Amazon Discovery + Angi 60-Sec Booking
            ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/40 via-white to-white pt-6 pb-12 lg:pt-10 lg:pb-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column (7 Cols): Headline, Diagnostic Search, CTAs, Badges */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Live Heat Dispatch Pill */}
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-500/30 px-3.5 py-1 text-xs font-bold text-orange-700 shadow-xs">
                  <Zap className="h-3.5 w-3.5 fill-orange-500 text-orange-500 animate-pulse" />
                  <span>SAME-DAY AC REPAIR · 60-MINUTE ARRIVAL GUARANTEE</span>
                </div>

                {/* Primary Conversion Heading */}
                <h1 className="font-heading text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-navy-950 leading-[1.08]">
                  Cold Air Restored Today.{" "}
                  <span className="text-orange-600 block sm:inline">Guaranteed in 60 Mins.</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Miami&apos;s #1 rated field service company for same-day AC repair, 21-point seasonal maintenance, and air duct cleaning. 100% upfront flat pricing with your deposit credited directly to the invoice.
                </p>

                {/* Amazon-Style Problem Diagnostic Search Bar */}
                <div className="pt-1 pb-1 space-y-3 max-w-xl">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search HVAC issue (e.g. warm air, leaking, capacitor, tune-up)..."
                      className="w-full h-13 pl-12 pr-28 rounded-2xl border-2 border-slate-200 bg-white text-sm text-navy-950 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 shadow-sm transition-all"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-28 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                    <Link
                      href="/services"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold inline-flex items-center justify-center shadow-xs transition-all"
                    >
                      Find Pro
                    </Link>
                  </div>

                  {/* Interactive Quick Symptom Pills (Angi Diagnostic) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Common AC Symptoms (Click to Diagnose):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {SYMPTOM_OPTIONS.map((symp, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSymptom(selectedSymptom?.label === symp.label ? null : symp)}
                          className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                            selectedSymptom?.label === symp.label
                              ? "bg-orange-500 text-navy-950 border-orange-500 font-bold shadow-xs"
                              : "bg-slate-100/80 hover:bg-orange-50 text-slate-700 hover:text-orange-700 border-slate-200"
                          }`}
                        >
                          <span className="mr-1">{symp.icon}</span>
                          <span>{symp.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Symptom Instant Preview Box */}
                  {selectedSymptom ? (
                    <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-3.5 space-y-2 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-orange-900 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-orange-600" />
                          Recommended Solution: {selectedSymptom.serviceName}
                        </span>
                        <span className="text-navy-950 font-black bg-white px-2 py-0.5 rounded-md border border-orange-200">
                          {selectedSymptom.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {selectedSymptom.cause} · Guaranteed ETA: <strong>{selectedSymptom.eta}</strong>
                      </p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          ✓ 100% of diagnostic credited to repair
                        </span>
                        <Button asChild size="sm" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black text-xs h-8">
                          <Link href={`/book?serviceId=${selectedSymptom.serviceId}`}>
                            Book This Fix Now →
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Dual Purposeful Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Button
                    asChild
                    className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black text-sm sm:text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    <Link href="/book" className="flex items-center justify-center gap-2.5">
                      <Calendar className="h-5 w-5" />
                      <span>Book Online (60-Min Arrival)</span>
                    </Link>
                  </Button>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="h-14 px-7 rounded-2xl border-2 border-slate-200 bg-white hover:border-orange-500 hover:bg-orange-50 text-navy-950 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span>Call 24/7 ({businessConfig.phone})</span>
                  </a>
                </div>

                {/* Angi Trust Verification Row */}
                <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-800">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Angi Certified · Lic #{businessConfig.licenseNumber}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-800">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    <span>4.9★ (1,240+ Reviews)</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-orange-600" />
                    <span>$2M Insured &amp; Bonded</span>
                  </div>
                </div>
              </div>

              {/* Right Column (5 Cols): Real Tech Visual + Dynamic Live Overlay Cards */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full max-w-[440px] h-[460px] sm:h-[520px]">
                  <Image
                    src="/images/technician-hero.png"
                    alt="Certified TechWork Master HVAC field technician"
                    fill
                    priority
                    quality={90}
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-contain object-bottom drop-shadow-2xl"
                  />

                  {/* Floating Live Card 1: Lead Tech Status */}
                  <div className="absolute top-4 right-0 sm:-right-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5 z-10">
                    <div className="h-9 w-9 rounded-xl bg-navy-950 text-orange-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">
                        Carlos M. · Master Tech
                      </div>
                      <div className="text-xs font-black text-navy-950 leading-tight mt-0.5 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Van #402 Active in Miami
                      </div>
                    </div>
                  </div>

                  {/* Floating Live Card 2: 60-Min Arrival Guarantee */}
                  <div className="absolute bottom-6 left-0 sm:-left-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5 z-10">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">
                        Average Response Time
                      </div>
                      <div className="text-xs font-black text-navy-950 leading-tight mt-0.5">
                        38 Mins GPS Dispatch
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. OEM BRANDS WE SERVICE (Amazon Brand Trust Bar)
            ======================================================== */}
        <section className="border-y border-slate-100 bg-slate-50/60 py-6 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Factory-Trained &amp; Certified For All Leading HVAC Manufacturers
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-80">
              {OEM_BRANDS.map((brand, i) => (
                <span
                  key={i}
                  className="font-heading font-black text-xs sm:text-sm tracking-wider text-slate-600 uppercase hover:text-navy-950 transition-colors"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            3. ANGI INTERACTIVE COST & TIME ESTIMATOR WIDGET
            ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-orange-50/30 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                  Instant Cost Transparency
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-2">
                  Angi-Style Instant HVAC Repair Cost Estimator
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                  Select your current air conditioning issue and system specs to see estimated repair costs, parts truck availability, and arrival time.
                </p>
              </div>

              {/* Home Size Selector */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1 text-xs self-start lg:self-center shadow-xs">
                <span className="text-slate-500 font-bold px-2">Property:</span>
                <button
                  type="button"
                  onClick={() => setHomeSize("small")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    homeSize === "small" ? "bg-navy-950 text-white" : "text-slate-600 hover:text-navy-950"
                  }`}
                >
                  Condo / Apt
                </button>
                <button
                  type="button"
                  onClick={() => setHomeSize("medium")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    homeSize === "medium" ? "bg-navy-950 text-white" : "text-slate-600 hover:text-navy-950"
                  }`}
                >
                  Single Family
                </button>
                <button
                  type="button"
                  onClick={() => setHomeSize("large")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    homeSize === "large" ? "bg-navy-950 text-white" : "text-slate-600 hover:text-navy-950"
                  }`}
                >
                  Multi-Unit
                </button>
              </div>
            </div>

            {/* Estimator Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              {/* Problem Selector List (Left 6 Cols) */}
              <div className="lg:col-span-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Select Diagnosed Problem:
                </span>
                {COST_ESTIMATOR_PROBLEMS.map((prob, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEstimatorProblemIdx(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      estimatorProblemIdx === idx
                        ? "border-orange-500 bg-white shadow-md ring-2 ring-orange-500/20"
                        : "border-slate-200 bg-white/70 hover:bg-white text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          estimatorProblemIdx === idx
                            ? "bg-orange-500 text-navy-950"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-navy-950">{prob.name}</span>
                    </div>
                    <span className="text-xs font-bold text-orange-600">{prob.range}</span>
                  </button>
                ))}
              </div>

              {/* Estimate Calculation Breakdown (Right 6 Cols) */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Live Estimate Summary
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      100% Upfront Guarantee
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-black text-navy-950">
                        {COST_ESTIMATOR_PROBLEMS[estimatorProblemIdx].name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Typical repair duration: <strong>{COST_ESTIMATOR_PROBLEMS[estimatorProblemIdx].typicalTime}</strong>
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Estimated Total Cost:</span>
                        <span className="font-black text-navy-950 text-base text-orange-600">
                          {COST_ESTIMATOR_PROBLEMS[estimatorProblemIdx].range}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/80 pt-2">
                        <span className="text-slate-600">Initial Diagnostic Deposit:</span>
                        <span className="font-bold text-navy-950">$129 (100% credited to repair)</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/80 pt-2">
                        <span className="text-slate-600">Parts Availability:</span>
                        <span className="font-bold text-emerald-700">✓ In Stock on Mobile Trucks</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/80 pt-2">
                        <span className="text-slate-600">Warranty Protection:</span>
                        <span className="font-bold text-navy-950">1-Year Comprehensive Warranty</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild size="lg" className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black text-sm shadow-md">
                    <Link href={`/book?serviceId=${COST_ESTIMATOR_PROBLEMS[estimatorProblemIdx].serviceId}`}>
                      Book This Repair with 60-Min Arrival Window →
                    </Link>
                  </Button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Zero risk: If you decline our upfront quote, you only pay the diagnostic fee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. AMAZON-STYLE PROMOTIONAL DEALS & LIGHTNING SPECIALS
            ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                Seasonal Savings
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-2">
                Today&apos;s Featured Promotional Deals
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Direct discounts and verified promo codes. Click to auto-apply to your service booking.
              </p>
            </div>
            <Link
              href="/specials"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>View All Specials &amp; Coupons</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMOTIONAL_DEALS.map((deal, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${deal.badgeColor}`}>
                      {deal.badge}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {deal.discount}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-navy-950">{deal.title}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-navy-950">{deal.salePrice}</span>
                      <span className="text-sm font-semibold text-slate-400 line-through">{deal.origPrice}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{deal.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Promo Code:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCoupon(deal.code)}
                      className="font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md hover:bg-orange-100 flex items-center gap-1 transition-all"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{copiedCoupon === deal.code ? "Copied!" : deal.code}</span>
                    </button>
                  </div>

                  <Button asChild className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black text-xs h-10 shadow-xs">
                    <Link href={`/book?serviceId=${deal.serviceId}&coupon=${deal.code}`}>
                      Claim Deal &amp; Book Online
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            5. FULL SERVICES CATALOG: 8 HVAC CATEGORIES
            ======================================================== */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                Service Directory
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-2">
                All 8 Licensed HVAC Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Uniform flat rates, certified master technicians, and 1-year parts &amp; labor warranty.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Explore Detailed Specifications</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="group rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Modern Image Container with Tags */}
                    <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3.5">
                      <Image
                        src={svc.image}
                        alt={svc.name}
                        fill
                        quality={85}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-navy-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1">
                        <Icon className="h-3 w-3 text-orange-600" />
                        <span>{svc.rateType}</span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-navy-950/95 backdrop-blur-md text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-md">
                        {svc.price}
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <h3 className="font-heading text-base font-bold text-navy-950 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {svc.desc}
                      </p>
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                        ✓ {svc.warranty}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={svc.href}
                      className="text-xs font-bold text-slate-700 hover:text-orange-600 flex items-center gap-1 transition-colors"
                    >
                      <span>Specs</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>

                    <Button asChild size="sm" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black text-xs px-3.5 h-8.5 shadow-xs">
                      <Link href={`/book?serviceId=${svc.id}`}>
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            6. ANGI COMPARISON MATRIX: TechWork vs Average Handyman
            ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                Contractor Comparison
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
                Why Greater Miami Chooses TechWork
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                See how our certified field dispatch standard compares against typical unregulated handymen.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="p-3 sm:p-4 rounded-l-xl">Service Standard</th>
                    <th className="p-3 sm:p-4 text-orange-600 font-black bg-orange-50/50">TechWork Services LLC</th>
                    <th className="p-3 sm:p-4 rounded-r-xl">Average Handyman / Lead Broker</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-navy-950">Arrival Window</td>
                    <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-orange-50/20">
                      ✓ Guaranteed 60-Minute or 2-Hour Slot
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500">4 to 6-hour vague window (&ldquo;sometime today&rdquo;)</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-navy-950">Technician Credentials</td>
                    <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-orange-50/20">
                      ✓ EPA Universal 608 &amp; NATE Certified Master Techs
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500">Unvetted subcontractors or apprentices</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-navy-950">Pricing Model</td>
                    <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-orange-50/20">
                      ✓ 100% Upfront Flat Rate (Deposit Credited to Bill)
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500">Hidden &ldquo;trip charges&rdquo; and unexpected surcharges</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-navy-950">Truck Stock &amp; Parts</td>
                    <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-orange-50/20">
                      ✓ OEM Parts on Board (Fixed in 1 Visit)
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500">Multiple hardware store trips billed by the hour</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-navy-950">Warranty Coverage</td>
                    <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-orange-50/20">
                      ✓ 1-Year Comprehensive Parts &amp; Labor Warranty
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500">30-day verbal guarantee or none</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-navy-950">Live GPS Tracking</td>
                    <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-orange-50/20">
                      ✓ Real-time SMS link with van route &amp; tech photo
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500">No tracking — waiting by the front door</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================
            7. HOW IT WORKS (Stripe-Clear 4 Numbered Steps)
            ======================================================== */}
        <section className="bg-slate-50 border-y border-slate-200 py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                Simple &amp; Frictionless
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
                How Online Service Booking Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                No telephone waiting or sales pitches. From booking to cold air in 4 straightforward steps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 relative group hover:border-orange-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-black text-3xl text-orange-500/80 group-hover:text-orange-500 transition-colors">
                        {s.step}
                      </span>
                      <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-heading text-base font-bold text-navy-950">{s.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            8. VERIFIED CUSTOMER REVIEWS & FEEDBACK
            ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-navy-950 ml-1">4.9 / 5.0 (1,240+ Reviews)</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
                Verified Feedback From Miami Homeowners
              </h2>
            </div>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Explore Community Feed (1,240+ Reviews)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((rev, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs">
                        {rev.name[0]}
                      </div>
                      <div>
                        <span className="block font-bold text-xs text-navy-950">{rev.name}</span>
                        <span className="block text-[11px] text-slate-400 font-medium">{rev.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      {rev.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">{rev.date}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Tech: {rev.technician}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            9. INTERACTIVE FAQ ACCORDION (Amazon / Customer Q&A)
            ======================================================== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct, transparent answers regarding dispatch, pricing, warranties, and technicians.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-navy-950 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-orange-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-6">
            <Link href="/faq" className="text-xs font-bold text-orange-600 hover:underline">
              Have another question? Browse our full Help Center &amp; Knowledge Base →
            </Link>
          </div>
        </section>

        {/* ========================================================
            10. SERVICE AREAS DIRECTORY STRIP
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
                  Guaranteed same-day and 60-minute emergency arrival coverage across major neighborhoods.
                </p>
              </div>
              <Link href="/areas" className="text-xs font-bold text-orange-600 hover:underline">
                View All Areas Directory →
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {NEIGHBORHOOD_AREAS.map((chip, i) => (
                <Link
                  key={i}
                  href={chip.href}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-orange-500 hover:text-orange-600 shadow-xs transition-all"
                >
                  {chip.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            11. HIGH-CONVERSION BOTTOM CALL-TO-ACTION BANNER
            ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-navy-950 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl space-y-6">
            <div className="absolute inset-0 bg-radial from-orange-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 bg-navy-900 border border-orange-500/30 px-3 py-1 rounded-full">
                Fastest Response in {businessConfig.city}
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
                Don&apos;t Wait in the Heat. Book Your 60-Minute Arrival Window Now.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                Select your time slot in 60 seconds online or call our 24/7 emergency dispatch desk. Upfront flat rates with 100% deposit credit.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10 pt-2">
              <Button
                asChild
                className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black text-sm sm:text-base shadow-xl shadow-orange-500/30"
              >
                <Link href="/book" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Book Online (Pick Exact Time Window)</span>
                </Link>
              </Button>

              <a
                href={`tel:${cleanPhone}`}
                className="h-14 px-7 rounded-2xl border border-slate-700 bg-navy-900/80 hover:bg-navy-900 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>Call Dispatch ({businessConfig.phone})</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
