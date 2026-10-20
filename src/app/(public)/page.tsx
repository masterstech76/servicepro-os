/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
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
  const [selectedWorkflowService, setSelectedWorkflowService] = useState<"hvac" | "plumbing" | "electrical">("hvac");

  // Free Trial Form State
  const [trialForm, setTrialForm] = useState({
    companyName: "",
    email: "",
    trade: "HVAC",
  });
  const [trialSubmitted, setTrialSubmitted] = useState(false);

  // Close modals & menus on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setDemoModalOpen(false);
        setTrialModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleTrialSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trialForm.email) return;
    setTrialSubmitted(true);
    setTimeout(() => {
      setTrialSubmitted(false);
      setTrialModalOpen(false);
    }, 2400);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased selection:bg-[#F97316] selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. MAIN NAVIGATION (GLASSMORPHISM UI)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-lg shadow-[#F97316]/25 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ServicePro <span className="text-[#F97316]">OS</span>
            </span>
          </Link>

          {/* Center Navigation: Features, Industries, Pricing, Resources, About */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#industries" className="hover:text-white transition-colors">Industries</a>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/faq" className="hover:text-white transition-colors">Resources</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-all"
            >
              Login
            </Link>
            <button
              onClick={() => setTrialModalOpen(true)}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-md shadow-[#F97316]/25 hover:shadow-[#F97316]/40 transition-all cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-[#0F172A]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
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
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-lg border border-white/15 bg-white/5 text-slate-200 font-medium"
              >
                Login
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTrialModalOpen(true);
                }}
                className="w-full text-center py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold shadow-md shadow-[#F97316]/25"
              >
                Get Started Free
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (GLASSMORPHISM ATMOSPHERE)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0F172A] text-white pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-[#1E293B]">
        {/* Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] font-bold tracking-wider text-xs uppercase mb-5 backdrop-blur-md">
                <span>FIELD SERVICE MANAGEMENT &amp; DISPATCH</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                The operating system<br />
                for <span className="text-[#F97316]">field service.</span>
              </h1>

              <p className="text-lg sm:text-xl font-semibold text-slate-200 mt-5">
                Book it. Dispatch it. Invoice it. All in one place.
              </p>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-2.5 max-w-xl">
                ServicePro OS helps HVAC, plumbing and electrical companies run smoother, serve customers better and grow faster — with one powerful, easy-to-use platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8">
                <button
                  onClick={() => setTrialModalOpen(true)}
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#F97316]/30 hover:shadow-[#F97316]/50 transition-all cursor-pointer group"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium px-5 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2.5 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Supporting Checkmarks */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-6 mt-7 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  <span>Setup in minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  <span>White-label ready</span>
                </div>
              </div>
            </div>

            {/* Right Mockup Graphic */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 group bg-slate-900/50 backdrop-blur-sm">
                <img
                  src="/images/servicepro-hero-main.jpg"
                  alt="ServicePro OS field technician dispatch dashboard and mobile app"
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FIVE-FEATURE STRIP
      ───────────────────────────────────────────────────────────── */}
      <section id="features" className="bg-[#FFFFFF] border-b border-[#E2E8F0] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] mb-4 group-hover:border-[#F97316]/50 group-hover:text-[#F97316] transition-colors shadow-sm">
                <Calendar className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1.5">Online Booking</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Let customers book 24/7 with a simple, 7-step wizard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] mb-4 group-hover:border-[#F97316]/50 group-hover:text-[#F97316] transition-colors shadow-sm">
                <Truck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1.5">Smart Dispatch</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                AI-powered technician assignment and live tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] mb-4 group-hover:border-[#F97316]/50 group-hover:text-[#F97316] transition-colors shadow-sm">
                <CreditCard className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1.5">Invoicing &amp; Payments</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Automated invoices, multiple payment options, and tax handling.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] mb-4 group-hover:border-[#F97316]/50 group-hover:text-[#F97316] transition-colors shadow-sm">
                <Smartphone className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1.5">Technician PWA</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Mobile-first job flow with GPS, photos and digital signatures.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-start group">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] mb-4 group-hover:border-[#F97316]/50 group-hover:text-[#F97316] transition-colors shadow-sm">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1.5">Secure &amp; Compliant</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Built with enterprise-grade security and full audit logs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FOUR-STEP WORKFLOW SECTION: "From first click to final payment."
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Introduction */}
            <div className="lg:col-span-4">
              <span className="text-[#C2410C] font-bold text-xs uppercase tracking-wider block mb-2">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                From first click<br />
                to final payment.
              </h2>
              <p className="text-[#64748B] text-sm sm:text-base mt-4 leading-relaxed">
                ServicePro OS simplifies every step of the field service process — so you can focus on what matters most: your customers.
              </p>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm px-5 py-3 rounded-lg shadow-md shadow-[#F97316]/20 hover:shadow-[#F97316]/35 transition-all cursor-pointer"
              >
                <span>See It In Action</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right 4 Stages in Horizontal Progression */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-4 relative">
                
                {/* STEP 1: 1. Book */}
                <div className="flex flex-col justify-between">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 shadow-sm hover:shadow-md transition-shadow mb-3">
                    <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E2E8F0]">
                        <div className="w-4 h-4 rounded bg-[#F97316] flex items-center justify-center text-[9px] text-white font-bold">S</div>
                        <span className="text-[11px] font-bold text-[#0F172A]">ServicePro OS</span>
                      </div>
                      <div className="text-[11px] font-medium text-[#64748B] mb-2">Select Service</div>
                      
                      <div className="space-y-1.5">
                        <button
                          onClick={() => setSelectedWorkflowService("hvac")}
                          className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                            selectedWorkflowService === "hvac"
                              ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                              : "bg-white text-slate-700 border border-slate-200"
                          }`}
                        >
                          <span className="flex items-center gap-1.5"><Snowflake className="w-3 h-3 text-sky-500" /> HVAC Service</span>
                          {selectedWorkflowService === "hvac" && <Check className="w-3 h-3 text-blue-600" />}
                        </button>
                        <button
                          onClick={() => setSelectedWorkflowService("plumbing")}
                          className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                            selectedWorkflowService === "plumbing"
                              ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                              : "bg-white text-slate-700 border border-slate-200"
                          }`}
                        >
                          <span className="flex items-center gap-1.5"><Wrench className="w-3 h-3 text-slate-600" /> Plumbing Service</span>
                          {selectedWorkflowService === "plumbing" && <Check className="w-3 h-3 text-blue-600" />}
                        </button>
                        <button
                          onClick={() => setSelectedWorkflowService("electrical")}
                          className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                            selectedWorkflowService === "electrical"
                              ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                              : "bg-white text-slate-700 border border-slate-200"
                          }`}
                        >
                          <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-500" /> Electrical Service</span>
                          {selectedWorkflowService === "electrical" && <Check className="w-3 h-3 text-blue-600" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">1. Book</h3>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      Customer selects a service, zip code and preferred time.
                    </p>
                  </div>
                </div>

                {/* STEP 2: 2. Dispatch */}
                <div className="flex flex-col justify-between">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 shadow-sm hover:shadow-md transition-shadow mb-3">
                    <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2">Optimal Technician</div>
                      
                      <div className="flex items-center gap-2.5 bg-white p-2 rounded-md border border-[#E2E8F0] mb-2">
                        <img src="/images/avatar-mike.jpg" alt="John D. technician" className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-[#0F172A]">John D.</div>
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
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">2. Dispatch</h3>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      Our engine finds the best eligible technician for the job.
                    </p>
                  </div>
                </div>

                {/* STEP 3: 3. Complete */}
                <div className="flex flex-col justify-between">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-2 shadow-sm hover:shadow-md transition-shadow mb-3">
                    <div className="rounded-lg overflow-hidden border border-[#E2E8F0] aspect-[4/3] bg-slate-100">
                      <img
                        src="/images/step3-technician.jpg"
                        alt="Service technician on site completing work"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">3. Complete</h3>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      Tech arrives, does the work, adds photos and parts.
                    </p>
                  </div>
                </div>

                {/* STEP 4: 4. Get Paid */}
                <div className="flex flex-col justify-between">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-3.5 shadow-sm hover:shadow-md transition-shadow mb-3 text-center">
                    <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto mb-1.5">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="text-[11px] text-[#64748B] font-medium">Payment Received</div>
                      <div className="text-2xl font-extrabold text-[#0F172A] my-0.5">$248.00</div>
                      <div className="text-[10px] text-blue-600 font-medium underline mb-2 cursor-pointer">View Invoice</div>
                      
                      <div className="text-[10px] text-[#64748B] bg-white border border-[#E2E8F0] py-1 px-2 rounded flex items-center justify-center gap-1.5">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        <span>Paid with card •••• 4242</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">4. Get Paid</h3>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
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
          5. THREE-INDUSTRY SOLUTIONS (SIDE-BY-SIDE LAYOUT EXACT TO REFERENCE)
      ───────────────────────────────────────────────────────────── */}
      <section id="industries" className="py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Header Content */}
            <div className="lg:col-span-4">
              <span className="text-[#C2410C] font-bold text-xs uppercase tracking-wider block mb-2">
                BUILT FOR REAL BUSINESSES
              </span>
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Trusted by service companies<br />across multiple trades.
              </h2>
              <p className="text-[#64748B] text-sm mt-3 leading-relaxed">
                Whether you&apos;re a 2-person team or a 20-person operation, ServicePro OS scales with your business.
              </p>
            </div>

            {/* Right 3 Trade Cards Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Card 1: HVAC */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="/images/trade-hvac.jpg"
                    alt="HVAC technician servicing outdoor residential air-conditioning condenser"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center text-white text-xs">
                      <Snowflake className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A]">HVAC</h3>
                  </div>
                  <p className="text-[11px] font-medium text-[#64748B]">
                    Repairs · Maintenance · Installations
                  </p>
                </div>
              </div>

              {/* Card 2: Plumbing */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="/images/trade-plumbing.jpg"
                    alt="Plumbing technician repairing pipes and drainage"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center text-white text-xs">
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A]">Plumbing</h3>
                  </div>
                  <p className="text-[11px] font-medium text-[#64748B]">
                    Repairs · Drain Cleaning · Installations
                  </p>
                </div>
              </div>

              {/* Card 3: Electrical */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="/images/trade-electrical.jpg"
                    alt="Electrician servicing an electrical breaker panel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center text-white text-xs">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A]">Electrical</h3>
                  </div>
                  <p className="text-[11px] font-medium text-[#64748B]">
                    Repairs · Upgrades · Installations
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. RESULTS AND BUSINESS BENEFITS BAND ("Proven results for growing businesses.")
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-12 text-white shadow-2xl border border-white/5 relative overflow-hidden">
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

            {/* Right 4 Metrics with Subtle Separators */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#334155] lg:pl-8">
              
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316]">50%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Less time on administrative work
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316]">30%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  More jobs per technician
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316]">20%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Increase in revenue
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316]">99.9%</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  System uptime
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. CUSTOMER TESTIMONIALS (EXACT HORIZONTAL AVATAR ALIGNMENT)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <span className="text-[#C2410C] font-bold text-xs uppercase tracking-wider block mb-2">
              WHAT OUR CUSTOMERS SAY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Real businesses. Real results.
            </h2>
          </div>

          {/* 3 Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            
            {/* Card 1: Mike Thompson */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <img
                src="/images/avatar-mike.jpg"
                alt="Mike Thompson portrait"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">
                  &ldquo;ServicePro OS has completely changed how we run our business. The dispatch and booking system is a game changer.&rdquo;
                </p>
                <div className="font-bold text-xs text-[#0F172A]">Mike Thompson</div>
                <div className="text-[11px] text-[#64748B]">Owner, Thompson HVAC</div>
                <div className="flex text-[#F97316] gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F97316]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Sarah Lopez */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <img
                src="/images/avatar-sarah.jpg"
                alt="Sarah Lopez portrait"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">
                  &ldquo;The technician app is simple and powerful. Our team loves it, and our customers love the real-time updates.&rdquo;
                </p>
                <div className="font-bold text-xs text-[#0F172A]">Sarah Lopez</div>
                <div className="text-[11px] text-[#64748B]">Owner, Lopez Plumbing</div>
                <div className="flex text-[#F97316] gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F97316]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: David Kim */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <img
                src="/images/avatar-david.jpg"
                alt="David Kim portrait"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">
                  &ldquo;We went from chaos to control. Everything is in one place — jobs, customers, payments, reports. Highly recommend!&rdquo;
                </p>
                <div className="font-bold text-xs text-[#0F172A]">David Kim</div>
                <div className="text-[11px] text-[#64748B]">Owner, Kim Electrical</div>
                <div className="flex text-[#F97316] gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F97316]" />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FINAL CALL-TO-ACTION (FULL-WIDTH EDGE-TO-EDGE BLOCK EXACT TO REFERENCE)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#071E22] overflow-hidden border-t border-[#1E293B]">
        {/* Full-bleed suburban residential house photograph on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-30 lg:opacity-95 pointer-events-none">
          <img
            src="/images/final-cta-house.jpg"
            alt="Residential suburban home in warm daylight"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E22] via-[#071E22]/90 lg:via-[#071E22]/70 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="max-w-xl">
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-wider block mb-2">
              GET STARTED TODAY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to streamline your field service business?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Join hundreds of service companies already using ServicePro OS.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8">
              <button
                onClick={() => setTrialModalOpen(true)}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#F97316]/30 transition-all cursor-pointer group"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setDemoModalOpen(true)}
                className="bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium px-5 py-3.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer"
              >
                <span>Book a Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Discreet Elegant Bottom Copyright Bar */}
        <div className="border-t border-white/10 py-5 bg-[#051619] relative z-10 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>&copy; {new Date().getFullYear()} ServicePro OS by TechWork. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. ACCESSIBLE DEMO-REQUEST & TOUR MODAL (GLASSMORPHISM)
      ───────────────────────────────────────────────────────────── */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0F172A]/95 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white relative shadow-2xl">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              aria-label="Close demo modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 text-[#F97316] text-xs font-bold uppercase tracking-wider mb-2">
              <Play className="w-3.5 h-3.5 fill-[#F97316]" />
              <span>Interactive Platform Tour</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Experience ServicePro OS Live
            </h3>
            <p className="text-slate-300 text-sm mb-6">
              Explore the live dispatch board, customer booking wizard, or technician field PWA:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <Link
                href="/admin/dispatch"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F97316]/50 p-4 rounded-xl text-center group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F97316]/20 text-[#F97316] flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-[#F97316]">Dispatch Board</div>
                <div className="text-[11px] text-slate-400 mt-1">Live dispatch calendar</div>
              </Link>

              <Link
                href="/book"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F97316]/50 p-4 rounded-xl text-center group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F97316]/20 text-[#F97316] flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-[#F97316]">Online Booking</div>
                <div className="text-[11px] text-slate-400 mt-1">7-step booking wizard</div>
              </Link>

              <Link
                href="/tech"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F97316]/50 p-4 rounded-xl text-center group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F97316]/20 text-[#F97316] flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-[#F97316]">Technician PWA</div>
                <div className="text-[11px] text-slate-400 mt-1">Mobile field app</div>
              </Link>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
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
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          10. FREE TRIAL REGISTRATION MODAL (GLASSMORPHISM)
      ───────────────────────────────────────────────────────────── */}
      {trialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0F172A]/95 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-md w-full p-6 sm:p-8 text-white relative shadow-2xl">
            <button
              onClick={() => setTrialModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              aria-label="Close trial modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="inline-block px-2.5 py-1 rounded bg-[#F97316]/20 text-[#F97316] font-bold text-xs uppercase mb-3">
              14-Day Full Access Trial
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              Start Free Trial
            </h3>
            <p className="text-[#64748B] text-xs mb-6">
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
                    className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
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
                    className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Trade</label>
                  <select
                    value={trialForm.trade}
                    onChange={(e) => setTrialForm({ ...trialForm, trade: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#0F172A] border border-white/15 rounded-lg text-white focus:outline-none focus:border-[#F97316]"
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
                    className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 rounded-lg text-sm shadow-lg shadow-[#F97316]/25 transition-all cursor-pointer"
                  >
                    Create My Free Trial
                  </button>
                </div>

                <div className="text-center text-[11px] text-[#64748B] pt-1">
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
