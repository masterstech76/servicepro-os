"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Smartphone, ShieldAlert, ArrowRight, CheckCircle2, Info, Lock } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

function VerifyPhoneContent() {
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || businessConfig.phone;
  const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(false);

  return (
    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-orange-500 mb-3 shadow-md">
          <Smartphone className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2">
          <Info className="h-3.5 w-3.5 text-amber-600" />
          <span>Scheduled Phase 2 Carrier Integration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
          Phone Verification Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
          Two-factor mobile verification status for {businessConfig.businessName} accounts.
        </p>
      </div>

      {/* Honest Status Notice */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3.5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-800 space-y-1.5">
            <p className="font-bold text-sm text-navy-900">
              Automated SMS OTP Currently Deactivated
            </p>
            <p className="text-slate-600 leading-relaxed">
              Mobile one-time password (OTP) verification requires an approved <strong>A2P 10DLC (10-Digit Long Code)</strong> carrier registration with US telecommunication providers.
            </p>
            <p className="text-slate-600 leading-relaxed">
              To remain fully compliant with US carrier regulations, SMS verification is queued for Phase 2 activation.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Your Account is Secure:</strong> You can authenticate safely and access all portal features using verified email credentials.
          </span>
        </div>
      </div>

      {/* Phone Details */}
      <div className="rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
        <div className="flex justify-between items-center text-slate-600">
          <span>Mobile Number on File:</span>
          <span className="font-bold text-navy-900">{phoneParam}</span>
        </div>
        <div className="flex justify-between items-center text-slate-600">
          <span>Verification Provider:</span>
          <span className="font-semibold text-slate-700">Twilio / Console (Pending 10DLC)</span>
        </div>
        <div className="flex justify-between items-center text-slate-600">
          <span>SMS Job Alerts Status:</span>
          <span className="font-bold text-emerald-600">Active (Transactional Only)</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-2.5">
        <Button
          asChild
          className="w-full bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold py-3 text-sm shadow-md transition-all"
        >
          <Link href="/account" className="flex items-center justify-center gap-2">
            <span>Continue to Customer Portal</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full text-xs font-bold border-slate-300 text-navy-900 hover:bg-slate-50"
        >
          <Link href="/verify-email">Verify via Email Instead</Link>
        </Button>
      </div>

      {/* Developer / Technical Specs Accordion */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-[11px] font-semibold text-slate-500 hover:text-navy-900 underline flex items-center gap-1 mx-auto"
        >
          <Lock className="h-3 w-3" />
          <span>{showTechnicalDetails ? "Hide Provider Specifications" : "View Integration Specifications"}</span>
        </button>

        {showTechnicalDetails && (
          <div className="mt-3 p-3 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1">
            <p className="text-orange-400 font-bold">[Phase 2 SMS Provider Integration Checklist]</p>
            <p>- TWILIO_ACCOUNT_SID: [configured]</p>
            <p>- TWILIO_AUTH_TOKEN: [configured]</p>
            <p>- TWILIO_VERIFY_SERVICE_SID: [pending registration]</p>
            <p>- A2P 10DLC Campaign Use-Case: 2FA Authentication</p>
            <p>- Fallback: Primary email token authentication enforced</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <Link href="/" className="font-medium text-slate-600 hover:text-navy-900 underline">
          ← Homepage
        </Link>
        <Link href="/book" className="font-semibold text-orange-600 hover:text-orange-700 underline">
          Book Service →
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPhonePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <React.Suspense
        fallback={
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600">
            Loading phone verification status...
          </div>
        }
      >
        <VerifyPhoneContent />
      </React.Suspense>
    </main>
  );
}
