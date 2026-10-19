import * as React from "react";
import Link from "next/link";
import { Calendar, Phone, CheckCircle2, ShieldCheck, Clock, ArrowRight, MessageSquare } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `How It Works | ${businessConfig.businessName}`,
  description: `Learn how TechWork's 60-second online booking and guaranteed arrival window work.`,
};

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Select Service & 60-Minute Arrival Slot",
      desc: "Pick the service you need (e.g. AC Repair diagnostic or Seasonal Tune-Up) and pick a convenient 60-minute arrival window. You'll see flat-rate upfront pricing immediately.",
      badge: "60 Seconds Online",
    },
    {
      num: "02",
      title: "Instant SMS Confirmation & Hold",
      desc: "A $20 deposit reserves your slot and is 100% credited toward your final repair invoice. You'll receive instant text and email receipts with your booking reference.",
      badge: "Zero Phone Tag",
    },
    {
      num: "03",
      title: "Real-Time Technician Tracking",
      desc: "When your technician is en route, you receive an automated SMS with their photo, vehicle details, and live GPS map tracking their arrival to your door.",
      badge: "Live GPS Tracking",
    },
    {
      num: "04",
      title: "Transparent Diagnosis & Digital Pay",
      desc: "Your technician diagnoses the issue, presents solutions with firm prices before turning a wrench, completes the repair, and sends a digital itemized receipt with photos.",
      badge: "1-Year Warranty",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <section className="bg-gradient-to-b from-[#FFF7ED]/60 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-[#EA580C] uppercase tracking-wider bg-[#FFF7ED] px-3.5 py-1 rounded-full border border-orange-200">
            Frictionless Field Service
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            How TechWork Online Booking Works
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            We redesigned the residential HVAC service experience around your schedule. No waiting on hold, no guessing games.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="space-y-8">
          {steps.map((st, idx) => (
            <div
              key={st.num}
              className="p-8 rounded-3xl border border-slate-200/90 bg-white shadow-sm flex flex-col md:flex-row items-start gap-6 hover:shadow-md transition-shadow"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#0F172A] text-[#F97316] font-heading font-black text-2xl flex items-center justify-center shrink-0">
                {st.num}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-xl font-bold text-[#0F172A]">{st.title}</h2>
                  <span className="text-[11px] font-bold text-[#EA580C] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full border border-orange-200">
                    {st.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-[#FFF7ED] border border-orange-200 text-center space-y-6">
          <h3 className="font-heading text-2xl font-bold text-[#0F172A]">Ready to Experience It Firsthand?</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Book an appointment today with an upfront flat diagnostic fee and on-time arrival guarantee.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black shadow-lg">
              <Link href="/book">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Book an Arrival Slot</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
