import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Calendar,
  Wrench,
  ThermometerSnowflake,
  ArrowRight,
  Star,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface AreaData {
  slug: string;
  name: string;
  city: string;
  state: string;
  zipCodes: string[];
  etaMinutes: number;
  description: string;
  landmarks: string[];
  popularServices: string[];
  highlight: string;
}

const SERVICE_AREAS: Record<string, AreaData> = {
  brickell: {
    slug: "brickell",
    name: "Brickell",
    city: "Miami",
    state: "FL",
    zipCodes: ["33129", "33130", "33131"],
    etaMinutes: 25,
    description:
      "High-rise condominium and commercial HVAC specialists providing whisper-quiet heat pumps, PTAC units, and chilled water fan coil maintenance across Brickell Avenue and Financial District.",
    landmarks: ["Brickell City Centre", "Brickell Key", "Mary Brickell Village", "South Miami Ave"],
    popularServices: [
      "Condo AC Diagnostic & Coil Cleaning",
      "High-Rise Chilled Water Unit Repair",
      "Smart Thermostat Integration",
      "Emergency Leak & Drain Pan Clearing",
    ],
    highlight: "Dedicated high-rise certified technicians equipped for tight condo utility closets.",
  },
  "downtown-miami": {
    slug: "downtown-miami",
    name: "Downtown Miami",
    city: "Miami",
    state: "FL",
    zipCodes: ["33128", "33132", "33136"],
    etaMinutes: 30,
    description:
      "24/7 rapid HVAC dispatch for Downtown Miami lofts, office towers, retail storefronts, and residences along Biscayne Boulevard.",
    landmarks: ["Bayside Marketplace", "Bayfront Park", "FTX Arena District", "Government Center"],
    popularServices: [
      "Commercial Rooftop Unit Maintenance",
      "Emergency Blower Motor Replacement",
      "Ductwork Sanitization & Air Quality",
      "Refrigerant Leak Detection",
    ],
    highlight: "Rapid 30-minute arrival guaranteed with dedicated downtown parking clearance.",
  },
  "coral-gables": {
    slug: "coral-gables",
    name: "Coral Gables",
    city: "Miami",
    state: "FL",
    zipCodes: ["33134", "33146"],
    etaMinutes: 35,
    description:
      "Historic Mediterranean home HVAC retrofit experts, dual-zone inverter heat pumps, and aesthetic low-profile exterior condenser installations in The City Beautiful.",
    landmarks: ["Miracle Mile", "Biltmore Hotel", "Venetian Pool", "University of Miami"],
    popularServices: [
      "Historic Home Ductless Mini-Split Installation",
      "Full System Energy-Efficiency Replacement",
      "Whole-Home Dehumidifier Integration",
      "Annual Preventative Maintenance Club",
    ],
    highlight: "Strict architectural code compliance and respectful historic home care.",
  },
  "coconut-grove": {
    slug: "coconut-grove",
    name: "Coconut Grove",
    city: "Miami",
    state: "FL",
    zipCodes: ["33133"],
    etaMinutes: 30,
    description:
      "Coastal humidity control, salt-air corrosion resistant condenser upgrades, and high-efficiency central air tune-ups in Coconut Grove.",
    landmarks: ["CocoWalk", "The Barnacle", "Dinner Key Marina", "Main Highway"],
    popularServices: [
      "Marine/Coastal Corrosion Protection",
      "High-SEER2 Heat Pump Replacement",
      "UV Germicidal Air Purifiers",
      "Emergency Capacitor & Contactor Repair",
    ],
    highlight: "Salt-resistant coastal coating and humidity regulation experts.",
  },
  "miami-beach": {
    slug: "miami-beach",
    name: "Miami Beach",
    city: "Miami Beach",
    state: "FL",
    zipCodes: ["33139", "33140"],
    etaMinutes: 40,
    description:
      "Art Deco district and oceanfront condominium climate control specialists. Fast barrier island dispatch for residential homes and hospitality venues.",
    landmarks: ["Ocean Drive", "Lincoln Road", "South of Fifth", "Mid Beach"],
    popularServices: [
      "Salt Air Condenser Coil Rinse & Protection",
      "Condo Fan Coil Valve Actuator Replacement",
      "Rapid Refrigerant Recharge",
      "Quiet Inverter Compressor Upgrades",
    ],
    highlight: "Causeway-ready dispatched vans stocked with multi-brand replacement parts.",
  },
  kendall: {
    slug: "kendall",
    name: "Kendall",
    city: "Miami",
    state: "FL",
    zipCodes: ["33143", "33144"],
    etaMinutes: 40,
    description:
      "Suburban residential split-system replacements, air duct sealing, attic insulation checks, and same-day AC repair for Kendall families.",
    landmarks: ["Dadeland Mall", "Baptist Hospital Area", "The Falls", "Kendall Town Center"],
    popularServices: [
      "Same-Day AC Breakdown Repair",
      "Full System Replacement with 10-Yr Warranty",
      "Air Duct Deep Cleaning & Sanitizing",
      "Wi-Fi Smart Thermostat Setup",
    ],
    highlight: "Family-friendly flat-rate pricing with zero overtime weekend surcharges.",
  },
  doral: {
    slug: "doral",
    name: "Doral",
    city: "Doral",
    state: "FL",
    zipCodes: ["33126", "33125"],
    etaMinutes: 35,
    description:
      "Commercial warehouse climate regulation, corporate headquarters rooftop HVAC maintenance, and modern townhome system tune-ups in Doral.",
    landmarks: ["CityPlace Doral", "Downtown Doral", "Doral Central Park", "Trump National"],
    popularServices: [
      "Light Commercial Packaged Units",
      "Smart Multi-Zone Thermostat Controls",
      "Capacitor, Fan Motor & Coil Servicing",
      "Commercial Preventative Maintenance Contracts",
    ],
    highlight: "Commercial and residential dispatch teams on standby 24 hours a day.",
  },
  pinecrest: {
    slug: "pinecrest",
    name: "Pinecrest",
    city: "Pinecrest",
    state: "FL",
    zipCodes: ["33156"],
    etaMinutes: 45,
    description:
      "Luxury estate multi-stage inverter cooling, wine room refrigeration, and ultra-high efficiency variable-speed HVAC systems in Pinecrest.",
    landmarks: ["Pinecrest Gardens", "Evelyn Greer Park", "SW 104th St Corridor"],
    popularServices: [
      "Variable-Capacity Inverter HVAC Systems",
      "Wine Cellar Climate Maintenance",
      "HEPA & Electronic Air Cleaners",
      "VIP Priority Membership Inspections",
    ],
    highlight: "White-glove service standard for high-tonnage multi-system estates.",
  },
  "key-biscayne": {
    slug: "key-biscayne",
    name: "Key Biscayne",
    city: "Key Biscayne",
    state: "FL",
    zipCodes: ["33149"],
    etaMinutes: 45,
    description:
      "Island-ready emergency air conditioning repairs, coastal anti-corrosion coil protection, and luxury apartment heat pump replacements.",
    landmarks: ["Crandon Park", "Bill Baggs Cape Florida", "Crandon Boulevard"],
    popularServices: [
      "Island Emergency Breakdown Response",
      "Severe Salt Fog Anti-Corrosion Defense",
      "Water-Source Heat Pump Servicing",
      "Seasonal Turn-On Inspection",
    ],
    highlight: "Dedicated island dispatch team carrying all standard marine-grade components.",
  },
};

export async function generateStaticParams() {
  return Object.keys(SERVICE_AREAS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = SERVICE_AREAS[slug];
  if (!area) {
    return { title: `Service Area Not Found | ${businessConfig.businessName}` };
  }
  return {
    title: `${area.name}, ${area.state} HVAC Repair & Emergency AC Service | ${businessConfig.businessName}`,
    description: `Fast ${area.etaMinutes}-minute HVAC response in ${area.name}, ${area.state}. Serving ZIP codes ${area.zipCodes.join(", ")}. Licensed, insured, 100% satisfaction guaranteed.`,
  };
}

export default async function ServiceAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = SERVICE_AREAS[slug];

  if (!area) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs
        items={[
          { label: "Service Areas", href: "/areas" },
          { label: area.name },
        ]}
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {area.city}, {area.state}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {area.etaMinutes}-Min Average Dispatch
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
            HVAC &amp; Air Conditioning Services in {area.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {area.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Button
              asChild
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold px-6 py-6 shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/book" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book {area.name} Technician
              </Link>
            </Button>
            <a
              href={`tel:${businessConfig.phone}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-orange-600 px-4 py-3 rounded-xl border border-slate-300 hover:border-orange-300 transition-all"
            >
              <Phone className="h-4 w-4 text-orange-500" />
              Call {businessConfig.phone} (24/7)
            </a>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-12">
        {/* Coverage Highlights Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50 space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
              <Clock className="h-5 w-5" />
              Dispatch Window
            </div>
            <p className="text-2xl font-black text-navy-950">
              ~{area.etaMinutes} Minutes
            </p>
            <p className="text-xs text-slate-500">
              Stationed vans near {area.name} ready for immediate emergency roll-out.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50 space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
              <ShieldCheck className="h-5 w-5" />
              Warranty &amp; Guarantee
            </div>
            <p className="text-2xl font-black text-navy-950">100% Fixed Right</p>
            <p className="text-xs text-slate-500">
              If your cooling issue recurs within 30 days, we return free of charge.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50 space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
              <Star className="h-5 w-5" />
              Local Rating
            </div>
            <p className="text-2xl font-black text-navy-950">4.9 / 5.0 Stars</p>
            <p className="text-xs text-slate-500">
              Over 450+ verified homeowner &amp; property manager reviews in {area.name}.
            </p>
          </div>
        </div>

        {/* Local Services & Landmarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-navy-950 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-500" />
              Popular Services in {area.name}
            </h2>
            <ul className="space-y-3">
              {area.popularServices.map((svc) => (
                <li key={svc} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{svc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-navy-950 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              Key Neighborhoods &amp; Landmarks
            </h2>
            <div className="flex flex-wrap gap-2">
              {area.landmarks.map((landmark) => (
                <span
                  key={landmark}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200"
                >
                  {landmark}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Covered Postal ZIP Codes
              </p>
              <div className="flex flex-wrap gap-2">
                {area.zipCodes.map((zip) => (
                  <span
                    key={zip}
                    className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-800 text-xs font-mono font-bold border border-orange-200"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer Card */}
        <div className="rounded-3xl bg-navy-900 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="font-heading text-2xl font-black">
              Need Fast AC Service in {area.name}?
            </h3>
            <p className="text-sm text-slate-300">
              Book online in 60 seconds with upfront pricing and live technician GPS tracking.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold px-6 py-6 shadow-md"
            >
              <Link href="/book" className="flex items-center gap-2">
                Schedule Service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
