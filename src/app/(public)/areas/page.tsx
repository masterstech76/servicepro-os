import * as React from "react";
import Link from "next/link";
import { MapPin, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Service Areas & 60-Minute Coverage Directory | ${businessConfig.businessName}`,
  description: `View all covered neighborhoods and postal zip codes in ${businessConfig.city} serviced by ${businessConfig.businessName}.`,
};

export default function ServiceAreasHubPage() {
  const neighborhoods = [
    { name: "Brickell", slug: "brickell", zip: "33129, 33130, 33131", avgEta: "25 min", status: "Active Dispatch" },
    { name: "Downtown Miami", slug: "downtown-miami", zip: "33128, 33132, 33136", avgEta: "30 min", status: "Active Dispatch" },
    { name: "Coral Gables", slug: "coral-gables", zip: "33134, 33146", avgEta: "35 min", status: "Active Dispatch" },
    { name: "Coconut Grove", slug: "coconut-grove", zip: "33133", avgEta: "30 min", status: "Active Dispatch" },
    { name: "Miami Beach", slug: "miami-beach", zip: "33139, 33140", avgEta: "40 min", status: "Active Dispatch" },
    { name: "Kendall", slug: "kendall", zip: "33143, 33144", avgEta: "40 min", status: "Active Dispatch" },
    { name: "Doral", slug: "doral", zip: "33126, 33125", avgEta: "35 min", status: "Active Dispatch" },
    { name: "Pinecrest", slug: "pinecrest", zip: "33146, 33143", avgEta: "45 min", status: "Active Dispatch" },
    { name: "Key Biscayne", slug: "key-biscayne", zip: "33149", avgEta: "45 min", status: "Active Dispatch" },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Service Areas" }]} />

      <section className="bg-gradient-to-b from-orange-50/60 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
            Greater Miami Territory
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
            HVAC Service Areas &amp; Coverage
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our fully stocked vans are positioned throughout {businessConfig.city} for rapid 60-minute emergency arrival.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((area) => (
            <div
              key={area.name}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <Link
                      href={`/service-areas/${area.slug}`}
                      className="font-heading text-lg font-bold text-navy-900 hover:text-orange-600 transition-colors"
                    >
                      {area.name}
                    </Link>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {area.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">ZIP Codes: {area.zip}</p>
                <div className="text-xs font-semibold text-slate-700 pt-1">
                  Average Arrival Window: <span className="font-black text-navy-900">{area.avgEta}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="text-xs font-semibold text-slate-600 hover:text-orange-600 flex items-center gap-1"
                >
                  Area Details <ArrowRight className="h-3 w-3" />
                </Link>
                <Button asChild size="sm" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs h-8 px-3">
                  <Link href="/book">
                    Book Slot
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Complete ZIP Code Directory Strip */}
        <div className="mt-16 p-8 rounded-3xl bg-navy-900 text-white space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-heading text-xl font-bold">All {businessConfig.zipCodes.length} Supported Postal ZIP Codes</h3>
            <span className="text-xs text-orange-400 font-semibold">100% On-Time Guarantee</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {businessConfig.zipCodes.map((zip) => (
              <span key={zip} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono font-semibold border border-slate-700">
                {zip}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
