import { NextResponse } from "next/server";
import { z } from "zod";
import { zipSchema } from "@/lib/validation/booking";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getLocalDb, rpcGetAvailableSlots } from "@/lib/server/local-db-fallback";
import { handleRouteError } from "@/lib/server/api-errors";
import { businessConfig } from "@config/business.config";

export const dynamic = "force-dynamic";

const slotsQuerySchema = z.object({
  serviceId: z.string().min(1),
  zip: zipSchema,
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = slotsQuerySchema.parse({
      serviceId: searchParams.get("serviceId") ?? "",
      zip: searchParams.get("zip") ?? "",
      from: searchParams.get("from") ?? "",
      to: searchParams.get("to") ?? "",
    });

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .eq("slug", businessConfig.slug)
        .single();

      const bizRow = biz as { id: string } | null;
      if (bizRow) {
        const rpcArgs = {
          p_business: bizRow.id,
          p_service: parsed.serviceId,
          p_zip: parsed.zip,
          p_from: parsed.from,
          p_to: parsed.to,
        };
        const { data: rows, error } = await (supabase.rpc as unknown as (
          fn: string,
          args: Record<string, unknown>
        ) => Promise<{ data: Array<{ slot_start: string; slot_end: string; remaining: number }> | null; error: { message: string } | null }>)(
          "get_available_slots",
          rpcArgs
        );
        if (error) throw new Error(error.message);

        const slots = (rows ?? []).map((r) => ({
          start: r.slot_start,
          end: r.slot_end,
          lowAvailability: r.remaining <= 2,
          remaining: r.remaining,
        }));

        return NextResponse.json(
          { slots },
          { headers: { "Cache-Control": "no-store" } }
        );
      }
    }

    const db = getLocalDb();
    const biz = Array.from(db.businesses.values())[0];
    const rows = rpcGetAvailableSlots(
      {
        p_business: biz.id,
        p_service: parsed.serviceId,
        p_zip: parsed.zip,
        p_from: parsed.from,
        p_to: parsed.to,
      },
      db
    );

    const slots = rows.map((r) => ({
      start: r.slot_start,
      end: r.slot_end,
      lowAvailability: r.remaining <= 2,
      remaining: r.remaining,
    }));

    return NextResponse.json(
      { slots },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return handleRouteError(err);
  }
}
