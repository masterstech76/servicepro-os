import { NextResponse } from "next/server";
import { resolveTechnicianSession, getTechEarnings } from "@/lib/server/tech-portal";

export async function GET(request: Request) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") as "this_week" | "this_month" | "all_time") || "this_month";

  const earnings = getTechEarnings(session.techId, period);
  return NextResponse.json(earnings);
}
