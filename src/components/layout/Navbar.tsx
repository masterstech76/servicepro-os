"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Calendar,
  User,
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-10 w-44">
              <Image
                src="/logo-placeholder.svg"
                alt="TechWork Service Pro OS"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-slate-700"
          >
            <Link
              href="/"
              className={`hover:text-slate-900 transition-colors ${
                pathname === "/" ? "text-orange-500 font-bold" : ""
              }`}
            >
              Home
            </Link>

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
                className={`flex items-center gap-1 hover:text-slate-900 transition-colors py-2 ${
                  pathname?.startsWith("/services") ? "text-orange-500 font-bold" : ""
                }`}
              >
                <span>Services</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {serviceLinks.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`hover:text-slate-900 transition-colors ${
                pathname === "/about" ? "text-orange-500 font-bold" : ""
              }`}
            >
              About Us
            </Link>
            <Link
              href="/how-it-works"
              className={`hover:text-slate-900 transition-colors ${
                pathname === "/how-it-works" ? "text-orange-500 font-bold" : ""
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/reviews"
              className={`hover:text-slate-900 transition-colors ${
                pathname === "/reviews" ? "text-orange-500 font-bold" : ""
              }`}
            >
              Reviews
            </Link>
            <Link
              href="/specials"
              className={`hover:text-slate-900 transition-colors ${
                pathname === "/specials" ? "text-orange-500 font-bold" : ""
              }`}
            >
              Specials
            </Link>
            <Link
              href="/areas"
              className={`hover:text-slate-900 transition-colors ${
                pathname === "/areas" ? "text-orange-500 font-bold" : ""
              }`}
            >
              Service Areas
            </Link>
            <Link
              href="/contact"
              className={`hover:text-slate-900 transition-colors ${
                pathname === "/contact" ? "text-orange-500 font-bold" : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <User className="h-4 w-4 text-slate-600" />
              <span>Sign In</span>
            </Link>
            <Button
              asChild
              size="md"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 px-5 py-2.5 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/book" className="flex items-center gap-2">
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
