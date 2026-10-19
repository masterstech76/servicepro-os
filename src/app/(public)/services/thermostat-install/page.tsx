import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, ArrowRight, Smartphone } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Smart Thermostat Installation (Nest, Ecobee, Honeywell) | ${businessConfig.businessName}`,
  description: `Professional smart thermostat installation, C-wire testing, Wi-Fi pairing, and multi-zone setup in ${businessConfig.city}.`,
};

export default function ThermostatInstallPage() {
  const supportedBrands = [
    { name: "Google Nest", models: "Learning Thermostat 3rd & 4th Gen, Nest Thermostat E" },
    { name: "Ecobee", models: "Smart Thermostat Premium, Enhanced, and Lite" },
    { name: "Honeywell Home", models: "T9, T10 Pro, and Home Color Touchscreen" },
    { name: "Amazon Smart", models: "Amazon Smart Thermostat with Alexa voice" },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "Thermostat Installation" }]} />

      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
              Smart Controls &amp; Automation
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight leading-tight">
              Smart Thermostat Installation for <span className="text-orange-600">$149</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Upgrade your home comfort and save up to 15% on heating and cooling costs. We handle complex 24V wiring, common wire (C-wire) power adapters, wall-plate mounting, and mobile app configuration.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-orange-600" /> C-Wire Power Verified</span>
              <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4 text-orange-600" /> Smartphone Setup Included</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Compatible with All Brands</span>
            </div>
            <div className="pt-2">
              <Button asChild size="lg" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black h-12 px-8 shadow-md">
                <Link href="/book?serviceId=svc-thermostat-install">
                  <span>Book Thermostat Install ($149 Flat Rate)</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image
                src="/images/svc-thermostat-install.jpg"
                alt="Modern smart thermostat display"
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

      {/* Supported Models */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 className="font-heading text-2xl font-bold text-navy-900 mb-8">Supported Thermostat Ecosystems</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportedBrands.map((b) => (
            <div key={b.name} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
              <div className="font-heading font-extrabold text-base text-navy-900">{b.name}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{b.models}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
