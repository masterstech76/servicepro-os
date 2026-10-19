import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Snowflake, Wrench, Sliders, Flame, Sparkles, Gauge, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `HVAC Services & Transparent Pricing | ${businessConfig.businessName}`,
  description: `Explore our full catalog of residential and commercial HVAC services with upfront flat-rate pricing and same-day arrival.`,
};

export default function ServicesCatalogPage() {
  const allServices = [
    {
      id: "svc-ac-repair",
      title: "AC Repair & Diagnostics",
      desc: "Fast troubleshooting for AC units blowing warm air, frozen evaporator coils, strange noises, or water leaks.",
      price: "$129 Flat Diagnostic",
      duration: "~90 min",
      href: "/services/ac-repair",
      bookHref: "/book?serviceId=svc-ac-repair",
      icon: Snowflake,
      image: "/images/svc-ac-repair.jpg",
    },
    {
      id: "svc-ac-tuneup",
      title: "AC Tune-Up & Maintenance",
      desc: "Comprehensive 21-point inspection, coil cleaning, electrical component test, and refrigerant pressure check.",
      price: "$89 Seasonal Special",
      duration: "~60 min",
      href: "/services/ac-tuneup",
      bookHref: "/book?serviceId=svc-ac-tuneup",
      icon: Wrench,
      image: "/images/svc-ac-tuneup.jpg",
    },
    {
      id: "svc-thermostat-install",
      title: "Smart Thermostat Installation",
      desc: "Professional installation and mobile setup for Google Nest, Ecobee, Honeywell, and smart thermostats.",
      price: "$149 Flat Rate",
      duration: "~60 min",
      href: "/services/thermostat-install",
      bookHref: "/book?serviceId=svc-thermostat-install",
      icon: Sliders,
      image: "/images/svc-thermostat-install.jpg",
    },
    {
      id: "svc-duct-cleaning",
      title: "Air Duct Cleaning & Sanitization",
      desc: "High-powered negative-pressure duct cleaning, dust extraction, and antimicrobial fogging for clean indoor air.",
      price: "$249 Whole Home",
      duration: "~180 min",
      href: "/services/duct-cleaning",
      bookHref: "/book?serviceId=svc-duct-cleaning",
      icon: Sparkles,
      image: "/images/svc-duct-cleaning.jpg",
    },
    {
      id: "svc-refrigerant-recharge",
      title: "Refrigerant Leak Test & Recharge",
      desc: "Nitrogen pressure testing, electronic leak detection, and R-410A / R-22 precision refrigerant balancing.",
      price: "$125/hr + Refrigerant",
      duration: "~60 min",
      href: "/services/refrigerant-recharge",
      bookHref: "/book?serviceId=svc-refrigerant-recharge",
      icon: Gauge,
      image: "/images/svc-refrigerant-recharge.jpg",
    },
    {
      id: "svc-furnace-repair",
      title: "Furnace & Heating System Repair",
      desc: "Diagnostic and repair for heat pumps, electric air handlers, gas igniters, and safety limit switches.",
      price: "$129 Flat Diagnostic",
      duration: "~90 min",
      href: "/services/furnace-repair",
      bookHref: "/book?serviceId=svc-furnace-repair",
      icon: Flame,
      image: "/images/svc-furnace-repair.jpg",
    },
    {
      id: "svc-emergency-hvac",
      title: "24/7 Priority Emergency HVAC",
      desc: "Immediate on-call dispatch for severe cooling failures, high humidity emergencies, and commercial breakdowns.",
      price: "Priority Dispatch",
      duration: "Immediate",
      href: "/services/emergency-hvac",
      bookHref: "/services/emergency-hvac",
      icon: Clock,
      image: "/images/hero.jpg",
    },
    {
      id: "svc-commercial-hvac",
      title: "Commercial HVAC & Rooftop Units",
      desc: "Preventative maintenance, air handling maintenance, and rooftop packaged units for offices and retail stores.",
      price: "Custom Estimate",
      duration: "Scheduled",
      href: "/services/commercial-hvac",
      bookHref: "/contact",
      icon: ShieldCheck,
      image: "/images/service-bg.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900">
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
            Transparent Pricing
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
            HVAC Services &amp; Flat-Rate Pricing
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Choose any service below to view full details or schedule your guaranteed 60-minute arrival window online.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 mb-5">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-navy-900/90 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1 rounded-full">
                      {svc.price}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="font-heading text-lg font-bold text-navy-900">{svc.title}</h2>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {svc.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={svc.href}
                    className="text-xs font-bold text-slate-700 hover:text-orange-600 flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>

                  <Button asChild size="sm" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs h-9 px-4">
                    <Link href={svc.bookHref}>
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
