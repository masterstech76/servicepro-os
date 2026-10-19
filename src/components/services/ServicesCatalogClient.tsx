"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Snowflake,
  Wrench,
  Sliders,
  Flame,
  Sparkles,
  Gauge,
  ArrowRight,
  ShieldCheck,
  Clock,
  Phone,
  AlertCircle,
  Building2,
  CheckCircle2,
  HelpCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceItem {
  id: string;
  category: "cooling" | "heating" | "iaq" | "emergency" | "commercial";
  categoryLabel: string;
  title: string;
  desc: string;
  price: string;
  duration: string;
  href: string;
  bookHref: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
}

const ALL_SERVICES: ServiceItem[] = [
  {
    id: "svc-ac-repair",
    category: "cooling",
    categoryLabel: "Cooling",
    title: "AC Repair & Diagnostics",
    desc: "Rapid troubleshooting for AC systems blowing warm air, frozen evaporator coils, strange compressor noises, or water leaks.",
    price: "$129 Flat Diagnostic",
    duration: "~90 min",
    href: "/services/ac-repair",
    bookHref: "/book?serviceId=svc-ac-repair",
    icon: Snowflake,
    image: "/images/svc-ac-repair.jpg",
  },
  {
    id: "svc-ac-tuneup",
    category: "cooling",
    categoryLabel: "Cooling",
    title: "AC Tune-Up & Maintenance",
    desc: "Comprehensive 21-point inspection, condenser coil wash, electrical terminal tightening, and precision refrigerant check.",
    price: "$89 Seasonal Special",
    duration: "~60 min",
    href: "/services/ac-tuneup",
    bookHref: "/book?serviceId=svc-ac-tuneup",
    icon: Wrench,
    image: "/images/svc-ac-tuneup.jpg",
  },
  {
    id: "svc-refrigerant-recharge",
    category: "cooling",
    categoryLabel: "Cooling",
    title: "Refrigerant Leak Test & Recharge",
    desc: "Nitrogen pressure testing, electronic sniffer leak detection, and R-410A / R-22 factory subcooling balancing.",
    price: "$125/hr + Refrigerant",
    duration: "~60 min",
    href: "/services/refrigerant-recharge",
    bookHref: "/book?serviceId=svc-refrigerant-recharge",
    icon: Gauge,
    image: "/images/svc-refrigerant-recharge.jpg",
  },
  {
    id: "svc-furnace-repair",
    category: "heating",
    categoryLabel: "Heating",
    title: "Furnace & Heating System Repair",
    desc: "Diagnostic and repair for heat pumps, electric air handlers, hot-surface igniters, and safety limit switches.",
    price: "$129 Flat Diagnostic",
    duration: "~90 min",
    href: "/services/furnace-repair",
    bookHref: "/book?serviceId=svc-furnace-repair",
    icon: Flame,
    image: "/images/svc-furnace-repair.jpg",
  },
  {
    id: "svc-thermostat-install",
    category: "cooling",
    categoryLabel: "Smart Controls",
    title: "Smart Thermostat Installation",
    desc: "Professional wiring and mobile app configuration for Google Nest, Ecobee, Honeywell Home, and multi-zone controllers.",
    price: "$149 Flat Rate",
    duration: "~60 min",
    href: "/services/thermostat-install",
    bookHref: "/book?serviceId=svc-thermostat-install",
    icon: Sliders,
    image: "/images/svc-thermostat-install.jpg",
  },
  {
    id: "svc-duct-cleaning",
    category: "iaq",
    categoryLabel: "Air Quality",
    title: "Air Duct Cleaning & Sanitization",
    desc: "Negative-pressure HEPA filtration vacuuming, trunk line dust extraction, and EPA-registered antimicrobial fogging.",
    price: "$249 Whole Home",
    duration: "~180 min",
    href: "/services/duct-cleaning",
    bookHref: "/book?serviceId=svc-duct-cleaning",
    icon: Sparkles,
    image: "/images/svc-duct-cleaning.jpg",
  },
  {
    id: "svc-emergency-hvac",
    category: "emergency",
    categoryLabel: "Emergency",
    title: "24/7 Priority Emergency HVAC",
    desc: "Immediate on-call dispatch for total cooling failure during peak summer heat, critical leaks, and severe electrical faults.",
    price: "Priority Dispatch",
    duration: "Under 60 Min",
    href: "/services/emergency-hvac",
    bookHref: "/services/emergency-hvac",
    icon: Clock,
    image: "/images/hero.jpg",
  },
  {
    id: "svc-commercial-hvac",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "Commercial HVAC & Rooftop Units",
    desc: "Quarterly preventative maintenance agreements, packaged RTU service, and ventilation management for commercial properties.",
    price: "Custom Estimate",
    duration: "Scheduled",
    href: "/services/commercial-hvac",
    bookHref: "/contact",
    icon: Building2,
    image: "/images/service-bg.jpg",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "cooling", label: "Cooling & AC" },
  { id: "heating", label: "Heating & Furnaces" },
  { id: "iaq", label: "Air Quality & Ducts" },
  { id: "emergency", label: "24/7 Emergency" },
  { id: "commercial", label: "Commercial HVAC" },
] as const;

interface ServicesCatalogClientProps {
  businessPhone: string;
  city: string;
}

export function ServicesCatalogClient({ businessPhone, city }: ServicesCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const cleanPhoneHref = `tel:${businessPhone.replace(/\D/g, "")}`;

  const filteredServices = React.useMemo(() => {
    let list = ALL_SERVICES;
    if (selectedCategory !== "all") {
      list = list.filter((svc) => svc.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (svc) =>
          svc.title.toLowerCase().includes(q) ||
          svc.desc.toLowerCase().includes(q) ||
          svc.categoryLabel.toLowerCase().includes(q) ||
          svc.price.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Amazon-Style Search + Category Filter Bar */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AC diagnostics, tune-up specials, duct cleaning..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm text-navy-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 px-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-navy-900 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Emergency Full-Width Card (Section 2) */}
      <div className="rounded-3xl bg-navy-900 text-white p-6 sm:p-10 shadow-xl border border-navy-800 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs font-black text-orange-400 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
              24/7 Priority Emergency Dispatch
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              AC Down in the Middle of the Heat?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We provide guaranteed 60-minute emergency arrival for cooling breakdowns across {city}. Our mobile diagnostic vans carry 95% of common universal replacement parts on board.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No Weekend Surcharge
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Live GPS En-Route SMS
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Upfront Flat-Rate Quotes
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <a
              href={cleanPhoneHref}
              className="inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black text-sm shadow-md transition-all text-center"
            >
              <Phone className="h-4 w-4" />
              <span>Call Dispatch: {businessPhone}</span>
            </a>
            <Button asChild variant="outline" className="h-12 px-6 rounded-xl border-slate-700 bg-navy-800/80 hover:bg-navy-800 text-white font-bold text-xs">
              <Link href="/services/emergency-hvac">
                Emergency Protocol Details →
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Unified 3-Col Service Cards (Section 3) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-navy-900">
              {selectedCategory === "all" ? "All HVAC Services" : CATEGORIES.find(c => c.id === selectedCategory)?.label}
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredServices.length} transparent flat-rate services
            </p>
          </div>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="group rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image container with price badge */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-navy-900 font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
                      <Icon className="h-3 w-3 text-orange-600" />
                      <span>{svc.categoryLabel}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-navy-900/95 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                      {svc.price}
                    </div>
                  </div>

                  {/* Header info */}
                  <div className="space-y-1.5 mb-3">
                    <h4 className="font-heading text-lg font-bold text-navy-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {svc.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {svc.duration}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="h-3 w-3" />
                      100% Guaranteed
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={svc.href}
                      className="flex-1 h-9 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Button asChild size="sm" className="flex-1 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black text-xs shadow-sm">
                      <Link href={svc.bookHref}>
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Commercial HVAC Full-Width Card (Section 4) */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-orange-50/40 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-xs font-black text-navy-900 uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5 text-navy-900" />
              Commercial &amp; Property Management
            </div>
            <h3 className="font-heading text-2xl font-black text-navy-900">
              Commercial HVAC Maintenance &amp; Rooftop Systems
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We manage multi-unit retail centers, office buildings, restaurants, and medical facilities. Request a tailored preventative maintenance proposal with priority SLA guarantees.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-1">
              <span>• Custom Quarterly PM Plans</span>
              <span>• Dedicated Account Manager</span>
              <span>• Net 30 Commercial Invoicing</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Button asChild className="h-11 px-6 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md">
              <Link href="/services/commercial-hvac">
                Explore Commercial HVAC →
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-6 rounded-xl border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs">
              <Link href="/contact?service=Commercial+HVAC">
                Request Custom RFP Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Helper Card: "Not sure what's wrong?" (Section 5) */}
      <div className="rounded-3xl bg-orange-50 border border-orange-200/80 p-8 text-center space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-orange-500 text-navy-900 flex items-center justify-center mx-auto shadow-sm">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div className="space-y-2 max-w-lg mx-auto">
          <h3 className="font-heading text-xl font-black text-navy-900">
            Not Sure What&apos;s Wrong With Your System?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Don&apos;t worry—most homeowners don&apos;t know whether it&apos;s a capacitor, refrigerant leak, or thermostat failure. Book our standard flat-rate diagnostic inspection and our technician will pinpoint the issue with zero guesswork.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black text-xs h-11 px-6 shadow-md">
            <Link href="/book?serviceId=svc-ac-repair">
              Book $129 Diagnostic Inspection
            </Link>
          </Button>
          <a
            href={cleanPhoneHref}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-navy-900 font-bold text-xs transition-colors shadow-sm"
          >
            <Phone className="h-3.5 w-3.5 text-orange-500" />
            <span>Speak With Dispatch</span>
          </a>
        </div>
      </div>
    </div>
  );
}
