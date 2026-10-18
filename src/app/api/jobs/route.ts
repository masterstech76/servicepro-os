import { NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { enrichJob, type EnrichedJob } from "@/lib/server/operations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const techId = searchParams.get("technicianId");
  const search = (searchParams.get("q") ?? "").trim().toLowerCase();

  const store = getLocalDbWithDemo();
  const jobs = Array.from(store.jobs.values())
    .sort((a, b) => b.scheduled_start.localeCompare(a.scheduled_start))
    .map((j) => enrichJob(j.id, store))
    .filter((j): j is EnrichedJob => {
      if (!j) return false;
      if (statusFilter && statusFilter !== "all" && j.status !== statusFilter) {
        return false;
      }
      if (techId && techId !== "all" && j.technician?.id !== techId) {
        return false;
      }
      if (search) {
        const hay = `${j.jobNumber} ${j.customer.name} ${j.customer.phone} ${j.service.name} ${j.addressLine1} ${j.zip}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

  return NextResponse.json({ jobs });
}
