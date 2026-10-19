"use client";

import * as React from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowLeft, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Manage 60-second cooldown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSendReset(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        // In local/demo mode, simulate safe reset instruction sent
        setSubmitted(true);
        setCooldown(60);
        toast.success("Password recovery link generated (Demo Mode)");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const origin =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined" ? window.location.origin : "https://heavenlease.in");

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        // Note: Even if Supabase returns rate-limit error, we provide safe feedback
        setErrorMessage(error.message);
        return;
      }

      // Security practice: Always display generic success to prevent email enumeration
      setSubmitted(true);
      setCooldown(60);
      toast.success("Instructions sent if an account exists");
    } catch {
      setErrorMessage("Unable to send recovery email. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full flex justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xl space-y-6">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-orange-500 mb-3 shadow-md">
            <KeyRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-navy-900">
            Reset Your Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm">
            Enter your email address and we&apos;ll send you a secure link to reset your {businessConfig.businessName} account password.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800 flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="text-xs text-navy-900 space-y-1">
                <p className="font-bold text-sm">Check your inbox</p>
                <p>
                  If an account exists with <span className="font-semibold">{email}</span>, we have sent instructions to reset your password.
                </p>
                <p className="text-slate-600 text-[11px] pt-1">
                  The link expires in 1 hour. Be sure to check your spam or promotional folders if you don&apos;t see it within 2 minutes.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-orange-200/60 flex flex-col sm:flex-row items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={cooldown > 0 || loading}
                onClick={() => handleSendReset()}
                className="w-full text-xs font-bold border-orange-300 text-navy-900 hover:bg-orange-100"
              >
                {cooldown > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-600 animate-pulse" />
                    <span>Resend in {cooldown}s</span>
                  </span>
                ) : (
                  <span>Resend Reset Email</span>
                )}
              </Button>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="w-full text-xs font-bold bg-navy-900 text-white hover:bg-navy-800"
              >
                <Link href="/login">Return to Sign In</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendReset} className="space-y-4">
            <div>
              <Label htmlFor="forgot-email" className="text-xs font-bold text-slate-800">
                Registered Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold py-3 text-sm shadow-md transition-all"
            >
              Send Password Reset Link
            </Button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-600 hover:text-navy-900 inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
