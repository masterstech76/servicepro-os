import * as React from "react";
import Link from "next/link";
import { Star, ShieldCheck, ThumbsUp, Calendar, ArrowRight } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Verified Customer Reviews | ${businessConfig.businessName}`,
  description: `Read verified 5-star HVAC repair and maintenance reviews from real homeowners across ${businessConfig.city}.`,
};

export default function ReviewsPage() {
  const reviewsList = [
    {
      author: "David M.",
      location: "Brickell, Miami",
      service: "AC Repair & Diagnostic",
      date: "October 14, 2026",
      rating: 5,
      content:
        "AC stopped blowing cold on a 92° day. Booked online at 11 AM, technician arrived by 11:45 AM. Replaced the blown dual run capacitor and had cold air blowing within 40 minutes. Truly upfront pricing.",
    },
    {
      author: "Elena & Carlos S.",
      location: "Downtown Miami",
      service: "Seasonal AC Tune-Up",
      date: "October 8, 2026",
      rating: 5,
      content:
        "Booked the $89 seasonal tune-up. The technician put on shoe covers, cleaned our drain line, rinsed the outdoor condenser, and showed before/after photos of the coils. Best contractor experience we've had in Florida.",
    },
    {
      author: "Marcus K.",
      location: "Coral Gables",
      service: "Smart Thermostat Install",
      date: "September 29, 2026",
      rating: 5,
      content:
        "Tech installed our Google Nest Learning Thermostat and wired the C-wire. He walked us through the app on our phones before leaving. Transparent deposit credited straight to the invoice.",
    },
    {
      author: "Sophia R.",
      location: "Coconut Grove",
      service: "Refrigerant Recharge",
      date: "September 21, 2026",
      rating: 5,
      content:
        "Unit was hissing and freezing over. Tech diagnosed a micro-leak on the service valve, tightened the schrader core, and balanced the subcooling. Honest work, didn't try to upsell a whole new unit.",
    },
    {
      author: "Anthony T.",
      location: "Miami Beach",
      service: "Air Duct Cleaning",
      date: "September 15, 2026",
      rating: 5,
      content:
        "Noticeable reduction in dust after our whole-home duct sanitization. Crew was respectful, organized, and finished in under 3 hours. Will use every year.",
    },
    {
      author: "Rachel B.",
      location: "Kendall",
      service: "Emergency AC Repair",
      date: "August 30, 2026",
      rating: 5,
      content:
        "Called the dispatch desk on a Sunday afternoon. Tech arrived inside the 60-minute window with the exact fan motor in his van. Ice cold air was restored before dinner.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <Breadcrumbs items={[{ label: "Reviews & Ratings" }]} />

      <section className="bg-gradient-to-b from-[#FFF7ED]/60 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7ED] border border-orange-200 px-3.5 py-1 text-xs font-bold text-[#EA580C]">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 OUT OF 5.0 RATING (1,200+ REVIEWS)</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            Verified Customer Reviews
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real feedback from homeowners and property managers who booked online with TechWork.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#0F172A]">{rev.author}</div>
                  <div className="text-slate-500">{rev.location}</div>
                </div>
                <span className="font-semibold text-[#EA580C] bg-[#FFF7ED] px-2.5 py-1 rounded-full border border-orange-200">
                  {rev.service}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-[#0F172A] text-white text-center space-y-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold">Experience the TechWork Difference</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Book online in 60 seconds. Transparent pricing, live technician tracking, and 100% satisfaction guarantee.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black shadow-lg">
              <Link href="/book">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Book Service Online</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
