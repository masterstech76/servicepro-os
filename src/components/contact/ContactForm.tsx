"use client";

import * as React from "react";
import Link from "next/link";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    service: "AC Repair & Diagnostic",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, phone number, and a brief description.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
      toast.success("Inquiry submitted! Our dispatch desk will contact you shortly.");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit inquiry. Please call dispatch directly.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-8 rounded-3xl border border-emerald-200 bg-emerald-50/50 text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white mx-auto shadow-md">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-heading text-xl font-bold text-navy-900">Message Received!</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you, <span className="font-bold text-navy-900">{formData.name}</span>. An active dispatch supervisor has received your details and will call or text you within 30 minutes.
        </p>
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: "",
                phone: "",
                email: "",
                service: "AC Repair & Diagnostic",
                message: "",
              });
            }}
            className="rounded-xl border-slate-300 text-xs font-bold"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-navy-900">Send an Inquiry</h2>
        <p className="text-xs text-slate-500 mt-1">
          We respond to online inquiries within 30 minutes during business hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-bold text-navy-900 uppercase mb-1">
              Full Name
            </label>
            <Input
              id="contact-name"
              type="text"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="block text-xs font-bold text-navy-900 uppercase mb-1">
              Phone Number
            </label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="(305) 555-0100"
              required
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-email" className="block text-xs font-bold text-navy-900 uppercase mb-1">
              Email Address
            </label>
            <Input
              id="contact-email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="contact-service" className="block text-xs font-bold text-navy-900 uppercase mb-1">
              Service Needed
            </label>
            <select
              id="contact-service"
              value={formData.service}
              onChange={(e) => setFormData((prev) => ({ ...prev, service: e.target.value }))}
              className="w-full h-12 px-3.5 rounded-input border border-slate-200 bg-white text-base text-navy-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 focus-visible:outline-offset-2"
            >
              <option value="AC Repair & Diagnostic">AC Repair &amp; Diagnostic</option>
              <option value="AC Tune-Up & Maintenance">AC Tune-Up &amp; Maintenance</option>
              <option value="Thermostat Installation">Thermostat Installation</option>
              <option value="Air Duct Cleaning">Air Duct Cleaning</option>
              <option value="Refrigerant Recharge">Refrigerant Recharge</option>
              <option value="Other / General Inquiry">Other / General Inquiry</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-xs font-bold text-navy-900 uppercase mb-1">
            How can we help?
          </label>
          <Textarea
            id="contact-message"
            rows={4}
            placeholder="Describe your AC or heating problem, unit symptoms, or request details..."
            required
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-900 font-black text-sm shadow-md"
          >
            <Send className="mr-2 h-4 w-4" />
            <span>{loading ? "Submitting..." : "Submit Inquiry"}</span>
          </Button>
        </div>

        <div className="text-center pt-2">
          <span className="text-xs text-slate-500">Need emergency service right away? </span>
          <Link href="/book" className="text-xs font-bold text-orange-600 hover:underline">
            Book online instantly in 60 seconds →
          </Link>
        </div>
      </form>
    </div>
  );
}
