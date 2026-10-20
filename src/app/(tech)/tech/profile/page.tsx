"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Truck,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  Mail,
  Award,
  Package,
  Wrench,
  CheckCircle2,
  Save,
  LogOut,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TechProfileData {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  color: string;
  certifications: string[];
  vehicle: {
    model: string;
    plate: string;
    status: string;
  };
  shift: {
    currentRoster: string;
    onCallWeekend: string;
    standbyStatus: string;
  };
  stats: {
    completedCount: number;
    inProgressCount: number;
    scheduledCount: number;
    customerRating: number;
    totalReviews: number;
    onTimeRate: string;
    vanPartsInTruck: number;
  };
}

export default function TechProfilePage() {
  const [profile, setProfile] = React.useState<TechProfileData | null>(null);
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const loadProfile = React.useCallback(async () => {
    const demoProfile: TechProfileData = {
      id: "tech-carlos",
      name: "Carlos Mendez",
      email: "carlos@techworkservices.com",
      phone: "(305) 555-0188",
      role: "Lead Master HVAC Technician",
      color: "#F97316",
      certifications: [
        "EPA Universal 608 Certified",
        "NATE Service & Installation Master",
        "Florida State Mechanical Journeyman",
        "OSHA 30 Worksite Safety",
      ],
      vehicle: {
        model: "2024 Ford Transit 250 High Roof",
        plate: "FL · W0RK-104",
        status: "Active & Fully Stocked",
      },
      shift: {
        currentRoster: "Monday – Friday (7:00 AM – 4:00 PM)",
        onCallWeekend: "Every 3rd Saturday (Rotation)",
        standbyStatus: "Active Dispatch Available",
      },
      stats: {
        completedCount: 148,
        inProgressCount: 1,
        scheduledCount: 4,
        customerRating: 4.95,
        totalReviews: 86,
        onTimeRate: "99.2%",
        vanPartsInTruck: 42,
      },
    };

    setLoading(true);
    try {
      const res = await fetch("/api/technicians/profile");
      if (res.ok) {
        const data = await res.json();
        const tech = data.technician || demoProfile;
        setProfile(tech);
        setPhone(tech.phone || "(305) 555-0188");
      } else {
        setProfile(demoProfile);
        setPhone(demoProfile.phone);
      }
    } catch {
      setProfile(demoProfile);
      setPhone(demoProfile.phone);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Phone number cannot be blank");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/technicians/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        toast.success("Mobile phone updated for dispatch contact!");
        await loadProfile();
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Network error updating contact");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <div className="h-20 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 p-4" />
        <div className="relative px-4 pb-4 pt-0">
          <div className="-mt-10 mb-3 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-navy-900 text-orange-500 shadow-md">
              <User className="h-10 w-10" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {profile.shift.standbyStatus}
            </span>
          </div>

          <h1 className="text-xl font-bold text-navy-950">{profile.name}</h1>
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
            Licensed HVAC Senior Field Technician
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-navy-700">
            <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1">
              <Mail className="h-3.5 w-3.5 text-slate-500" />
              {profile.email || "carlos.mendez@servicepro-os.com"}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1">
              <Phone className="h-3.5 w-3.5 text-slate-500" />
              {profile.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Stats KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500">
              Customer Rating
            </span>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-navy-900">
              {profile.stats.customerRating}
            </span>
            <span className="text-xs font-bold text-navy-500">
              ({profile.stats.totalReviews} reviews)
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            Top 5% Service Pro
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500">
              On-Time Rate
            </span>
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-navy-900">
              {profile.stats.onTimeRate}
            </span>
          </div>
          <span className="text-[11px] text-navy-600 font-semibold mt-0.5 block">
            30-min window compliance
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500">
              Completed Visits
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-navy-900">
              {profile.stats.completedCount}
            </span>
            <span className="text-xs text-navy-500">jobs this cycle</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500">
              Van Inventory
            </span>
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-navy-900">
              {profile.stats.vanPartsInTruck}
            </span>
            <span className="text-xs text-navy-500">parts units</span>
          </div>
        </div>
      </div>

      {/* Assigned Vehicle & Truck Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-700">
          <Truck className="h-4 w-4 text-orange-600" />
          <span>Assigned Service Vehicle</span>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-navy-600 font-semibold">Vehicle:</span>
            <span className="font-bold text-navy-900">{profile.vehicle.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-600 font-semibold">License Plate:</span>
            <span className="font-mono font-bold text-navy-900">{profile.vehicle.plate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-600 font-semibold">Status:</span>
            <span className="font-bold text-emerald-700">{profile.vehicle.status}</span>
          </div>
        </div>
      </div>

      {/* Field Certifications */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-700">
          <Award className="h-4 w-4 text-orange-600" />
          <span>Active Licenses & Certifications</span>
        </div>

        <div className="space-y-2">
          {profile.certifications.map((cert, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 text-xs font-semibold text-navy-900"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shift Roster */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-700">
          <Calendar className="h-4 w-4 text-orange-600" />
          <span>Shift Schedule & On-Call Roster</span>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-navy-600 font-semibold">Regular Shift:</span>
            <span className="font-bold text-navy-900">{profile.shift.currentRoster}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-600 font-semibold">Weekend On-Call:</span>
            <span className="font-bold text-navy-900">{profile.shift.onCallWeekend}</span>
          </div>
        </div>
      </div>

      {/* Edit Phone Contact */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
          Dispatch Direct Contact Phone
        </h3>
        <form onSubmit={handleSaveContact} className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy-900 focus:border-orange-500 focus:outline-none"
            placeholder="(555) 000-0000"
          />
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-navy-900 px-4 text-xs font-bold text-white hover:bg-navy-800"
          >
            {saving ? "Saving..." : "Update"}
          </Button>
        </form>
      </div>
    </div>
  );
}
