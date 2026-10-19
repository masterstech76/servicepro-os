import { NextResponse } from "next/server";
import {
  resolveTechnicianSession,
  getTechnicianScheduleJobs,
  getTechVanInventory,
} from "@/lib/server/tech-portal";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export async function GET(request: Request) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  const allJobs = getTechnicianScheduleJobs(session.techId, "all");
  const completedJobs = allJobs.filter((j) => j.status === "completed").length;
  const inProgressJobs = allJobs.filter((j) => j.status === "in_progress").length;
  const scheduledJobs = allJobs.filter((j) => j.status === "assigned" || j.status === "unassigned").length;

  const vanStock = getTechVanInventory(session.techId);
  const totalStockUnits = vanStock.reduce((sum, item) => sum + item.quantity, 0);

  return NextResponse.json({
    technician: {
      id: session.techId,
      name: session.name,
      email: session.email,
      phone: session.phone,
      role: session.role,
      color: session.color,
      certifications: ["EPA Section 608 Universal", "NATE Core & Heat Pump Specialist", "OSHA-10 Safety"],
      vehicle: session.vehicle,
      shift: {
        currentRoster: "Monday – Friday: 08:00 AM – 05:00 PM EST",
        onCallWeekend: "Every 3rd Saturday",
        standbyStatus: "Active On Shift",
      },
      stats: {
        completedCount: completedJobs,
        inProgressCount: inProgressJobs,
        scheduledCount: scheduledJobs,
        customerRating: 4.94,
        totalReviews: 128,
        onTimeRate: "98.2%",
        vanPartsInTruck: totalStockUnits,
      },
    },
  });
}

export async function PATCH(request: Request) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const store = getLocalDbWithDemo();
    const tech = store.technicians.get(session.techId);

    if (tech) {
      if (body.phone) tech.phone = String(body.phone);
      if (body.name) tech.name = String(body.name);
    }

    return NextResponse.json({ ok: true, message: "Profile preferences updated successfully" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
