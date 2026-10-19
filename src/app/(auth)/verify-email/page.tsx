"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, Mail, CheckCircle2, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = React.useState(emailParam);
  const [isVerified, setIsVerified] = React.useState(false);
  const [checking, setChecking] = React.useState(true);
  const [resending, setResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  // Manage cooldown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Check Supabase verification state on load
  React.useEffect(() => {
    async function checkState() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        setChecking(false);
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          if (user.email) setEmail(user.email);
          if (user.email_confirmed_at) {
            setIsVerified(true);
          }
        }
      } catch {
        // Continue with unverified state
      } finally {
        setChecking(false);
      }
    }

    checkState();
  }, []);

  async function handleResend() {
    if (!email) {
      toast.error("No email address found to resend verification.");
      return;
    }

    setResending(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        setCooldown(60);
        toast.success("Verification link resent (Demo Mode)");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const origin =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined" ? window.location.origin : "https://heavenlease.in");
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/verify-email`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setCooldown(60);
      toast.success("Verification email resent. Please check your inbox.");
    } catch {
      toast.error("Unable to resend email. Please try again shortly.");
    } finally {
      setResending(false);
    }
  }

  if (checking) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600">
        Checking verification status...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xl space-y-6">
      {/* Verified State */}
      {isVerified ? (
        <div className="text-center space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mx-auto shadow-sm">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">
              Email Verified!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto">
              Your {businessConfig.businessName} account is verified and ready. You now have access to service tracking and account billing.
            </p>
          </div>

          <div className="pt-2">
            <Button
              asChild
              className="w-full bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold py-3 text-sm shadow-md transition-all"
            >
              <Link href="/account" className="flex items-center justify-center gap-2">
                <span>Go to Customer Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* Pending Verification State */
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-navy-900 mb-3 shadow-md">
              <MailCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-navy-900">
              Verify Your Email
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm">
              We sent an account activation link to{" "}
              <span className="font-bold text-navy-900">
                {email || "your registered email"}
              </span>
              .
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-bold text-navy-900">
              <ShieldCheck className="h-4 w-4 text-orange-500 shrink-0" />
              <span>Next Steps to Activate</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
              <li>Open your email inbox and look for an email from <strong>{businessConfig.businessName}</strong>.</li>
              <li>Click the activation button inside to confirm your address.</li>
              <li>Return here or refresh this page to access your customer portal.</li>
            </ol>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              Can&apos;t find it? Check your spam, updates, or junk folder.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className="w-full text-xs font-bold border-slate-300 text-navy-900 hover:bg-slate-50"
            >
              {cooldown > 0 ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-orange-600 animate-pulse" />
                  <span>Resend activation link in {cooldown}s</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Resend Verification Email</span>
                </span>
              )}
            </Button>

            <Button
              asChild
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs"
            >
              <Link href="/login">Return to Sign In</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Footer Support */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Need help? Call our office at{" "}
          <a
            href={`tel:${businessConfig.phone.replace(/[^\d+]/g, "")}`}
            className="font-bold text-orange-600 hover:underline"
          >
            {businessConfig.phone}
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="w-full flex justify-center">
      <React.Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600">
            Loading verification page...
          </div>
        }
      >
        <VerifyEmailContent />
      </React.Suspense>
    </main>
  );
}
