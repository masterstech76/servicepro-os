import * as React from "react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ServicesCatalogClient } from "@/components/services/ServicesCatalogClient";

export const metadata = {
  title: `HVAC Services & Transparent Pricing | ${businessConfig.businessName}`,
  description: `Explore our full catalog of residential and commercial HVAC services with upfront flat-rate pricing and same-day arrival across ${businessConfig.city}.`,
};

export default function ServicesCatalogPage() {
  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Services & Pricing" }]} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200">
            Upfront Flat-Rate Pricing
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
            HVAC Services &amp; Transparent Rates
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every repair, tune-up, and installation comes with guaranteed pricing, certified technicians, and our 100% satisfaction commitment.
          </p>
        </div>
      </section>

      {/* Interactive Catalog Sections */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <ServicesCatalogClient
          businessPhone={businessConfig.phone}
          city={businessConfig.city}
        />
      </section>
    </div>
  );
}
