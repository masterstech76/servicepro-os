import { NextResponse } from "next/server";
import { resolveAdminSession } from "@/lib/server/admin-portal";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const store = getLocalDbWithDemo();
  const tech = store.technicians.get(params.id);
  if (!tech) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Technician not found" } },
      { status: 404 }
    );
  }

  const hours = Array.from(store.technician_hours.values()).filter(
    (h) => h.technician_id === params.id
  );
  const timeOff = Array.from(store.technician_time_off.values()).filter(
    (to) => to.technician_id === params.id
  );

  return NextResponse.json({
    technicianId: tech.id,
    technicianName: tech.name,
    hours,
    timeOff,
  });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const store = getLocalDbWithDemo();
    const tech = store.technicians.get(params.id);
    if (!tech) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Technician not found" } },
        { status: 404 }
      );
    }

    if (body.type === "time_off") {
      if (!body.startsAt || !body.endsAt) {
        return NextResponse.json(
          { error: { code: "INVALID_INPUT", message: "Start and end times are required for time off" } },
          { status: 400 }
        );
      }

      const id = `to_${Date.now()}`;
      store.technician_time_off.set(id, {
        id,
        business_id: tech.business_id,
        technician_id: tech.id,
        starts_at: body.startsAt,
        ends_at: body.endsAt,
        reason: body.reason || "Approved Leave",
      });

      return NextResponse.json({ ok: true, message: "Time off scheduled successfully" });
    } else if (body.type === "hours") {
      const day = Number(body.dayOfWeek);
      if (isNaN(day) || day < 0 || day > 6) {
        return NextResponse.json(
          { error: { code: "INVALID_INPUT", message: "Day of week must be between 0 (Sun) and 6 (Sat)" } },
          { status: 400 }
        );
      }

      const existingHour = Array.from(store.technician_hours.values()).find(
        (h) => h.technician_id === tech.id && h.day_of_week === day
      );

      if (existingHour) {
        existingHour.start_time = body.startTime || "08:00";
        existingHour.end_time = body.endTime || "17:00";
      } else {
        const id = `th_${tech.id}_${day}`;
        store.technician_hours.set(id, {
          id,
          business_id: tech.business_id,
          technician_id: tech.id,
          day_of_week: day,
          start_time: body.startTime || "08:00",
          end_time: body.endTime || "17:00",
        });
      }

      return NextResponse.json({ ok: true, message: "Working shift updated successfully" });
    }

    return NextResponse.json(
      { error: { code: "INVALID_TYPE", message: "Type must be 'time_off' or 'hours'" } },
      { status: 400 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bad request";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
