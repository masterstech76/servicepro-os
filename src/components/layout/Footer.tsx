"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
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

  return (
    <footer className="bg-[#18181B] text-slate-400 pt-12 pb-8 px-4 sm:px-6 border-t border-slate-800">
      <div className="mx-auto max-w-7xl">
        {/* 4 COLUMNS EXACTLY MATCHING USER SPEC */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-10">
          {/* Column 1: Company */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">Company</h4>
            <div className="w-9 h-0.5 bg-orange-500 mt-2 mb-4" />
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Get Help */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">Get Help</h4>
            <div className="w-9 h-0.5 bg-orange-500 mt-2 mb-4" />
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms#guarantee" className="hover:text-white transition-colors">
                  Service Guarantee
                </Link>
              </li>
              <li>
                <Link href="/terms#refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Portal */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">Customer Portal</h4>
            <div className="w-9 h-0.5 bg-orange-500 mt-2 mb-4" />
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/appointments" className="hover:text-white transition-colors">
                  Appointments
                </Link>
              </li>
              <li>
                <Link href="/account/invoices" className="hover:text-white transition-colors">
                  Invoices
                </Link>
              </li>
              <li>
                <Link href="/account/support" className="hover:text-white transition-colors">
                  Support Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">Follow Us</h4>
            <div className="w-9 h-0.5 bg-orange-500 mt-2 mb-4" />
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full bg-slate-800 text-slate-300 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="h-9 w-9 rounded-full bg-slate-800 text-slate-300 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full bg-slate-800 text-slate-300 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-full bg-slate-800 text-slate-300 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM CLEAN COPYRIGHT */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {businessConfig.businessName} LLC. All rights reserved.
          </div>
          <div>
            State Licensed Mechanical Contractor • Bonded &amp; Insured
          </div>
        </div>
      </div>
    </footer>
  );
}
