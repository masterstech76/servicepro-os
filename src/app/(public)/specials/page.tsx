"use client";

import * as React from "react";
import Link from "next/link";
import {
  Tag,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Copy,
  Zap,
  Flame,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface SpecialDeal {
  id: string;
  code: string;
  title: string;
  category: "all" | "repair" | "tuneup" | "upgrade";
  regularPrice: string;
  dealPrice: string;
  savings: string;
  savingsBadge: string;
  description: string;
  features: string[];
  claimedPercent: number;
  dealType: "Flash Deal" | "Limited Capacity" | "Seasonal Rebate" | "Energy Rebate";
  serviceSlug: string;
  bookUrl: string;
}

const DEALS: SpecialDeal[] = [
  {
    id: "deal-1",
    code: "FIRST25",
    title: "$25 Off First AC Repair Diagnostic",
    category: "repair",
    regularPrice: "$129",
    dealPrice: "$104",
    savings: "$25 OFF",
    savingsBadge: "19% OFF",
    description: "Save $25 on your initial comprehensive system diagnostic and electrical inspection. 100% credited toward approved repair work.",
    features: [
      "Full 21-point electrical & refrigerant test",
      "Exact written estimate before any work starts",
      "Same-day dispatch across Greater Miami",
      "Waived completely if repairs approved",
    ],
    claimedPercent: 88,
    dealType: "Flash Deal",
    serviceSlug: "ac-repair",
    bookUrl: "/book?service=svc-ac-repair&coupon=FIRST25",
  },
  {
    id: "deal-2",
    code: "TUNE89",
    title: "Seasonal 21-Point AC Precision Tune-Up",
    category: "tuneup",
    regularPrice: "$129",
    dealPrice: "$89",
    savings: "$40 OFF",
    savingsBadge: "31% OFF",
    description: "Prevent summer compressor burnouts, lower power consumption, and maintain factory warranty compliance with our multi-point tune-up.",
    features: [
      "Condenser coil chemical rinse & fin comb",
      "Condensate drain line flush & biocidal treatment",
      "Capacitor, contactor & motor amp testing",
      "30-day breakdown-free performance guarantee",
    ],
    claimedPercent: 92,
    dealType: "Seasonal Rebate",
    serviceSlug: "ac-tuneup",
    bookUrl: "/book?service=svc-ac-tuneup&coupon=TUNE89",
  },
  {
    id: "deal-3",
    code: "CLEANAIR50",
    title: "Whole-Home Air Duct Cleaning & Sanitization",
    category: "tuneup",
    regularPrice: "$299",
    dealPrice: "$249",
    savings: "$50 OFF",
    savingsBadge: "17% OFF",
    description: "Remove accumulated South Florida dust mites, mold spores, and construction debris with high-powered negative-air HEPA extraction.",
    features: [
      "Negative-air HEPA vacuum containment",
      "Rotary brush scrubbing of all supply branch trunks",
      "Hospital-grade botanical antimicrobial mist",
      "Before & after visual inspection photos",
    ],
    claimedPercent: 74,
    dealType: "Limited Capacity",
    serviceSlug: "duct-cleaning",
    bookUrl: "/book?service=svc-duct-cleaning&coupon=CLEANAIR50",
  },
  {
    id: "deal-4",
    code: "NEST30",
    title: "Smart Thermostat Pro Installation Rebate",
    category: "upgrade",
    regularPrice: "$179",
    dealPrice: "$149",
    savings: "$30 OFF",
    savingsBadge: "17% OFF",
    description: "Professional installation for Google Nest, Ecobee, or Honeywell smart thermostats, including 24V common wire (C-wire) power bridge.",
    features: [
      "Dedicated 24V C-wire testing and connection",
      "Smartphone app pairing and Wi-Fi synchronization",
      "Eco-scheduling optimization for humidity control",
      "Old thermostat safe disposal & recycling",
    ],
    claimedPercent: 65,
    dealType: "Energy Rebate",
    serviceSlug: "thermostat-install",
    bookUrl: "/book?service=svc-thermostat-install&coupon=NEST30",
  },
];

export default function SpecialsPage() {
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "repair" | "tuneup" | "upgrade">("all");
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  // Filtered list
  const filteredDeals = React.useMemo(() => {
    if (selectedFilter === "all") return DEALS;
    return DEALS.filter((d) => d.category === selectedFilter);
  }, [selectedFilter]);

  function handleClipCoupon(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} clipped to clipboard! Auto-applied to your booking.`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 4000);
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-navy-900 pb-20">
      {/* Amazon Deals Header Banner */}
      <section className="bg-navy-950 text-white pt-10 pb-12 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-4">
          <Breadcrumbs
            items={[{ label: "Deals & Specials" }]}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                <span>Today&apos;s Verified HVAC Deals &amp; Instant Coupons</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Amazon-Style Savings on Professional Service
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Clip verified digital coupons to claim upfront discounted diagnostics, tune-ups, and duct sanitization across {businessConfig.city}.
              </p>
            </div>

            {/* Urgency Box (Amazon Lightning Deal Style) */}
            <div className="rounded-2xl border border-orange-500/30 bg-orange-950/40 p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-1.5 min-w-[220px]">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Seasonal Allocation</span>
              </span>
              <div className="font-mono text-2xl font-black text-white">
                Limited Slots
              </div>
              <span className="text-[11px] text-slate-300">
                100% Satisfaction Guarantee
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFilter === "all"
                  ? "bg-orange-500 text-navy-950 shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              All Deals ({DEALS.length})
            </button>
            <button
              onClick={() => setSelectedFilter("repair")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFilter === "repair"
                  ? "bg-orange-500 text-navy-950 shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Repair &amp; Diagnostics
            </button>
            <button
              onClick={() => setSelectedFilter("tuneup")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFilter === "tuneup"
                  ? "bg-orange-500 text-navy-950 shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Tune-Ups &amp; Duct Care
            </button>
            <button
              onClick={() => setSelectedFilter("upgrade")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFilter === "upgrade"
                  ? "bg-orange-500 text-navy-950 shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Smart Upgrades
            </button>
          </div>
        </div>
      </section>

      {/* Main Deals Grid (Amazon Card Layout) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDeals.map((deal) => {
            const isCopied = copiedCode === deal.code;

            return (
              <div
                key={deal.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-md">
                      {deal.savingsBadge}
                    </span>
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {deal.dealType}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Verified Deal
                  </span>
                </div>

                {/* Price & Title Block */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-navy-950 font-heading">
                      {deal.dealPrice}
                    </span>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      {deal.regularPrice}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save {deal.savings}
                    </span>
                  </div>

                  <h2 className="font-heading text-xl sm:text-2xl font-black text-navy-950">
                    {deal.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* Checklist Features */}
                <div className="space-y-2 py-3 border-y border-slate-100">
                  {deal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Claim Bar (Amazon Lightning Deals) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>{deal.claimedPercent}% claimed</span>
                    <span className="text-orange-600 font-bold">Limited daily technician slots</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                      style={{ width: `${deal.claimedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Actions: Clip Coupon & Book */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  {/* Clip Coupon Button */}
                  <button
                    type="button"
                    onClick={() => handleClipCoupon(deal.code)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      isCopied
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 bg-white text-slate-800 hover:border-orange-500 hover:bg-orange-50/50"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Code {deal.code} Clipped!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-slate-500" />
                        <span>Clip Code: <strong className="font-mono text-navy-950">{deal.code}</strong></span>
                      </>
                    )}
                  </button>

                  {/* Redeem & Book Button */}
                  <Button
                    asChild
                    className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black text-xs h-10 shadow-sm"
                  >
                    <Link href={deal.bookUrl} className="flex items-center justify-center gap-1.5">
                      <span>Redeem Deal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commercial & Multi-Unit Promo Banner */}
        <section className="mt-12 rounded-3xl bg-navy-900 text-white p-8 sm:p-10 shadow-lg space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
              Commercial &amp; Property Managers
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black">
              Manage Multiple Units or Commercial Rooftops?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We offer volume pricing agreements, quarterly preventative maintenance contracts, and Net-30 terms for commercial accounts across Miami-Dade.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              asChild
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-bold text-xs h-11 px-6 shadow"
            >
              <Link href="/services/commercial-hvac">
                Commercial Programs
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-slate-700 text-white hover:bg-slate-800 text-xs font-bold h-11 px-6"
            >
              <Link href="/contact">
                Request Fleet Quote
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
