import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getLocalDb } from "@/lib/server/local-db-fallback";
import { handleRouteError, jsonError } from "@/lib/server/api-errors";

export const dynamic = "force-dynamic";

const byIntentQuerySchema = z.object({
  pi: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = byIntentQuerySchema.parse({
      pi: searchParams.get("pi") ?? "",
    });

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data: job } = await supabase
        .from("jobs")
        .select(
          "job_number, scheduled_start, scheduled_end, address_line1, city, state, zip, deposit_cents, service_id, customer_id"
        )
        .eq("deposit_payment_intent_id", parsed.pi)
        .maybeSingle();

      const jobRow = job as {
        job_number: number;
        scheduled_start: string;
        scheduled_end: string;
        address_line1: string;
        city: string;
        state: string;
        zip: string;
        deposit_cents: number;
        service_id: string;
        customer_id: string;
      } | null;

      if (!jobRow) {
        return jsonError("JOB_NOT_FOUND", "Job not found for payment intent.", 404);
      }

      const { data: svc } = await supabase
        .from("services")
        .select("name")
        .eq("id", jobRow.service_id)
        .single();

      const { data: cust } = await supabase
        .from("customers")
        .select("name, phone")
        .eq("id", jobRow.customer_id)
        .single();

      const custRow = cust as { name?: string; phone?: string } | null;

      return NextResponse.json({
        job: {
          jobNumber: jobRow.job_number,
          serviceName: String((svc as { name?: string } | null)?.name ?? "Service"),
          scheduledStart: jobRow.scheduled_start,
          scheduledEnd: jobRow.scheduled_end,
          addressLine1: jobRow.address_line1,
          city: jobRow.city,
          state: jobRow.state,
          zip: jobRow.zip,
          customerFirstName: String(custRow?.name ?? "Customer").split(" ")[0],
          customerPhone: String(custRow?.phone ?? ""),
          depositCents: jobRow.deposit_cents,
        },
      });
    }

    // Local DB fallback
    const db = getLocalDb();
    const job = Array.from(db.jobs.values()).find(
      (j) => j.deposit_payment_intent_id === parsed.pi
    );

    if (!job) {
      return jsonError("JOB_NOT_FOUND", "Job not found for payment intent.", 404);
    }

    const svc = db.services.get(job.service_id);
    const cust = db.customers.get(job.customer_id);

    return NextResponse.json({
      job: {
        jobNumber: job.job_number,
        serviceName: svc?.name ?? "Service",
        scheduledStart: job.scheduled_start,
        scheduledEnd: job.scheduled_end,
        addressLine1: job.address_line1,
        city: job.city,
        state: job.state,
        zip: job.zip,
        customerFirstName: (cust?.name ?? "Customer").split(" ")[0],
        customerPhone: cust?.phone ?? "",
        depositCents: job.deposit_cents,
      },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
