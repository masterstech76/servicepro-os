import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Users, CheckCircle2, Phone, Calendar, ArrowRight } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `About Us | ${businessConfig.businessName}`,
  description: `Learn about ${businessConfig.businessName}, our licensed technicians, state credentials, and 100% satisfaction guarantee.`,
};

export default function AboutPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#FFF7ED]/60 to-white py-16 sm:py-20 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-[#EA580C] uppercase tracking-wider bg-[#FFF7ED] px-3.5 py-1 rounded-full border border-orange-200">
            About Our Company
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            Setting the Standard in Fast, Honest HVAC Service
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Founded with a simple mission: eliminate the 4-hour waiting windows, hidden fees, and high-pressure sales that plague the home service industry.
          </p>
        </div>
      </section>

      {/* Core Values / Story Grid */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#0F172A]">State Licensed &amp; Insured</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We hold State Mechanical Contractor License #{businessConfig.licenseNumber} with comprehensive $2,000,000 general liability coverage for complete customer protection.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#0F172A]">100% Satisfaction Guarantee</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every diagnostic, repair, and parts installation is backed by our 1-year labor warranty. If the repair doesn&apos;t hold, we return and make it right at zero additional cost.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="h-12 w-12 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#0F172A]">Vetted &amp; Certified Technicians</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every field technician undergoes background checks, drug screenings, and ongoing NATE &amp; EPA Section 608 certification training.
            </p>
          </div>
        </div>

        {/* Company Overview & Dispatch Detail */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-[#0F172A] text-white flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Based in {businessConfig.city}, Dispatched Directly to Your Door
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our central dispatch office is located at {businessConfig.address}. We maintain mobile warehouse vans stationed across {businessConfig.city} stocked with 95% of OEM replacement parts.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-orange-400 font-semibold">
              <span>✓ Upfront Flat Pricing</span>
              <span>✓ Real-Time Technician Tracking</span>
              <span>✓ Digital Receipts &amp; Photos</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button asChild size="lg" className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black shadow-lg">
              <Link href="/book">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Book Service Online</span>
              </Link>
            </Button>
            <a
              href={cleanPhoneHref}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-6 font-bold text-sm text-white hover:bg-slate-700 transition-all"
            >
              <Phone className="mr-2 h-4 w-4 text-[#F97316]" />
              <span>{businessConfig.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
