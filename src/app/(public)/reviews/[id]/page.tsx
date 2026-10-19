import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  User,
  Wrench,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface ReviewSpotlight {
  id: string;
  author: string;
  location: string;
  service: string;
  serviceSlug: string;
  technicianName: string;
  rating: number;
  date: string;
  jobId: string;
  headline: string;
  fullReview: string;
  problemSummary: string;
  resolutionSummary: string;
}

const REVIEWS_STORE: Record<string, ReviewSpotlight> = {
  "rev-1": {
    id: "rev-1",
    author: "David M.",
    location: "Brickell, Miami, FL",
    service: "AC Repair & Diagnostic",
    serviceSlug: "ac-repair",
    technicianName: "Carlos Rodriguez (Master HVAC Tech)",
    rating: 5,
    date: "October 14, 2026",
    jobId: "#WO-1004",
    headline: "Fast Sunday dispatch and saved us from unbearable 92° heat",
    fullReview:
      "AC completely ceased blowing cold air on a scorching 92° Sunday afternoon. I booked through the portal at 11:00 AM, and Carlos arrived in his fully stocked van by 11:35 AM. He immediately identified the blown dual run capacitor, tested compressor winding impedance, and had cool 56° air circulating within 40 minutes. Zero surprise fees, exact upfront quote before touch.",
    problemSummary: "Compressor hummed without starting, indoor blower blowing warm humid air.",
    resolutionSummary:
      "Installed heavy-duty Titan HD 45/5 MFD dual run capacitor, cleaned condenser coil fins, calibrated thermostat.",
  },
  "rev-2": {
    id: "rev-2",
    author: "Elena & Carlos S.",
    location: "Downtown Miami, FL",
    service: "Seasonal AC Tune-Up",
    serviceSlug: "maintenance",
    technicianName: "Marcus Vance (Senior HVAC Tech)",
    rating: 5,
    date: "October 8, 2026",
    jobId: "#WO-1002",
    headline: "Unmatched professionalism & detailed photo inspection report",
    fullReview:
      "We take preventive maintenance seriously in Florida. Marcus arrived right on time wearing protective shoe covers. He performed a 21-point inspection, flushed our condensate drain with biocidal cleaner, rinsed coils, and emailed us high-res before/after photos with amp draw readings. Best HVAC experience we've had in 10 years living in South Florida.",
    problemSummary: "Preventative seasonal maintenance check before high-humidity summer peaks.",
    resolutionSummary:
      "Comprehensive 21-point check, drain line nitrogen purge, electrical contact polishing, air filter renewal.",
  },
  "rev-3": {
    id: "rev-3",
    author: "Marcus K.",
    location: "Coral Gables, FL",
    service: "Smart Thermostat Installation",
    serviceSlug: "smart-thermostats",
    technicianName: "Carlos Rodriguez (Master HVAC Tech)",
    rating: 5,
    date: "September 29, 2026",
    jobId: "#WO-1001",
    headline: "Seamless Google Nest C-Wire installation in older home",
    fullReview:
      "Our 1950s Coral Gables house did not have a dedicated 24V common wire (C-wire) for modern smart thermostats. Carlos fished the new low-voltage wire cleanly, installed our Nest Learning Thermostat, and paired it with our phones before leaving. Transparent pricing with deposit applied directly to final bill.",
    problemSummary: "Intermittent power cycling and battery drainage on DIY smart thermostat install.",
    resolutionSummary:
      "Installed 24V fast-stat transformer bridge and dedicated C-wire terminal at the air handler.",
  },
  "rev-4": {
    id: "rev-4",
    author: "Sophia R.",
    location: "Coconut Grove, FL",
    service: "Refrigerant Leak Repair",
    serviceSlug: "ac-repair",
    technicianName: "Marcus Vance (Senior HVAC Tech)",
    rating: 5,
    date: "September 21, 2026",
    jobId: "#WO-0994",
    headline: "Honest diagnosis when other contractors quoted a full replacement",
    fullReview:
      "Another company insisted our entire 6-year-old system was finished and needed an $8,000 replacement. TechWork came out for a second opinion, found a microscopic Schrader core leak at the low-side service valve, replaced the valve core, pulled a 450-micron deep vacuum, and restored optimal R-410A charge. Honest contractors are rare — TechWork is the real deal.",
    problemSummary: "Evaporator coil frosting over with sub-normal low-side suction pressure.",
    resolutionSummary:
      "Schrader service valve replacement, nitrogen pressure test to 350 PSI, precision subcooling recharge.",
  },
};

export async function generateStaticParams() {
  return Object.keys(REVIEWS_STORE).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = REVIEWS_STORE[id];
  if (!review) {
    return { title: `Review Spotlight | ${businessConfig.businessName}` };
  }
  return {
    title: `${review.rating}★ Review from ${review.author} in ${review.location} | ${businessConfig.businessName}`,
    description: `"${review.headline}" - Verified customer review for ${review.service} performed by ${businessConfig.businessName}.`,
  };
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = REVIEWS_STORE[id] || {
    id,
    author: "Verified Homeowner",
    location: `${businessConfig.city}, FL`,
    service: "AC Repair & Diagnostic",
    serviceSlug: "ac-repair",
    technicianName: "Certified Master Technician",
    rating: 5,
    date: "Recent Service",
    jobId: `#WO-${id.replace(/\D/g, "") || "9081"}`,
    headline: "Outstanding prompt response and complete professional service",
    fullReview:
      "Exceptional customer experience from booking on the mobile app to completed work. The technician was respectful, well-equipped, and walked us through the exact repair before starting. Highly recommended for anyone in South Florida.",
    problemSummary: "Cooling system failed to maintain set temperature during peak daytime heat.",
    resolutionSummary: "Full electrical and refrigerant diagnostics completed with 100% fixed-right guarantee.",
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <Breadcrumbs
        items={[
          { label: "Reviews", href: "/reviews" },
          { label: `Review by ${review.author}` },
        ]}
      />

      <section className="bg-gradient-to-b from-[#FFF7ED]/70 to-white py-12 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-3xl mx-auto space-y-4">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Reviews
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Verified Verified Customer
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Work Order {review.jobId}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-black text-navy-950 tracking-tight leading-tight">
            &ldquo;{review.headline}&rdquo;
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex text-amber-400">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-700">
              {review.rating}.0 / 5.0 Star Rating
            </span>
            <span className="text-xs text-slate-400">• {review.date}</span>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-8">
        {/* Review Quote Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed italic">
            &ldquo;{review.fullReview}&rdquo;
          </blockquote>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 text-[#EA580C] font-black flex items-center justify-center text-sm border border-orange-200">
                {review.author[0]}
              </div>
              <div>
                <p className="font-bold text-sm text-navy-950">{review.author}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {review.location}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Service Performed
              </span>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 inline-block mt-0.5">
                {review.service}
              </span>
            </div>
          </div>
        </div>

        {/* Job Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
          <h2 className="font-heading text-base font-bold text-navy-950 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-orange-500" />
            Verified Job Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Dispatched Specialist
              </span>
              <p className="font-bold text-navy-950">{review.technicianName}</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Service Guarantee
              </span>
              <p className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                100% Fixed-Right 30-Day Guarantee
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="text-xs">
              <span className="font-bold text-navy-950">Reported Problem: </span>
              <span className="text-slate-600">{review.problemSummary}</span>
            </div>
            <div className="text-xs">
              <span className="font-bold text-navy-950">Verified Resolution: </span>
              <span className="text-slate-600">{review.resolutionSummary}</span>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="rounded-3xl bg-[#0F172A] p-8 text-white text-center space-y-4 shadow-xl">
          <h3 className="font-heading text-xl sm:text-2xl font-black">
            Need {review.service} for Your Home?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Get the same 5-star certified service. Upfront pricing, 60-minute emergency arrival window, and live tracking.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              asChild
              className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-bold px-6 py-5 text-xs shadow-md"
            >
              <Link href="/book" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Book This Service Online
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
