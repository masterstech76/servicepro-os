import * as React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: `Contact Us & 24/7 Dispatch Desk | ${businessConfig.businessName}`,
  description: `Contact ${businessConfig.businessName} for emergency AC repair, dispatch assistance, and service inquiries in ${businessConfig.city}.`,
};

export default function ContactPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-white text-navy-900">
      <Breadcrumbs items={[{ label: "Contact & Dispatch" }]} />

      <section className="bg-gradient-to-b from-orange-50/60 to-white py-16 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
            24/7 Priority Support
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
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
            <div className="p-8 rounded-3xl bg-navy-900 text-white space-y-6 shadow-md">
              <h2 className="font-heading text-2xl font-bold">Central Dispatch Desk</h2>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Emergency &amp; Booking Phone</div>
                    <a href={cleanPhoneHref} className="text-orange-500 hover:underline font-extrabold text-base">
                      {businessConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Support Email</div>
                    <a href={`mailto:${businessConfig.email}`} className="text-slate-300 hover:text-white">
                      {businessConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Headquarters Address</div>
                    <div>{businessConfig.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
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

            <div className="p-6 rounded-2xl border border-orange-200 bg-orange-50/50 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-navy-900 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>60-Minute Arrival Commitment</span>
              </div>
              <p className="leading-relaxed">
                When you schedule online, our system matches your address with the nearest available certified van for rapid dispatch.
              </p>
            </div>
          </div>

          {/* Right Column: Send a Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
