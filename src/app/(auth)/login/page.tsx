"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Snowflake } from "lucide-react";
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const isPlaceholder =
        !url.startsWith("https://") ||
        url.includes("placeholder-project.supabase.co");

      if (isPlaceholder) {
        const isTech = email.toLowerCase().includes("carlos") || email.toLowerCase().includes("tech");
        const role = isTech ? "technician" : "owner";
        document.cookie = `servicepro_dev_role=${role}; path=/; max-age=86400`;
        router.push(role === "owner" ? "/admin" : "/tech");
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
      <div className="w-full max-w-sm rounded-card border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-input bg-navy-900 text-orange-500 mb-3">
            <Snowflake className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-navy-900">
            {businessConfig.businessName} Staff
          </h1>
          <p className="text-xs text-navy-700 mt-1">
            Sign in to access Dispatch or Technician tools
          </p>
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
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-xs font-medium text-orange-700 underline">
            ← Back to customer booking
          </Link>
        </div>
      </div>
    </main>
  );
}
