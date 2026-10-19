"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Snowflake, Phone, ShieldCheck } from "lucide-react";
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

  return (
    <footer className="border-t border-slate-800 bg-[#0F172A] text-slate-300 pt-10 pb-8 px-4 sm:px-6 text-sm">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Brand Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5 font-heading font-black text-xl text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F97316] text-[#0F172A]">
              <Snowflake className="h-5 w-5" />
            </div>
            <span>{businessConfig.businessName}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">
              Emergency Dispatch &amp; Support:
            </span>
            <a
              href={cleanPhoneHref}
              className="inline-flex items-center gap-1.5 font-bold text-white hover:text-orange-400 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-[#F97316]" />
              <span>{businessConfig.phone}</span>
            </a>
          </div>
        </div>

        {/* LAYER 1: TRUST CARDS STRIP (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <span className="font-bold text-sm">4.9★</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Top-Rated Service</div>
              <div className="text-[11px] text-slate-400">1,200+ Verified Homeowner Reviews</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Licensed &amp; Insured</div>
              <div className="text-[11px] text-slate-400">State Mechanical Lic #{businessConfig.licenseNumber}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <span className="font-black text-xs">100%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Service Guarantee</div>
              <div className="text-[11px] text-slate-400">Fixed Right or 100% Diagnostic Refund</div>
            </div>
          </div>
        </div>

        {/* LAYER 2: The 4 Category Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Category 1: Company */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              1. Company
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/areas"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Service Areas
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Category 2: Help & Support */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              2. Help &amp; Support
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Help Center / FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms#guarantee"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Service Guarantee
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Report a Problem
                </Link>
              </li>
            </ul>
          </div>

          {/* Category 3: Customer Account */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              3. Customer Account
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/account"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Book a Service
                </Link>
              </li>
              <li>
                <Link
                  href="/account/appointments"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  My Appointments
                </Link>
              </li>
              <li>
                <Link
                  href="/account/invoices"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Payments &amp; Invoices
                </Link>
              </li>
            </ul>
          </div>

          {/* Category 4: Legal & Policies */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              4. Legal &amp; Policies
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/terms#cancellation"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms#refunds"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Payment &amp; Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} {businessConfig.legalName}. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-[#F97316]" />
            <span>State HVAC License #{businessConfig.licenseNumber} • Certified &amp; Insured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
