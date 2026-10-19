"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePasswordStrength } from "@/lib/server/redirect-safety";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [checkingSession, setCheckingSession] = React.useState(true);
  const [hasValidSession, setHasValidSession] = React.useState(false);

  // Check whether an active recovery session exists
  React.useEffect(() => {
    async function verifySession() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        // In demo mode, treat as valid recovery session
        setHasValidSession(true);
        setCheckingSession(false);
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();

        // Also check if url hash has access_token or type=recovery
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        const isRecoveryHash = hash.includes("type=recovery") || hash.includes("access_token");

        if (session || isRecoveryHash) {
          setHasValidSession(true);
        } else {
          setHasValidSession(false);
        }
      } catch {
        setHasValidSession(false);
      } finally {
        setCheckingSession(false);
      }
    }

    verifySession();
  }, []);

  const passwordValidation = React.useMemo(() => {
    return validatePasswordStrength(password);
  }, [password]);

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!passwordValidation.valid) {
      setErrorMessage("Please ensure your password meets all strength criteria.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        setSuccess(true);
        toast.success("Password reset successfully (Demo Mode)");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password: password.trim(),
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccess(true);
      toast.success("Password successfully updated");
    } catch {
      setErrorMessage("Failed to update password. Your recovery link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="w-full flex justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600">
          Verifying security token...
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xl space-y-6">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-orange-500 mb-3 shadow-md">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-navy-900">
            Create New Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm">
            Enter your new secure password below to complete your account recovery.
          </p>
        </div>

        {/* Invalid / Expired Link State */}
        {!hasValidSession && !success && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold text-sm">Reset Link Expired or Invalid</p>
                <p>
                  This password recovery link has either expired or has already been used to reset an account.
                </p>
                <p className="text-amber-800 text-[11px] pt-1">
                  Password reset links are single-use and expire after 1 hour for your account security.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <Button
                asChild
                className="w-full bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs"
              >
                <Link href="/forgot-password">Request New Recovery Link</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-bold border-slate-300 text-navy-900"
              >
                <Link href="/login">Return to Sign In</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 space-y-4 text-center">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="font-bold text-base text-emerald-950">Password Updated!</p>
              <p className="text-xs text-emerald-800 mt-1 max-w-xs">
                Your password has been changed securely. You can now sign in with your new credentials.
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 text-sm shadow-md"
            >
              <Link href="/login" className="flex items-center justify-center gap-1.5">
                <span>Sign In with New Password</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {/* Form State (when session is valid and not yet succeeded) */}
        {hasValidSession && !success && (
          <>
            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800 flex items-start gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="reset-new-password" className="text-xs font-bold text-slate-800">
                    New Password *
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-navy-900 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <Input
                  id="reset-new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-600">Password Strength:</span>
                      <span
                        className={`font-bold ${
                          passwordValidation.score <= 2
                            ? "text-red-600"
                            : passwordValidation.score === 3
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {passwordValidation.score <= 2
                          ? "Weak"
                          : passwordValidation.score === 3
                          ? "Good"
                          : "Strong"}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          passwordValidation.score >= 1 ? "bg-orange-500" : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full ${
                          passwordValidation.score >= 2 ? "bg-orange-500" : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full ${
                          passwordValidation.score >= 3 ? "bg-amber-500" : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full ${
                          passwordValidation.score >= 4 ? "bg-emerald-500" : "bg-transparent"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="reset-confirm-password" className="text-xs font-bold text-slate-800">
                  Confirm New Password *
                </Label>
                <Input
                  id="reset-confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
                {confirmPassword.length > 0 && (
                  <p
                    className={`text-[11px] mt-1 font-semibold flex items-center gap-1 ${
                      passwordsMatch ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3" />
                        <span>Passwords do not match yet</span>
                      </>
                    )}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={!passwordsMatch || !passwordValidation.valid}
                className="w-full bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold py-3 text-sm shadow-md transition-all"
              >
                Update Password
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
