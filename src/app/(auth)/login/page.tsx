import Link from "next/link";
import { Snowflake } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPlaceholderPage() {
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

        <form className="space-y-4">
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" placeholder="owner@coolairmiami.com" />
          </div>
          <div>
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" type="password" placeholder="••••••••" />
          </div>
          <Button type="button" className="w-full">
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
