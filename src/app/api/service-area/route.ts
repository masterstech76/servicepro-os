import { NextResponse } from "next/server";
import { zipSchema } from "@/lib/validation/booking";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getLocalDb } from "@/lib/server/local-db-fallback";
import { handleRouteError } from "@/lib/server/api-errors";
import { businessConfig } from "@config/business.config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawZip = searchParams.get("zip") ?? "";
    const zip = zipSchema.parse(rawZip);

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .eq("slug", businessConfig.slug)
        .single();

      const bizRow = biz as { id: string } | null;
      if (bizRow) {
        const { data: area } = await supabase
          .from("service_areas")
          .select("zip, city, state, surcharge_cents, active")
          .eq("business_id", bizRow.id)
          .eq("zip", zip)
          .eq("active", true)
          .maybeSingle();

        const areaRow = area as {
          zip: string;
          city: string | null;
          state: string | null;
          surcharge_cents: number;
          active: boolean;
        } | null;

        if (!areaRow) {
          return NextResponse.json({
            served: false,
            zip,
            surchargeCents: 0,
          });
        }

        return NextResponse.json({
          served: true,
          zip: areaRow.zip,
          city: areaRow.city ?? businessConfig.city,
          state: areaRow.state ?? businessConfig.state,
          surchargeCents: areaRow.surcharge_cents,
        });
      }
    }

    // Local DB fallback
    const db = getLocalDb();
    const area = Array.from(db.service_areas.values()).find(
      (sa) => sa.zip === zip && sa.active
    );

    if (!area) {
      return NextResponse.json({
        served: false,
        zip,
        surchargeCents: 0,
      });
    }

    return NextResponse.json({
      served: true,
      zip: area.zip,
      city: area.city ?? businessConfig.city,
      state: area.state ?? businessConfig.state,
      surchargeCents: area.surcharge_cents,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
