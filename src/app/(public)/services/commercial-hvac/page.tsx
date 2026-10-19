import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, ShieldCheck, Clock, CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Commercial HVAC & Rooftop Package Units | ${businessConfig.businessName}`,
  description: `Commercial HVAC maintenance, package unit repair, and facility cooling agreements for offices, restaurants, and retail spaces in ${businessConfig.city}.`,
};

export default function CommercialHvacPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "Commercial HVAC" }]} />

      <section className="bg-gradient-to-b from-[#FFF7ED]/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-[#EA580C] uppercase tracking-wider bg-[#FFF7ED] px-3.5 py-1 rounded-full border border-orange-200">
              Commercial &amp; Facility Solutions
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              Commercial HVAC Repair &amp; Maintenance
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Minimize business downtime. We service rooftop packaged units, split systems, server room precision cooling, and commercial ventilation for restaurants, retail, and corporate facilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black px-8 shadow-md text-sm gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>Call Commercial Desk: {businessConfig.phone}</span>
              </a>
              <Button asChild size="lg" className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A] font-bold h-12 px-6 shadow-sm">
                <Link href="/contact">
                  <span>Request Custom Commercial Proposal</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image src="/images/service-bg.jpg" alt="Commercial rooftop HVAC system" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
