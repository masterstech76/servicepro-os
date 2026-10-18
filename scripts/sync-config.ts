import { createClient } from "@supabase/supabase-js";
import "./verify-env";
import { businessConfig } from "../config/business.config";
import { isRemoteSupabaseConfigured } from "../src/lib/supabase/middleware";
import { getLocalDb, seedStoreFromConfigAndDemo } from "../src/lib/server/local-db-fallback";

export async function syncConfig(options?: { prune?: boolean }) {
  const prune = options?.prune ?? process.argv.includes("--prune");

  console.log(`[sync-config] Syncing "${businessConfig.businessName}" (slug: ${businessConfig.slug})...`);
  console.log(`[sync-config] Mode: ${prune ? "PRUNE enabled (--prune)" : "Idempotent upsert (no delete)"}`);

  if (!isRemoteSupabaseConfigured()) {
    const db = getLocalDb();
    seedStoreFromConfigAndDemo(db);
    console.log(
      `[sync-config] Local DB synced: 1 business, 7 business_hours rows, ${businessConfig.zipCodes.length} service_areas, ${businessConfig.services.length} services.`
    );
    return {
      upserted: {
        businesses: 1,
        businessHours: 7,
        serviceAreas: businessConfig.zipCodes.length,
        services: businessConfig.services.length,
      },
      pruned: 0,
    };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // 1. Upsert business on slug
  const { data: biz, error: bizErr } = await supabase
    .from("businesses")
    .upsert(
      {
        name: businessConfig.businessName,
        slug: businessConfig.slug,
        phone: businessConfig.phone,
        email: businessConfig.email,
        timezone: businessConfig.timezone,
        currency: "usd",
        tax_rate_bps: businessConfig.tax.rateBps,
        tax_applies_to: businessConfig.tax.appliesTo,
        deposit_pct: businessConfig.booking.depositPct,
        tip_presets: [...businessConfig.booking.tipPresets],
        slot_interval_minutes: businessConfig.booking.slotIntervalMinutes,
        buffer_minutes: businessConfig.booking.bufferMinutes,
        min_notice_hours: businessConfig.booking.minNoticeHours,
        max_advance_days: businessConfig.booking.maxAdvanceDays,
        cancellation_window_hours: businessConfig.policy.cancellationWindowHours,
        hold_minutes: businessConfig.booking.holdMinutes,
        review_url: businessConfig.sms.reviewUrl,
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (bizErr || !biz) {
    throw new Error(`Failed to upsert business: ${bizErr?.message}`);
  }

  const businessId = biz.id as string;

  // 2. Upsert business_hours
  for (let dow = 0; dow <= 6; dow++) {
    const h = businessConfig.hours[dow as 0 | 1 | 2 | 3 | 4 | 5 | 6];
    await supabase.from("business_hours").upsert(
      {
        business_id: businessId,
        day_of_week: dow,
        open_time: h ? h.open : null,
        close_time: h ? h.close : null,
        is_closed: !h,
      },
      { onConflict: "business_id,day_of_week" }
    );
  }

  // 3. Diff & Upsert service_areas
  const { data: existingAreas } = await supabase
    .from("service_areas")
    .select("id, zip")
    .eq("business_id", businessId);

  const existingZips = new Set((existingAreas ?? []).map((a) => a.zip as string));
  const configZips = new Set(businessConfig.zipCodes);

  for (const zip of businessConfig.zipCodes) {
    await supabase.from("service_areas").upsert(
      {
        business_id: businessId,
        zip,
        city: businessConfig.city,
        state: businessConfig.state,
        surcharge_cents: zip === "33149" ? 1500 : 0,
        active: true,
      },
      { onConflict: "business_id,zip" }
    );
  }

  const extraZips = Array.from(existingZips).filter((z) => !configZips.has(z));
  if (extraZips.length > 0) {
    console.log(`[sync-config] Diff — Extra ZIPs in DB not in config: ${extraZips.join(", ")}`);
    if (prune) {
      await supabase
        .from("service_areas")
        .delete()
        .eq("business_id", businessId)
        .in("zip", extraZips);
      console.log(`[sync-config] Pruned ${extraZips.length} extra service_areas.`);
    }
  }

  // 4. Diff & Upsert services
  const { data: existingServices } = await supabase
    .from("services")
    .select("id, name")
    .eq("business_id", businessId);

  const existingNames = new Set((existingServices ?? []).map((s) => s.name as string));
  const configNames = new Set(businessConfig.services.map((s) => s.name));

  for (let i = 0; i < businessConfig.services.length; i++) {
    const svc = businessConfig.services[i];
    await supabase.from("services").upsert(
      {
        business_id: businessId,
        name: svc.name,
        description: svc.description,
        category: svc.category,
        skill_tag: svc.skillTag,
        pricing_type: svc.pricing,
        price_cents: svc.price,
        duration_minutes: svc.durationMinutes,
        min_billable_minutes: svc.minBillableMinutes ?? 60,
        deposit_pct_override: svc.depositPctOverride ?? null,
        active: true,
        sort_order: i,
      },
      { onConflict: "business_id,name" }
    );
  }

  const extraNames = Array.from(existingNames).filter((n) => !configNames.has(n));
  if (extraNames.length > 0) {
    console.log(`[sync-config] Diff — Extra services in DB not in config: ${extraNames.join(", ")}`);
    if (prune) {
      await supabase
        .from("services")
        .delete()
        .eq("business_id", businessId)
        .in("name", extraNames);
      console.log(`[sync-config] Pruned ${extraNames.length} extra services.`);
    }
  }

  console.log("[sync-config] Completed successfully.");
  return {
    upserted: {
      businesses: 1,
      businessHours: 7,
      serviceAreas: businessConfig.zipCodes.length,
      services: businessConfig.services.length,
    },
    pruned: prune ? extraZips.length + extraNames.length : 0,
  };
}

if (require.main === module) {
  syncConfig().catch((err) => {
    console.error("[sync-config] Error:", err);
    process.exit(1);
  });
}
