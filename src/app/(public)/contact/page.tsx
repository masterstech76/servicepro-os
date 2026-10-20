import * as React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, AlertTriangle, ArrowRight, HelpCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: `Contact Us & 24/7 Dispatch Desk | ${businessConfig.businessName}`,
  description: `Contact ${businessConfig.businessName} for emergency AC repair, dispatch assistance, and service inquiries in ${businessConfig.city}.`,
};

export default function ContactPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const faqs = [
    {
      q: "How fast can a certified technician arrive at my home?",
      a: `For active cooling emergencies in ${businessConfig.city} and surrounding areas, our mobile vans are typically dispatched to arrive within 60 minutes. Standard appointments offer 2-hour arrival windows with live SMS GPS tracking.`,
    },
    {
      q: "Is there a diagnostic trip charge?",
      a: "We charge a transparent flat-rate diagnostic fee of $129 that includes comprehensive system troubleshooting, electrical component testing, and refrigerant checks. You will receive an upfront quote before any repair work begins.",
    },
    {
      q: "What payment methods and guarantees do you offer?",
      a: "We accept all major credit cards, debit, Apple Pay, and Google Pay through secure on-site mobile terminals or our online portal. All repair work is covered by our 1-Year Parts & Labor Guarantee.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Contact & Dispatch" }]} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-12 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs font-black text-orange-700 uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            24/7 Live Central Dispatch
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
            Contact TechWork Dispatch
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Need urgent AC diagnostics, seasonal tune-up booking, or technical support? Our local dispatch supervisors are standing by 24 hours a day.
          </p>
        </div>
      </section>

      {/* Emergency Priority Alert Bar */}
      <section className="bg-amber-500/10 border-b border-amber-200/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500 text-navy-900 flex items-center justify-center font-black shrink-0 shadow-sm">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black text-navy-900">
                Experiencing a total AC shutdown or water leak?
              </div>
              <div className="text-xs text-slate-600">
                On-call emergency vans are staged across {businessConfig.city} for priority 60-minute response.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={cleanPhoneHref}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
            >
              <Phone className="h-3.5 w-3.5 text-orange-400" />
              <span>Call Dispatch: {businessConfig.phone}</span>
            </a>
            <Link
              href="/book"
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black text-xs shadow-sm transition-all whitespace-nowrap"
            >
              Book Online →
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content: Unequal 2-Column Layout */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Contact Info (4 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-navy-900 text-white space-y-6 shadow-xl border border-navy-800">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Direct Line &amp; HQ
                </span>
                <h2 className="font-heading text-2xl font-black">Central Dispatch Office</h2>
              </div>

              <div className="space-y-5 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-navy-800 text-orange-400 flex items-center justify-center shrink-0 border border-navy-700">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      24/7 Telephone Dispatch
                    </div>
                    <a
                      href={cleanPhoneHref}
                      className="text-orange-400 hover:text-orange-300 font-extrabold text-lg transition-colors"
                    >
                      {businessConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-navy-800 text-orange-400 flex items-center justify-center shrink-0 border border-navy-700">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Dispatch &amp; Support Email
                    </div>
                    <a
                      href={`mailto:${businessConfig.email}`}
                      className="text-slate-200 hover:text-white font-medium transition-colors"
                    >
                      {businessConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-navy-800 text-orange-400 flex items-center justify-center shrink-0 border border-navy-700">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Physical Service Depot
                    </div>
                    <div className="text-slate-200 font-medium">{businessConfig.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-navy-800 text-orange-400 flex items-center justify-center shrink-0 border border-navy-700">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Standard Operating Hours
                    </div>
                    <div className="text-slate-200 font-medium">Mon–Fri: 7:00 AM – 7:00 PM</div>
                    <div className="text-slate-400 text-xs">Sat: 8:00 AM – 4:00 PM • Sun: On-Call Emergency</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-navy-800 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Licensed State Contractor #{businessConfig.licenseNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Fully Bonded &amp; Insured up to $2,000,000</span>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Card */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>60-Minute Arrival Commitment</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you book online or call dispatch, your appointment is instantly assigned to the closest mobile unit. We send SMS alerts with live technician GPS tracking once en route.
              </p>
            </div>
          </div>

          {/* Right Column: Grouped Form (8 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Section 4: 3 FAQ Accordions below the form */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50/70 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-900">
              Common Dispatch &amp; Service Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Everything you need to know about our dispatch protocols, pricing policies, and service standards.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={index}
                name="contact-faq"
                className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm open:shadow-md open:border-orange-300 transition-all cursor-pointer"
              >
                <summary className="flex items-center justify-between font-bold text-navy-900 text-sm sm:text-base select-none list-none">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-orange-500 shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180 group-open:text-orange-600" />
                </summary>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              <span>View all HVAC and dispatch FAQs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
