"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Snowflake, ShieldCheck, MapPin, Clock, Phone } from "lucide-react";
import { businessConfig } from "@config/business.config";

export function Footer() {
  const pathname = usePathname();

  // Hide global footer on dashboard, tech portal, login, and dedicated booking wizard screens
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/tech") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/book")
  ) {
    return null;
  }

  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <footer className="border-t border-navy-800 bg-navy-900 text-slate-200 py-14 px-4 sm:px-6 text-sm">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2.5 font-heading font-bold text-white text-lg mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-navy-900">
              <Snowflake className="h-5 w-5" aria-hidden="true" />
            </div>
            <span>{businessConfig.businessName}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{businessConfig.seo.description}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200">
            <ShieldCheck className="h-4 w-4 text-orange-500" aria-hidden="true" />
            <span>State License #{businessConfig.licenseNumber}</span>
          </div>
        </div>

        <div>
          <h3 className="font-heading font-bold text-white text-base mb-3">
            Dispatch Center & Hours
          </h3>
          <div className="space-y-2 text-slate-300">
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-1" aria-hidden="true" />
              <span>{businessConfig.address}</span>
            </p>
            <p className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-orange-500 shrink-0 mt-1" aria-hidden="true" />
              <span>
                Mon–Fri 7:00 AM – 7:00 PM
                <br />
                Sat 8:00 AM – 4:00 PM • Sun Closed
              </span>
            </p>
            <p className="pt-1">
              <a
                href={cleanPhoneHref}
                className="inline-flex items-center gap-2 font-bold text-white hover:text-orange-500 transition-colors"
              >
                <Phone className="h-4 w-4 text-orange-500" aria-hidden="true" />
                <span>{businessConfig.phone}</span>
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:items-end justify-between">
          <div className="space-y-2 md:text-right">
            <h3 className="font-heading font-bold text-white text-base mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm text-slate-300">
              <Link href="/book" className="hover:text-white underline-offset-4 hover:underline">
                Book Service Online
              </Link>
              <Link href="/demo" className="hover:text-white underline-offset-4 hover:underline">
                Interactive Platform Demo (/demo)
              </Link>
              <Link href="/login" className="hover:text-white underline-offset-4 hover:underline">
                Staff & Technician Login (/login)
              </Link>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-6">
            © {new Date().getFullYear()} {businessConfig.businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
