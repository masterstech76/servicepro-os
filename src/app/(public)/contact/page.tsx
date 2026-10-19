import * as React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Send, MessageSquare } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Contact Us & 24/7 Dispatch Desk | ${businessConfig.businessName}`,
  description: `Contact ${businessConfig.businessName} for emergency AC repair, dispatch assistance, and service inquiries in ${businessConfig.city}.`,
};

export default function ContactPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <Breadcrumbs items={[{ label: "Contact & Dispatch" }]} />

      <section className="bg-gradient-to-b from-[#FFF7ED]/60 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-[#EA580C] uppercase tracking-wider bg-[#FFF7ED] px-3.5 py-1 rounded-full border border-orange-200">
            24/7 Priority Support
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
            Contact TechWork Dispatch
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Need immediate assistance or have questions about a service booking? Reach our central dispatch team below.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#0F172A] text-white space-y-6">
              <h2 className="font-heading text-2xl font-bold">Central Dispatch Office</h2>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Emergency &amp; Booking Phone</div>
                    <a href={cleanPhoneHref} className="text-[#F97316] hover:underline font-extrabold text-base">
                      {businessConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Support Email</div>
                    <a href={`mailto:${businessConfig.email}`} className="text-slate-300 hover:text-white">
                      {businessConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Headquarters Address</div>
                    <div>{businessConfig.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Operating Hours</div>
                    <div>Mon–Fri 7:00 AM – 7:00 PM</div>
                    <div>Sat 8:00 AM – 4:00 PM • Sun Emergency</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                State Mechanical Contractor License #{businessConfig.licenseNumber} • Bonded &amp; Insured
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FFF7ED]/30 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-[#0F172A] flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-[#EA580C]" />
                <span>60-Minute Arrival Commitment</span>
              </div>
              <p className="leading-relaxed">
                When you schedule online, our system matches your address with the nearest available certified van for rapid dispatch.
              </p>
            </div>
          </div>

          {/* Right Column: Send a Message Form (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-[#0F172A]">Send an Inquiry</h2>
              <p className="text-xs text-slate-500 mt-1">
                We respond to online inquiries within 30 minutes during business hours.
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(305) 555-0100"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">Service Needed</label>
                  <select className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#F97316] bg-white">
                    <option>AC Repair &amp; Diagnostic</option>
                    <option>AC Tune-Up &amp; Maintenance</option>
                    <option>Thermostat Installation</option>
                    <option>Air Duct Cleaning</option>
                    <option>Refrigerant Recharge</option>
                    <option>Other / General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase mb-1">How can we help?</label>
                <textarea
                  rows={4}
                  placeholder="Describe your AC or heating problem, unit symptoms, or request details..."
                  required
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="pt-2">
                <Button type="button" size="md" className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#0F172A] font-black text-sm shadow-md">
                  <Send className="mr-2 h-4 w-4" />
                  <span>Submit Inquiry</span>
                </Button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Need emergency service right away? </span>
                <Link href="/book" className="text-xs font-bold text-[#EA580C] hover:underline">
                  Book online instantly in 60 seconds →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
