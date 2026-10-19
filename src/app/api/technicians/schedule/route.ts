import { NextResponse } from "next/server";
import { resolveTechnicianSession, getTechnicianScheduleJobs } from "@/lib/server/tech-portal";

export async function GET(request: Request) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const filter = (searchParams.get("filter") as any) || "today";

  const jobs = getTechnicianScheduleJobs(session.techId, filter);

  return NextResponse.json({
    technician: session,
    jobs,
    total: jobs.length,
  });
}
