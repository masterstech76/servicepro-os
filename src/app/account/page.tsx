"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CreditCard,
  Home,
  User,
  Wrench,
  Clock,
  ShieldCheck,
  LogOut,
  ArrowRight,
  PlusCircle,
  FileText,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AccountOverviewPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = React.useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "clear" }),
      });
      document.cookie = "servicepro_dev_role=; path=/; max-age=0";
      document.cookie = "sp_demo_role=; path=/; max-age=0";
      document.cookie = "sp_demo_tech_id=; path=/; max-age=0";
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-navy-900 text-white p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-orange-500">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Customer Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome to Your Service Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Manage your residential and commercial HVAC service appointments, view maintenance history, and track arriving technicians in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-black text-xs sm:text-sm px-5 py-2.5 shadow-md flex-1 sm:flex-none"
            >
              <Link href="/book" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Book New Service</span>
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              disabled={signingOut}
              className="border-slate-700 bg-white/5 text-white hover:bg-white/10 text-xs font-bold"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Appointments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-orange-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Live Status
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900">Appointments</h2>
              <p className="text-xs text-slate-500 mt-1">
                View your scheduled appointments and track your technician&apos;s live ETA.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">No active dispatches right now</p>
              <p className="text-[11px] text-slate-500">Need routine maintenance or an emergency diagnostic?</p>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Schedule HVAC Service</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 2: Billing & Invoices */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-orange-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Stripe Verified
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900">Invoices & Receipts</h2>
              <p className="text-xs text-slate-500 mt-1">
                Access PDF receipts, breakdown of labor & parts, and pay balances.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">All invoices paid in full</p>
              <p className="text-[11px] text-slate-500">Your account balance is current with \$0.00 outstanding.</p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>View Service Catalog</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 3: Property Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-orange-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Miami-Dade
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900">Service Address</h2>
              <p className="text-xs text-slate-500 mt-1">
                Primary HVAC equipment location and dispatch contact preference.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">{businessConfig.businessName} Service Area</p>
              <p className="text-[11px] text-slate-500">Miami, Coral Gables, Brickell, Doral & South Florida</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Contact Dispatch Office</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* 24/7 Emergency Dispatch Banner */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-orange-500 text-navy-900 flex items-center justify-center font-bold text-lg">
              ⚡
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-navy-900">
                Require Immediate Emergency HVAC Dispatch?
              </h3>
              <p className="text-xs text-slate-600">
                AC down in high heat? Our on-call technicians are available 24/7 across South Florida.
              </p>
            </div>
          </div>
          <a
            href={`tel:${businessConfig.phone.replace(/[^\d+]/g, "")}`}
            className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm px-5 py-3 shadow transition-colors shrink-0"
          >
            Call {businessConfig.phone}
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
