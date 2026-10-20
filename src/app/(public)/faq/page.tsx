"use client";

import * as React from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Calendar,
  ShieldCheck,
  CreditCard,
  Clock,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@config/business.config";

interface FAQItem {
  id: string;
  category: "pricing" | "booking" | "warranty" | "emergency" | "safety";
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "pricing",
    question: "How does your pricing work? Are there surprise fees?",
    answer:
      "We operate on 100% upfront flat-rate pricing. When our technician arrives and diagnoses the issue, you receive a written quote itemizing parts, labor, and sales tax before any work begins. There are zero surprise fees, no hidden travel surcharges, and no ticking hourly clocks.",
  },
  {
    id: "faq-2",
    category: "pricing",
    question: "What is the diagnostic deposit, and is it applied to my repair?",
    answer:
      "Our standard diagnostic dispatch fee is $129 ($169 for Priority Emergency Dispatch). When you approve the recommended repair during the visit, 100% of your diagnostic fee is credited directly toward the final repair invoice balance.",
  },
  {
    id: "faq-3",
    category: "booking",
    question: "How quickly can a technician reach my home in Miami?",
    answer:
      "We guarantee a 60-minute emergency arrival window for urgent breakdown calls across our service territory (Brickell, Downtown, Coral Gables, Coconut Grove, Miami Beach, Kendall, Doral, and Pinecrest). For standard scheduled appointments, you select a convenient arrival window and receive real-time SMS updates with live GPS technician tracking.",
  },
  {
    id: "faq-4",
    category: "booking",
    question: "Can I reschedule or cancel my appointment online?",
    answer:
      "Yes. You can manage, reschedule, or cancel your booking through your Customer Portal account up to 2 hours before the scheduled appointment window without any penalty.",
  },
  {
    id: "faq-5",
    category: "warranty",
    question: "What warranties do you provide on repairs and replacement parts?",
    answer:
      "All repair parts and workmanship carry our 30-Day '100% Fixed Right or It's Free' guarantee and 1-year limited workmanship warranty. If the same issue returns within 30 days, we come back immediately at no additional cost. Full system replacements include a 10-year manufacturer equipment warranty and a 1-year complimentary labor warranty.",
  },
  {
    id: "faq-6",
    category: "emergency",
    question: "Do you offer 24/7 emergency service on weekends and holidays?",
    answer:
      `Yes! AC breakdowns in South Florida humidity can become dangerous fast. Our on-call dispatch fleet operates 24 hours a day, 7 days a week, 365 days a year. Call our dispatch hotline at ${businessConfig.phone} or select an emergency same-day slot in the booking wizard.`,
  },
  {
    id: "faq-7",
    category: "safety",
    question: "Are your technicians licensed, insured, and background-checked?",
    answer:
      `Every TechWork technician is fully licensed (State Mechanical License #${businessConfig.licenseNumber}), EPA Universal 608 certified, and insured up to $2,000,000 general liability. All technicians undergo strict multi-state criminal background checks and random drug screenings, and wear shoe covers and protective floor mats inside your home.`,
  },
  {
    id: "faq-8",
    category: "pricing",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards (Visa, MasterCard, American Express, Discover), Apple Pay, Google Pay, ACH bank transfers, and flexible 0% APR financing options through our partners on qualifying system installations.",
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [openIds, setOpenIds] = React.useState<Record<string, boolean>>({
    "faq-1": true,
    "faq-3": true,
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Frequently Asked Questions" }]} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-orange-50/70 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            Clear Answers
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our HVAC services, dispatch arrival, upfront flat-rate pricing, and warranties.
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions (e.g. warranty, emergency, deposit)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "All Questions" },
            { id: "pricing", label: "Pricing & Billing" },
            { id: "booking", label: "Booking & Dispatch" },
            { id: "warranty", label: "Guarantees & Warranties" },
            { id: "emergency", label: "24/7 Emergency" },
            { id: "safety", label: "Technicians & Safety" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-navy-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQs List */}
      <section className="py-8 px-4 sm:px-6 max-w-3xl mx-auto space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-bold text-navy-950">No questions found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search keywords or reach out directly to our 24/7 dispatch desk.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds[faq.id];
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                  isOpen
                    ? "border-orange-200 shadow-sm ring-1 ring-orange-200/50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-navy-950 hover:text-orange-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-orange-500 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Still Have Questions CTA */}
        <div className="mt-12 rounded-3xl bg-navy-900 p-8 text-white text-center space-y-4 shadow-xl">
          <h2 className="font-heading text-xl sm:text-2xl font-black">
            Have a Question Not Listed Here?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Our local Miami dispatch agents are standing by 24/7 to answer questions, check service availability, or schedule immediate emergency service.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold px-6 py-5 text-xs shadow-md"
            >
              <Link href="/book" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Book Online Now
              </Link>
            </Button>
            <a
              href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl border border-slate-700 transition-all"
            >
              <Phone className="h-4 w-4 text-orange-400" />
              Call {businessConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
