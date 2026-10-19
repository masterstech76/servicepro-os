import * as React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  DollarSign,
  Clock,
  Phone,
  Mail,
  Scale,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Terms of Service & Warranty Agreement | ${businessConfig.businessName}`,
  description: `Official terms of service, diagnostic deposit policy, 1-year workmanship warranty, and cancellation rules for ${businessConfig.businessName}.`,
};

const SECTIONS = [
  { id: "scope", title: "1. Scope of Service & Authorization" },
  { id: "diagnostics", title: "2. Diagnostic Fees & Estimates" },
  { id: "warranty", title: "3. 1-Year Workmanship Warranty" },
  { id: "cancellations", title: "4. Cancellation & Rescheduling" },
  { id: "payments", title: "5. Invoicing, Deposits & Payments" },
  { id: "emergency", title: "6. 24/7 Emergency Dispatch SLA" },
  { id: "access", title: "7. Property Access & Worksite Safety" },
  { id: "liability", title: "8. Limitation of Liability" },
  { id: "licensing", title: "9. State Licensing & Compliance" },
  { id: "contact", title: "10. Inquiries & Official Notices" },
];

export default function TermsPage() {
  const cleanPhone = businessConfig.phone.replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-20">
      {/* Stripe-Style Header */}
      <section className="bg-gradient-to-b from-orange-50/70 via-white to-white pt-10 pb-12 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-4">
          <Breadcrumbs items={[{ label: "Terms of Service" }]} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest">
                Legal Terms &amp; Conditions
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 tracking-tight mt-1">
                Terms of Service
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Last updated: October 19, 2026 • State Mechanical License #{businessConfig.licenseNumber}
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-300 text-slate-700 text-xs font-bold self-start sm:self-auto"
            >
              <Link href="/contact">
                Have a Legal Question?
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Two-Column Layout (Sticky TOC on Left, Clauses on Right) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sticky Left Navigation (Stripe Legal Style) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 shadow-xs">
              <h3 className="font-heading text-xs font-black uppercase tracking-wider text-navy-900">
                Table of Contents
              </h3>
              <nav className="space-y-1.5 text-xs">
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50/80 transition-colors font-medium"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-200 space-y-2 text-[11px] text-slate-500">
                <p>
                  Need immediate help with a job or bill?
                </p>
                <a
                  href={`tel:${cleanPhone}`}
                  className="font-bold text-orange-600 hover:underline block"
                >
                  Call {businessConfig.phone}
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Structured Legal Clauses */}
          <main className="lg:col-span-8 space-y-12 text-slate-700 leading-relaxed text-sm">
            {/* Section 1 */}
            <section id="scope" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>1. Scope of Service &amp; Customer Authorization</span>
              </h2>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern all heating, ventilation, and air conditioning services provided by {businessConfig.businessName} (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) to the homeowner, tenant, or authorized property representative (&ldquo;Customer&rdquo;, &ldquo;you&rdquo;).
              </p>
              <p>
                By scheduling an appointment online via our booking wizard, confirming by phone, or approving an on-site technician estimate, you agree to be bound by these Terms. No repair or parts replacement will begin without prior written or digital electronic authorization from the Customer.
              </p>
            </section>

            {/* Section 2 */}
            <section id="diagnostics" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>2. Upfront Diagnostic Protocol &amp; Transparent Estimates</span>
              </h2>
              <p>
                To accurately identify HVAC malfunctions, an EPA-certified technician performs a rigorous physical and electrical diagnostic on your equipment. Our standard residential diagnostic fee is $129 (or $169 for Priority After-Hours Emergency Dispatch).
              </p>
              <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4 space-y-1.5 text-xs text-slate-700">
                <span className="font-bold text-orange-700 uppercase tracking-wider block">
                  100% Diagnostic Fee Credit
                </span>
                <p>
                  When you approve recommended repairs during the diagnostic visit, the entire diagnostic fee is credited directly toward your repair balance. You never pay twice for our time.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="warranty" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>3. 1-Year Workmanship Warranty &amp; Fixed Right Guarantee</span>
              </h2>
              <p>
                We take immense pride in craft. All replacement parts and labor installed by our licensed technicians are backed by our:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                <li>
                  <strong className="text-navy-900">30-Day &ldquo;Fixed Right or It&rsquo;s Free&rdquo; Performance Guarantee:</strong> If the exact diagnosed issue recurs within 30 days of repair, we return and re-evaluate at zero dispatch cost.
                </li>
                <li>
                  <strong className="text-navy-900">1-Year Limited Workmanship Warranty:</strong> Any newly installed capacitor, contactor, blower motor, fan blade, or electrical component is warrantied against defect for 365 days from invoice completion.
                </li>
              </ul>
              <p className="text-xs text-slate-500">
                Warranty exclusions include unapproved modifications, third-party tampering, flood damage, severe electrical utility power surges, or failure caused by dirty filters.
              </p>
            </section>

            {/* Section 4 */}
            <section id="cancellations" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>4. Cancellation, Rescheduling &amp; Deposit Policy</span>
              </h2>
              <p>
                We respect your schedule and keep our field technicians strategically positioned. When booking, a nominal $20 authorization hold is placed on your payment card to reserve the dispatch window.
              </p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-navy-900">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span>Cancellation Timeline Rules</span>
                </div>
                <p>
                  <strong>More than 2 hours before window:</strong> Free cancellation or rescheduling at zero penalty with immediate hold release.
                </p>
                <p>
                  <strong>Within 2 hours of arrival:</strong> If a technician is already en route with van parts staged, the $20 deposit is retained to cover fuel and travel expenses.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="payments" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>5. Invoicing, Deposits &amp; Payment Terms</span>
              </h2>
              <p>
                Payment in full is due immediately upon work order completion and customer digital sign-off. We accept Visa, MasterCard, American Express, Discover, Apple Pay, Google Pay, and bank ACH transfers powered securely by Stripe.
              </p>
              <p>
                For commercial or residential equipment replacement projects exceeding $2,500, a 50% deposit is required before ordering specialized OEM machinery, with the remaining balance due upon commissioning.
              </p>
            </section>

            {/* Section 6 */}
            <section id="emergency" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>6. 24/7 Emergency Dispatch Service Level Agreement (SLA)</span>
              </h2>
              <p>
                Our 60-minute emergency arrival window is available 24 hours a day, 365 days a year across designated {businessConfig.city} ZIP codes. Emergency appointments receive highest dispatch priority on our dispatch board.
              </p>
              <p className="text-xs text-slate-500">
                While we maintain a 98.4% on-time arrival rate, extreme weather events, severe hurricane watches, or major highway closures may prompt dispatch agents to reach out with adjusted ETAs.
              </p>
            </section>

            {/* Section 7 */}
            <section id="access" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>7. Property Access &amp; Worksite Safety</span>
              </h2>
              <p>
                The Customer agrees to provide safe and unhindered access to the HVAC equipment, including indoor mechanical closets, attics, breaker electrical panels, and exterior condenser pads. Pets must be secured during technician presence.
              </p>
            </section>

            {/* Section 8 */}
            <section id="liability" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>8. Limitation of Liability</span>
              </h2>
              <p>
                To the maximum extent permitted by applicable law, {businessConfig.businessName} shall not be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or personal inconvenience resulting from temporary HVAC outages.
              </p>
            </section>

            {/* Section 9 */}
            <section id="licensing" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>9. State Licensing &amp; Regulatory Compliance</span>
              </h2>
              <p>
                All work is executed in full compliance with the Florida Building Code and EPA Section 608 Clean Air Act guidelines. {businessConfig.businessName} is fully licensed and insured:
              </p>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 text-xs font-mono">
                <p>State Mechanical License: #{businessConfig.licenseNumber}</p>
                <p>Commercial General Liability: $2,000,000 Aggregate Coverage</p>
                <p>Workers' Compensation: Active State Compliance</p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="contact" className="space-y-3 scroll-mt-28">
              <h2 className="font-heading text-xl font-black text-navy-900 flex items-center gap-2">
                <span>10. Official Inquiries &amp; Notices</span>
              </h2>
              <p>
                If you have questions regarding these Terms or wish to submit an official inquiry, please contact our administrative office:
              </p>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-2 text-xs">
                <p className="font-bold text-navy-900">{businessConfig.businessName}</p>
                <p>
                  {businessConfig.address}
                </p>
                <p>
                  Telephone: <a href={`tel:${cleanPhone}`} className="text-orange-600 font-bold hover:underline">{businessConfig.phone}</a>
                </p>
                <p>
                  Email: <a href={`mailto:${businessConfig.email}`} className="text-orange-600 font-bold hover:underline">{businessConfig.email}</a>
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
