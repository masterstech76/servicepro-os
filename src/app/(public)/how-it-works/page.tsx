import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  MessageSquare,
  Smartphone,
  Navigation,
  FileText,
  CreditCard,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `How It Works — 60-Second Booking & Live GPS Dispatch | ${businessConfig.businessName}`,
  description: `Learn how ${businessConfig.businessName}'s transparent HVAC booking, real-time technician GPS tracking, and upfront pricing work.`,
};

export default function HowItWorksPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const steps = [
    {
      num: "01",
      title: "Select Service & 60-Minute Arrival Slot",
      desc: "Choose the exact issue (AC diagnostic, seasonal tune-up, or duct cleaning) and select a guaranteed arrival window that fits your schedule. Upfront flat-rate pricing is displayed before you book.",
      badge: "60 Seconds Online",
      preview: {
        tag: "Step 1 Preview",
        headline: "AC Diagnostic & Troubleshooting",
        sub: "Guaranteed 2-Hour Arrival Window: Today, 2:00 PM - 4:00 PM",
        badgeText: "$129 Flat Rate Diagnostic",
      },
    },
    {
      num: "02",
      title: "Instant SMS Confirmation & $20 Hold",
      desc: "A $20 deposit reserves your slot and is 100% credited toward your final repair invoice. You immediately receive a confirmation text and calendar invite with your booking reference.",
      badge: "Zero Phone Tag",
      preview: {
        tag: "Automated SMS Alert",
        headline: "TechWork Dispatch: Job #1042 Confirmed",
        sub: "Your appointment is confirmed for Carlos Rodriguez (Master Tech). $20 deposit credited to final bill.",
        badgeText: "SMS & Email Sent",
      },
    },
    {
      num: "03",
      title: "Live GPS Technician En-Route Tracking",
      desc: "When your master technician departs for your property, you receive a text with their photo, vehicle ID, and live interactive GPS map showing their real-time estimated arrival.",
      badge: "Live GPS Tracking",
      preview: {
        tag: "Live Route Telemetry",
        headline: "Tech Carlos is En Route (14 min away)",
        sub: "Vehicle: 2024 Ford Transit Van #104 • NATE & EPA Universal Certified",
        badgeText: "Live GPS Active",
      },
    },
    {
      num: "04",
      title: "Fixed-Right Diagnostic & Digital Payment",
      desc: "Your technician tests your system, presents a digital itemized quote before turning a wrench, completes the repair from truck stock, and issues a digital receipt with before/after photos.",
      badge: "1-Year Warranty",
      preview: {
        tag: "Digital Work Order",
        headline: "Dual Run Capacitor Replaced",
        sub: "System balanced at 58°F supply temp. 1-Year Workmanship Warranty included.",
        badgeText: "Settled on Glass",
      },
    },
  ];

  const faqs = [
    {
      q: "Is the $20 booking deposit refundable if I cancel?",
      a: "Yes. You can cancel or reschedule through your Customer Portal up to 2 hours before your appointment window for a 100% full refund.",
    },
    {
      q: "What happens if the technician arrives later than the guaranteed window?",
      a: "We stand behind our punctuality. If our technician arrives outside your 60-minute or 2-hour window, we apply an automatic $50 credit toward your service bill.",
    },
    {
      q: "Do I have to pay before the technician inspects my system?",
      a: "Never. Only the $20 reservation hold is collected online. Any repair work is quoted on-site with flat-rate pricing, and you only pay after approving the fix and seeing cold air restored.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      <Breadcrumbs items={[{ label: "How It Works" }]} />

      {/* Stripe-Style Editorial Hero */}
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Frictionless Field Service
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight leading-tight">
            How {businessConfig.businessName} Online Booking Works
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We redesigned the HVAC contractor experience around your convenience. No waiting on hold, no 8-hour waiting windows, and no surprise prices.
          </p>
        </div>
      </section>

      {/* Connected Numbered Steps (Stripe Style) */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="space-y-12 relative">
          {/* Vertical continuous accent line for desktop */}
          <div className="hidden lg:block absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-orange-500 via-orange-300 to-slate-200 z-0" />

          {steps.map((st, idx) => (
            <div
              key={st.num}
              className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Left Column: Number + Content (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-navy-900 text-orange-500 font-heading font-black text-2xl flex items-center justify-center shrink-0 shadow-md ring-4 ring-orange-50">
                    {st.num}
                  </div>
                  <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    {st.badge}
                  </span>
                </div>

                <h2 className="font-heading text-xl sm:text-2xl font-black text-navy-950">
                  {st.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  {st.desc}
                </p>
              </div>

              {/* Right Column: Visual UI Mockup (5 cols) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-inner space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {st.preview.tag}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {st.preview.badgeText}
                    </span>
                  </div>
                  <div className="font-heading font-bold text-sm text-navy-950">
                    {st.preview.headline}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {st.preview.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-navy-900 text-white text-center space-y-6 shadow-xl border border-navy-800">
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Ready to Experience Punctual HVAC Service?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Book online in 60 seconds. Diagnostic fee is 100% credited to your final bill if you choose to repair.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-8 shadow-lg w-full sm:w-auto"
            >
              <Link href="/book">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Book Service Online</span>
              </Link>
            </Button>
            <a
              href={cleanPhoneHref}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-navy-950 hover:bg-white hover:text-navy-950 text-white font-bold text-xs sm:text-sm px-7 transition-all w-full sm:w-auto"
            >
              <Phone className="mr-2 h-4 w-4 text-orange-400" />
              <span>Call Dispatch: {businessConfig.phone}</span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-heading text-2xl font-black text-navy-950">
              Booking FAQs
            </h2>
            <p className="text-xs text-slate-500">
              Answers to common questions regarding our booking and dispatch process.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-sm space-y-2"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <h3 className="font-heading font-bold text-sm sm:text-base text-navy-950">
                    {f.q}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
