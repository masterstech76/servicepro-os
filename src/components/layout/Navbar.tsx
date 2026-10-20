"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  Menu,
  X,
  Phone,
  User,
  ShieldCheck,
  ChevronRight,
  Flame,
  Snowflake,
  Wrench,
  Wind,
  MapPin,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const mobileDrawerRef = React.useRef<HTMLDivElement>(null);

  // Close menus on route change
  React.useEffect(() => {
    setServicesOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdown & mobile menu when clicking outside or pressing Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Hide global navbar on dashboard, tech portal, and all auth pages
  const isAuthPage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/tech") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/verify-email") ||
    pathname?.startsWith("/verify-phone") ||
    pathname?.startsWith("/unauthorized");

  if (isAuthPage) {
    return null;
  }

  const serviceLinks = [
    { name: "All HVAC Services", href: "/services", icon: Wrench },
    { name: "AC Repair & Diagnostic", href: "/services/ac-repair", icon: Snowflake },
    { name: "AC Tune-Up & Maintenance", href: "/services/ac-tuneup", icon: Wrench },
    { name: "Smart Thermostat Install", href: "/services/thermostat-install", icon: Flame },
    { name: "Air Duct Cleaning", href: "/services/duct-cleaning", icon: Wind },
    { name: "Refrigerant Recharge", href: "/services/refrigerant-recharge", icon: Snowflake },
    { name: "Furnace & Heating Repair", href: "/services/furnace-repair", icon: Flame },
    { name: "24/7 Emergency HVAC", href: "/services/emergency-hvac", icon: Flame },
    { name: "Commercial HVAC", href: "/services/commercial-hvac", icon: Wrench },
  ];

  const primaryNavLinks = [
    { name: "Service Areas", href: "/areas" },
    { name: "Reviews", href: "/reviews" },
    { name: "Specials", href: "/specials" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
  ];

  const cleanPhone = businessConfig.phone.replace(/\D/g, "");

  return (
    <div className="w-full">
      {/* MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
          {/* ZONE 1 (LEFT): Logo + 60-Min Arrival Guarantee Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-10 w-40 sm:w-44">
                <Image
                  src="/logo-placeholder.svg"
                  alt={businessConfig.businessName}
                  fill
                  priority
                  sizes="176px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <span className="hidden xl:inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              60-Min Arrival
            </span>
          </div>

          {/* ZONE 2 (CENTER): Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] font-semibold text-slate-700"
          >
            {/* Services Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((prev) => !prev)}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-navy-950 transition-colors py-2 ${
                  pathname?.startsWith("/services") ? "text-orange-500 font-bold" : ""
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Flyout Menu */}
              {servicesOpen && (
                <div className="absolute left-0 top-full pt-2 w-72 z-50">
                  <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        HVAC Services Catalog
                      </p>
                    </div>
                    {serviceLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setServicesOpen(false)}
                        className={`block rounded-xl px-3 py-2 text-xs transition-colors ${
                          pathname === item.href
                            ? "bg-orange-50 text-orange-600 font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-navy-950 font-medium"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/areas"
              className={`hover:text-navy-950 transition-colors ${
                pathname === "/areas" ? "text-orange-500 font-bold" : ""
              }`}
            >
              Service Areas
            </Link>

            <Link
              href="/reviews"
              className={`hover:text-navy-950 transition-colors ${
                pathname === "/reviews" ? "text-orange-500 font-bold" : ""
              }`}
            >
              Reviews
            </Link>

            <Link
              href="/specials"
              className={`hover:text-navy-950 transition-colors ${
                pathname === "/specials" ? "text-orange-500 font-bold" : ""
              }`}
            >
              Specials
            </Link>

            <Link
              href="/how-it-works"
              className={`hover:text-navy-950 transition-colors ${
                pathname === "/how-it-works" ? "text-orange-500 font-bold" : ""
              }`}
            >
              How It Works
            </Link>
          </nav>

          {/* ZONE 3 (RIGHT): Phone Hotline + Book Button + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-navy-950 hover:text-orange-600 transition-colors py-2 px-1"
            >
              <Phone className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-slate-400 font-normal">24/7 Dispatch:</span>
              <span className="font-extrabold">{businessConfig.phone}</span>
            </a>

            <Button
              asChild
              size="md"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 px-3.5 sm:px-5 py-2 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/book" className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Book Online</span>
              </Link>
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-xl text-navy-950 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER (below header) */}
        {mobileMenuOpen && (
          <div
            ref={mobileDrawerRef}
            className="lg:hidden border-t border-slate-200 bg-white shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top-4 duration-200"
          >
            <div className="p-4 sm:p-6 space-y-6">
              {/* Emergency Call Box for Mobile Users */}
              <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-500 text-navy-950 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block">
                      Emergency 24/7 Hotline
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-base font-black text-navy-950 hover:underline"
                    >
                      {businessConfig.phone}
                    </a>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                  Live Dispatch
                </span>
              </div>

              {/* Primary Mobile Navigation Links */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                  Main Menu
                </span>
                {primaryNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                      pathname === link.href
                        ? "bg-orange-50 text-orange-600"
                        : "text-navy-950 hover:bg-slate-50"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
              </div>

              {/* Services Submenu Grid */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between px-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Our HVAC Services
                  </span>
                  <Link
                    href="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {serviceLinks.slice(1).map((svc) => {
                    const Icon = svc.icon;
                    return (
                      <Link
                        key={svc.href}
                        href={svc.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 text-xs font-semibold transition-all ${
                          pathname === svc.href
                            ? "bg-orange-50 border-orange-200 text-orange-600 font-bold"
                            : "bg-slate-50/70 text-slate-800 hover:bg-slate-100 hover:text-navy-950"
                        }`}
                      >
                        <div className="h-6 w-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-orange-500 shrink-0">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate">{svc.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Customer Portal Shortcut */}
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl bg-slate-100 p-3.5 text-xs font-bold text-navy-950 hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="h-4 w-4 text-orange-500" />
                    <div>
                      <span className="block">Customer Portal</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Track live vans, view invoices, appointments
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>

              {/* Primary Full-Width CTA */}
              <div className="pt-2">
                <Button
                  asChild
                  className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black text-sm shadow-md"
                >
                  <Link
                    href="/book"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book Service Online (60-Min Arrival)</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
