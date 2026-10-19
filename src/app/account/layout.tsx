"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CreditCard,
  MapPin,
  User,
  HelpCircle,
  Bell,
  LogOut,
  Phone,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Star,
  Bookmark,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/appointments", label: "Appointments", icon: Calendar },
  { href: "/account/invoices", label: "Invoices", icon: FileText },
  { href: "/account/payments", label: "Payments", icon: CreditCard },
  { href: "/account/favorites", label: "Saved Services", icon: Bookmark },
  { href: "/account/reviews", label: "My Reviews", icon: Star },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/support", label: "Support", icon: HelpCircle },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loggingOut, setLoggingOut] = React.useState(false);

  React.useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/account/notifications");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // silent
      }
    }
    fetchUnread();
  }, [pathname]);

  async function handleSignOut() {
    setLoggingOut(true);
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
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Utility Bar */}
      <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-md border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-36">
                <Image
                  src="/logo-placeholder.svg"
                  alt="TechWork ServicePro OS"
                  fill
                  priority
                  className="object-contain object-left invert"
                />
              </div>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-slate-700" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Customer Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${businessConfig.phone.replace(/[^\d+]/g, "")}`}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-orange-400 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-orange-500" />
              <span>24/7 Dispatch: {businessConfig.phone}</span>
            </a>

            <Link
              href="/account/notifications"
              className="relative p-2 text-slate-300 hover:text-white rounded-lg transition-colors"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-navy-900" />
              )}
            </Link>

            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs"
            >
              <Link href="/book">Book Service</Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={loggingOut}
              className="border-slate-700 bg-white/5 text-slate-200 hover:bg-white/10 text-xs font-bold"
            >
              <LogOut className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-1">
            <div className="px-3 py-2 mb-2 border-b border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Self-Service Portal
              </p>
            </div>

            <nav className="space-y-1" aria-label="Customer portal sidebar">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/account"
                    ? pathname === "/account"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-orange-50 text-orange-600 border border-orange-200"
                        : "text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? "text-orange-500" : "text-slate-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.href === "/account/notifications" && unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-navy-900 text-[10px] font-black">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 mt-4 border-t border-slate-100 px-3">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-1 text-slate-600">
                <p className="font-bold text-navy-900">Need Immediate Help?</p>
                <p className="text-[11px]">Emergency technicians are on call 24 hours a day.</p>
                <a
                  href={`tel:${businessConfig.phone.replace(/[^\d+]/g, "")}`}
                  className="font-bold text-orange-600 hover:underline block pt-1 text-xs"
                >
                  Call {businessConfig.phone}
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Horizontal Tab Navigation */}
        <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-2 scrollbar-none flex items-center gap-1.5 border-b border-slate-200 bg-white py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                  isActive
                    ? "bg-orange-500 text-navy-900 shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
                {item.href === "/account/notifications" && unreadCount > 0 && (
                  <span className="ml-1 px-1 rounded-full bg-navy-900 text-white text-[9px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Page Content Viewport */}
        <section className="flex-1 min-w-0">{children}</section>
      </div>
    </div>
  );
}
