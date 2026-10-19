import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getLocalDb } from "@/lib/server/local-db-fallback";
import { handleRouteError } from "@/lib/server/api-errors";
import { businessConfig } from "@config/business.config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data: biz } = await supabase
          .from("businesses")
          .select("id")
          .eq("slug", businessConfig.slug)
          .single();

        const bizRow = biz as { id: string } | null;
        if (bizRow) {
          const { data: rows } = await supabase
            .from("services")
            .select("*")
            .eq("business_id", bizRow.id)
            .eq("active", true)
            .order("sort_order", { ascending: true });

          if (rows && rows.length > 0) {
            const list = rows.map((r: Record<string, unknown>) => ({
              id: String(r.id),
              name: String(r.name),
              category: String(r.category ?? "General"),
              skillTag: String(r.skill_tag),
              pricing: r.pricing_type as "flat" | "hourly",
              priceCents: Number(r.price_cents),
              durationMinutes: Number(r.duration_minutes),
              minBillableMinutes: Number(r.min_billable_minutes ?? 60),
              depositPctOverride:
                r.deposit_pct_override !== null && r.deposit_pct_override !== undefined
                  ? Number(r.deposit_pct_override)
                  : null,
              description: String(r.description ?? ""),
            }));

            return NextResponse.json({ services: list });
          }
        }
      } catch (e) {
        console.warn("[api/services] Supabase query failed, falling back to local DB:", e);
      }
    }

    const db = getLocalDb();
    const services = Array.from(db.services.values())
      .filter((s) => s.active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category ?? "General",
        skillTag: s.skill_tag,
        pricing: s.pricing_type,
        priceCents: s.price_cents,
        durationMinutes: s.duration_minutes,
        minBillableMinutes: s.min_billable_minutes,
        depositPctOverride: s.deposit_pct_override,
        description: s.description ?? "",
      }));

    return NextResponse.json({ services });
  } catch (err) {
    return handleRouteError(err);
  }
}
