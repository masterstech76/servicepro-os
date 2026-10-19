import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, ArrowRight, Wind } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Air Duct Cleaning & Sanitization | ${businessConfig.businessName}`,
  description: `Breathe cleaner air with whole-home negative-pressure duct cleaning, allergen removal, and botanical fogging in ${businessConfig.city}.`,
};

export default function DuctCleaningServicePage() {
  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "Air Duct Cleaning" }]} />

      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
              Indoor Air Quality &amp; Health
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight leading-tight">
              Whole-Home Air Duct Cleaning for <span className="text-orange-600">$249</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Remove years of trapped dust, pet dander, mold spores, and allergens from your supply and return ductwork. We use commercial negative-pressure HEPA vacuums and rotary brushes to restore fresh, breathable air.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5"><Wind className="h-4 w-4 text-orange-600" /> High-Powered HEPA Extraction</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-orange-600" /> EPA-Registered Sanitizer</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> All Supply &amp; Return Vents</span>
            </div>
            <div className="pt-2">
              <Button asChild size="lg" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black h-12 px-8 shadow-md">
                <Link href="/book?serviceId=svc-duct-cleaning">
                  <span>Book Duct Cleaning ($249 Flat Rate)</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image
                src="/images/svc-duct-cleaning.jpg"
                alt="Air duct cleaning in progress"
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
