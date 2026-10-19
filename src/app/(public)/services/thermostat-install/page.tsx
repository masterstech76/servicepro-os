import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sliders,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Phone,
  Smartphone,
  Wifi,
  Cpu,
  Zap,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Smart Thermostat Installation (Nest, Ecobee, Honeywell) | ${businessConfig.businessName}`,
  description: `Professional smart thermostat installation, C-wire testing, Wi-Fi pairing, and multi-zone setup in ${businessConfig.city}. Upfront $149 flat rate.`,
};

export default function ThermostatInstallPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const installFeatures = [
    {
      title: "C-Wire 24V Constant Power Testing",
      desc: "We verify or install common-wire adapters to prevent battery drain, Wi-Fi dropouts, and board damage.",
      icon: Zap,
    },
    {
      title: "Wall Mount & Trim Plate Finishing",
      desc: "Clean installation covering old paint outlines with custom OEM trim plates or neat wall anchors.",
      icon: Sliders,
    },
    {
      title: "Heat Pump & Multi-Stage Configuration",
      desc: "Correct low-voltage jumper and terminal wiring (O/B, Y1, Y2, W1, Aux) for your exact HVAC model.",
      icon: Cpu,
    },
    {
      title: "Wi-Fi Pairing & Mobile App Setup",
      desc: "We connect the thermostat to your home 2.4/5GHz Wi-Fi and configure schedules on your smartphone.",
      icon: Wifi,
    },
    {
      title: "Smart Home & Voice Assistant Linking",
      desc: "Optional sync with Apple HomeKit, Amazon Alexa, or Google Assistant for voice temperature control.",
      icon: Smartphone,
    },
    {
      title: "Temperature & Sensor Verification",
      desc: "Testing heat/cool cycle response times and calibrating external wireless room sensors.",
      icon: CheckCircle2,
    },
  ];

  const supportedBrands = [
    {
      name: "Google Nest",
      models: "Learning Thermostat 3rd & 4th Gen, Nest Thermostat, and Nest E",
    },
    {
      name: "Ecobee",
      models: "Smart Thermostat Premium, Enhanced, SmartThermostat with voice control",
    },
    {
      name: "Honeywell Home",
      models: "T9, T10 Pro Smart, Color Touchscreen, and Round Smart Series",
    },
    {
      name: "Amazon Smart",
      models: "Amazon Smart Thermostat with Alexa Energy Dashboard integration",
    },
  ];

  const faqs = [
    {
      q: "What if my old thermostat doesn't have a C-wire (common wire)?",
      a: "No problem. Many older homes lack a dedicated C-wire. Our technicians carry C-wire power extender kits (PEKs) and can add continuous 24V power without cutting through drywall.",
    },
    {
      q: "Can you install a thermostat that I already bought myself?",
      a: "Yes! Our $149 flat-rate installation service covers professional mounting, wiring, and app configuration for customer-supplied units from Nest, Ecobee, Honeywell, and more.",
    },
    {
      q: "Will a smart thermostat actually save money on my energy bill?",
      a: "According to EPA Energy Star studies, properly programmed smart thermostats save an average of 8% to 12% on annual heating and cooling utility expenses.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: "Smart Thermostat Installation" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              Smart Controls &amp; Automation
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight leading-tight">
              Smart Thermostat Installation for{" "}
              <span className="text-orange-600">$149</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Upgrade your home comfort and lower electric bills by up to 15%. We handle 24V wiring, C-wire power adapters, mounting plates, and full smartphone app setup.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-orange-600" /> C-Wire Power Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-orange-600" /> Phone App Setup Included
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> All Major Brands
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-7 shadow-md"
              >
                <Link href="/book?serviceId=svc-thermostat-install">
                  <span>Book Installation ($149 Flat Rate)</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-navy-950 font-bold text-sm px-6 shadow-sm transition-all"
              >
                <Phone className="mr-2 h-4 w-4 text-orange-600" />
                <span>Call {businessConfig.phone}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image
                src="/images/svc-thermostat-install.jpg"
                alt="Modern smart thermostat installed on wall"
                fill
                quality={85}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Included Features */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            What Is Included
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-1">
            Complete Professional Installation Service
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Incorrect thermostat wiring can blow control boards or lock compressors on. We ensure flawless operation from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {installFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-orange-300 transition-all space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-navy-950">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Ecosystems */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              Supported Smart Thermostat Ecosystems
            </h2>
            <p className="text-sm text-slate-600">
              We install and configure hardware from all leading smart climate manufacturers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportedBrands.map((b) => (
              <div
                key={b.name}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2"
              >
                <h3 className="font-heading font-bold text-base text-navy-950">
                  {b.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {b.models}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-navy-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-navy-800">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-orange-400">
              Upfront Flat Package
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
              $149 Complete Smart Thermostat Setup
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Includes full mounting, C-wire voltage testing, multi-stage heat pump programming, Wi-Fi pairing, and phone app walkthrough. 1-year workmanship warranty.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-8 shadow-lg w-full sm:w-auto"
            >
              <Link href="/book?serviceId=svc-thermostat-install">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Schedule Install</span>
              </Link>
            </Button>
            <a
              href={cleanPhoneHref}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-navy-950 hover:bg-white hover:text-navy-950 text-white font-bold text-xs sm:text-sm px-6 transition-all"
            >
              Call {businessConfig.phone}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-heading text-2xl font-black text-navy-950">
            Installation FAQs
          </h2>
          <p className="text-xs text-slate-500">
            Frequently asked questions about smart thermostat compatibility and wiring.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-sm space-y-2"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <h3 className="font-heading font-bold text-sm sm:text-base text-navy-950">
                  {f.q}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
