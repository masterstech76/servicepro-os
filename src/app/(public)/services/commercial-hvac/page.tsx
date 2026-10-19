import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Layers,
  Server,
  UtensilsCrossed,
  FileText,
  HelpCircle,
  Briefcase,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Commercial HVAC & Rooftop Package Units | ${businessConfig.businessName}`,
  description: `Commercial HVAC repair, package unit maintenance, and facility agreements for offices, restaurants, and retail spaces in ${businessConfig.city}. Priority commercial dispatch.`,
};

export default function CommercialHvacPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const commercialCapabilities = [
    {
      title: "Rooftop Packaged Units (RTU)",
      desc: "Fast troubleshooting, blower motor rebuilds, economizer calibration, and compressor diagnostics for 3-ton to 25-ton RTUs.",
      icon: Building2,
    },
    {
      title: "Server & Precision Telecom Cooling",
      desc: "Dedicated mini-split and precision DX systems maintaining strict temperature and humidity standards for critical IT equipment.",
      icon: Server,
    },
    {
      title: "Restaurant & Kitchen Make-Up Air",
      desc: "Make-up air units (MAU), exhaust ventilation balance, and indoor air negative pressure diagnostics for commercial kitchens.",
      icon: UtensilsCrossed,
    },
    {
      title: "Multi-Zone Split & VRF Systems",
      desc: "Variable Refrigerant Flow (VRF) and multi-zone commercial heat pumps for corporate offices and medical clinics.",
      icon: Layers,
    },
  ];

  const commercialPerks = [
    {
      title: "Priority 60-Min Business Dispatch",
      desc: "HVAC failures cost customers and employee productivity. Commercial accounts receive expedited routing.",
    },
    {
      title: "Digital Equipment Asset Tracking",
      desc: "Every RTU is tagged with a digital QR code tracking filter history, belt sizing, and service history.",
    },
    {
      title: "Licensed Mechanical Contractors",
      desc: "State-certified master technicians with full commercial liability insurance and worker's compensation coverage.",
    },
    {
      title: "Flexible Commercial Invoicing",
      desc: "Itemized digital quotes with before-and-after photo verification. Net-30 terms available for verified corporate clients.",
    },
  ];

  const faqs = [
    {
      q: "Do you service commercial properties after hours to avoid business disruption?",
      a: "Yes. Our commercial technicians operate 24/7. We can schedule rooftop maintenance, filter changes, and major repairs outside your operating hours.",
    },
    {
      q: "Can you provide preventive maintenance agreements for our facility?",
      a: "We offer tailored quarterly and bi-monthly maintenance contracts including filter replacements, coil cleanings, belt inspections, and motor amp draw tests.",
    },
    {
      q: "Do you supply certificates of insurance (COI) for property managers?",
      a: "Yes. We immediately issue customized Certificates of Insurance naming property management companies or building owners as additional insured.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: "Commercial HVAC" },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50/60 to-white py-14 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-100/80 px-3.5 py-1 rounded-full border border-orange-200 inline-flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              Facility &amp; Commercial Solutions
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-950 tracking-tight leading-tight">
              Commercial HVAC Repair &amp; Maintenance in{" "}
              <span className="text-orange-600">{businessConfig.city}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Protect your business revenue and employee comfort. We deliver rapid diagnostics and preventive maintenance for rooftop units, split systems, and facility cooling.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-orange-600" /> Priority 60-Min Dispatch
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-orange-600" /> Fully Insured &amp; Bonded
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-orange-600" /> Itemized Digital Reports
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={cleanPhoneHref}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black px-7 shadow-md text-sm gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>Commercial Desk: {businessConfig.phone}</span>
              </a>
              <Button
                asChild
                size="lg"
                className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-navy-950 font-bold h-12 px-6 shadow-sm"
              >
                <Link href="/contact">
                  <span>Request Facility Proposal</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <Image
                src="/images/svc-ac-repair.jpg"
                alt="Commercial rooftop HVAC system"
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

      {/* Systems We Service */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Commercial Equipment
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950 mt-1">
            Commercial Systems We Diagnose &amp; Service
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Our certified mechanical technicians have the equipment and crane coordination required to service complex commercial rooftop setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commercialCapabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-orange-300 transition-all space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-navy-950">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us for Facilities */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              Built for Facility Managers &amp; Business Owners
            </h2>
            <p className="text-sm text-slate-600">
              Zero hassle compliance, rapid turnaround, and clear digital accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commercialPerks.map((p, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2"
              >
                <div className="h-7 w-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h3 className="font-heading font-bold text-sm text-navy-950">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
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
              Commercial Flat Diagnostic
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
              $179 Commercial Unit Diagnostic
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Includes comprehensive rooftop safety inspection, electrical contactor check, belt tension evaluation, refrigerant pressures, and a detailed digital proposal before repair.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 px-8 shadow-lg w-full sm:w-auto"
            >
              <Link href="/contact">
                <span>Book Diagnostic or Quote</span>
                <ArrowRight className="ml-2 h-4 w-4" />
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
            Commercial Service FAQs
          </h2>
          <p className="text-xs text-slate-500">
            Common questions regarding commercial service agreements and rooftop repairs.
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
