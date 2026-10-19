import * as React from "react";
import Link from "next/link";
import { Tag, Sparkles, Calendar, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `HVAC Coupons & Seasonal Specials | ${businessConfig.businessName}`,
  description: `Save with exclusive coupons and rebates on AC repair, seasonal tune-ups, and thermostat installations across ${businessConfig.city}.`,
};

export default function SpecialsPage() {
  const specials = [
    {
      code: "FIRST25",
      title: "$25 Off First AC Repair",
      desc: "Save $25 on any diagnostics and repair service for new customers. Valid when booking online.",
      expiry: "Ongoing promotion",
      targetService: "AC Repair & Diagnostic",
      bookHref: "/book?serviceId=svc-ac-repair",
    },
    {
      code: "TUNE89",
      title: "$89 Seasonal 21-Point Tune-Up",
      desc: "Comprehensive multi-point system inspection, coil rinse, drain line clear, and electrical safety check (regular $129).",
      expiry: "Limited summer slots",
      targetService: "AC Tune-Up & Maintenance",
      bookHref: "/book?serviceId=svc-ac-tuneup",
    },
    {
      code: "NEST30",
      title: "$30 Off Smart Thermostat Install",
      desc: "Professional wiring, mounting, and Wi-Fi configuration for Nest, Ecobee, or Honeywell smart thermostats.",
      expiry: "With coupon code",
      targetService: "Thermostat Installation",
      bookHref: "/book?serviceId=svc-thermostat-install",
    },
    {
      code: "CLEANAIR50",
      title: "$50 Off Whole-Home Duct Cleaning",
      desc: "High-powered vacuum extraction, trunk line sanitization, and register inspection for cleaner, allergen-free air.",
      expiry: "Whole home package",
      targetService: "Air Duct Cleaning",
      bookHref: "/book?serviceId=svc-duct-cleaning",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <Breadcrumbs items={[{ label: "Specials & Coupons" }]} />

      <section className="bg-gradient-to-b from-[#FFF7ED]/60 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7ED] border border-orange-200 px-3.5 py-1 text-xs font-bold text-[#EA580C]">
            <Tag className="h-3.5 w-3.5" />
            <span>SEASONAL REBATES &amp; SAVINGS</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            HVAC Coupons &amp; Special Offers
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Take advantage of upfront promotional pricing on AC maintenance, diagnostic calls, and smart upgrades.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specials.map((sp) => (
            <div
              key={sp.code}
              className="p-8 rounded-3xl border-2 border-dashed border-orange-300 bg-[#FFF7ED]/30 hover:bg-[#FFF7ED]/60 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black tracking-widest text-[#EA580C] bg-white border border-orange-200 px-3 py-1 rounded-lg">
                    COUPON: {sp.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{sp.expiry}</span>
                </div>
                <h2 className="font-heading text-2xl font-black text-[#0F172A]">{sp.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{sp.desc}</p>
                <div className="text-xs font-semibold text-slate-500 pt-1">
                  Valid for: <span className="text-[#0F172A] font-bold">{sp.targetService}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-orange-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">Auto-applies when booked online</span>
                <Button asChild size="sm" className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black h-10 px-5 shadow-md">
                  <Link href={sp.bookHref}>
                    <span>Claim Offer</span>
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
