import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Phone, ArrowRight } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `24/7 Priority Emergency HVAC Dispatch | ${businessConfig.businessName}`,
  description: `Emergency AC and heating repair dispatched 24 hours a day, 7 days a week across ${businessConfig.city}. 60-minute arrival window.`,
};

export default function EmergencyHvacPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "24/7 Emergency HVAC" }]} />

      <section className="bg-gradient-to-b from-red-50/60 via-white to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-red-700 uppercase tracking-wider bg-red-100 px-3.5 py-1 rounded-full border border-red-200 flex items-center gap-1.5 w-fit">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Priority Emergency Dispatch</span>
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight leading-tight">
              24/7 Emergency HVAC Repair in <span className="text-red-600">60 Minutes</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              When your air conditioning fails during a dangerous heat wave or humidity reaches hazardous levels, our emergency technicians are on standby around the clock with fully stocked mobile units.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white font-black px-8 shadow-lg shadow-red-500/25 transition-all text-sm gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>Call Dispatch: {businessConfig.phone}</span>
              </a>
              <Button asChild size="lg" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black h-12 px-6 shadow-md">
                <Link href="/book?serviceId=svc-ac-repair">
                  <span>Book Immediate Slot Online</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image
                src="/images/hero.jpg"
                alt="Emergency HVAC van"
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
