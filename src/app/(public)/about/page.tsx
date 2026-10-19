import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Phone,
  Calendar,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Wrench,
  Sparkles,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `About Us | ${businessConfig.businessName}`,
  description: `Learn about ${businessConfig.businessName}, our 14+ years serving ${businessConfig.city}, licensed master technicians, and our 100% satisfaction guarantee.`,
};

export default function AboutPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const stats = [
    { label: "Years Serving Miami", value: "14+" },
    { label: "Verified Jobs Completed", value: "15,000+" },
    { label: "Customer Satisfaction", value: "4.9 ★" },
    { label: "Metro Service Areas", value: "12 Zones" },
  ];

  const values = [
    {
      icon: DollarSign,
      title: "Upfront Transparent Pricing",
      desc: "Every diagnostic quote is approved before repair begins. Deposit is 100% credited to your final bill.",
    },
    {
      icon: ShieldCheck,
      title: "100% Fixed-Right Guarantee",
      desc: "All parts and workmanship are backed by our 30-day fixed-right promise and 1-year limited warranty.",
    },
    {
      icon: Users,
      title: "Certified Master Technicians",
      desc: "Background-checked, drug-screened pros with NATE and EPA Section 608 mechanical certifications.",
    },
  ];

  const teamMembers = [
    {
      name: "Carlos Rodriguez",
      role: "Lead Master HVAC Technician",
      exp: "12 Yrs Exp • NATE Certified",
      initial: "C",
      color: "from-blue-600 to-indigo-700",
    },
    {
      name: "Marcus Vance",
      role: "Senior Refrigeration Specialist",
      exp: "9 Yrs Exp • EPA Section 608",
      initial: "M",
      color: "from-orange-500 to-amber-600",
    },
    {
      name: "Tony Alvarez",
      role: "Duct & Airflow Diagnostics",
      exp: "7 Yrs Exp • Indoor Air Quality",
      initial: "T",
      color: "from-emerald-500 to-teal-700",
    },
    {
      name: "Danny Miller",
      role: "Controls & Smart Systems",
      exp: "6 Yrs Exp • Low-Voltage Cert",
      initial: "D",
      color: "from-purple-500 to-pink-600",
    },
  ];

  function DollarSign(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="2" y2="22"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    );
  }

  return (
    <div className="min-h-screen bg-white text-navy-900 pb-16">
      {/* 1. Breadcrumb + Left-Aligned Hero (Title left, 2 stats cards right) */}
      <Breadcrumbs items={[{ label: "About Us" }]} />

      <section className="bg-gradient-to-b from-orange-50/60 to-white py-12 lg:py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 inline-block">
              About {businessConfig.businessName}
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight leading-tight">
              Fast, Transparent HVAC Service Built for South Florida Homeowners
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Founded to eliminate 4-hour waiting windows, hidden fees, and high-pressure replacement quotas. We bring honest diagnostics and cold air back to your home.
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
              <div className="text-3xl font-black text-orange-600">14+</div>
              <div className="text-xs font-bold text-navy-950">Years Active</div>
              <div className="text-[11px] text-slate-400">Founded in Miami</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
              <div className="text-3xl font-black text-navy-950">60m</div>
              <div className="text-xs font-bold text-navy-950">Dispatch Window</div>
              <div className="text-[11px] text-slate-400">Emergency Response</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20 pt-16">
        {/* 2. Story - 2 Col: Left Images Overlap, Right Text + Vertical Timeline */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative h-[380px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <Image
                src="/images/hero.jpg"
                alt="HVAC work van and team"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 w-48 h-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 hidden sm:block">
              <Image
                src="/images/svc-ac-repair.jpg"
                alt="HVAC technician at work"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              Our Journey: From One Truck to {businessConfig.city}&apos;s Highest-Rated Team
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When {businessConfig.businessName} started in 2012, homeowners were frustrated by HVAC contractors who wouldn&apos;t give upfront prices or show up on time. We built our entire business model on radical transparency: exact 2-hour arrival windows, GPS technician tracking, and zero diagnostic fees when you approve repairs.
            </p>

            {/* Vertical Timeline */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                  <div className="w-0.5 h-full bg-slate-200" />
                </div>
                <div className="pb-4">
                  <span className="font-bold text-xs text-orange-600">2012 — Founded in Miami</span>
                  <p className="text-xs text-slate-600 mt-0.5">Started with 1 mobile warehouse van dedicated to honest residential diagnostics.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-navy-900 ring-4 ring-slate-100" />
                  <div className="w-0.5 h-full bg-slate-200" />
                </div>
                <div className="pb-4">
                  <span className="font-bold text-xs text-navy-950">2018 — 10,000th Home Fixed</span>
                  <p className="text-xs text-slate-600 mt-0.5">Expanded fleet coverage across 12 zones with full EPA Section 608 certification.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                </div>
                <div>
                  <span className="font-bold text-xs text-emerald-700">2026 — Modern Digital Dispatch</span>
                  <p className="text-xs text-slate-600 mt-0.5">Launched real-time online booking, slot locking, and 1-year fixed-right warranties.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Stats Row - 4 Cols */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center space-y-1">
              <div className="font-heading font-black text-2xl sm:text-4xl text-navy-950">{s.value}</div>
              <div className="text-xs font-semibold text-slate-600">{s.label}</div>
            </div>
          ))}
        </section>

        {/* 4. Core Values - 3 Cols Equal Height */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              The Principles That Guide Every Dispatch
            </h2>
            <p className="text-xs text-slate-500 font-medium">Clear commitments to our customers on every service call.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-navy-950">{v.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Office & Dispatch Center - 2 Col: Map Card Left, Info List Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl bg-navy-950 text-white border border-navy-800">
          <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden bg-navy-900 border border-slate-800">
            <Image
              src="/images/cart-illustration.jpg"
              alt="Dispatch headquarters"
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="text-xs font-bold text-white bg-orange-500 px-3 py-1 rounded-full">
                Central Operations Base
              </span>
              <span className="text-xs text-slate-300 font-mono">25.7617° N, 80.1918° W</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Local Headquarters</span>
              <h3 className="font-heading text-2xl font-black text-white">Central Dispatch &amp; Mobile Warehouse</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our main dispatch facility is located at {businessConfig.address}. We stage mobile vans with 95% of replacement parts throughout {businessConfig.city} for sub-60 minute arrival.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-400 shrink-0" />
                <span>{businessConfig.address}, {businessConfig.city}, {businessConfig.state} {businessConfig.zipCodes[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-400 shrink-0" />
                <span>Monday–Sunday: 7:00 AM – 8:00 PM (24/7 Emergency Dispatch)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-400 shrink-0" />
                <a href={cleanPhoneHref} className="text-orange-400 font-bold hover:underline">{businessConfig.phone}</a>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Certified Team - 4 Avatars Horizontal */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy-950">
              Meet Our Senior Field Specialists
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Every dispatched technician is drug-screened, background-checked, and manufacturer-trained.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center space-y-3">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-tr ${m.color} text-white font-black text-xl flex items-center justify-center shadow-md ring-4 ring-slate-50`}>
                  {m.initial}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-navy-950">{m.name}</h3>
                  <p className="text-xs text-orange-600 font-semibold">{m.role}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">{m.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Final Contained CTA Card */}
        <section className="rounded-3xl bg-navy-900 text-white p-8 sm:p-12 text-center space-y-4 shadow-xl border border-navy-800">
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            Experience the {businessConfig.businessName} Difference Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Schedule service online in 60 seconds with upfront pricing and guaranteed arrival windows.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="md" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black px-7 h-12 shadow-lg">
              <Link href="/book" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Book Service Online</span>
              </Link>
            </Button>
            <a
              href={cleanPhoneHref}
              className="inline-flex h-12 items-center justify-center px-6 rounded-xl border border-slate-700 bg-navy-950 text-white font-bold text-xs sm:text-sm hover:bg-white hover:text-navy-900 transition-all"
            >
              Call {businessConfig.phone}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
