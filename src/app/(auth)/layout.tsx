import * as React from "react";
import Link from "next/link";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { businessConfig } from "@config/business.config";

export const metadata = {
  title: `Authentication | ${businessConfig.businessName}`,
  description: `Secure sign in and account management for ${businessConfig.businessName}.`,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between items-center relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Background ambient decorative effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top minimal brand link */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between z-10">
        <Link
          href="/"
          className="text-xs font-bold text-slate-500 hover:text-navy-950 transition-colors flex items-center gap-1.5"
        >
          <span>← Back to {businessConfig.businessName}</span>
        </Link>
        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          Commercial &amp; Residential HVAC Field Service
        </div>
      </header>

      {/* Main Split Body: Instagram Style */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 flex items-center justify-center">
        <div className="w-full flex items-center justify-center gap-10 lg:gap-14 xl:gap-20">
          {/* Left Column: Animated Smartphone Mockup (Desktop Only) */}
          <aside
            aria-label="App features preview"
            className="hidden lg:flex items-center justify-center shrink-0"
          >
            <AuthShowcase />
          </aside>

          {/* Right Column: Main Details Features for User Input */}
          <section
            aria-label="User authentication details"
            className="w-full max-w-md shrink-0 flex justify-center"
          >
            {children}
          </section>
        </div>
      </main>

      {/* Minimal Bottom Bar */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 z-10">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <span>© {new Date().getFullYear()} {businessConfig.legalName}</span>
          <span>•</span>
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-slate-600 transition-colors">
            Support Desk
          </Link>
        </div>
      </footer>
    </div>
  );
}
