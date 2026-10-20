import React from "react";
import Link from "next/link";
import { Compass, CalendarCheck, Home } from "lucide-react";
import { businessConfig } from "@config/business.config";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">
          The page you are looking for does not exist or has moved. Need immediate assistance from{" "}
          <span className="font-semibold text-slate-900">{businessConfig.businessName}</span>? Call{" "}
          <a href={`tel:${businessConfig.phone.replace(/\D/g, "")}`} className="font-semibold underline">
            {businessConfig.phone}
          </a>
          .
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/book"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#F97316] px-4 text-sm font-bold text-[#0F172A] hover:bg-[#EA580C]"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Service
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
