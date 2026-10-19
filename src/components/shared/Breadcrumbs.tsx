import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 bg-[#FFF7ED]/50 border-b border-orange-100 text-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-slate-500 font-medium overflow-x-auto">
        <Link href="/" className="flex items-center gap-1 hover:text-[#EA580C] transition-colors shrink-0">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        {items.map((it, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            {it.href ? (
              <Link href={it.href} className="hover:text-[#EA580C] transition-colors shrink-0">
                {it.label}
              </Link>
            ) : (
              <span className="text-[#0F172A] font-bold shrink-0" aria-current="page">
                {it.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
