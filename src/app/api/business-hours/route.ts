import { NextRequest, NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export async function GET() {
  const store = getLocalDbWithDemo();
  const businessHours = Array.from(store.business_hours.values()).sort(
    (a, b) => a.day_of_week - b.day_of_week
  );
  return NextResponse.json({ businessHours });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const store = getLocalDbWithDemo();
  const bh = Array.from(store.business_hours.values()).find(
    (h) => h.day_of_week === Number(body.dayOfWeek)
  );
  if (!bh) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Day of week not found." } },
      { status: 404 }
    );
  }
  if (typeof body.isClosed === "boolean") bh.is_closed = body.isClosed;
  if (typeof body.openTime === "string") bh.open_time = body.openTime;
  if (typeof body.closeTime === "string") bh.close_time = body.closeTime;
  store.business_hours.set(bh.id, bh);
  return NextResponse.json({ businessHour: bh });
}
