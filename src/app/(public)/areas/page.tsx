"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Search,
  Navigation,
  Car,
  Check,
  Filter,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NeighborhoodArea {
  name: string;
  slug: string;
  region: "core" | "south" | "west" | "beach";
  regionLabel: string;
  zips: string[];
  avgEta: string;
  status: "Active Dispatch" | "Rapid Response" | "Priority Coverage";
  techniciansOnDuty: number;
  featuredStreet: string;
}

const NEIGHBORHOODS: NeighborhoodArea[] = [
  {
    name: "Brickell",
    slug: "brickell",
    region: "core",
    regionLabel: "Miami Core",
    zips: ["33129", "33130", "33131"],
    avgEta: "25 min",
    status: "Active Dispatch",
    techniciansOnDuty: 3,
    featuredStreet: "Brickell Ave & Mary Brickell Village",
  },
  {
    name: "Downtown Miami",
    slug: "downtown-miami",
    region: "core",
    regionLabel: "Miami Core",
    zips: ["33128", "33132", "33136"],
    avgEta: "30 min",
    status: "Active Dispatch",
    techniciansOnDuty: 2,
    featuredStreet: "Biscayne Blvd & Miami Design District",
  },
  {
    name: "Coral Gables",
    slug: "coral-gables",
    region: "west",
    regionLabel: "West Dade",
    zips: ["33134", "33146"],
    avgEta: "35 min",
    status: "Rapid Response",
    techniciansOnDuty: 2,
    featuredStreet: "Miracle Mile & Ponce de Leon",
  },
  {
    name: "Coconut Grove",
    slug: "coconut-grove",
    region: "south",
    regionLabel: "South Dade",
    zips: ["33133"],
    avgEta: "30 min",
    status: "Active Dispatch",
    techniciansOnDuty: 2,
    featuredStreet: "Grand Ave & South Bayshore Dr",
  },
  {
    name: "Miami Beach",
    slug: "miami-beach",
    region: "beach",
    regionLabel: "Beachside",
    zips: ["33139", "33140"],
    avgEta: "40 min",
    status: "Priority Coverage",
    techniciansOnDuty: 2,
    featuredStreet: "Collins Ave & Lincoln Rd",
  },
  {
    name: "Kendall",
    slug: "kendall",
    region: "south",
    regionLabel: "South Dade",
    zips: ["33143", "33144"],
    avgEta: "40 min",
    status: "Active Dispatch",
    techniciansOnDuty: 3,
    featuredStreet: "Kendall Dr & Dadeland Corridor",
  },
  {
    name: "Doral",
    slug: "doral",
    region: "west",
    regionLabel: "West Dade",
    zips: ["33126", "33125"],
    avgEta: "35 min",
    status: "Active Dispatch",
    techniciansOnDuty: 2,
    featuredStreet: "NW 87th Ave & Doral City Center",
  },
  {
    name: "Pinecrest",
    slug: "pinecrest",
    region: "south",
    regionLabel: "South Dade",
    zips: ["33156"],
    avgEta: "45 min",
    status: "Rapid Response",
    techniciansOnDuty: 1,
    featuredStreet: "Red Road & Pinecrest Gardens",
  },
  {
    name: "Key Biscayne",
    slug: "key-biscayne",
    region: "beach",
    regionLabel: "Beachside",
    zips: ["33149"],
    avgEta: "45 min",
    status: "Priority Coverage",
    techniciansOnDuty: 1,
    featuredStreet: "Crandon Blvd & Harbor Dr",
  },
];

export default function ServiceAreasHubPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState<"all" | "core" | "west" | "south" | "beach">("all");

  const filteredAreas = React.useMemo(() => {
    return NEIGHBORHOODS.filter((area) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === "" ||
        area.name.toLowerCase().includes(q) ||
        area.zips.some((z) => z.includes(q)) ||
        area.featuredStreet.toLowerCase().includes(q);

      const matchesRegion =
        selectedRegion === "all" || area.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="min-h-screen bg-slate-50/60 text-navy-900 pb-20">
      <Breadcrumbs items={[{ label: "Service Areas" }]} />

      {/* Google Maps Directory Header */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5" />
                <span>60-Minute Rapid Dispatch Zone</span>
              </span>
              <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight">
                Service Areas &amp; Live Territory Map
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We keep our fully stocked HVAC repair vans strategically staged across {businessConfig.city} for immediate 60-minute emergency arrival.
              </p>
            </div>

            {/* Live Dispatch Telemetry Card (Google Maps Style) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-xs space-y-3 min-w-[240px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Live Dispatch Grid
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-600">Active Trucks Staged:</span>
                  <span className="font-mono font-bold text-navy-950">14 Vans</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-600">Average City ETA:</span>
                  <span className="font-mono font-bold text-orange-600">28 Mins</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-600">On-Time Arrival:</span>
                  <span className="font-mono font-bold text-emerald-700">99.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Search & Region Filter Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search neighborhood or 5-digit ZIP code (e.g. 33129, Brickell)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-xs rounded-xl bg-slate-50 border-slate-300"
              />
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedRegion("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedRegion === "all"
                    ? "bg-navy-950 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Regions
              </button>
              <button
                onClick={() => setSelectedRegion("core")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedRegion === "core"
                    ? "bg-navy-950 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Miami Core
              </button>
              <button
                onClick={() => setSelectedRegion("west")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedRegion === "west"
                    ? "bg-navy-950 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                West Dade / Doral
              </button>
              <button
                onClick={() => setSelectedRegion("south")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedRegion === "south"
                    ? "bg-navy-950 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                South Dade / Grove
              </button>
              <button
                onClick={() => setSelectedRegion("beach")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedRegion === "beach"
                    ? "bg-navy-950 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Beachside
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Neighborhood Cards Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => (
            <div
              key={area.slug}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <Link
                      href={`/service-areas/${area.slug}`}
                      className="font-heading text-lg font-bold text-navy-950 hover:text-orange-600 transition-colors"
                    >
                      {area.name}
                    </Link>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {area.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Corridor: <span className="text-slate-800 font-medium">{area.featuredStreet}</span>
                </p>

                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Avg Arrival Window:</span>
                    <span className="font-bold text-navy-950">{area.avgEta}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vans Staged Nearby:</span>
                    <span className="font-bold text-orange-600">{area.techniciansOnDuty} Trucks</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  ZIP Codes: {area.zips.join(", ")}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="text-xs font-bold text-slate-600 hover:text-orange-600 flex items-center gap-1"
                >
                  Area Landing Page <ArrowRight className="h-3 w-3" />
                </Link>
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-bold text-xs h-8 px-3.5 shadow-xs"
                >
                  <Link href="/book">
                    Book Slot
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Complete ZIP Code Directory Strip */}
        <section className="mt-14 p-8 rounded-3xl bg-navy-950 text-white space-y-5 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
                Comprehensive Coverage
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-black mt-1">
                All {businessConfig.zipCodes.length} Supported Greater Miami ZIP Codes
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/70 border border-emerald-800 px-3 py-1 rounded-full">
              ✓ Guaranteed On-Time Dispatch
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            If your address is in any of the postal codes below, our dispatch system guarantees 60-minute emergency arrival windows or standard scheduled slots with zero travel surcharges.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {businessConfig.zipCodes.map((zip) => (
              <span
                key={zip}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono font-bold border border-slate-800 hover:border-orange-500 transition-colors"
              >
                {zip}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              Don&apos;t see your postal code? Call our 24/7 central office for surrounding territory dispatch:
            </span>
            <a
              href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}
              className="text-orange-400 font-bold hover:underline shrink-0 text-sm"
            >
              {businessConfig.phone}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
