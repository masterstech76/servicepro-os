"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wrench,
  Sparkles,
  Calendar,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Star,
  Layers,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@config/business.config";

interface GalleryProject {
  id: string;
  title: string;
  category: "installations" | "repairs" | "commercial" | "maintenance";
  categoryLabel: string;
  location: string;
  completionDate: string;
  scope: string;
  equipment: string;
  efficiencyGain: string;
  beforeNotes: string;
  afterNotes: string;
  gradient: string;
}

const PROJECTS: GalleryProject[] = [
  {
    id: "proj-1",
    title: "High-Efficiency 5-Ton Inverter Heat Pump Replacement",
    category: "installations",
    categoryLabel: "Installation",
    location: "Coral Gables, FL",
    completionDate: "October 2026",
    scope: "Removed rusted 10-SEER legacy unit; installed Carrier Infinity 20 SEER2 system with Wi-Fi smart zoning.",
    equipment: "Carrier Infinity 20 SEER2 Variable-Speed Condenser & Fan Coil",
    efficiencyGain: "42% reduction in electric cooling costs",
    beforeNotes: "20-year old corroded unit frequently tripped 40A breakers during afternoon heat peaks.",
    afterNotes: "Sub-55dB whisper quiet operation with ultra-precise humidity reduction at 48% RH.",
    gradient: "from-blue-600 to-indigo-800",
  },
  {
    id: "proj-2",
    title: "Luxury Condo Fan Coil Retrofit & Silent Actuators",
    category: "repairs",
    categoryLabel: "Condo Repair",
    location: "Brickell Ave, Miami",
    completionDate: "September 2026",
    scope: "Addressed flooded drain pan emergency, swapped failing 3-way motorized valve and replaced blower wheel.",
    equipment: "Taco Modulating Valves & ECM High-Static Blower",
    efficiencyGain: "Eliminated condensation overflow risk & resolved 68dB noise complaint",
    beforeNotes: "Water pooling in mechanical closet with severe mold mildew odor in master bedroom.",
    afterNotes: "Double-float switch safety shutoff installed and sanitized coil treated with antimicrobial fog.",
    gradient: "from-emerald-600 to-teal-800",
  },
  {
    id: "proj-3",
    title: "Commercial Rooftop Packaged System Crane Lift & Install",
    category: "commercial",
    categoryLabel: "Commercial",
    location: "Doral Industrial District",
    completionDate: "August 2026",
    scope: "15-ton rooftop unit crane lift and curb adapter installation with zero downtime for warehouse food supply.",
    equipment: "Trane 15-Ton Pre-Charged Commercial Packaged Heat Pump",
    efficiencyGain: "Met strict ASHRAE 90.1 energy guidelines",
    beforeNotes: "Catastrophic compressor burnout on outdated R-22 system halting cold storage facility.",
    afterNotes: "Fully commissioned in 6 hours with digital psychrometric air balancing validation.",
    gradient: "from-amber-600 to-orange-800",
  },
  {
    id: "proj-4",
    title: "Multi-Zone Ductless Mini-Split Architectural Setup",
    category: "installations",
    categoryLabel: "Installation",
    location: "Coconut Grove, FL",
    completionDate: "July 2026",
    scope: "Installed 4-zone concealed mini-split system preserving historic exposed wooden ceiling beams.",
    equipment: "Mitsubishi Electric Diamond Series Hyper-Heating Multi-Zone",
    efficiencyGain: "Individual room temperature control saving 35% seasonal power",
    beforeNotes: "Home lacked central ductwork, reliant on noisy window units degrading aesthetics.",
    afterNotes: "Line sets concealed inside custom copper architectural flashing painted to match trim.",
    gradient: "from-purple-600 to-indigo-900",
  },
  {
    id: "proj-5",
    title: "Comprehensive Antimicrobial Duct Restoration & UV Light",
    category: "maintenance",
    categoryLabel: "Maintenance",
    location: "Pinecrest, FL",
    completionDate: "June 2026",
    scope: "HEPA negative-air rotary brush scrubbing of all supply trunks and dual-bulb UVC germicidal lamp integration.",
    equipment: "Honeywell Whole-Home Electronic UV-C Air Disinfection",
    efficiencyGain: "99.2% airborne pathogen & spore reduction",
    beforeNotes: "High dust accumulation, recurrent allergy symptoms and restricted airflow.",
    afterNotes: "Air velocity increased by 28% CFM with allergen particle counts below 5 ug/m3.",
    gradient: "from-cyan-600 to-blue-800",
  },
  {
    id: "proj-6",
    title: "Emergency Dual-Run Capacitor & Contactor Swap",
    category: "repairs",
    categoryLabel: "Repairs",
    location: "Miami Beach, FL",
    completionDate: "May 2026",
    scope: "Dispatched within 35 minutes on Sunday holiday; replaced swollen 45/5 MFD capacitor and pitted contactor.",
    equipment: "Titan HD USA-Made Heavy-Duty Capacitor & 30A Sealed Contactor",
    efficiencyGain: "Restored cooling in 40 minutes flat",
    beforeNotes: "Outside fan hummed violently but compressor refused to turn over in 94°F heat.",
    afterNotes: "Amperage draw normalized to factory spec; full electrical safety test passed.",
    gradient: "from-rose-600 to-red-900",
  },
];

export default function GalleryPage() {
  const [filter, setFilter] = React.useState<"all" | "installations" | "repairs" | "commercial" | "maintenance">("all");

  const filteredProjects =
    filter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Project Gallery" }]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50/70 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Field Proof &amp; Craftsmanship
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
            HVAC Project &amp; Work Showcase
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real field photos, verified installations, and precision repairs executed by our certified technicians across {businessConfig.city}.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(
            [
              { id: "all", label: "All Projects" },
              { id: "installations", label: "Installations" },
              { id: "repairs", label: "Repairs" },
              { id: "commercial", label: "Commercial" },
              { id: "maintenance", label: "Maintenance & Air Quality" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filter === tab.id
                  ? "bg-navy-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Visual Header Representation */}
                <div
                  className={`h-44 bg-gradient-to-br ${project.gradient} p-5 flex flex-col justify-between text-white relative`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {project.categoryLabel}
                    </span>
                    <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                      {project.location}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-200 tracking-wider">
                      Verified Completion
                    </span>
                    <h3 className="text-lg font-bold leading-snug line-clamp-2">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Scope of Work
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {project.scope}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 space-y-2 border border-slate-100 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <span className="font-bold text-navy-950 shrink-0">System:</span>
                      <span className="text-slate-600">{project.equipment}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{project.efficiencyGain}</span>
                    </div>
                  </div>

                  {/* Before / After comparison bullets */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-rose-600 shrink-0 uppercase tracking-wide">
                        Before:
                      </span>
                      <span className="text-slate-500">{project.beforeNotes}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 shrink-0 uppercase tracking-wide">
                        After:
                      </span>
                      <span className="text-slate-700 font-medium">{project.afterNotes}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bottom */}
              <div className="p-5 pt-0">
                <Button
                  asChild
                  className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs h-10 shadow-sm"
                >
                  <Link href="/book" className="flex items-center justify-center gap-2">
                    Request Similar Installation
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 rounded-3xl bg-navy-900 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="font-heading text-2xl sm:text-3xl font-black">
              Have an HVAC Project in Mind?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              From historic residential homes to commercial warehouses, get a free in-person estimate with zero pressure and clear upfront itemized pricing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold px-6 py-6 shadow-md"
            >
              <Link href="/book" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Book On-Site Inspection
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
