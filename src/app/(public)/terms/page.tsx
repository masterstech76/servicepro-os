import * as React from "react";
import Link from "next/link";
import { FileText, ShieldCheck, CheckCircle2 } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata = {
  title: `Terms of Service | ${businessConfig.businessName}`,
  description: `Terms and conditions for HVAC services, diagnostics, warranties, and payments provided by ${businessConfig.businessName}.`,
};

export default function TermsPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <section className="bg-gradient-to-b from-[#FFF7ED]/70 via-white to-white py-12 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-4">
          <Breadcrumbs items={[{ label: "Terms of Service" }]} />
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Effective Date: October 19, 2026 • State Mechanical License #{businessConfig.licenseNumber}
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 text-slate-700 leading-relaxed text-sm">
        <div className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-[#0F172A]">1. Service Appointments &amp; Arrival Windows</h2>
          <p>
            {businessConfig.businessName} provides upfront arrival windows. We make every reasonable effort to arrive within the designated window. In case of emergency dispatch delays or inclement weather, we promptly notify customers via SMS or phone.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-[#0F172A]">2. Estimates &amp; Upfront Pricing</h2>
          <p>
            No repair work proceeds without customer authorization. Diagnostic fees are 100% credited toward completed repairs. Prior to starting repair work, our technician provides a digital estimate detailing parts and labor costs.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-[#0F172A]">3. One-Year Workmanship Warranty</h2>
          <p>
            All residential replacement parts and labor performed by our licensed technicians are backed by our 1-year limited workmanship guarantee. Warranty excludes damage resulting from power surges, floods, or unauthorized third-party tampering.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-[#0F172A]">4. Payment Terms</h2>
          <p>
            Payment in full is due upon job completion and digital sign-off. We accept major credit cards, debit cards, and authorized bank payments processed securely via Stripe.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-5 bg-slate-50 text-xs text-slate-500">
          For questions regarding these terms, contact <a href={cleanPhoneHref} className="text-orange-600 font-bold hover:underline">{businessConfig.phone}</a> or email <a href={`mailto:${businessConfig.email}`} className="text-orange-600 font-bold hover:underline">{businessConfig.email}</a>.
        </div>
      </section>
    </div>
  );
}
