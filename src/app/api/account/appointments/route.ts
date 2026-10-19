import { NextResponse } from "next/server";
import { resolveCustomerSession, getCustomerJobs } from "@/lib/server/customer-portal";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  let jobs = getCustomerJobs(session.customerId);

  if (statusFilter && statusFilter !== "all") {
    if (statusFilter === "upcoming") {
      jobs = jobs.filter((j) => ["unassigned", "assigned"].includes(j.status));
    } else if (statusFilter === "active") {
      jobs = jobs.filter((j) => ["on_the_way", "in_progress"].includes(j.status));
    } else if (statusFilter === "completed") {
      jobs = jobs.filter((j) => j.status === "completed");
    } else if (statusFilter === "cancelled") {
      jobs = jobs.filter((j) => j.status === "cancelled");
    }
  }

  return NextResponse.json({
    jobs,
    total: jobs.length,
  });
}
