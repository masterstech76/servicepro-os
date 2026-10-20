/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Truck,
  CreditCard,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Play,
  Check,
  CheckCircle2,
  Star,
  Menu,
  X,
  Zap,
  Snowflake,
  Wrench,
} from "lucide-react";

export default function ServiceProLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedServiceStep, setSelectedServiceStep] = useState<"hvac" | "plumbing" | "electrical">("hvac");

  // Quick Trial Form state
  const [trialForm, setTrialForm] = useState({
    companyName: "",
    email: "",
    trade: "HVAC",
  });
  const [trialSubmitted, setTrialSubmitted] = useState(false);

  function handleTrialSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trialForm.email) return;
    setTrialSubmitted(true);
    setTimeout(() => {
      setTrialSubmitted(false);
      setTrialModalOpen(false);
    }, 2200);
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER / NAVBAR
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0c1524]/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ServicePro <span className="text-orange-500">OS</span>
            </span>
          </Link>

          {/* Desktop Nav Links (Exact 5 items matching the mock) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#industries" className="hover:text-white transition-colors">Industries</a>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/faq" className="hover:text-white transition-colors">Resources</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </nav>

          {/* Nav Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="border border-slate-700 hover:border-slate-500 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Login
            </Link>
            <button
              onClick={() => setTrialModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#09101c] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white text-base font-medium"
            >
              Features
            </a>
            <a
              href="#industries"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white text-base font-medium"
            >
              Industries
            </a>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white text-base font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white text-base font-medium"
            >
              Resources
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white text-base font-medium"
            >
              About
            </Link>
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-lg border border-slate-700 text-slate-200 font-medium"
              >
                Login
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTrialModalOpen(true);
                }}
                className="w-full text-center py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md shadow-orange-500/25"
              >
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0c1524] text-white pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold tracking-wider text-xs uppercase mb-5">
                <span>FIELD SERVICE MANAGEMENT &amp; DISPATCH</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                The operating system<br />
                for <span className="text-orange-500">field service.</span>
              </h1>

              <p className="text-lg sm:text-xl font-semibold text-slate-200 mt-5">
                Book it. Dispatch it. Invoice it. All in one place.
              </p>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-2.5 max-w-xl">
                ServicePro OS helps HVAC, plumbing and electrical companies run smoother, serve customers better and grow faster — with one powerful, easy-to-use platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8">
                <button
                  onClick={() => setTrialModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all cursor-pointer group"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="border border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-white font-medium px-5 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Badges / Guarantees */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-6 mt-7 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>Setup in minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>White-label ready</span>
                </div>
              </div>
            </div>

            {/* Right Mockup Graphic (Using user's high-res asset with zero cut-off) */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/70 border border-slate-700/60 group">
                <img
                  src="/images/servicepro-hero-device.jpg"
                  alt="ServicePro OS field technician dispatch dashboard and mobile app"
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FIVE PILLARS / KEY CAPABILITIES ROW
      ───────────────────────────────────────────────────────────── */}
      <section id="features" className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            
            {/* Pillar 1 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 mb-4 group-hover:border-orange-500/50 group-hover:text-orange-600 transition-colors">
                <Calendar className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Online Booking</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Let customers book 24/7 with a simple, 7-step wizard.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 mb-4 group-hover:border-orange-500/50 group-hover:text-orange-600 transition-colors">
                <Truck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Smart Dispatch</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                AI-powered technician assignment and live tracking.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 mb-4 group-hover:border-orange-500/50 group-hover:text-orange-600 transition-colors">
                <CreditCard className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Invoicing &amp; Payments</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Automated invoices, multiple payment options, and tax handling.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 mb-4 group-hover:border-orange-500/50 group-hover:text-orange-600 transition-colors">
                <Smartphone className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Technician PWA</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Mobile-first job flow with GPS, photos and digital signatures.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 mb-4 group-hover:border-orange-500/50 group-hover:text-orange-600 transition-colors">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Secure &amp; Compliant</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Built with enterprise-grade security and full audit logs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. "HOW IT WORKS: From first click to final payment."
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-slate-50/70 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Header */}
            <div className="lg:col-span-4">
              <span className="text-orange-600 font-bold text-xs uppercase tracking-wider block mb-2">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                From first click<br />
                to final payment.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
                ServicePro OS simplifies every step of the field service process — so you can focus on what matters most: your customers.
              </p>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-3 rounded-lg shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition-all cursor-pointer"
              >
                <span>See It In Action</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right 4-Step Interactive Flow */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-4 relative">
                
                {/* STEP 1: Book */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-3">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                      <div className="w-4 h-4 rounded bg-orange-500 flex items-center justify-center text-[9px] text-white font-bold">S</div>
                      <span className="text-[11px] font-bold text-slate-800">ServicePro OS</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 mb-2">Select Service</div>
                    
                    {/* Interactive service buttons */}
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setSelectedServiceStep("hvac")}
                        className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                          selectedServiceStep === "hvac"
                            ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        <span className="flex items-center gap-1.5"><Snowflake className="w-3 h-3 text-sky-500" /> HVAC Service</span>
                        {selectedServiceStep === "hvac" && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                      <button
                        onClick={() => setSelectedServiceStep("plumbing")}
                        className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                          selectedServiceStep === "plumbing"
                            ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        <span className="flex items-center gap-1.5"><Wrench className="w-3 h-3 text-slate-600" /> Plumbing Service</span>
                        {selectedServiceStep === "plumbing" && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                      <button
                        onClick={() => setSelectedServiceStep("electrical")}
                        className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                          selectedServiceStep === "electrical"
                            ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-500" /> Electrical Service</span>
                        {selectedServiceStep === "electrical" && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">1. Book</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Customer selects a service, zip code and preferred time.
                    </p>
                  </div>
                </div>

                {/* STEP 2: Dispatch */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Optimal Technician</div>
                    
                    <div className="flex items-center gap-2.5 bg-white p-2 rounded-md border border-slate-200 mb-2.5">
                      <img src="/images/avatar-1.jpg" alt="John D. technician" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">John D.</div>
                        <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">92% match</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[10px] text-slate-600">
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-3 h-3" /> <span>Skills match</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-3 h-3" /> <span>In coverage area</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-3 h-3" /> <span>Available now</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-3 h-3" /> <span>Low travel time</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">2. Dispatch</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Our engine finds the best technician in seconds.
                    </p>
                  </div>
                </div>

                {/* STEP 3: Complete (Using user-provided crisp trade image with NO cutting) */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="rounded-lg overflow-hidden border border-slate-100 mb-3 aspect-[4/3] bg-slate-100">
                    <img
                      src="/images/trade-user-2.png"
                      alt="Service technician on site completing field work"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">3. Complete</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Tech arrives, does the work, adds photos and parts.
                    </p>
                  </div>
                </div>

                {/* STEP 4: Get Paid */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-3 text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Payment Received</div>
                    <div className="text-2xl font-extrabold text-slate-900 my-0.5">$248.00</div>
                    <div className="text-[10px] text-blue-600 font-medium underline mb-2 cursor-pointer">View Invoice</div>
                    
                    <div className="text-[10px] text-slate-500 bg-white border border-slate-200 py-1 px-2 rounded flex items-center justify-center gap-1.5">
                      <CreditCard className="w-3 h-3 text-slate-400" />
                      <span>Paid with card •••• 4242</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">4. Get Paid</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Secure payments, automatic invoicing, happy customers.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. "BUILT FOR REAL BUSINESSES: Trusted by service companies across multiple trades."
             (Horizontal 2-Column layout matching the exact mockup in media_1792497823670_82a1ad87.jpg)
      ───────────────────────────────────────────────────────────── */}
      <section id="industries" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & description */}
            <div className="lg:col-span-4">
              <span className="text-orange-600 font-bold text-xs uppercase tracking-wider block mb-2">
                BUILT FOR REAL BUSINESSES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Trusted by service companies across multiple trades.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
                Whether you&apos;re a 2-person team or a 20-person operation, ServicePro OS scales with your business.
              </p>
            </div>

            {/* Right Column: 3 Trade Cards Grid (Using user's uploaded images, 0 cutting artifacts) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Card 1: HVAC */}
              <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src="/images/trade-user-1.png"
                    alt="HVAC service technician inspecting unit"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-orange-500/15 text-orange-600 flex items-center justify-center">
                      <Snowflake className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">HVAC</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Repairs • Maintenance • Installations
                  </p>
                </div>
              </div>

              {/* Card 2: Plumbing */}
              <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src="/images/trade-user-2.png"
                    alt="Plumbing service technician working on site"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-orange-500/15 text-orange-600 flex items-center justify-center">
                      <Wrench className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Plumbing</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Repairs • Drain Cleaning • Installations
                  </p>
                </div>
              </div>

              {/* Card 3: Electrical */}
              <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src="/images/trade-user-3.png"
                    alt="Electrical service technician on site"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-orange-500/15 text-orange-600 flex items-center justify-center">
                      <Zap className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Electrical</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Repairs • Upgrades • Installations
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. "Proven results for growing businesses." (STATS BANNER)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="bg-[#0c1829] rounded-2xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Proven results<br />
                for growing businesses.
              </h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-sm">
                ServicePro OS helps you save time, get more jobs and increase revenue — all with one platform.
              </p>
            </div>

            {/* Right 4 Stats Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-8">
              
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-orange-500">50%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Less time on administrative work
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-orange-500">30%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  More jobs per technician
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-orange-500">20%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Increase in revenue
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-orange-500">99.9%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  System uptime
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. "WHAT OUR CUSTOMERS SAY: Real businesses. Real results."
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <span className="text-orange-600 font-bold text-xs uppercase tracking-wider block mb-2">
              WHAT OUR CUSTOMERS SAY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real businesses. Real results.
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            
            {/* Card 1: Mike Thompson */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                &ldquo;ServicePro OS has completely changed how we run our business. The dispatch and booking system is a game changer.&rdquo;
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src="/images/avatar-1.jpg"
                  alt="Mike Thompson"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Mike Thompson</h4>
                  <p className="text-xs text-slate-500">Owner, Thompson HVAC</p>
                  <div className="flex items-center text-orange-500 gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-orange-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Sarah Lopez */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                &ldquo;The technician app is simple and powerful. Our team loves it, and our customers love the real-time updates.&rdquo;
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src="/images/avatar-2.jpg"
                  alt="Sarah Lopez"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sarah Lopez</h4>
                  <p className="text-xs text-slate-500">Owner, Lopez Plumbing</p>
                  <div className="flex items-center text-orange-500 gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-orange-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: David Kim */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                &ldquo;We went from chaos to control. Everything is in one place — jobs, customers, payments, reports. Highly recommend!&rdquo;
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src="/images/avatar-3.jpg"
                  alt="David Kim"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">David Kim</h4>
                  <p className="text-xs text-slate-500">Owner, Kim Electrical</p>
                  <div className="flex items-center text-orange-500 gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-orange-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. BOTTOM CALL TO ACTION BANNER (FULL WIDTH, EXACT TO MOCKUP)
             (The page concludes here as shown in the design image)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#071920] overflow-hidden border-t border-slate-800">
        {/* Suburban residential house photo on the right half with smooth gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none">
          <img
            src="/images/cta-suburban-home.jpg"
            alt="Residential suburban home serviced by ServicePro OS"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071920] via-[#071920]/80 to-transparent sm:block hidden" />
          <div className="absolute inset-0 bg-[#071920]/85 sm:hidden block" />
        </div>

        {/* Content on the left */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-xl">
            <span className="text-orange-400 font-bold text-xs uppercase tracking-wider block mb-2">
              GET STARTED TODAY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to streamline your field service business?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Join hundreds of service companies already using ServicePro OS.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8">
              <button
                onClick={() => setTrialModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all cursor-pointer group"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setDemoModalOpen(true)}
                className="border border-slate-600 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-400 text-white font-medium px-5 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Book a Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Subtle, minimal 1-line copyright bar aligned with the mock's clean finish */}
        <div className="relative z-10 border-t border-slate-800/60 bg-[#051116] py-4 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ServicePro OS by TechWork. All rights reserved.
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. INTERACTIVE WATCH DEMO MODAL
      ───────────────────────────────────────────────────────────── */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b1524] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white relative shadow-2xl">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Play className="w-3.5 h-3.5 fill-orange-500" />
              <span>Interactive Platform Tour</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Experience ServicePro OS Live
            </h3>
            <p className="text-slate-300 text-sm mb-6">
              Select one of the pre-configured live portals to test out the dispatcher board, online booking engine, or technician mobile PWA:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <Link
                href="/admin/dispatch"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/50 p-4 rounded-xl text-center group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-orange-400">Dispatch Board</div>
                <div className="text-[11px] text-slate-400 mt-1">Live drag-and-drop schedule</div>
              </Link>

              <Link
                href="/book"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/50 p-4 rounded-xl text-center group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-orange-400">Online Booking</div>
                <div className="text-[11px] text-slate-400 mt-1">7-step customer self-serve</div>
              </Link>

              <Link
                href="/tech"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/50 p-4 rounded-xl text-center group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-orange-400">Technician PWA</div>
                <div className="text-[11px] text-slate-400 mt-1">Mobile field execution app</div>
              </Link>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setDemoModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDemoModalOpen(false);
                  setTrialModalOpen(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          10. START FREE TRIAL MODAL
      ───────────────────────────────────────────────────────────── */}
      {trialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b1524] border border-slate-700 rounded-2xl max-w-md w-full p-6 sm:p-8 text-white relative shadow-2xl">
            <button
              onClick={() => setTrialModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="inline-block px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 font-bold text-xs uppercase mb-3">
              14-Day Full Access Trial
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              Start Free Trial
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              No credit card required. Set up your company in less than 3 minutes.
            </p>

            {trialSubmitted ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 p-6 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Your Trial Account is Ready!</h4>
                <p className="text-xs text-slate-300">
                  We sent your workspace login credentials to <span className="font-semibold text-white">{trialForm.email}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Heating & Air"
                    value={trialForm.companyName}
                    onChange={(e) => setTrialForm({ ...trialForm, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={trialForm.email}
                    onChange={(e) => setTrialForm({ ...trialForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Trade</label>
                  <select
                    value={trialForm.trade}
                    onChange={(e) => setTrialForm({ ...trialForm, trade: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="HVAC">HVAC &amp; Air Conditioning</option>
                    <option value="Plumbing">Plumbing &amp; Drains</option>
                    <option value="Electrical">Electrical Services</option>
                    <option value="Multi-Trade">Multi-Trade Operation</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    Create My Free Trial
                  </button>
                </div>

                <div className="text-center text-[11px] text-slate-500 pt-1">
                  By clicking, you agree to our Terms of Service &amp; Privacy Policy.
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
