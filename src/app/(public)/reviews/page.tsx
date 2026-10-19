import * as React from "react";
import Link from "next/link";
import { Star, ShieldCheck, Heart, MessageCircle, Sparkles, PlusCircle } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { InstagramReviewsFeed } from "@/components/reviews/InstagramReviewsFeed";

export const metadata = {
  title: `Verified Customer Reviews | ${businessConfig.businessName}`,
  description: `Live community review feed and real-time photo check-ins from homeowners across ${businessConfig.city}.`,
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 text-navy-900">
      <Breadcrumbs items={[{ label: "Verified Reviews & Feed" }]} />

      {/* Top Instagram-Style Profile / Brand Bar */}
      <section className="bg-white border-b border-slate-200/80 pt-8 pb-6 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Gradient Ring */}
          <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 shadow-md">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-navy-900 text-white flex flex-col items-center justify-center p-2 text-center ring-4 ring-white">
              <span className="font-heading font-black text-xs text-orange-400">TECHWORK</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">HVAC PROS</span>
            </div>
          </div>

          {/* Profile Bio Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <h1 className="font-heading text-xl sm:text-2xl font-black text-navy-950">
                    techwork_miami
                  </h1>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-sky-100 text-sky-700">
                    ✓ Verified Dispatch
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {businessConfig.businessName} • Real-time Customer Reviews &amp; Check-ins
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Link href="/book">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-navy-950 font-bold text-xs h-9 px-4 rounded-xl shadow-sm">
                    Book Service
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 text-xs font-bold h-9 px-3 rounded-xl">
                    Message
                  </Button>
                </Link>
              </div>
            </div>

            {/* Social Statistics Counter */}
            <div className="flex items-center justify-center sm:justify-start gap-6 text-xs text-slate-600 font-medium pt-1">
              <div>
                <span className="font-bold text-navy-950">1,248</span> posts
              </div>
              <div>
                <span className="font-bold text-navy-950">4.9★</span> rating
              </div>
              <div>
                <span className="font-bold text-navy-950">99.4%</span> fixed right
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs text-slate-700 leading-relaxed max-w-lg">
              Licensed &amp; insured 24/7 HVAC field service across {businessConfig.city}. Upfront pricing, 60-min emergency windows, and 1-year workmanship warranty. 📍 Miami, FL.
            </p>
          </div>
        </div>
      </section>

      {/* Main Feed Container */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <InstagramReviewsFeed />
      </main>
    </div>
  );
}
