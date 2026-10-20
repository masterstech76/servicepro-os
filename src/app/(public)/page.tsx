"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Wrench,
  Zap,
  Sparkles,
  Paintbrush,
  Clock,
  FileText,
  Headphones,
  CheckSquare,
  ArrowRight,
  Droplet,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopularService {
  name: string;
  price: string;
  image: string;
  href: string;
}

const POPULAR_SERVICES: PopularService[] = [
  {
    name: "Plumbing",
    price: "Starting at $29",
    image: "/images/svc-plumbing.jpg",
    href: "/book?serviceId=svc-ac-repair",
  },
  {
    name: "Electrical",
    price: "Starting at $25",
    image: "/images/svc-electrical.jpg",
    href: "/book?serviceId=svc-thermostat-install",
  },
  {
    name: "Cleaning",
    price: "Starting at $20",
    image: "/images/svc-cleaning.jpg",
    href: "/book?serviceId=svc-duct-cleaning",
  },
  {
    name: "Painting",
    price: "Starting at $30",
    image: "/images/svc-painting.jpg",
    href: "/book?serviceId=svc-ac-tuneup",
  },
  {
    name: "Carpentry",
    price: "Starting at $35",
    image: "/images/svc-carpentry.jpg",
    href: "/book?serviceId=svc-commercial-hvac",
  },
  {
    name: "Appliance Repair",
    price: "Starting at $35",
    image: "/images/svc-appliance.jpg",
    href: "/book?serviceId=svc-refrigerant-recharge",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-navy-950 font-sans selection:bg-[#F97316] selection:text-white pb-16">
      {/* ========================================================
          1. HERO SECTION (Exact Match to Screenshot)
          ======================================================== */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-16 bg-gradient-to-b from-slate-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold">
                Trusted Home Services, Anytime
              </div>

              {/* H1 Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black font-heading tracking-tight text-navy-950 leading-[1.12]">
                Professional Services for{" "}
                <span className="block mt-1">
                  a <span className="text-[#F97316]">Better Home</span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Plumbing, Electrical, Cleaning, Painting &amp; more &ndash; All services at your doorstep.
              </p>

              {/* Trust Bullets */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-7 pt-1 text-xs sm:text-sm font-semibold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Verified Experts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplet className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Upfront Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Satisfaction Guaranteed</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
                <Link href="/book">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm sm:text-base px-7 py-3 rounded-xl shadow-md transition-all"
                  >
                    Book a Service
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white hover:bg-slate-50 border-slate-300 text-slate-800 font-bold text-sm sm:text-base px-7 py-3 rounded-xl transition-all"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Social Proof Pill Card */}
              <div className="pt-2 flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-3.5 p-2 pr-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex -space-x-2">
                    <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                      <Image
                        src="/images/avatar-1.jpg"
                        alt="Customer"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                      <Image
                        src="/images/avatar-2.jpg"
                        alt="Customer"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                      <Image
                        src="/images/avatar-3.jpg"
                        alt="Customer"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-left leading-tight">
                    <span className="font-black text-sm text-navy-950 block">4.8/5</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      12,500+ Happy Customers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Technician with 4 Floating Cards (lg:col-span-5) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              {/* Radial subtle ambient glow */}
              <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-blue-100/60 filter blur-3xl -z-10" />

              {/* Technician Image Container */}
              <div className="relative w-72 sm:w-84 md:w-96 aspect-[3/4]">
                <Image
                  src="/images/technician-hero.png"
                  alt="ServicePro Verified Professional"
                  fill
                  priority
                  sizes="(max-width: 768px) 320px, 420px"
                  className="object-contain object-bottom drop-shadow-xl"
                />

                {/* Floating Card 1: Plumbing (Top Right) */}
                <div className="absolute top-2 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-xl flex items-center gap-2.5 z-20 hover:scale-105 transition-transform">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-left pr-2">
                    <span className="text-xs sm:text-sm font-bold text-navy-950 block leading-tight">
                      Plumbing
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Fix &amp; Install
                    </span>
                  </div>
                </div>

                {/* Floating Card 2: Electrical (Upper Middle Left) */}
                <div className="absolute top-20 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-xl flex items-center gap-2.5 z-20 hover:scale-105 transition-transform">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-left pr-2">
                    <span className="text-xs sm:text-sm font-bold text-navy-950 block leading-tight">
                      Electrical
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Repair &amp; Install
                    </span>
                  </div>
                </div>

                {/* Floating Card 3: Cleaning (Lower Left) */}
                <div className="absolute bottom-24 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-xl flex items-center gap-2.5 z-20 hover:scale-105 transition-transform">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-left pr-2">
                    <span className="text-xs sm:text-sm font-bold text-navy-950 block leading-tight">
                      Cleaning
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Home &amp; Office
                    </span>
                  </div>
                </div>

                {/* Floating Card 4: Painting (Bottom Right) */}
                <div className="absolute bottom-16 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-xl flex items-center gap-2.5 z-20 hover:scale-105 transition-transform">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Paintbrush className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-left pr-2">
                    <span className="text-xs sm:text-sm font-bold text-navy-950 block leading-tight">
                      Painting
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Interior &amp; Exterior
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. "BOOK IN 3 EASY STEPS" CARD (Exact Match)
          ======================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-6 sm:my-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          <h2 className="text-center font-heading font-black text-xl sm:text-2xl text-navy-950 mb-8 sm:mb-10">
            Book in 3 Easy Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-navy-950">
                  Choose a Service
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Select the service you need from our list.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-navy-950">
                  Pick Date &amp; Time
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Choose a convenient slot for you.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-navy-950">
                  We&apos;ll Do the Rest
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Our expert will arrive and get the job done.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. OUR POPULAR SERVICES SECTION (Exact Match)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 my-12 sm:my-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-950">
            Our <span className="text-blue-600">Popular Services</span>
          </h2>
          <Link
            href="/services"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All Services
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {POPULAR_SERVICES.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3.5 space-y-0.5 text-left">
                <h3 className="font-bold text-xs sm:text-sm text-navy-950 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {service.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. "SAVE MORE WITH SERVICEPRO CARE" BANNER (Exact Match)
          ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-12 sm:my-16">
        <div className="bg-gradient-to-r from-[#0D2040] via-[#0E2A54] to-[#0A1A33] rounded-3xl overflow-hidden shadow-xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Left Content (md:col-span-7) */}
            <div className="md:col-span-7 p-8 sm:p-12 space-y-5">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200">
                Membership Plan
              </span>

              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                Save More with{" "}
                <span className="block mt-1">
                  ServicePro <span className="text-[#F97316]">Care</span>
                </span>
              </h2>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckSquare className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Priority Booking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckSquare className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Free Service Checkups</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckSquare className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Exclusive Discounts</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link href="/specials">
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-slate-100 text-navy-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-sm transition-all"
                  >
                    Explore Plans
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image: Happy Family (md:col-span-5) */}
            <div className="md:col-span-5 relative h-64 sm:h-80 w-full bg-slate-800">
              <Image
                src="/images/care-family.jpg"
                alt="Happy Family with ServicePro Care"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0D2040] via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. "WHY CHOOSE SERVICEPRO OS?" SECTION (Exact Match)
          ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-14 sm:my-20 text-center">
        <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-950 mb-10 sm:mb-12">
          Why Choose <span className="text-blue-600">ServicePro OS?</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* USP 1 */}
          <div className="flex flex-col items-center space-y-2.5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-navy-950 max-w-[140px] leading-snug">
              Verified &amp; Trained Professionals
            </h3>
          </div>

          {/* USP 2 */}
          <div className="flex flex-col items-center space-y-2.5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-navy-950 max-w-[140px] leading-snug">
              On-Time Service
            </h3>
          </div>

          {/* USP 3 */}
          <div className="flex flex-col items-center space-y-2.5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-navy-950 max-w-[140px] leading-snug">
              Transparent Pricing
            </h3>
          </div>

          {/* USP 4 */}
          <div className="flex flex-col items-center space-y-2.5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-navy-950 max-w-[140px] leading-snug">
              100% Satisfaction Guarantee
            </h3>
          </div>

          {/* USP 5 */}
          <div className="flex flex-col items-center space-y-2.5 col-span-2 sm:col-span-1">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Headphones className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-navy-950 max-w-[140px] leading-snug">
              24/7 Customer Support
            </h3>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. "LOVED BY THOUSANDS OF HAPPY CUSTOMERS" (Exact Match)
          ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-10 sm:my-14">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Title (lg:col-span-4) */}
            <div className="lg:col-span-4 text-center lg:text-left">
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-950 leading-tight">
                Loved by Thousands of{" "}
                <span className="block text-blue-600">Happy Customers</span>
              </h2>
            </div>

            {/* Middle: Testimonial Quote (lg:col-span-4) */}
            <div className="lg:col-span-4 flex items-center gap-3.5 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-200">
                <Image
                  src="/images/avatar-sarah.jpg"
                  alt="Sarah J."
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="text-left space-y-1">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Excellent service! The plumber was on time, professional and fixed the issue quickly.&rdquo;
                </p>
                <span className="text-[11px] font-bold text-slate-500 block">
                  &ndash; Sarah J.
                </span>
              </div>
            </div>

            {/* Right: 3 Stats with Dividers (lg:col-span-4) */}
            <div className="lg:col-span-4 grid grid-cols-3 text-center divide-x divide-slate-200">
              <div className="px-2">
                <span className="font-black text-xl sm:text-2xl text-navy-950 block">
                  12K+
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Happy Customers
                </span>
              </div>
              <div className="px-2">
                <span className="font-black text-xl sm:text-2xl text-navy-950 block">
                  98%
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Satisfaction Rate
                </span>
              </div>
              <div className="px-2">
                <span className="font-black text-xl sm:text-2xl text-navy-950 block">
                  50K+
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Services Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
