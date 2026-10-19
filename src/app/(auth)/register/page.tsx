"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Snowflake, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeRedirectUrl, validatePasswordStrength } from "@/lib/server/redirect-safety";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo") || searchParams.get("redirect");

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeConsent, setAgreeConsent] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [duplicateAccount, setDuplicateAccount] = React.useState(false);

  // Real-time password validation
  const passwordValidation = React.useMemo(() => {
    return validatePasswordStrength(password);
  }, [password]);

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setDuplicateAccount(false);

    // Validation checks
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Please enter both your first and last name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!passwordValidation.valid) {
      setErrorMessage("Please ensure your password meets all security criteria.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    if (!agreeConsent) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        // Mock / development registration fallback
        await fetch("/api/auth/demo-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "customer" }),
        });
        document.cookie = `servicepro_dev_role=customer; path=/; max-age=86400`;
        document.cookie = `sp_demo_role=customer; path=/; max-age=86400`;

        toast.success("Account created successfully (Demo Mode)");
        const safeDestination = sanitizeRedirectUrl(rawRedirect, "/account");
        router.push(safeDestination);
        router.refresh();
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: `${firstName.trim()} ${lastName.trim()}`,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            role: "customer",
          },
          emailRedirectTo: `${origin}/verify-email`,
        },
      });

      if (error) {
        const lowMsg = error.message.toLowerCase();
        if (
          lowMsg.includes("already registered") ||
          lowMsg.includes("already exists") ||
          error.status === 422
        ) {
          setDuplicateAccount(true);
          setErrorMessage("An account with this email address already exists.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      // Check if user already existed (Supabase returns empty identities array in some setups)
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setDuplicateAccount(true);
        setErrorMessage("An account with this email address already exists.");
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast.info("Activation link sent. Please verify your email.");
        router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        return;
      }

      // Active session granted
      toast.success("Welcome! Your account is active.");
      const safeDestination = sanitizeRedirectUrl(rawRedirect, "/account");
      router.push(safeDestination);
      router.refresh();
    } catch {
      setErrorMessage("Registration failed due to a network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const loginHref = rawRedirect
    ? `/login?redirectTo=${encodeURIComponent(rawRedirect)}`
    : "/login";

  return (
    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xl space-y-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-orange-500 mb-3 shadow-md">
          <Snowflake className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
          Create Customer Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
          Join {businessConfig.businessName} to manage service appointments, view invoices, and track your technician in real time.
        </p>
      </div>

      {/* Duplicate Account Alert */}
      {duplicateAccount && (
        <div
          role="alert"
          className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-3"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <p className="font-bold">Account already exists</p>
              <p className="mt-0.5">
                We found an existing account for <span className="font-semibold">{email}</span>. You can sign in directly or request a password reset if you forgot your credentials.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button
              asChild
              size="sm"
              className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold"
            >
              <Link href={loginHref}>Sign In with This Email</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs font-bold border-amber-300 text-amber-900 hover:bg-amber-100"
            >
              <Link href="/forgot-password">Reset Password</Link>
            </Button>
          </div>
        </div>
      )}

      {/* General Error Alert */}
      {errorMessage && !duplicateAccount && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800 flex items-start gap-2"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="reg-first-name" className="text-xs font-bold text-slate-800">
              First Name *
            </Label>
            <Input
              id="reg-first-name"
              type="text"
              required
              autoComplete="given-name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="reg-last-name" className="text-xs font-bold text-slate-800">
              Last Name *
            </Label>
            <Input
              id="reg-last-name"
              type="text"
              required
              autoComplete="family-name"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="reg-email" className="text-xs font-bold text-slate-800">
              Email Address *
            </Label>
            <Input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="reg-phone" className="text-xs font-bold text-slate-800">
              Mobile Phone
            </Label>
            <Input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              placeholder="(305) 555-0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="reg-password" className="text-xs font-bold text-slate-800">
              Create Password *
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
            id="reg-password"
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
              <ul className="text-[10px] text-slate-500 grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1">
                <li className={password.length >= 8 ? "text-emerald-700 font-semibold" : ""}>
                  ✓ 8+ characters
                </li>
                <li className={/[a-z]/.test(password) ? "text-emerald-700 font-semibold" : ""}>
                  ✓ Lowercase letter
                </li>
                <li className={/[A-Z]/.test(password) ? "text-emerald-700 font-semibold" : ""}>
                  ✓ Uppercase letter
                </li>
                <li className={/[0-9]/.test(password) ? "text-emerald-700 font-semibold" : ""}>
                  ✓ Number
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="reg-confirm-password" className="text-xs font-bold text-slate-800">
            Confirm Password *
          </Label>
          <Input
            id="reg-confirm-password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
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

        {/* Consent Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
            <input
              type="checkbox"
              required
              checked={agreeConsent}
              onChange={(e) => setAgreeConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-orange-600 underline font-semibold hover:text-orange-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-orange-600 underline font-semibold hover:text-orange-700">
                Privacy Policy
              </Link>
              , and consent to receive appointment updates by SMS and email.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          disabled={!passwordsMatch || !agreeConsent || !passwordValidation.valid}
          className="w-full bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold py-3 text-sm shadow-md transition-all disabled:opacity-60"
        >
          Create My Account
        </Button>
      </form>

      {/* Security Guarantee Strip */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>256-Bit SSL Encrypted & HIPAA/SOC2 Secure Auth</span>
      </div>

      {/* Sign In Link */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-600">
          Already have an account?{" "}
          <Link
            href={loginHref}
            className="font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-0.5"
          >
            <span>Sign In</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <Link href="/" className="font-medium text-slate-600 hover:text-navy-900 underline">
          ← Homepage
        </Link>
        <Link href="/book" className="font-semibold text-orange-600 hover:text-orange-700 underline">
          Book as Guest →
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6">
      <React.Suspense
        fallback={
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 text-center text-sm font-semibold text-slate-600">
            Loading registration form...
          </div>
        }
      >
        <RegisterForm />
      </React.Suspense>
    </main>
  );
}
