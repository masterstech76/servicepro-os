import { NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { isRealStripeConfigured } from "@/lib/server/stripe";
import { isRemoteSupabaseConfigured } from "@/lib/supabase/middleware";
import { businessConfig } from "@config/business.config";

export async function GET() {
  const store = getLocalDbWithDemo();
  return NextResponse.json({
    ok: true,
    status: "ok",
    business: businessConfig.businessName,
    slug: businessConfig.slug,
    timezone: businessConfig.timezone,
    subsystems: {
      database: isRemoteSupabaseConfigured() ? "supabase_remote" : "local_persistent",
      stripe: isRealStripeConfigured() ? "stripe_live_sdk" : "stripe_simulated",
      sms:
        process.env.SMS_DRIVER === "twilio" && process.env.TWILIO_ACCOUNT_SID
          ? "twilio"
          : "console",
      mapbox: Boolean(process.env.MAPBOX_SERVER_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN),
    },
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
