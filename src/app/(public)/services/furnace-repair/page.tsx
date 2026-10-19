import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock, ArrowRight, ShieldAlert } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Furnace & Heating System Repair | ${businessConfig.businessName}`,
  description: `Reliable gas furnace, heat pump, and electric air handler repair with safety inspections across ${businessConfig.city}.`,
};

export default function FurnaceRepairPage() {
  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "Furnace & Heating Repair" }]} />

      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
              Heating &amp; Safety Diagnostics
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight leading-tight">
              Furnace &amp; Heating Repair for <span className="text-orange-600">$129</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              When winter cold snaps hit, stay warm safely. We diagnose heat pumps, gas furnaces, electric heat strips, bad igniters, flame sensors, and cracked heat exchangers.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5"><ShieldAlert className="h-4 w-4 text-orange-600" /> Carbon Monoxide &amp; Gas Safety Check</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-orange-600" /> 60-Minute Arrival</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> 1-Year Labor Warranty</span>
            </div>
            <div className="pt-2">
              <Button asChild size="lg" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black h-12 px-8 shadow-md">
                <Link href="/book?serviceId=svc-furnace-repair">
                  <span>Book Furnace Repair ($129 Flat Rate)</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image
                src="/images/svc-furnace-repair.jpg"
                alt="Residential furnace heating unit"
                fill
                quality={85}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
