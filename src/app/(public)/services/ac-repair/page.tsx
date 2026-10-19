import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Snowflake, CheckCircle2, Clock, ShieldCheck, ArrowRight, Phone, HelpCircle } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `AC Repair & Diagnostic Service | ${businessConfig.businessName}`,
  description: `Same-day AC repair and diagnostics with upfront flat pricing, 60-minute arrival window, and 1-year labor warranty in ${businessConfig.city}.`,
};

export default function AcRepairServicePage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const commonIssues = [
    "AC blowing warm or room-temperature air",
    "Outdoor condenser fan not spinning or humming loudly",
    "Water leaking around indoor air handler or condensate pan overflow",
    "Frozen evaporator coils or ice on copper refrigerant lines",
    "AC constantly short-cycling on and off every few minutes",
    "Circuit breaker tripping whenever the AC starts up",
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "AC Repair & Diagnostic" }]} />

      <section className="bg-gradient-to-b from-[#FFF7ED]/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-[#EA580C] uppercase tracking-wider bg-[#FFF7ED] px-3.5 py-1 rounded-full border border-orange-200">
              Cooling &amp; Emergency Dispatch
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              Fast AC Repair Within <span className="text-[#EA580C]">60 Minutes</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              When the South Florida heat strikes, you can&apos;t wait days for cool air. Our certified HVAC technicians arrive in fully stocked mobile warehouses to diagnose and fix your AC on the first visit.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#EA580C]" /> 1-Year Labor Warranty</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#EA580C]" /> 60-Minute Arrival</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Upfront Flat Diagnostic</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild size="lg" className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black h-12 px-6 shadow-md">
                <Link href="/book?serviceId=svc-ac-repair">
                  <span>Book AC Repair ($129 Flat Rate)</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 font-bold text-sm text-[#0F172A] hover:bg-slate-50 transition-all shadow-sm"
              >
                <Phone className="mr-2 h-4 w-4 text-[#EA580C]" />
                <span>Call {businessConfig.phone}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image src="/images/svc-ac-repair.jpg" alt="AC condenser repair" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Common Problems Solved */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            Common AC Problems We Fix On-Site
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Our vans carry universal capacitors, contactors, fan motors, hard-start kits, and circuit boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonIssues.map((issue, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">{issue}</span>
            </div>
          ))}
        </div>

        {/* Pricing & Guarantee Box */}
        <div className="mt-14 p-8 rounded-3xl bg-[#0F172A] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-orange-400 font-black">Upfront Diagnostic Rate</div>
            <div className="font-heading text-3xl font-black text-white mt-1">$129 Complete Diagnostic</div>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Full electrical inspection, refrigerant check, airflow balance, and digital estimate. The $20 booking deposit is credited straight to your invoice.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black h-12 px-8 shadow-lg shrink-0">
            <Link href="/book?serviceId=svc-ac-repair">
              Schedule Repair Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}
