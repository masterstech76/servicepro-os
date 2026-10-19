"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Calendar, ShieldCheck } from "lucide-react";
import { businessConfig } from "@config/business.config";

export function Footer() {
  const pathname = usePathname();

  // Hide global footer on dashboard, tech portal, and all auth pages
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

  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Areas", href: "/areas" },
    { label: "Reviews", href: "/reviews" },
    { label: "Specials", href: "/specials" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Guarantee", href: "/terms#guarantee" },
    { label: "Cancellation", href: "/terms#cancellation" },
    { label: "Refund", href: "/terms#refund" },
  ];

  return (
    <footer className="border-t border-slate-800 bg-[#0F172A] text-slate-400 py-6 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* ROW 1: Facebook-Style Dense Wrapping Links */}
        <nav
          aria-label="Footer links"
          className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs"
        >
          {navLinks.map((item, idx) => (
            <React.Fragment key={item.label}>
              <Link
                href={item.href}
                className="hover:text-white transition-colors py-0.5"
              >
                {item.label}
              </Link>
              {idx < navLinks.length - 1 && (
                <span className="text-slate-600 select-none">•</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* THIN DIVIDER LINE */}
        <div className="border-t border-slate-800/90" />

        {/* ROW 2: Utility & Dispatch Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} heavenlease.in</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
              <span>License #{businessConfig.licenseNumber}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>Bonded &amp; Insured</span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <a
              href={cleanPhoneHref}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-orange-400" />
              <span>{businessConfig.phone}</span>
            </a>
            <span className="text-slate-600">•</span>
            <Link
              href="/book"
              className="inline-flex items-center gap-1 font-bold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book Now &gt;</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
