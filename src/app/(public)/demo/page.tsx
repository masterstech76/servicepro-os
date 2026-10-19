"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Layers,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Sparkles,
  Wrench,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { acePlumbingAustinConfig } from "@config/examples/ace-plumbing-austin";
import { Button } from "@/components/ui/button";
import { DemoDataManager } from "@/components/admin/DemoDataManager";

export default function InteractiveDemoGuidePage() {
  const router = useRouter();
  const [enteringRole, setEnteringRole] = React.useState<string | null>(null);

  async function launchSurface(
    role: "owner" | "technician",
    destPath: string,
    techId = "tech-carlos"
  ) {
    setEnteringRole(destPath);
    try {
      await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, technicianId: techId }),
      });
      router.push(destPath);
    } finally {
      setEnteringRole(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="border-b border-slate-200 bg-navy-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-input bg-orange-500 text-navy-900 font-bold">
              <Snowflake className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-base font-bold">
                ServicePro OS · Interactive Demo Hub
              </span>
              <span className="block text-xs text-slate-300">
                Configured for {businessConfig.businessName} ({businessConfig.city},{" "}
                {businessConfig.state})
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link href="/book">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold shadow-sm">
                Book a Service →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8 space-y-8">
        {/* Demo Data Reset & Delete Toolbar */}
        <DemoDataManager />

        {/* Hero Banner */}
        <section className="rounded-card border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-800">
            <Sparkles className="h-3.5 w-3.5" />
            Full-Stack White-Label Dispatch System
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
            Explore All 4 Live Surfaces with One Click
          </h1>
          <p className="text-sm text-navy-700 max-w-3xl">
            Every surface shares a single live store pre-populated with{" "}
            <strong>4 Miami HVAC technicians</strong>,{" "}
            <strong>12 Miami-Dade customers</strong>,{" "}
            <strong>today’s active dispatch board</strong>, and{" "}
            <strong>14 days of completed jobs & invoices</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* 1. Customer Booking */}
            <div className="rounded-card border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-input bg-orange-500 text-navy-900">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <h2 className="text-base font-bold text-navy-900">
                  1. Customer Booking
                </h2>
                <p className="text-xs text-navy-700">
                  7-step mobile-first wizard with ZIP check, photo upload, 10-min
                  slot hold timer, and 20% deposit math.
                </p>
              </div>
              <Link href="/book" className="block">
                <Button size="sm" className="w-full gap-1.5">
                  Open /book
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* 2. Owner Dispatch */}
            <div className="rounded-card border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-input bg-navy-900 text-orange-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-base font-bold text-navy-900">
                  2. Owner Dispatch Board
                </h2>
                <p className="text-xs text-navy-700">
                  Kanban, Miami Map & Timeline views, smart technician scoring,
                  SLA alerts, and 4-tab Job Drawer.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                loading={enteringRole === "/admin/dispatch"}
                data-testid="demo-launch-admin"
                onClick={() => void launchSurface("owner", "/admin/dispatch")}
                className="w-full gap-1.5 border-navy-900 text-navy-900"
              >
                Enter Owner Dispatch
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* 3. Technician Field PWA */}
            <div className="rounded-card border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-input bg-blue-600 text-white">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h2 className="text-base font-bold text-navy-900">
                  3. Technician Field PWA
                </h2>
                <p className="text-xs text-navy-700">
                  Sign in as Carlos Mendez: start route (sends ETA SMS), add
                  parts, select tip, and collect payment.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                loading={enteringRole === "/tech"}
                data-testid="demo-launch-tech"
                onClick={() =>
                  void launchSurface("technician", "/tech", "tech-carlos")
                }
                className="w-full gap-1.5 border-blue-600 text-navy-900"
              >
                Enter Tech PWA
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* 4. Customer Payment Link */}
            <div className="rounded-card border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-input bg-emerald-600 text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-base font-bold text-navy-900">
                  4. Customer Pay Link
                </h2>
                <p className="text-xs text-navy-700">
                  Hosted invoice page with parts tax, deposit credit, tip presets
                  (15/20/25%), and instant receipt.
                </p>
              </div>
              <Link href="/pay/pay_tok_1035" className="block">
                <Button
                  size="sm"
                  variant="secondary"
                  data-testid="demo-launch-pay-link"
                  className="w-full gap-1.5"
                >
                  Open Invoice #5035
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 6-Step Guided Walkthrough */}
        <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            6-Step End-to-End Verification Walkthrough
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-input border border-slate-200 p-4 space-y-1.5">
              <span className="font-bold text-orange-700 uppercase">Step 1</span>
              <h3 className="text-sm font-bold text-navy-900">
                Book an AC Repair on /book
              </h3>
              <p className="text-navy-700">
                Select <strong>AC Repair ($99)</strong>, enter ZIP{" "}
                <strong>33133</strong>, pick a time window, and pay the{" "}
                <strong>$19.80 (20%) deposit</strong>.
              </p>
            </div>
            <div className="rounded-input border border-slate-200 p-4 space-y-1.5">
              <span className="font-bold text-orange-700 uppercase">Step 2</span>
              <h3 className="text-sm font-bold text-navy-900">
                Smart-Assign on Dispatch Board
              </h3>
              <p className="text-navy-700">
                Open <strong>/admin/dispatch</strong>, click an unassigned job,
                and inspect the ranked technician suggestions with travel & load
                scores.
              </p>
            </div>
            <div className="rounded-input border border-slate-200 p-4 space-y-1.5">
              <span className="font-bold text-orange-700 uppercase">Step 3</span>
              <h3 className="text-sm font-bold text-navy-900">
                Start Route in Tech PWA
              </h3>
              <p className="text-navy-700">
                Switch to <strong>/tech</strong> as Carlos Mendez and tap{" "}
                <strong>Start Route ▶</strong> to transition to{" "}
                <code>on_the_way</code> and send the ETA SMS.
              </p>
            </div>
            <div className="rounded-input border border-slate-200 p-4 space-y-1.5">
              <span className="font-bold text-orange-700 uppercase">Step 4</span>
              <h3 className="text-sm font-bold text-navy-900">
                Add Parts & Calculate 7% Tax
              </h3>
              <p className="text-navy-700">
                Tap <strong>Complete & Collect Payment</strong>, add a{" "}
                <strong>$120 Capacitor</strong> part (+$8.40 tax), and credit the{" "}
                <strong>$19.80 deposit</strong>.
              </p>
            </div>
            <div className="rounded-input border border-slate-200 p-4 space-y-1.5">
              <span className="font-bold text-orange-700 uppercase">Step 5</span>
              <h3 className="text-sm font-bold text-navy-900">
                Collect Tip & Payment
              </h3>
              <p className="text-navy-700">
                Select a <strong>20% tip ($43.80)</strong> on the $219 pre-tax
                subtotal and charge the saved Visa •••• 4242 or text the pay link.
              </p>
            </div>
            <div className="rounded-input border border-slate-200 p-4 space-y-1.5">
              <span className="font-bold text-orange-700 uppercase">Step 6</span>
              <h3 className="text-sm font-bold text-navy-900">
                Verify Revenue & Commissions
              </h3>
              <p className="text-navy-700">
                Open{" "}
                <button
                  type="button"
                  onClick={() => void launchSurface("owner", "/admin/reports")}
                  className="font-semibold text-orange-700 underline"
                >
                  /admin/reports
                </button>{" "}
                to view gross revenue, tips, and 20% technician commission CSV
                exports.
              </p>
            </div>
          </div>
        </section>

        {/* White-Label Multi-Trade Comparison */}
        <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-orange-600" />
                White-Label Configuration Architecture
              </h2>
              <p className="text-xs text-navy-700">
                Validated by Zod schema + WCAG contrast checker at startup (`config/business.schema.ts`)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-input border-2 border-orange-500 bg-orange-50/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-navy-900">
                  {businessConfig.businessName} (Active Config)
                </span>
                <span className="rounded-pill bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-navy-900">
                  config/business.config.ts
                </span>
              </div>
              <p className="text-navy-700">
                <strong>Location:</strong> {businessConfig.city},{" "}
                {businessConfig.state} ({businessConfig.timezone}) ·{" "}
                {businessConfig.zipCodes.length} ZIPs
              </p>
              <p className="text-navy-700">
                <strong>Rules:</strong> {businessConfig.booking.depositPct}%
                deposit · {(businessConfig.tax.rateBps / 100).toFixed(1)}% parts
                tax · {businessConfig.services.length} HVAC services
              </p>
            </div>

            <div className="rounded-input border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-navy-900">
                  {acePlumbingAustinConfig.businessName} (Example Config)
                </span>
                <span className="rounded-pill bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-navy-900">
                  config/examples/ace-plumbing-austin.ts
                </span>
              </div>
              <p className="text-navy-700">
                <strong>Location:</strong> {acePlumbingAustinConfig.city},{" "}
                {acePlumbingAustinConfig.state} ({acePlumbingAustinConfig.timezone}) ·{" "}
                {acePlumbingAustinConfig.zipCodes.length} ZIPs
              </p>
              <p className="text-navy-700">
                <strong>Rules:</strong> {acePlumbingAustinConfig.booking.depositPct}%
                deposit · {(acePlumbingAustinConfig.tax.rateBps / 100).toFixed(2)}%
                parts tax · {acePlumbingAustinConfig.services.length} Plumbing
                services
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
