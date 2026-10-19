import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Wrench, CheckCircle2, Clock, ShieldCheck, ArrowRight, Phone } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `AC Tune-Up & 21-Point Maintenance Special | ${businessConfig.businessName}`,
  description: `Keep your AC running at peak efficiency with our $89 21-point seasonal maintenance special across ${businessConfig.city}.`,
};

export default function AcTuneupServicePage() {
  const checklist = [
    "Clean & rinse outdoor condenser coil fins",
    "Flush condensate drain line & clear algae/sludge",
    "Inspect & test dual run capacitor microfarads",
    "Test compressor amperage & starting capacitor",
    "Measure subcooling & superheat refrigerant pressures",
    "Check & tighten all high-voltage electrical connections",
    "Test blower motor capacitor & inspect blower wheel",
    "Inspect indoor air filter and static pressure balance",
    "Verify thermostat calibration & temperature delta (18°-22°F)",
    "Lubricate all moving parts and inspect motor bearings",
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "AC Tune-Up & Maintenance" }]} />

      <section className="bg-gradient-to-b from-[#FFF7ED]/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-[#EA580C] uppercase tracking-wider bg-[#FFF7ED] px-3.5 py-1 rounded-full border border-orange-200">
              Seasonal Preventative Maintenance
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              21-Point AC Tune-Up for Just <span className="text-[#EA580C]">$89</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Prevent unexpected breakdowns, lower electric bills by up to 20%, and extend your system&apos;s lifespan. Our 60-minute thorough inspection restores your air conditioner to peak manufacturer performance.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#EA580C]" /> Breakdown-Free Guarantee</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#EA580C]" /> 60-Min Comprehensive Service</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Digital Inspection Report</span>
            </div>
            <div className="pt-2">
              <Button asChild size="lg" className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black h-12 px-8 shadow-md">
                <Link href="/book?serviceId=svc-ac-tuneup">
                  <span>Book $89 Tune-Up Online</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image src="/images/svc-ac-tuneup.jpg" alt="Technicians performing AC tune up" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 21-Point Checklist Overview */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            What Our 21-Point Inspection Covers
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Every tune-up includes full photos, electrical readings, and a digital health score of your HVAC system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {checklist.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0 text-xs font-bold">
                {idx + 1}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
