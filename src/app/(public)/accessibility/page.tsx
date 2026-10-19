import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata = {
  title: `Accessibility Statement | ${businessConfig.businessName}`,
  description: `Accessibility commitment and digital standard compliance for ${businessConfig.businessName}.`,
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white text-navy-900">
      <section className="bg-gradient-to-b from-orange-50/70 via-white to-white py-12 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-4">
          <Breadcrumbs items={[{ label: "Accessibility" }]} />
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 tracking-tight">
            Accessibility Statement
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Committed to digital inclusion and WCAG 2.1 AA standards.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 text-slate-700 leading-relaxed text-sm">
        <p>
          {businessConfig.businessName} is committed to ensuring digital accessibility for all people, including individuals with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
        </p>

        <div className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-navy-900">Conformance Measures</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>High-contrast color themes meeting 4.5:1 text contrast ratios.</li>
            <li>Keyboard navigable interactive elements and screen-reader accessible form labels.</li>
            <li>Clear error notifications and focus indicators across our online booking and payment flows.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 p-5 bg-slate-50 text-xs text-slate-500">
          If you encounter any difficulty accessing content or booking service, please call our 24/7 dispatch office directly at <a href={`tel:${businessConfig.phone.replace(/\D/g, "")}`} className="text-orange-600 font-bold hover:underline">{businessConfig.phone}</a>.
        </div>
      </section>
    </div>
  );
}
