"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShieldCheck, MapPin, Clock, Phone, Mail, ArrowRight } from "lucide-react";
import { businessConfig } from "@config/business.config";

export function Footer() {
  const pathname = usePathname();

  // Hide global footer on dashboard, tech portal, and login screens
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/tech") ||
    pathname?.startsWith("/login")
  ) {
    return null;
  }

  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <footer className="border-t border-slate-800 bg-[#071633] text-slate-300 pt-16 pb-32 sm:pb-28 px-4 sm:px-6 text-sm">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
        {/* Col 1: Brand & License */}
        <div className="space-y-4">
          <div className="relative h-10 w-44">
            <Image
              src="/logo-placeholder.svg"
              alt="TechWork Service Pro OS"
              fill
              className="object-contain object-left brightness-200"
            />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            Commercial &amp; residential HVAC service platform. Fast dispatch, flat-rate pricing, and certified technicians across California.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-200">
            <ShieldCheck className="h-4 w-4 text-[#08BDEB]" aria-hidden="true" />
            <span>CA License #{businessConfig.licenseNumber}</span>
          </div>
        </div>

        {/* Col 2: Services */}
        <div>
          <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
            Services
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/book?serviceId=svc-ac-repair" className="hover:text-white transition-colors">
                AC Repair &amp; Troubleshooting
              </Link>
            </li>
            <li>
              <Link href="/book?serviceId=svc-ac-tuneup" className="hover:text-white transition-colors">
                AC Tune-Up &amp; Maintenance
              </Link>
            </li>
            <li>
              <Link href="/book?serviceId=svc-thermostat-install" className="hover:text-white transition-colors">
                Smart Thermostat Installation
              </Link>
            </li>
            <li>
              <Link href="/book?serviceId=svc-furnace-repair" className="hover:text-white transition-colors">
                Furnace &amp; Heating Repair
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-white transition-colors">
                24/7 Emergency Dispatch
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Company & Resources */}
        <div>
          <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
            Company
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/#about-us" className="hover:text-white transition-colors">
                About TechWork
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="hover:text-white transition-colors">
                How Online Booking Works
              </Link>
            </li>
            <li>
              <Link href="/#reviews" className="hover:text-white transition-colors">
                Verified Reviews
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Staff &amp; Technician Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Dispatch Center & Hours */}
        <div>
          <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
            Dispatch Center
          </h3>
          <div className="space-y-2.5 text-xs text-slate-400">
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-[#08BDEB] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{businessConfig.address}</span>
            </p>
            <p className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-[#08BDEB] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Mon–Fri 7:00 AM – 7:00 PM
                <br />
                Sat 8:00 AM – 4:00 PM • 24/7 Emergency
              </span>
            </p>
            <p className="pt-2">
              <a
                href={cleanPhoneHref}
                className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#08BDEB] transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-[#08BDEB]" />
                <span>{businessConfig.phone}</span>
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} {businessConfig.legalName}. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-slate-400">
            Privacy Policy
          </Link>
          <Link href="/" className="hover:text-slate-400">
            Terms of Service
          </Link>
          <Link href="/" className="hover:text-slate-400">
            Accessibility
          </Link>
        </div>
      </div>
    </footer>
  );
}
