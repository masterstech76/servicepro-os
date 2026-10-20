"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Grid,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
  X,
  ArrowRight,
  Flame,
  Snowflake,
  Wrench,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "installations" | "repairs" | "commercial" | "ducts";
  image: string;
  likes: number;
  commentsCount: number;
  neighborhood: string;
  technician: string;
  techHandle: string;
  completionDate: string;
  equipment: string;
  workOrder: string;
  specs: string;
  efficiencyGain: string;
  beforeNotes: string;
  afterNotes: string;
  bookServiceSlug: string;
}

const GALLERY_POSTS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "5-Ton Carrier Infinity 20 SEER2 Inverter Heat Pump",
    category: "installations",
    image: "/images/svc-ac-repair.jpg",
    likes: 312,
    commentsCount: 28,
    neighborhood: "Coral Gables, FL",
    technician: "Carlos Mendez",
    techHandle: "@carlos_lead_tech",
    completionDate: "October 16, 2026",
    equipment: "Carrier Infinity 20 SEER2 Variable-Speed Condenser & Fan Coil",
    workOrder: "#WO-1004",
    specs: "Variable-speed Greenspeed inverter, R-410A factory subcooled, 54dB quiet sound blanket.",
    efficiencyGain: "42% reduction in seasonal electric cooling costs",
    beforeNotes: "20-year-old corroded 10-SEER unit constantly tripped 40A breakers during 95° midday peak temperatures.",
    afterNotes: "Sub-55dB whisper-quiet operation with ultra-precise indoor humidity stabilization at 48% RH.",
    bookServiceSlug: "/services/ac-repair",
  },
  {
    id: "gal-2",
    title: "Seasonal 21-Point Condenser Coil Restoration & Drain Clean",
    category: "repairs",
    image: "/images/svc-ac-tuneup.jpg",
    likes: 247,
    commentsCount: 19,
    neighborhood: "Downtown Miami, FL",
    technician: "Marcus Vance",
    techHandle: "@marcus_cooling_spec",
    completionDate: "October 14, 2026",
    equipment: "Trane XR14 Condenser & Aspen High-Static Air Handler",
    workOrder: "#WO-1002",
    specs: "Chemical alkaline coil wash, nitrogen drain line blow-out, biocidal pan tablet insert.",
    efficiencyGain: "Restored 18°F temperature split (ΔT) and eliminated 4A electrical draw excess.",
    beforeNotes: "Heavy salt air corrosion and organic biological buildup clogging drain trap, causing float switch cutoff.",
    afterNotes: "Completely cleared condensate drain line, polished electrical contactors, zero drainage overflow risk.",
    bookServiceSlug: "/services/ac-tuneup",
  },
  {
    id: "gal-3",
    title: "Smart Thermostat C-Wire Low Voltage Architecture",
    category: "installations",
    image: "/images/svc-thermostat-install.jpg",
    likes: 189,
    commentsCount: 14,
    neighborhood: "Coconut Grove, FL",
    technician: "Carlos Mendez",
    techHandle: "@carlos_lead_tech",
    completionDate: "October 12, 2026",
    equipment: "Google Nest Learning Thermostat 4th Gen + Fast-Stat Common Maker",
    workOrder: "#WO-1001",
    specs: "24VAC dedicated power bridge, Wi-Fi 6 mesh synchronization, geofencing sensor calibration.",
    efficiencyGain: "Automated eco-schedule projected to save $280/year in phantom cooling waste.",
    beforeNotes: "Historic wall lacked common wire; homeowner suffered continuous power cycling and battery depletion.",
    afterNotes: "Fished low-voltage harness cleanly without wall damage; paired directly with homeowner smartphone.",
    bookServiceSlug: "/services/thermostat-install",
  },
  {
    id: "gal-4",
    title: "Precision Refrigerant Leak Seal & Micron Deep Vacuum",
    category: "repairs",
    image: "/images/svc-refrigerant-recharge.jpg",
    likes: 295,
    commentsCount: 32,
    neighborhood: "Brickell, FL",
    technician: "Danny Reyes",
    techHandle: "@danny_field_refrig",
    completionDate: "October 10, 2026",
    equipment: "Lennox Signature Series 4-Ton Condensing Unit",
    workOrder: "#WO-0994",
    specs: "High-side Schrader core replacement, 450-micron decay test, digital scale R-410A charge.",
    efficiencyGain: "Restored factory 11°F subcooling and factory nominal capacity.",
    beforeNotes: "Competitor quoted full $8,000 replacement. System frozen into solid block of ice from slow valve leak.",
    afterNotes: "Isolated leak to $15 service valve core. Replaced under pressure, tested nitrogen to 350 PSI.",
    bookServiceSlug: "/services/refrigerant-recharge",
  },
  {
    id: "gal-5",
    title: "HEPA Negative-Air Whole-Home Duct Restoration",
    category: "ducts",
    image: "/images/svc-duct-cleaning.jpg",
    likes: 218,
    commentsCount: 17,
    neighborhood: "Pinecrest, FL",
    technician: "Tony Brooks",
    techHandle: "@tony_iaq_pro",
    completionDate: "October 7, 2026",
    equipment: "Nikro 5,000 CFM Negative Air Machine & Rotary Whip System",
    workOrder: "#WO-0985",
    specs: "3-stage HEPA filtration with 99.97% particulate capture, EPA hospital-grade botanical fogger.",
    efficiencyGain: "Doubled airflow velocity at perimeter supply diffusers; zero allergen circulation.",
    beforeNotes: "Post-renovation drywall dust and dark mold mildew accumulating along fiberglass duct liners.",
    afterNotes: "Every trunk mechanically brushed under negative vacuum pressure; sanitized with antimicrobial mist.",
    bookServiceSlug: "/services/duct-cleaning",
  },
  {
    id: "gal-6",
    title: "15-Ton Commercial RTU Packaged Crane Installation",
    category: "commercial",
    image: "/images/svc-commercial-hvac.jpg",
    likes: 384,
    commentsCount: 41,
    neighborhood: "Doral Industrial District, FL",
    technician: "Carlos Mendez & Crew",
    techHandle: "@techwork_crew",
    completionDate: "October 3, 2026",
    equipment: "Trane Precedent 15-Ton Packaged Commercial Gas/Electric RTU",
    workOrder: "#WO-0972",
    specs: "Custom welded curb adapter, economizer fresh-air dampers, building automation BACnet controller.",
    efficiencyGain: "Satisfies ASHRAE 90.1 energy performance guidelines with 14.8 IEER.",
    beforeNotes: "Catastrophic dual compressor failure halting food distribution refrigerated logistics facility.",
    afterNotes: "Zero downtime for client facility: crane lift completed on Sunday morning in under 6 hours.",
    bookServiceSlug: "/services/commercial-hvac",
  },
];

const STORIES = [
  { label: "20 SEER Installs", icon: Snowflake, gradient: "from-blue-500 to-indigo-600" },
  { label: "Emergency Rescues", icon: Flame, gradient: "from-orange-500 to-rose-600" },
  { label: "Duct HEPA Cleans", icon: Sparkles, gradient: "from-emerald-500 to-teal-600" },
  { label: "Commercial RTUs", icon: Wrench, gradient: "from-purple-500 to-pink-600" },
  { label: "Smart Climates", icon: Zap, gradient: "from-amber-400 to-orange-500" },
  { label: "Miami Vans", icon: ShieldCheck, gradient: "from-cyan-500 to-blue-600" },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<"all" | "installations" | "repairs" | "commercial" | "ducts">("all");
  const [activeModalItem, setActiveModalItem] = React.useState<GalleryItem | null>(null);

  const filteredPosts = React.useMemo(() => {
    if (selectedCategory === "all") return GALLERY_POSTS;
    return GALLERY_POSTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/70 text-navy-900 pb-20">
      <Breadcrumbs items={[{ label: "Project Gallery" }]} />

      {/* Instagram Profile Header */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Profile Avatar with Story Ring */}
          <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 shadow-md shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-navy-950 text-white flex flex-col items-center justify-center p-3 text-center ring-4 ring-white">
              <span className="font-heading font-black text-sm text-orange-400">TECHWORK</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">PROJECTS</span>
            </div>
          </div>

          {/* Profile Bio Details */}
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-black text-navy-950">
                  techwork_field_gallery
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black bg-sky-100 text-sky-800">
                  ✓ Verified Dispatch
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-bold text-xs h-9 px-4 shadow-sm"
                >
                  <Link href="/book">
                    Book Service
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-300 text-slate-700 text-xs font-bold h-9 px-3"
                >
                  <Link href="/contact">
                    Contact Dispatch
                  </Link>
                </Button>
              </div>
            </div>

            {/* Counts Counter */}
            <div className="flex items-center justify-center sm:justify-start gap-8 text-xs text-slate-700 font-medium">
              <div>
                <strong className="font-black text-navy-950 text-sm">1,248</strong> completed jobs
              </div>
              <div>
                <strong className="font-black text-navy-950 text-sm">4.9★</strong> Google rating
              </div>
              <div>
                <strong className="font-black text-navy-950 text-sm">99.4%</strong> first-visit fix rate
              </div>
            </div>

            {/* Bio Description */}
            <div className="text-xs text-slate-700 leading-relaxed max-w-xl space-y-1">
              <p className="font-semibold text-navy-950">
                {businessConfig.businessName} • Field Work &amp; Equipment Evidence
              </p>
              <p>
                Real photographs from residential condenser replacements, 21-point coil restorations, and commercial rooftop crane lifts across Greater Miami. State Lic #{businessConfig.licenseNumber}.
              </p>
            </div>
          </div>
        </div>

        {/* Instagram Stories Row */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-slate-100 mt-6">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 px-2 scrollbar-none">
            {STORIES.map((story, idx) => {
              const Icon = story.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                  <div className={`p-0.5 rounded-full bg-gradient-to-tr ${story.gradient} group-hover:scale-105 transition-transform`}>
                    <div className="w-14 h-14 rounded-full bg-navy-900 text-white flex items-center justify-center ring-2 ring-white">
                      <Icon className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 max-w-[70px] truncate text-center">
                    {story.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Filter Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center justify-center border-b border-slate-200">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              selectedCategory === "all"
                ? "border-navy-950 text-navy-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>ALL WORK</span>
          </button>
          <button
            onClick={() => setSelectedCategory("installations")}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              selectedCategory === "installations"
                ? "border-navy-950 text-navy-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <span>INSTALLATIONS</span>
          </button>
          <button
            onClick={() => setSelectedCategory("repairs")}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              selectedCategory === "repairs"
                ? "border-navy-950 text-navy-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <span>REPAIRS &amp; TUNE-UPS</span>
          </button>
          <button
            onClick={() => setSelectedCategory("commercial")}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              selectedCategory === "commercial"
                ? "border-navy-950 text-navy-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <span>COMMERCIAL RTU</span>
          </button>
          <button
            onClick={() => setSelectedCategory("ducts")}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              selectedCategory === "ducts"
                ? "border-navy-950 text-navy-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <span>DUCT CLEANING</span>
          </button>
        </div>
      </div>

      {/* Instagram 3-Column Square Image Grid */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActiveModalItem(post)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-sm border border-slate-200"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Instagram Hover Overlay with Likes & Comments */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white p-4 text-center">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Heart className="h-5 w-5 fill-white text-white" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <MessageCircle className="h-5 w-5 fill-white text-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
                <p className="text-xs font-bold line-clamp-2 px-2 text-slate-200">
                  {post.title}
                </p>
                <span className="text-[10px] font-mono text-orange-400 bg-navy-950/80 px-2.5 py-1 rounded-full border border-orange-400/40">
                  {post.workOrder}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Instagram Post Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-navy-950/70 text-white hover:bg-navy-950 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Column: Image with Overlay Tag */}
            <div className="lg:w-7/12 relative aspect-[4/3] lg:aspect-auto min-h-[300px] lg:min-h-[500px] bg-slate-950 flex items-center justify-center">
              <Image
                src={activeModalItem.image}
                alt={activeModalItem.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-navy-950/80 backdrop-blur-sm p-3.5 rounded-2xl text-white text-xs border border-white/20">
                <span className="text-orange-400 font-bold block text-[10px] uppercase">
                  Field Capture
                </span>
                <span className="font-bold">{activeModalItem.equipment}</span>
              </div>
            </div>

            {/* Right Column: Work Order Specs & Details */}
            <div className="lg:w-5/12 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
              <div className="space-y-4">
                {/* Tech Profile Bar */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-xs">
                    {activeModalItem.technician[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-navy-950">
                      {activeModalItem.technician}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {activeModalItem.techHandle} • {activeModalItem.neighborhood}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading text-base font-black text-navy-950">
                    {activeModalItem.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeModalItem.specs}
                  </p>
                </div>

                {/* Performance & Efficiency */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-1 text-xs">
                  <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] block">
                    Verified Customer Gain
                  </span>
                  <p className="font-bold text-navy-950">{activeModalItem.efficiencyGain}</p>
                </div>

                {/* Before / After Notes */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                      Before Diagnosis:
                    </span>
                    <p className="text-slate-700">{activeModalItem.beforeNotes}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                      After TechWork Restoration:
                    </span>
                    <p className="text-slate-700">{activeModalItem.afterNotes}</p>
                  </div>
                </div>
              </div>

              {/* Action: Book This Service */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Button
                  asChild
                  className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-bold text-xs h-10 shadow-sm"
                >
                  <Link href="/book" className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Book Service Like This</span>
                  </Link>
                </Button>
                <Link
                  href={activeModalItem.bookServiceSlug}
                  className="text-center block text-[11px] font-bold text-slate-500 hover:text-navy-950 transition-colors"
                >
                  View Service Pricing &amp; Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
