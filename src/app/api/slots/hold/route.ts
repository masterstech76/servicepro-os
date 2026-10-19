import { NextResponse } from "next/server";
import crypto from "crypto";
import { holdSlotRequestSchema } from "@/lib/validation/booking";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getLocalDb, rpcHoldSlot } from "@/lib/server/local-db-fallback";
import { handleRouteError } from "@/lib/server/api-errors";
import { verifyTurnstileTokenIfEnabled } from "@/lib/server/turnstile";
import { businessConfig } from "@config/business.config";
import { verifyCsrfOrigin } from "@/lib/server/csrf";
import { checkRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  // 1. CSRF Protection
  const csrf = verifyCsrfOrigin(request);
  if (!csrf.valid && csrf.response) {
    return csrf.response;
  }

  // 2. Sensitive rate limiting (20 slot holds / min per IP)
  const rl = checkRateLimit(request, { limit: 20, windowMs: 60_000, keyPrefix: "slot_hold" });
  if (!rl.allowed && rl.response) {
    return rl.response;
  }

  try {
    const body = await request.json();
    const parsed = holdSlotRequestSchema.parse(body);

    const turnstileErr = await verifyTurnstileTokenIfEnabled(parsed.turnstileToken);
    if (turnstileErr) return turnstileErr;

    const forwarded = request.headers.get("x-forwarded-for") ?? "";
    const ipHash = forwarded
      ? crypto.createHash("sha256").update(forwarded).digest("hex").slice(0, 16)
      : "";

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("id, hold_minutes")
        .eq("slug", businessConfig.slug)
        .single();

      const bizRow = biz as { id: string; hold_minutes: number } | null;
      if (bizRow) {
        const { data: holdId, error } = await (supabase.rpc as unknown as (
          fn: string,
          args: Record<string, unknown>
        ) => Promise<{ data: string | null; error: { message: string } | null }>)("hold_slot", {
          p_business: bizRow.id,
          p_service: parsed.serviceId,
          p_zip: parsed.zip,
          p_start: parsed.start,
          p_ip_hash: ipHash,
          p_payload: {},
        });

        if (error) throw new Error(error.message);

        const expiresAt = new Date(
          Date.now() + bizRow.hold_minutes * 60 * 1000
        ).toISOString();

        return NextResponse.json({ holdId, expiresAt });
      }
    }

    const db = getLocalDb();
    const biz = Array.from(db.businesses.values())[0];
    const holdId = await rpcHoldSlot(
      {
        p_business: biz.id,
        p_service: parsed.serviceId,
        p_zip: parsed.zip,
        p_start: parsed.start,
        p_ip_hash: ipHash,
        p_payload: {},
      },
      db
    );

    const holdRow = db.slot_holds.get(holdId)!;
    return NextResponse.json({
      holdId: holdRow.id,
      expiresAt: holdRow.expires_at,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
