"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Snowflake, ShieldCheck, Wrench, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeRedirectUrl, getHomeForRole } from "@/lib/server/redirect-safety";
import type { UserRole } from "@/lib/supabase/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo") || searchParams.get("redirect");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function quickSignIn(role: UserRole, techId = "tech-carlos") {
    setLoading(true);
    setErrorMessage(null);
    try {
      await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, technicianId: techId }),
      });
      document.cookie = `servicepro_dev_role=${role}; path=/; max-age=86400`;
      document.cookie = `sp_demo_role=${role}; path=/; max-age=86400`;
      if (role === "technician") {
        document.cookie = `sp_demo_tech_id=${techId}; path=/; max-age=86400`;
      }

      const defaultHome = getHomeForRole(role);
      const destination = sanitizeRedirectUrl(rawRedirect, defaultHome);
      router.push(destination);
      router.refresh();
    } catch {
      toast.error("Failed to start demo session. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        // Fallback for mock/dev environment based on email
        let simulatedRole: UserRole = "customer";
        const lowEmail = email.toLowerCase();
        if (lowEmail.includes("owner") || lowEmail.includes("admin")) {
          simulatedRole = "owner";
        } else if (
          lowEmail.includes("carlos") ||
          lowEmail.includes("danny") ||
          lowEmail.includes("maria") ||
          lowEmail.includes("tony") ||
          lowEmail.includes("tech")
        ) {
          simulatedRole = "technician";
        }

        await quickSignIn(simulatedRole, "tech-carlos");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
        return;
      }

      // Resolve user's actual role from Supabase database profile
      let resolvedRole: UserRole = "customer";
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
        const pRole = (profile as { role?: UserRole } | null)?.role;
        if (pRole) {
          resolvedRole = pRole;
        }
      }

      toast.success("Signed in successfully");
      const defaultHome = getHomeForRole(resolvedRole);
      const destination = sanitizeRedirectUrl(rawRedirect, defaultHome);
      router.push(destination);
      router.refresh();
    } catch {
      const msg = "Unable to sign in. Please verify your email and password.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const registerHref = rawRedirect
    ? `/register?redirectTo=${encodeURIComponent(rawRedirect)}`
    : "/register";

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-lg space-y-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-orange-500 mb-3 shadow-md">
          <Snowflake className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-navy-900">
          Sign In to {businessConfig.businessName}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Access your bookings, technician dispatch, or owner operations
        </p>
      </div>

      {/* Demo Access Shortcuts */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Instant Role Previews (1-Click)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => quickSignIn("owner")}
            disabled={loading}
            data-testid="demo-login-owner"
            className="w-full text-xs flex flex-col items-center justify-center h-auto py-2 px-1 text-navy-900 hover:border-orange-500"
          >
            <ShieldCheck className="h-4 w-4 text-orange-500 mb-1" />
            <span className="font-semibold text-[11px]">Owner</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => quickSignIn("technician", "tech-carlos")}
            disabled={loading}
            data-testid="demo-login-tech"
            className="w-full text-xs flex flex-col items-center justify-center h-auto py-2 px-1 text-navy-900 hover:border-orange-500"
          >
            <Wrench className="h-4 w-4 text-orange-500 mb-1" />
            <span className="font-semibold text-[11px]">Technician</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => quickSignIn("customer")}
            disabled={loading}
            data-testid="demo-login-customer"
            className="w-full text-xs flex flex-col items-center justify-center h-auto py-2 px-1 text-navy-900 hover:border-orange-500"
          >
            <User className="h-4 w-4 text-orange-500 mb-1" />
            <span className="font-semibold text-[11px]">Customer</span>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-800"
        >
          {errorMessage}
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="login-email" className="text-xs font-bold text-slate-800">
            Email Address
          </Label>
          <Input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="login-password" className="text-xs font-bold text-slate-800">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold py-3 text-sm shadow-md transition-all"
        >
          Sign In
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href={registerHref}
            className="font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-0.5"
          >
            <span>Create Customer Account</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <Link href="/" className="font-medium text-slate-600 hover:text-navy-900 underline">
          ← Back to Homepage
        </Link>
        <Link href="/book" className="font-semibold text-orange-600 hover:text-orange-700 underline">
          Book Service →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <React.Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center text-sm font-semibold text-slate-600">
            Loading sign in...
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </main>
  );
}
