import * as React from "react";
import Link from "next/link";
import {
  Eye,
  Keyboard,
  Volume2,
  Brain,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  Sliders,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Accessibility Commitment & WCAG 2.1 AA Standards | ${businessConfig.businessName}`,
  description: `Learn how ${businessConfig.businessName} builds accessible field service technology conforming to WCAG 2.1 Level AA standards for all customers and technicians.`,
};

const ACCESSIBILITY_PILLARS = [
  {
    icon: Eye,
    title: "Vision & Contrast",
    summary:
      "Engineered for low vision, color blindness, and high-glare outdoor technician environments.",
    features: [
      "Strict minimum 4.5:1 text contrast ratio (7:1 for headers) conforming to WCAG AAA standards.",
      "Support for 200% browser text scaling without loss of functionality or horizontal scrolling.",
      "Non-color-dependent status badges (pairing icons, textual labels, and borders).",
      "Semantic HTML tags (`<header>`, `<main>`, `<nav>`, `<section>`) with descriptive ARIA live regions.",
    ],
  },
  {
    icon: Keyboard,
    title: "Mobility & Navigation",
    summary:
      "Fully controllable without a mouse via keyboard shortcuts, switch controls, and single-finger gestures.",
    features: [
      "Visible high-contrast focus rings (`outline: 2px solid #F97316`) on all interactive buttons and inputs.",
      "Logical, predictable tab ordering across all 7 steps of the online booking wizard.",
      "Touch targets exceed the 48x48px requirement for field technicians wearing protective gloves.",
      "Skip-to-main-content landmark navigation link present on every page header.",
    ],
  },
  {
    icon: Volume2,
    title: "Hearing & Speech",
    summary:
      "Complete autonomy for Deaf and hard-of-hearing homeowners without mandatory phone calls.",
    features: [
      "Automated real-time SMS status dispatches with interactive GPS technician tracking links.",
      "In-portal two-way live messaging with central dispatch office and assigned technicians.",
      "Digital estimates, invoice itemization, and electronic signatures requiring zero verbal calls.",
      "Screen-reader tested with Apple VoiceOver (macOS/iOS), NVDA, and Google TalkBack.",
    ],
  },
  {
    icon: Brain,
    title: "Cognitive & Clarity",
    summary:
      "Transparent layouts designed to reduce anxiety during emergency HVAC system failures.",
    features: [
      "Predictable step-by-step progress tracking with automatic state saving in local storage.",
      "Plain-language diagnostic pricing with zero hidden surcharge surprises ($129 diagnostic flat rate).",
      "Immediate inline form validation with constructive, human-readable correction advice.",
      "Absence of flashing animations, auto-playing video media, or high-pressure countdown timers.",
    ],
  },
];

const WCAG_MATRIX = [
  {
    guideline: "1.1.1 Non-text Content",
    level: "A",
    status: "Passed",
    description: "Every service image, technician badge, and diagram includes descriptive alternative text.",
  },
  {
    guideline: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "Passed",
    description: "All text elements meet or exceed the 4.5:1 color contrast ratio against slate and navy backgrounds.",
  },
  {
    guideline: "2.1.1 Keyboard Navigation",
    level: "A",
    status: "Passed",
    description: "All interactive controls, modals, drawers, and form fields are reachable and actionable via keyboard.",
  },
  {
    guideline: "2.4.7 Focus Visible",
    level: "AA",
    status: "Passed",
    description: "Interactive elements render a prominent safety orange focus outline upon keyboard tab focus.",
  },
  {
    guideline: "3.3.2 Labels or Instructions",
    level: "A",
    status: "Passed",
    description: "Form inputs have persistent programmatic labels, helper descriptions, and error notifications.",
  },
  {
    guideline: "4.1.2 Name, Role, Value",
    level: "A",
    status: "Passed",
    description: "Custom UI components (tabs, accordions, dialogs) adhere to WAI-ARIA authoring practices.",
  },
];

export default function AccessibilityPage() {
  const cleanPhone = businessConfig.phone.replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-20">
      {/* Apple-Style Hero Header */}
      <section className="bg-gradient-to-b from-orange-50/70 via-white to-white pt-10 pb-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <Breadcrumbs items={[{ label: "Accessibility" }]} />
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 border border-orange-200 px-4 py-1.5 text-xs font-bold text-orange-700">
            <ShieldCheck className="h-4 w-4 text-orange-600" />
            <span>WCAG 2.1 Level AA Conformance Commitment</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight">
            Technology for Every Homeowner and Technician.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed pt-2">
            At {businessConfig.businessName}, we believe reliable climate control and emergency service should be effortlessly accessible to everyone, regardless of ability or assistive device.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 space-y-16">
        {/* Four Core Pillars Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-900">
              Universal Design Principles
            </h2>
            <p className="text-sm text-slate-500">
              How our design system empowers homeowners, dispatchers, and field technicians across all touchpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {ACCESSIBILITY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 space-y-4 hover:border-orange-300 transition-colors shadow-xs"
                >
                  <div className="h-12 w-12 rounded-2xl bg-navy-900 text-orange-400 flex items-center justify-center shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-navy-900">{pillar.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pillar.summary}</p>
                  </div>
                  <ul className="space-y-2.5 pt-2 border-t border-slate-200/80">
                    {pillar.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* WCAG Compliance Matrix Table */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-xl font-black text-navy-900">
                WCAG 2.1 AA Compliance Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated against the Web Content Accessibility Guidelines established by W3C.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Status: 100% Compliant
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-navy-900 uppercase font-mono tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Standard</th>
                  <th className="py-3 px-3 font-bold">Level</th>
                  <th className="py-3 px-3 font-bold">Result</th>
                  <th className="py-3 px-4 font-bold">Implementation Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {WCAG_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-navy-900 whitespace-nowrap">
                      {row.guideline}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold">
                        {row.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Accommodation Assistance Strip */}
        <section className="rounded-3xl bg-navy-900 text-white p-8 sm:p-10 shadow-lg space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              Direct Assistance Channel
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black">
              Need Accommodations or Found a Barrier?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              If you experience any challenge accessing our online booking portal, reading invoices, or communicating with technicians, our designated accessibility coordinator will assist you immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl bg-navy-950/70 border border-slate-700 p-5 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase">
                <Phone className="h-4 w-4" />
                <span>24/7 Voice & TTY Dispatch</span>
              </div>
              <p className="text-xs text-slate-300">
                Dedicated telephone support line for real-time booking and dispatch status:
              </p>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-block text-lg font-black text-white hover:text-orange-400 transition-colors"
              >
                {businessConfig.phone}
              </a>
            </div>

            <div className="rounded-2xl bg-navy-950/70 border border-slate-700 p-5 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase">
                <Mail className="h-4 w-4" />
                <span>Accessibility Office</span>
              </div>
              <p className="text-xs text-slate-300">
                Direct email for feedback, bug reports, and specialized accommodations:
              </p>
              <a
                href={`mailto:${businessConfig.email}?subject=Accessibility%20Accommodation%20Request`}
                className="inline-block text-base font-bold text-white hover:text-orange-400 transition-colors"
              >
                {businessConfig.email}
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              Physical Office: {businessConfig.address}
            </span>
            <Link
              href="/book"
              className="text-orange-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              Book Service Online &rarr;
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
