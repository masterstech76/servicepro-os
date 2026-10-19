"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Snowflake, ShieldCheck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function quickSignIn(role: "owner" | "technician", techId = "tech-carlos") {
    setLoading(true);
    try {
      await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, technicianId: techId }),
      });
      document.cookie = `servicepro_dev_role=${role}; path=/; max-age=86400`;
      document.cookie = `sp_demo_tech_id=${techId}; path=/; max-age=86400`;
      router.push(role === "owner" ? "/admin" : "/tech");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        const isTech =
          email.toLowerCase().includes("carlos") ||
          email.toLowerCase().includes("danny") ||
          email.toLowerCase().includes("maria") ||
          email.toLowerCase().includes("tony") ||
          email.toLowerCase().includes("tech");
        const role = isTech ? "technician" : "owner";
        await quickSignIn(role, "tech-carlos");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-card border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-input bg-navy-900 text-orange-500 mb-3 shadow-sm">
            <Snowflake className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-navy-900">
            {businessConfig.businessName} Staff Portal
          </h1>
          <p className="text-xs text-navy-700 mt-1">
            Sign in to access Owner Dispatch or Technician Field PWA
          </p>
        </div>

        <div className="rounded-input border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">
            Instant Demo Access
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => quickSignIn("owner")}
              disabled={loading}
              data-testid="demo-login-owner"
              className="w-full justify-start gap-2 border-slate-300 bg-white text-navy-900 hover:bg-slate-100"
            >
              <ShieldCheck className="h-4 w-4 text-orange-500 shrink-0" />
              <span className="truncate">Owner Dispatch</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => quickSignIn("technician", "tech-carlos")}
              disabled={loading}
              data-testid="demo-login-tech"
              className="w-full justify-start gap-2 border-slate-300 bg-white text-navy-900 hover:bg-slate-100"
            >
              <Wrench className="h-4 w-4 text-orange-500 shrink-0" />
              <span className="truncate">Tech (Carlos M.)</span>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              required
              placeholder="owner@coolairmiami.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            loading={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold shadow-md transition-all"
          >
            Sign in with Email
          </Button>
        </form>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <Link href="/" className="font-medium text-navy-700 hover:text-navy-900 underline">
            ← Customer Booking
          </Link>
          <Link href="/demo" className="font-semibold text-orange-600 hover:text-orange-700 underline">
            Interactive Demo Guide →
          </Link>
        </div>
      </div>
    </main>
  );
}
