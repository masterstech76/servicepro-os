import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Wrench,
  ThumbsUp,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface ReviewSpotlight {
  id: string;
  author: string;
  username: string;
  location: string;
  service: string;
  serviceSlug: string;
  technicianName: string;
  technicianHandle: string;
  rating: number;
  date: string;
  jobId: string;
  image: string;
  likes: number;
  headline: string;
  fullReview: string;
  problemSummary: string;
  resolutionSummary: string;
  techComment: string;
}

const REVIEWS_STORE: Record<string, ReviewSpotlight> = {
  "rev-1": {
    id: "rev-1",
    author: "David M.",
    username: "david_m_brickell",
    location: "Brickell, Miami, FL",
    service: "AC Repair & Diagnostic",
    serviceSlug: "/services/ac-repair",
    technicianName: "Carlos Mendez",
    technicianHandle: "carlos_mendez_lead",
    rating: 5,
    date: "October 14, 2026",
    jobId: "#WO-1004",
    image: "/images/svc-ac-repair.jpg",
    likes: 148,
    headline: "Fast Sunday dispatch and saved us from unbearable 92° heat",
    fullReview:
      "AC completely ceased blowing cold air on a scorching 92° Sunday afternoon. I booked through the portal at 11:00 AM, and Carlos arrived in his fully stocked van by 11:35 AM. He immediately identified the blown dual run capacitor, tested compressor winding impedance, and had cool 56° air circulating within 40 minutes. Zero surprise fees, exact upfront quote before touch.",
    problemSummary: "Compressor hummed without starting, indoor blower blowing warm humid air.",
    resolutionSummary:
      "Installed heavy-duty Titan HD 45/5 MFD dual run capacitor, cleaned condenser coil fins, calibrated thermostat.",
    techComment:
      "Glad we got that capacitor swapped before the afternoon peak heat David! Enjoy that crisp 56° air! 🔧❄️",
  },
  "rev-2": {
    id: "rev-2",
    author: "Elena & Carlos S.",
    username: "elena_and_carlos",
    location: "Downtown Miami, FL",
    service: "Seasonal AC Tune-Up",
    serviceSlug: "/services/ac-tuneup",
    technicianName: "Marcus Vance",
    technicianHandle: "marcus_cooling_spec",
    rating: 5,
    date: "October 8, 2026",
    jobId: "#WO-1002",
    image: "/images/svc-ac-tuneup.jpg",
    likes: 219,
    headline: "Unmatched professionalism & detailed photo inspection report",
    fullReview:
      "We take preventive maintenance seriously in Florida. Marcus arrived right on time wearing protective shoe covers. He performed a 21-point inspection, flushed our condensate drain with biocidal cleaner, rinsed coils, and emailed us high-res before/after photos with amp draw readings. Best HVAC experience we've had in 10 years living in South Florida.",
    problemSummary: "Preventative seasonal maintenance check before high-humidity summer peaks.",
    resolutionSummary:
      "Comprehensive 21-point check, drain line nitrogen purge, electrical contact polishing, air filter renewal.",
    techComment:
      "Those coils were definitely due for that deep rinse! Happy to keep your energy bills low Elena!",
  },
  "rev-3": {
    id: "rev-3",
    author: "Marcus K.",
    username: "marcus_k_gables",
    location: "Coral Gables, FL",
    service: "Smart Thermostat Installation",
    serviceSlug: "/services/thermostat-install",
    technicianName: "Carlos Mendez",
    technicianHandle: "carlos_mendez_lead",
    rating: 5,
    date: "September 29, 2026",
    jobId: "#WO-1001",
    image: "/images/svc-thermostat-install.jpg",
    likes: 94,
    headline: "Seamless Google Nest C-Wire installation in older home",
    fullReview:
      "Our 1950s Coral Gables house did not have a dedicated 24V common wire (C-wire) for modern smart thermostats. Carlos fished the new low-voltage wire cleanly, installed our Nest Learning Thermostat, and paired it with our phones before leaving. Transparent pricing with deposit applied directly to final bill.",
    problemSummary: "Intermittent power cycling and battery drainage on DIY smart thermostat install.",
    resolutionSummary:
      "Installed 24V fast-stat transformer bridge and dedicated C-wire terminal at the air handler.",
    techComment:
      "That historic wall cavity was tight, but that 24V bridge worked like a charm! Enjoy remote climate control!",
  },
  "rev-4": {
    id: "rev-4",
    author: "Sophia R.",
    username: "sophia_grove",
    location: "Coconut Grove, FL",
    service: "Refrigerant Leak Repair",
    serviceSlug: "/services/refrigerant-recharge",
    technicianName: "Marcus Vance",
    technicianHandle: "marcus_cooling_spec",
    rating: 5,
    date: "September 21, 2026",
    jobId: "#WO-0994",
    image: "/images/svc-refrigerant-recharge.jpg",
    likes: 182,
    headline: "Honest diagnosis when other contractors quoted a full replacement",
    fullReview:
      "Another company insisted our entire 6-year-old system was finished and needed an $8,000 replacement. TechWork came out for a second opinion, found a microscopic Schrader core leak at the low-side service valve, replaced the valve core, pulled a 450-micron deep vacuum, and restored optimal R-410A charge. Honest contractors are rare — TechWork is the real deal.",
    problemSummary: "Evaporator coil frosting over with sub-normal low-side suction pressure.",
    resolutionSummary:
      "Schrader service valve replacement, nitrogen pressure test to 350 PSI, precision subcooling recharge.",
    techComment:
      "Always test before you replace! So glad we saved you thousands of dollars Sophia!",
  },
  "rev-5": {
    id: "rev-5",
    author: "Anthony Vargas",
    username: "anthony_vargas_doral",
    location: "Doral, FL",
    service: "Emergency AC Repair",
    serviceSlug: "/services/emergency-hvac",
    technicianName: "Carlos Mendez",
    technicianHandle: "carlos_mendez_lead",
    rating: 5,
    date: "September 15, 2026",
    jobId: "#WO-0988",
    image: "/images/svc-ac-repair.jpg",
    likes: 126,
    headline: "Late night emergency repair during severe heat wave",
    fullReview:
      "Our central AC stopped blowing cold at 9:30 PM on a Tuesday with a 3-month-old infant in the home. TechWork dispatch had Carlos at our door within 45 minutes. He diagnosed a locked rotor on the condenser fan, installed a temporary motor to get cold air circulating, and returned the next morning with the exact OEM replacement. Lifesavers.",
    problemSummary: "Condenser fan motor thermal overload trip resulting in complete system shutdown.",
    resolutionSummary:
      "Installed universal rescue motor, restored airflow, flushed primary drain line, and verified 18-degree delta split.",
    techComment:
      "Safety first when infants are in the home Anthony! Happy we got the cold air restored before midnight! ❄️",
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
  const review = REVIEWS_STORE[id];

  if (!review) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-navy-900 pb-16">
      <Breadcrumbs
        items={[
          { label: "Community Reviews", href: "/reviews" },
          { label: `Post by ${review.username}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-4">
        {/* Navigation Back Link */}
        <Link
          href="/reviews"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-950 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Reviews Feed</span>
        </Link>

        {/* Instagram Post Detail Card (Two-Column Desktop) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Visual Media (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 relative aspect-[4/3] lg:aspect-auto flex items-center justify-center min-h-[380px] lg:min-h-[560px]">
            <Image
              src={review.image}
              alt={`${review.service} completed in ${review.location}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-navy-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Verified Work Order {review.jobId}
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-500 text-navy-950 text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                <Star className="h-3.5 w-3.5 fill-navy-950" />
                5.0 Stars
              </span>
            </div>

            {/* Bottom Photo Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                Field Evidence Capture
              </p>
              <h2 className="text-lg font-bold drop-shadow-md">{review.service}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-orange-400" />
                {review.location}
              </p>
            </div>
          </div>

          {/* Right Column: Post Social Thread & Details (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 bg-white">
            {/* Thread Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black flex items-center justify-center text-sm shadow-sm ring-2 ring-orange-500/20">
                  {review.author[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-navy-950">{review.username}</span>
                    <CheckCircle2 className="h-4 w-4 fill-sky-500 text-white" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {review.author} • {review.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Thread Content */}
            <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto text-xs leading-relaxed">
              {/* Customer Caption */}
              <div className="space-y-2">
                <p className="font-bold text-sm text-navy-950 leading-snug">
                  &ldquo;{review.headline}&rdquo;
                </p>
                <p className="text-slate-700">{review.fullReview}</p>
              </div>

              {/* Technician Verified Response (Comment Style) */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">
                    T
                  </div>
                  <div>
                    <span className="font-bold text-navy-950 text-xs">
                      {review.technicianName}
                    </span>
                    <span className="text-[10px] text-orange-600 font-bold ml-1.5">
                      ✓ Dispatched Tech
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 pl-8 text-xs">{review.techComment}</p>
              </div>

              {/* Verified Problem & Resolution Accordion */}
              <div className="rounded-2xl border border-slate-200/80 p-3.5 bg-white space-y-2">
                <div className="text-[11px]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block">
                    Reported Issue:
                  </span>
                  <span className="text-slate-800 font-medium">{review.problemSummary}</span>
                </div>
                <div className="text-[11px] pt-1 border-t border-slate-100">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block">
                    Technician Resolution:
                  </span>
                  <span className="text-slate-800 font-medium">{review.resolutionSummary}</span>
                </div>
              </div>
            </div>

            {/* Post Engagement Bar & Quick Booking CTA */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-4">
                  <button type="button" className="text-rose-500 flex items-center gap-1.5">
                    <Heart className="h-5 w-5 fill-rose-500" />
                    <span className="text-xs font-bold text-navy-950">{review.likes}</span>
                  </button>
                  <MessageCircle className="h-5 w-5 text-slate-600" />
                  <Send className="h-5 w-5 text-slate-600" />
                </div>
                <Bookmark className="h-5 w-5 text-slate-600" />
              </div>

              <div className="pt-2">
                <Link href="/book" className="block">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-navy-950 font-bold text-xs h-10 rounded-xl shadow-sm flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Book {review.service}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
