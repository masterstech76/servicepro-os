import { NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { checkoutRequestSchema } from "@/lib/validation/booking";
import { computeBookingEstimate } from "@/lib/domain/pricing";
import { normalizeUSPhone } from "@/lib/domain/format";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getLocalDb, getDbNow, DbException } from "@/lib/server/local-db-fallback";
import { geocodeAddress } from "@/lib/server/mapbox";
import { handleRouteError } from "@/lib/server/api-errors";
import { businessConfig } from "@config/business.config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutRequestSchema.parse(body);

    const normalizedPhone = normalizeUSPhone(parsed.customer.phone) ?? parsed.customer.phone;
    const geo = await geocodeAddress(parsed.address);

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data: hold } = await supabase
        .from("slot_holds")
        .select("*")
        .eq("id", parsed.holdId)
        .maybeSingle();

      const holdRow = hold as {
        id: string;
        business_id: string;
        service_id: string;
        zip: string;
        expires_at: string;
        converted_job_id: string | null;
      } | null;

      if (!holdRow || holdRow.converted_job_id) {
        throw new DbException("HOLD_NOT_FOUND");
      }
      if (new Date(holdRow.expires_at) <= new Date()) {
        throw new DbException("HOLD_EXPIRED");
      }

      const { data: area } = await supabase
        .from("service_areas")
        .select("*")
        .eq("business_id", holdRow.business_id)
        .eq("zip", parsed.address.zip)
        .eq("active", true)
        .maybeSingle();

      const areaRow = area as { surcharge_cents: number } | null;
      if (!areaRow) {
        throw new DbException("ZIP_NOT_SERVED");
      }

      const { data: svc } = await supabase
        .from("services")
        .select("*")
        .eq("id", holdRow.service_id)
        .single();

      const svcRow = svc as unknown as {
        pricing_type: "flat" | "hourly";
        price_cents: number;
        duration_minutes: number;
        min_billable_minutes: number;
        deposit_pct_override: number | null;
      };

      const est = computeBookingEstimate({
        pricingType: svcRow.pricing_type,
        priceCents: svcRow.price_cents,
        durationMinutes: svcRow.duration_minutes,
        minBillableMinutes: svcRow.min_billable_minutes,
        surchargeCents: areaRow.surcharge_cents,
        depositPct: businessConfig.booking.depositPct,
        depositPctOverride: svcRow.deposit_pct_override,
      });

      const paymentIntentId = `pi_fake_${holdRow.id}`;
      const clientSecret = `${paymentIntentId}_secret_phase2`;
      const payload = {
        customer: {
          name: parsed.customer.name,
          phone: normalizedPhone,
          email: parsed.customer.email.toLowerCase(),
        },
        address: {
          ...parsed.address,
          lat: geo.lat,
          lng: geo.lng,
        },
        issue: parsed.issue,
        photoPaths: parsed.photoPaths,
        smsConsent: parsed.smsConsent,
        estimatedTotalCents: est.estimateCents,
        depositCents: est.depositCents,
      };

      const extendedExpiry = addMinutes(new Date(holdRow.expires_at), 5).toISOString();

      await (supabase.from("slot_holds") as unknown as {
        update: (v: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<unknown> };
      })
        .update({
          payload,
          stripe_payment_intent_id: paymentIntentId,
          expires_at: extendedExpiry,
        })
        .eq("id", holdRow.id);

      return NextResponse.json({
        clientSecret,
        paymentIntentId,
        depositCents: est.depositCents,
        totalEstimateCents: est.estimateCents,
        remainingEstimateCents: est.remainingEstimateCents,
      });
    }

    // Local DB fallback
    const db = getLocalDb();
    const hold = db.slot_holds.get(parsed.holdId);
    const now = getDbNow(db);
    if (!hold || hold.converted_job_id !== null) {
      throw new DbException("HOLD_NOT_FOUND");
    }
    if (new Date(hold.expires_at) <= now) {
      throw new DbException("HOLD_EXPIRED");
    }

    const area = Array.from(db.service_areas.values()).find(
      (sa) => sa.business_id === hold.business_id && sa.zip === parsed.address.zip && sa.active
    );
    if (!area) {
      throw new DbException("ZIP_NOT_SERVED");
    }

    const svc = db.services.get(hold.service_id);
    if (!svc) {
      throw new DbException("SERVICE_NOT_FOUND");
    }

    const est = computeBookingEstimate({
      pricingType: svc.pricing_type,
      priceCents: svc.price_cents,
      durationMinutes: svc.duration_minutes,
      minBillableMinutes: svc.min_billable_minutes,
      surchargeCents: area.surcharge_cents,
      depositPct: businessConfig.booking.depositPct,
      depositPctOverride: svc.deposit_pct_override,
    });

    const paymentIntentId = `pi_fake_${hold.id}`;
    const clientSecret = `${paymentIntentId}_secret_phase2`;

    hold.payload = {
      customer: {
        name: parsed.customer.name,
        phone: normalizedPhone,
        email: parsed.customer.email.toLowerCase(),
      },
      address: {
        ...parsed.address,
        lat: geo.lat,
        lng: geo.lng,
      },
      issue: parsed.issue,
      photoPaths: parsed.photoPaths,
      smsConsent: parsed.smsConsent,
      estimatedTotalCents: est.estimateCents,
      depositCents: est.depositCents,
    };
    hold.stripe_payment_intent_id = paymentIntentId;
    hold.expires_at = addMinutes(new Date(hold.expires_at), 5).toISOString();
    db.slot_holds.set(hold.id, hold);

    return NextResponse.json({
      clientSecret,
      paymentIntentId,
      depositCents: est.depositCents,
      totalEstimateCents: est.estimateCents,
      remainingEstimateCents: est.remainingEstimateCents,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
