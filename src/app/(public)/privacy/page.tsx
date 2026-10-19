import * as React from "react";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, CheckCircle2, Phone, Mail } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata = {
  title: `Privacy Policy | ${businessConfig.businessName}`,
  description: `Privacy Policy and data protection terms for ${businessConfig.businessName}. Learn how we protect your personal and payment information.`,
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 19, 2026";
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#FFF7ED]/70 via-white to-white py-12 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-4">
          <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF7ED] border border-orange-200 px-3.5 py-1 text-xs font-bold text-[#EA580C]">
            <Shield className="h-3.5 w-3.5" />
            <span>Customer Data Protection</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Effective Date: {lastUpdated} • Version 2.4
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 text-slate-700 leading-relaxed text-sm">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-2">
          <p className="font-bold text-slate-900 text-sm">Summary of our Commitment:</p>
          <p>
            At {businessConfig.businessName} (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we respect your privacy and are committed to safeguarding your personal data. We never sell customer records, phone numbers, or email addresses to third-party data brokers.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-[#EA580C] text-xs font-black">1</span>
            Information We Collect
          </h2>
          <p>We collect information necessary to provide, manage, and invoice heating, ventilation, and air conditioning services:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Contact Details:</strong> Name, phone number, email address, and service delivery addresses.</li>
            <li><strong>HVAC Equipment Information:</strong> System make, model, tonnage, filter sizes, and photos taken during inspections.</li>
            <li><strong>Transaction &amp; Billing Data:</strong> Payment transaction identifiers, partial card numbers (last 4 digits only), and billing history. Complete card credentials are processed directly by our PCI-DSS Level 1 certified payment processor (Stripe) and are never stored on our servers.</li>
            <li><strong>Communications:</strong> SMS appointment reminders, dispatch notifications, technician arrival alerts, and customer service inquiries.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-[#EA580C] text-xs font-black">2</span>
            How We Use Your Information
          </h2>
          <p>Your information is used strictly for operational and service delivery purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Scheduling and dispatching certified HVAC technicians to your premises.</li>
            <li>Sending real-time arrival estimates and live tracking links with your assigned technician&apos;s photo.</li>
            <li>Processing service diagnostics, repair estimates, invoices, and receipts.</li>
            <li>Administering our 1-year labor warranty and seasonal maintenance records.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-[#EA580C] text-xs font-black">3</span>
            SMS &amp; Communication Consent
          </h2>
          <p>
            By booking a service or submitting your phone number, you consent to receive service-related transactional SMS messages (arrival alerts, quote approvals, invoices). Message frequency varies based on active job status. Message and data rates may apply. You may opt out at any time by replying STOP to any message or updating your preferences in your customer account.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-[#EA580C] text-xs font-black">4</span>
            Data Security &amp; Retention
          </h2>
          <p>
            We implement industry-standard technical safeguards including 256-bit TLS encryption in transit and AES-256 encryption at rest. Customer records are maintained for as long as needed to fulfill ongoing warranties, accounting obligations, and Florida statutory record-retention requirements.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-[#EA580C] text-xs font-black">5</span>
            Contact Our Privacy Officer
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request data access or deletion, contact our dispatch office:
          </p>
          <div className="rounded-xl border border-slate-200 p-5 bg-white space-y-2">
            <p className="font-bold text-slate-900">{businessConfig.businessName}</p>
            <p className="text-xs text-slate-500">{businessConfig.address}</p>
            <p className="text-xs text-slate-500">
              Email: <a href={`mailto:${businessConfig.email}`} className="text-orange-600 hover:underline">{businessConfig.email}</a> • Phone: <a href={cleanPhoneHref} className="text-orange-600 hover:underline">{businessConfig.phone}</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
