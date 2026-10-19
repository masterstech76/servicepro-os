"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Phone,
  Calendar,
  User,
  ChevronDown,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();

  // Hide global navbar on dashboard, tech portal, and login screens
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/tech") ||
    pathname?.startsWith("/login")
  ) {
    return null;
  }

  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="w-full">
      {/* 1. TOP BLACK UTILITY BAR */}
      <div className="bg-[#090D1A] text-white text-[11px] sm:text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 font-medium tracking-wide">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span>Licensed &amp; Insured</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">CA HVAC License #CAC1819420</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="h-3 w-3 text-blue-400" />
              <span>24/7 Emergency Service</span>
            </span>
            <a
              href={cleanPhoneHref}
              className="flex items-center gap-1 font-bold text-white hover:text-blue-400 transition-colors"
            >
              <span className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px]">
                📞
              </span>
              <span>(888) 555-0198</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN WHITE NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
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
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Home
            </Link>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-slate-900 transition-colors">
              <Link href="/#services">Services</Link>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" />
            </div>
            <Link href="/#about-us" className="hover:text-slate-900 transition-colors">
              About Us
            </Link>
            <Link href="/#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </Link>
            <Link href="/#reviews" className="hover:text-slate-900 transition-colors">
              Reviews
            </Link>
            <Link href="/#specials" className="hover:text-slate-900 transition-colors">
              Specials
            </Link>
            <Link href="/#contact" className="hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <User className="h-4 w-4 text-slate-600" />
              <span>Staff Sign In</span>
            </Link>
            <Button
              asChild
              size="md"
              className="rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 py-2.5 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
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
