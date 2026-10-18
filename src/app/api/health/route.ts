import { NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { businessConfig } from "@config/business.config";

export async function GET() {
  const store = getLocalDbWithDemo();
  return NextResponse.json({
    status: "ok",
    business: businessConfig.businessName,
    slug: businessConfig.slug,
    timezone: businessConfig.timezone,
    counts: {
      technicians: store.technicians.size,
      services: store.services.size,
      serviceAreas: store.service_areas.size,
      jobs: store.jobs.size,
      customers: store.customers.size,
      invoices: store.invoices.size,
    },
    timestamp: new Date().toISOString(),
  });
}
