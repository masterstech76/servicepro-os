"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Snowflake, ArrowRight } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { PhoneLink } from "@/components/shared/PhoneLink";

export function Navbar() {
  const pathname = usePathname();

  // Hide global navbar on dashboard, tech portal, login, and dedicated booking wizard screens
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/tech") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/book")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading font-bold text-lg sm:text-xl text-navy-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 rounded-xl"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-orange-500 shadow-md">
            <Snowflake className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight tracking-tight">{businessConfig.businessName}</span>
            <span className="text-[11px] font-sans font-semibold text-navy-700">
              {businessConfig.city}, {businessConfig.state} • Lic #{businessConfig.licenseNumber}
            </span>
          </div>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-navy-700"
        >
          <Link href="/#services" className="hover:text-navy-900 transition-colors">
            Services & Pricing
          </Link>
          <Link href="/#why-us" className="hover:text-navy-900 transition-colors">
            Why Choose Us
          </Link>
          <Link href="/#how-it-works" className="hover:text-navy-900 transition-colors">
            How It Works
          </Link>
          <Link href="/#reviews" className="hover:text-navy-900 transition-colors">
            Reviews
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-navy-900 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500"
          >
            Staff Sign In
          </Link>
          <Button
            asChild
            size="sm"
            className="rounded-xl px-5 font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/book">
              <span>Book Online</span>
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
