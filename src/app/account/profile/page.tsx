"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Bell,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [smsOptOut, setSmsOptOut] = React.useState(false);
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [seasonalReminders, setSeasonalReminders] = React.useState(true);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const fetchProfile = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      const p = data.profile;
      setName(p.name || "");
      setEmail(p.email || "");
      setPhone(p.phone || "");
      setSmsOptOut(Boolean(p.smsOptOut));
    } catch {
      toast.error("Unable to load profile data");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          smsOptOut,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile preferences updated successfully");
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
          Account Profile & Notification Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage your personal contact details, SMS dispatch alerts, and password security.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-navy-900">Personal Information</h2>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" />
              <span>Verified Customer</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prof-name" className="text-xs font-bold text-slate-700">
                Full Name *
              </Label>
              <Input
                id="prof-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prof-phone" className="text-xs font-bold text-slate-700">
                Contact Phone Number
              </Label>
              <Input
                id="prof-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="prof-email" className="text-xs font-bold text-slate-700">
              Account Email (Verified)
            </Label>
            <Input
              id="prof-email"
              type="email"
              disabled
              value={email}
              className="mt-1 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              To update your primary account email, please contact our administrative dispatch office.
            </p>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 pb-2 border-b border-slate-100">
            Dispatch & Communication Preferences
          </h2>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={!smsOptOut}
                onChange={(e) => setSmsOptOut(!e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <div className="text-xs">
                <p className="font-bold text-navy-900">SMS Appointment & ETA Alerts</p>
                <p className="text-slate-500 text-[11px]">
                  Receive text messages when your appointment is booked, when the technician is en route, and upon job completion.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <div className="text-xs">
                <p className="font-bold text-navy-900">Email Invoices & Receipts</p>
                <p className="text-slate-500 text-[11px]">
                  Automatically email itemized work order breakdowns and Stripe payment receipts.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={seasonalReminders}
                onChange={(e) => setSeasonalReminders(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <div className="text-xs">
                <p className="font-bold text-navy-900">Seasonal AC Tune-Up Reminders</p>
                <p className="text-slate-500 text-[11px]">
                  Receive spring & fall maintenance reminders to optimize energy efficiency and extend compressor lifespan.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Security & Credentials */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-navy-900 pb-2 border-b border-slate-100">
            Account Security & Password
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-navy-900">Password & Authentication</p>
              <p className="text-slate-500">Your account is secured with 256-bit Supabase Auth encryption.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs font-bold border-slate-300">
              <Link href="/forgot-password">
                <Lock className="h-3.5 w-3.5 mr-1 text-orange-500" />
                <span>Reset Password</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={saving}
            className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold px-6 py-2.5 text-xs sm:text-sm shadow-md"
          >
            <Save className="h-4 w-4 mr-1.5" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
