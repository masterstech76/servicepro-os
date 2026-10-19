"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, Snowflake } from "lucide-react";
import { businessConfig } from "@config/business.config";

export default function TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function switchToOwnerAdmin() {
    await fetch("/api/auth/demo-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "owner" }),
    });
    document.cookie = "servicepro_dev_role=owner; path=/; max-age=86400";
    router.push("/admin/dispatch");
  }

  async function handleSignOut() {
    await fetch("/api/auth/demo-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "clear" }),
    });
    document.cookie = "servicepro_dev_role=; path=/; max-age=0";
    document.cookie = "sp_demo_role=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="sticky top-0 z-30 bg-navy-900 text-white border-b border-slate-800">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 h-14">
          <Link href="/tech" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-input bg-orange-500 text-navy-900 font-bold">
              <Snowflake className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-sm font-bold leading-tight">
                {businessConfig.businessName}
              </span>
              <span className="block text-[11px] text-orange-400 font-medium">
                Field Technician PWA
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={switchToOwnerAdmin}
              className="inline-flex items-center gap-1 rounded-input bg-navy-800 border border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
              Dispatch
            </button>
            <button
              type="button"
              aria-label="Sign out"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-input bg-navy-800 border border-slate-700 p-1.5 text-slate-300 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-4 pb-24">
        {children}
      </main>
    </div>
  );
}
