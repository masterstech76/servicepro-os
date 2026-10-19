import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Gauge, CheckCircle2, Clock, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Refrigerant Leak Detection & Recharge (Freon / R-410A) | ${businessConfig.businessName}`,
  description: `EPA Section 608 certified electronic leak detection, nitrogen pressure testing, and refrigerant recharge in ${businessConfig.city}.`,
};

export default function RefrigerantRechargePage() {
  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "Refrigerant Recharge" }]} />

      <section className="bg-gradient-to-b from-[#FFF7ED]/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-[#EA580C] uppercase tracking-wider bg-[#FFF7ED] px-3.5 py-1 rounded-full border border-orange-200">
              EPA Universal Certified
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              Refrigerant Leak Detection &amp; Precision Recharge
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              If your AC is freezing up or hissing, simply topping off refrigerant won&apos;t fix the root problem. Our EPA-certified technicians use ultrasonic and electronic sniffers to find leaks, repair fittings, and balance pressures ($125/hr + refrigerant).
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#EA580C]" /> EPA 608 Universal Certified</span>
              <span className="flex items-center gap-1.5"><Gauge className="h-4 w-4 text-[#EA580C]" /> Subcooling &amp; Superheat Calibrated</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> R-410A &amp; R-22 Stocked</span>
            </div>
            <div className="pt-2">
              <Button asChild size="lg" className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black h-12 px-8 shadow-md">
                <Link href="/book?serviceId=svc-refrigerant-recharge">
                  <span>Schedule Leak Test &amp; Recharge</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image src="/images/svc-refrigerant-recharge.jpg" alt="Manifold gauges connected to AC" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
