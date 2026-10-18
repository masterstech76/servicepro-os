import { NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export async function GET() {
  const store = getLocalDbWithDemo();
  const technicians = Array.from(store.technicians.values()).map((t) => {
    const hours = Array.from(store.technician_hours.values())
      .filter((th) => th.technician_id === t.id)
      .sort((a, b) => a.day_of_week - b.day_of_week);
    const timeOff = Array.from(store.technician_time_off.values()).filter(
      (to) => to.technician_id === t.id
    );
    return {
      ...t,
      hours,
      timeOff,
    };
  });
  return NextResponse.json({ technicians });
}

export async function POST(request: Request) {
  const store = getLocalDbWithDemo();
  const biz = Array.from(store.businesses.values())[0];
  const body = (await request.json()) as {
    name: string;
    phone: string;
    email: string;
    skills?: string[];
    zipCodes?: string[];
    commissionPct?: number;
    color?: string;
    days?: number[];
    startTime?: string;
    endTime?: string;
  };

  if (!body.name || !body.phone || !body.email) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "Name, phone, and email are required" } },
      { status: 400 }
    );
  }

  const id = `tech-${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36).slice(-3)}`;
  const nowIso = new Date().toISOString();

  store.technicians.set(id, {
    id,
    business_id: biz.id,
    user_id: `user_${id}`,
    name: body.name,
    phone: body.phone,
    email: body.email,
    skills: body.skills ?? ["hvac"],
    zip_codes: body.zipCodes ?? [],
    commission_pct: body.commissionPct ?? 20,
    color: body.color ?? "#3B82F6",
    home_lat: 25.7617,
    home_lng: -80.1918,
    active: true,
    created_at: nowIso,
  });

  const days = body.days ?? [1, 2, 3, 4, 5];
  for (const d of days) {
    const thId = `th_${id}_${d}`;
    store.technician_hours.set(thId, {
      id: thId,
      business_id: biz.id,
      technician_id: id,
      day_of_week: d,
      start_time: body.startTime ?? "08:00",
      end_time: body.endTime ?? "17:00",
    });
  }

  return NextResponse.json({ technician: store.technicians.get(id) });
}

export async function PATCH(request: Request) {
  const store = getLocalDbWithDemo();
  const biz = Array.from(store.businesses.values())[0];
  const body = (await request.json()) as {
    id: string;
    name?: string;
    phone?: string;
    email?: string;
    skills?: string[];
    zipCodes?: string[];
    commissionPct?: number;
    color?: string;
    active?: boolean;
    addTimeOff?: { startsAt: string; endsAt: string; reason: string };
    removeTimeOffId?: string;
  };

  const tech = store.technicians.get(body.id);
  if (!tech) {
    return NextResponse.json(
      { error: { code: "TECH_NOT_FOUND", message: "Technician not found" } },
      { status: 404 }
    );
  }

  if (body.name !== undefined) tech.name = body.name;
  if (body.phone !== undefined) tech.phone = body.phone;
  if (body.email !== undefined) tech.email = body.email;
  if (body.skills !== undefined) tech.skills = body.skills;
  if (body.zipCodes !== undefined) tech.zip_codes = body.zipCodes;
  if (body.commissionPct !== undefined) tech.commission_pct = body.commissionPct;
  if (body.color !== undefined) tech.color = body.color;
  if (body.active !== undefined) tech.active = body.active;

  store.technicians.set(tech.id, tech);

  if (body.addTimeOff) {
    const toId = `tto_${tech.id}_${Date.now()}`;
    store.technician_time_off.set(toId, {
      id: toId,
      business_id: biz.id,
      technician_id: tech.id,
      starts_at: body.addTimeOff.startsAt,
      ends_at: body.addTimeOff.endsAt,
      reason: body.addTimeOff.reason,
    });
  }

  if (body.removeTimeOffId) {
    store.technician_time_off.delete(body.removeTimeOffId);
  }

  return NextResponse.json({ technician: tech });
}
