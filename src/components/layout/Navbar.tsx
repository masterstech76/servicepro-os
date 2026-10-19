"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronDown,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
    { name: "All HVAC Services", href: "/services" },
    { name: "AC Repair & Diagnostic", href: "/services/ac-repair" },
    { name: "AC Tune-Up & Maintenance", href: "/services/ac-tuneup" },
    { name: "Thermostat Installation", href: "/services/thermostat-install" },
    { name: "Air Duct Cleaning", href: "/services/duct-cleaning" },
    { name: "Refrigerant Recharge", href: "/services/refrigerant-recharge" },
    { name: "Furnace & Heating Repair", href: "/services/furnace-repair" },
    { name: "24/7 Emergency HVAC", href: "/services/emergency-hvac" },
    { name: "Commercial HVAC", href: "/services/commercial-hvac" },
  ];

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
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <span className="hidden xl:inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              60-Min Arrival
            </span>
          </div>

          {/* ZONE 2 (CENTER): 5 Clean Navigation Links with Featured Services Dropdown */}
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
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Featured Services
                    </span>
                  </div>
                  {serviceLinks.map((s, idx) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className={`block px-4 py-2 text-xs font-semibold transition-colors ${
                        idx === 0
                          ? "bg-orange-50 text-orange-600 font-bold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-navy-950"
                      }`}
                      onClick={() => setServicesOpen(false)}
                    >
                      {s.name}
                    </Link>
                  ))}
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

          {/* ZONE 3 (RIGHT): Direct Phone Call + Primary Book Online Button */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-navy-950 hover:text-orange-600 transition-colors py-2 px-1"
            >
              <span className="text-slate-400 font-normal">24/7 Dispatch:</span>
              <span className="font-extrabold">{businessConfig.phone}</span>
            </a>

            <Button
              asChild
              size="md"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 px-4 sm:px-5 py-2 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/book" className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Book Online</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
