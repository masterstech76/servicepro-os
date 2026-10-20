"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Linkedin, Youtube, Send, Wrench } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = React.useState("");

  // Hide global footer on landing page (which renders its own standalone CLIM TECH footer), dashboard, tech portal, and all auth pages
  const isAuthPage =
    pathname === "/" ||
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("Thank you for subscribing to home care tips & offers!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#0B132B] text-slate-300 pt-16 pb-8 px-4 sm:px-6 border-t border-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
          {/* Col 1: Brand & Social (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading font-black text-lg text-white leading-tight">
                  ServicePro <span className="text-blue-500">OS</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
                  by TechWork
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400">
              Your home. Our priority.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Services (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/ac-repair" className="hover:text-white transition-colors">
                  Plumbing
                </Link>
              </li>
              <li>
                <Link href="/services/thermostat-install" className="hover:text-white transition-colors">
                  Electrical
                </Link>
              </li>
              <li>
                <Link href="/services/duct-cleaning" className="hover:text-white transition-colors">
                  Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/ac-tuneup" className="hover:text-white transition-colors">
                  Painting
                </Link>
              </li>
              <li>
                <Link href="/services/commercial-hvac" className="hover:text-white transition-colors">
                  Carpentry
                </Link>
              </li>
              <li>
                <Link href="/services/refrigerant-recharge" className="hover:text-white transition-colors">
                  Appliance Repair
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#team" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms#cancellation" className="hover:text-white transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/terms#refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Stay Updated (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">Stay Updated</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to get offers and home care tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-0 pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full h-10 px-3.5 text-xs text-navy-950 bg-white rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg flex items-center justify-center transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ServicePro OS by TechWork. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
