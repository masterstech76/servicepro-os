"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  CalendarClock,
  LayoutDashboard,
  MapPin,
  Menu,
  Settings,
  Snowflake,
  Sparkles,
  Users,
  Wrench,
  X,
  ExternalLink,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/dispatch", label: "Dispatch Board", icon: CalendarClock },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/technicians", label: "Technicians", icon: Wrench },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/service-areas", label: "Service Areas", icon: MapPin },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  async function switchToTechPwa() {
    await fetch("/api/auth/demo-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "technician", technicianId: "tech-carlos" }),
    });
    document.cookie = "servicepro_dev_role=technician; path=/; max-age=86400";
    document.cookie = "sp_demo_tech_id=tech-carlos; path=/; max-age=86400";
    router.push("/tech");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 bg-navy-900 text-white z-30">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-input bg-orange-500 text-navy-900 font-bold">
            <Snowflake className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-bold tracking-tight text-white truncate">
              {businessConfig.businessName}
            </span>
            <span className="block text-[11px] text-slate-400">
              ServicePro OS · Dispatch
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-500 text-navy-900 font-semibold shadow-sm"
                    : "text-slate-300 hover:bg-navy-800 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={switchToTechPwa}
            className="w-full flex items-center justify-between rounded-input bg-navy-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5 text-orange-400" />
              Switch to Tech PWA
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400">
            <span>Owner Admin</span>
            <Link href="/demo" className="text-orange-400 hover:underline">
              Demo Guide
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-navy-900/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-xs bg-navy-900 text-white flex flex-col z-10">
            <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800">
              <span className="font-bold text-sm">{businessConfig.businessName}</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-300 hover:text-white"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium",
                      isActive
                        ? "bg-orange-500 text-navy-900 font-semibold"
                        : "text-slate-300 hover:bg-navy-800 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-input p-2 text-navy-700 hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                Live Realtime
              </span>
              <span className="hidden sm:inline text-xs text-navy-700">
                {businessConfig.city}, {businessConfig.state} ({businessConfig.timezone})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 rounded-input border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-navy-900 hover:bg-slate-50"
            >
              + Book Customer Job
            </Link>
            <button
              type="button"
              onClick={switchToTechPwa}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-input bg-navy-900 px-3 py-2 text-xs font-semibold text-white hover:bg-navy-800"
            >
              <Wrench className="h-3.5 w-3.5 text-orange-400" />
              Tech View
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
