"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Calendar,
  LogOut,
  ShieldCheck,
  Snowflake,
  User,
  Wrench,
  Radio,
  DollarSign,
  Bell,
} from "lucide-react";
import { businessConfig } from "@config/business.config";

export default function TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

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

  const isTodayActive = pathname === "/tech";
  const isScheduleActive = pathname === "/tech/schedule";
  const isEarningsActive = pathname === "/tech/earnings";
  const isProfileActive = pathname === "/tech/profile";
  const isNotifsActive = pathname === "/tech/notifications";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      <header className="sticky top-0 z-30 bg-navy-900 text-white border-b border-slate-800 shadow-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 h-14">
          <Link href="/tech" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-navy-950 font-bold shadow-sm">
              <Snowflake className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-sm font-bold leading-tight">
                {businessConfig.businessName}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-orange-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Field Tech PWA
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            <Link
              href="/tech/notifications"
              aria-label="Dispatch alerts"
              className={`inline-flex items-center justify-center rounded-lg bg-navy-800 border p-1.5 transition-colors ${
                isNotifsActive
                  ? "border-orange-500 text-orange-400"
                  : "border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <Bell className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={switchToOwnerAdmin}
              className="inline-flex items-center gap-1 rounded-lg bg-navy-800 border border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
              Dispatch
            </button>
            <button
              type="button"
              aria-label="Sign out"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-lg bg-navy-800 border border-slate-700 p-1.5 text-slate-300 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-4 pb-28">
        {children}
      </main>

      {/* Mobile-First PWA Bottom Navigation Bar */}
      <nav
        aria-label="Technician bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-lg"
      >
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          <Link
            href="/tech"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isTodayActive
                ? "text-orange-600 font-bold"
                : "text-navy-700 hover:text-navy-950 font-semibold"
            }`}
          >
            <div
              className={`p-1 rounded-lg mb-0.5 ${
                isTodayActive ? "bg-orange-100 text-orange-600" : ""
              }`}
            >
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-[11px]">Today</span>
          </Link>

          <Link
            href="/tech/schedule"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isScheduleActive
                ? "text-orange-600 font-bold"
                : "text-navy-700 hover:text-navy-950 font-semibold"
            }`}
          >
            <div
              className={`p-1 rounded-lg mb-0.5 ${
                isScheduleActive ? "bg-orange-100 text-orange-600" : ""
              }`}
            >
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-[11px]">Schedule</span>
          </Link>

          <Link
            href="/tech/earnings"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isEarningsActive
                ? "text-orange-600 font-bold"
                : "text-navy-700 hover:text-navy-950 font-semibold"
            }`}
          >
            <div
              className={`p-1 rounded-lg mb-0.5 ${
                isEarningsActive ? "bg-orange-100 text-orange-600" : ""
              }`}
            >
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-[11px]">Earnings</span>
          </Link>

          <Link
            href="/tech/profile"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isProfileActive
                ? "text-orange-600 font-bold"
                : "text-navy-700 hover:text-navy-950 font-semibold"
            }`}
          >
            <div
              className={`p-1 rounded-lg mb-0.5 ${
                isProfileActive ? "bg-orange-100 text-orange-600" : ""
              }`}
            >
              <User className="h-5 w-5" />
            </div>
            <span className="text-[11px]">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
