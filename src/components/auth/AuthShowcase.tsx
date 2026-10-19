"use client";

import * as React from "react";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Wrench,
  Navigation,
  FileCheck,
  PhoneCall,
  Sparkles,
  Zap,
} from "lucide-react";
import { businessConfig } from "@config/business.config";

export function AuthShowcase() {
  const [activeSlide, setActiveSlide] = React.useState(0);

  // Auto-advance slides like Instagram desktop phone mockup
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative select-none">
      {/* Decorative ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 via-sky-500/10 to-indigo-500/20 rounded-full blur-3xl opacity-70 pointer-events-none" />

      {/* Floating Badge 1 - Top Left */}
      <div className="absolute -top-4 -left-6 z-20 hidden xl:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-100 text-xs font-bold text-navy-950 animate-bounce duration-1000">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        <Zap className="h-4 w-4 text-orange-500" />
        <span>60-Min Emergency Dispatch</span>
      </div>

      {/* Floating Badge 2 - Bottom Right */}
      <div className="absolute -bottom-4 -right-6 z-20 hidden xl:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-100 text-xs font-bold text-navy-950">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>100% Fixed-Right Guarantee</span>
      </div>

      {/* Smartphone Hardware Frame (Instagram Style) */}
      <div className="relative w-[340px] xl:w-[360px] h-[640px] rounded-[48px] bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-800/80">
        {/* Exterior Bezel & Reflection */}
        <div className="relative w-full h-full rounded-[40px] bg-slate-950 overflow-hidden border border-slate-800 flex flex-col justify-between">
          {/* Top Notch / Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-2 h-5 w-28 bg-black rounded-full">
            <div className="h-2 w-2 rounded-full bg-slate-800" />
            <div className="h-2 w-2 rounded-full bg-slate-900 border border-slate-700" />
          </div>

          {/* Screen Content Container */}
          <div className="relative w-full h-full pt-8 pb-4 px-4 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-navy-950 to-slate-900 text-white">
            {/* App Status Header inside Mockup */}
            <div className="flex items-center justify-between pt-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-orange-500 flex items-center justify-center text-navy-950 font-black text-[10px]">
                  TP
                </div>
                <div>
                  <p className="text-[11px] font-bold leading-tight">
                    {businessConfig.businessName}
                  </p>
                  <p className="text-[9px] text-orange-400 font-medium">
                    Field Service Operating System
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>

            {/* SLIDE 1: Live GPS Dispatch Tracking */}
            {activeSlide === 0 && (
              <div className="my-auto space-y-4 animate-in fade-in duration-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      Live Technician En Route
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      ETA: 18 Min
                    </span>
                  </div>

                  {/* Stylized Mini Map Simulation */}
                  <div className="h-28 rounded-xl bg-slate-800/80 border border-slate-700/60 relative overflow-hidden flex items-center justify-center">
                    {/* Simulated Map Grid lines */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Route Path */}
                    <div className="absolute w-36 h-0.5 bg-gradient-to-r from-orange-500 to-sky-400 rotate-12" />

                    {/* Destination Marker */}
                    <div className="absolute top-4 right-8 flex flex-col items-center">
                      <MapPin className="h-4 w-4 text-emerald-400" />
                      <span className="text-[8px] font-bold text-slate-300">Your Home</span>
                    </div>

                    {/* Tech Van Pulse Marker */}
                    <div className="absolute bottom-6 left-8 flex items-center gap-1.5 bg-navy-900/90 border border-orange-500/80 px-2 py-1 rounded-lg shadow-lg">
                      <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                      <Wrench className="h-3 w-3 text-orange-400" />
                      <span className="text-[9px] font-bold text-white">Carlos R.</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <p className="text-xs font-bold text-slate-200">
                      2023 Ford Transit • Fully Stocked
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Dispatched for Job #1004 (AC Breakdown Diagnostic)
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-2.5 text-center">
                  <p className="text-[10px] text-orange-300 font-semibold">
                    Real-time SMS &amp; GPS arrival alerts
                  </p>
                </div>
              </div>
            )}

            {/* SLIDE 2: Upfront Digital Estimate */}
            {activeSlide === 1 && (
              <div className="my-auto space-y-4 animate-in fade-in duration-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <FileCheck className="h-3 w-3" />
                      Digital Invoice Ready
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">#INV-1004</span>
                  </div>

                  <div className="rounded-xl bg-slate-800/80 p-3 space-y-2 border border-slate-700/60 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>AC System Diagnostic</span>
                      <span className="font-mono font-bold">$49.00</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Dual Run Capacitor 45/5 MFD</span>
                      <span className="font-mono font-bold">$140.00</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-semibold border-t border-slate-700 pt-1">
                      <span>Diagnostic Fee Credit</span>
                      <span className="font-mono">-$49.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-white border-t border-slate-700 pt-1 text-sm">
                      <span>Total Balance</span>
                      <span className="text-orange-400 font-mono">$140.00</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/60 p-2 text-center text-[10px] text-emerald-300 flex items-center justify-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Paid Online via Apple Pay / Card</span>
                  </div>
                </div>

                <div className="rounded-xl bg-sky-500/10 border border-sky-500/20 p-2.5 text-center">
                  <p className="text-[10px] text-sky-300 font-semibold">
                    100% Upfront flat pricing with zero surprise fees
                  </p>
                </div>
              </div>
            )}

            {/* SLIDE 3: 60-Minute Response & Verified Trust */}
            {activeSlide === 2 && (
              <div className="my-auto space-y-4 animate-in fade-in duration-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3.5 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    <Clock className="h-6 w-6" />
                  </div>

                  <div>
                    <h4 className="font-black text-base text-white">
                      60-Minute Emergency Arrival
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Covering Brickell, Downtown, Coral Gables &amp; Greater Miami
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-amber-400 pt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-200 ml-1.5">
                      4.9 / 5.0 (1,240+ Reviews)
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-800/60 p-2 border border-slate-700/60 text-[10px] text-slate-300 flex items-center justify-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>FL License #{businessConfig.licenseNumber} • Insured</span>
                  </div>
                </div>

                <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-2.5 text-center">
                  <p className="text-[10px] text-purple-300 font-semibold">
                    Certified EPA Universal HVAC Technicians
                  </p>
                </div>
              </div>
            )}

            {/* Slide Navigation Dots (Instagram style) */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx
                      ? "w-6 bg-orange-500"
                      : "w-1.5 bg-slate-700 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Home indicator bar at bottom of mockup */}
            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
