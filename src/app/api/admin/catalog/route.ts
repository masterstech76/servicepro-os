import { NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export async function GET() {
  const store = getLocalDbWithDemo();
  const business = Array.from(store.businesses.values())[0];
  const services = Array.from(store.services.values()).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const serviceAreas = Array.from(store.service_areas.values()).sort((a, b) =>
    a.zip.localeCompare(b.zip)
  );
  const businessHours = Array.from(store.business_hours.values()).sort(
    (a, b) => a.day_of_week - b.day_of_week
  );
  const closures = Array.from(store.business_closures.values());
  const customers = Array.from(store.customers.values()).map((c) => {
    const custJobs = Array.from(store.jobs.values()).filter(
      (j) => j.customer_id === c.id
    );
    const totalSpentCents = custJobs
      .filter((j) => j.status === "completed")
      .reduce((sum, j) => sum + (j.total_cents ?? j.estimated_total_cents), 0);
    return {
      ...c,
      jobsCount: custJobs.length,
      totalSpentCents,
    };
  });
  const smsLogs = Array.from(store.sms_log.values()).sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );

  return NextResponse.json({
    business,
    services,
    serviceAreas,
    businessHours,
    closures,
    customers,
    smsLogs,
  });
}

export async function POST(request: Request) {
  const store = getLocalDbWithDemo();
  const biz = Array.from(store.businesses.values())[0];
  const body = (await request.json()) as {
    action: string;
    payload: Record<string, unknown>;
  };

  switch (body.action) {
    case "upsert_service": {
      const p = body.payload;
      const id = String(p.id || `svc-${Date.now().toString(36)}`);
      const existing = store.services.get(id);
      store.services.set(id, {
        id,
        business_id: biz.id,
        name: String(p.name ?? existing?.name ?? "New Service"),
        description: String(p.description ?? existing?.description ?? ""),
        category: String(p.category ?? existing?.category ?? "HVAC"),
        skill_tag: String(p.skill_tag ?? existing?.skill_tag ?? "hvac"),
        pricing_type: (p.pricing_type as "flat" | "hourly") ?? existing?.pricing_type ?? "flat",
        price_cents: Number(p.price_cents ?? existing?.price_cents ?? 9900),
        duration_minutes: Number(p.duration_minutes ?? existing?.duration_minutes ?? 60),
        min_billable_minutes: Number(p.min_billable_minutes ?? existing?.min_billable_minutes ?? 60),
        deposit_pct_override:
          p.deposit_pct_override !== undefined
            ? (p.deposit_pct_override as number | null)
            : existing?.deposit_pct_override ?? null,
        active: p.active !== undefined ? Boolean(p.active) : existing?.active ?? true,
        sort_order: existing?.sort_order ?? store.services.size,
        created_at: existing?.created_at ?? new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, service: store.services.get(id) });
    }

    case "upsert_zip": {
      const zip = String(body.payload.zip ?? "").trim();
      if (!/^\d{5}$/.test(zip)) {
        return NextResponse.json(
          { error: { code: "INVALID_ZIP", message: "5-digit US ZIP required" } },
          { status: 400 }
        );
      }
      const id = `sa_${zip}`;
      store.service_areas.set(id, {
        id,
        business_id: biz.id,
        zip,
        city: String(body.payload.city ?? biz.name.includes("Miami") ? "Miami" : "Local"),
        state: String(body.payload.state ?? "FL"),
        surcharge_cents: Number(body.payload.surcharge_cents ?? 0),
        active: body.payload.active !== undefined ? Boolean(body.payload.active) : true,
      });
      return NextResponse.json({ ok: true, serviceArea: store.service_areas.get(id) });
    }

    case "add_closure": {
      const date = String(body.payload.closed_on ?? "");
      const reason = String(body.payload.reason ?? "Holiday closure");
      const id = `cl_${date}`;
      store.business_closures.set(id, {
        id,
        business_id: biz.id,
        closed_on: date,
        reason,
      });
      return NextResponse.json({ ok: true, closure: store.business_closures.get(id) });
    }

    case "remove_closure": {
      const id = String(body.payload.id ?? "");
      store.business_closures.delete(id);
      return NextResponse.json({ ok: true });
    }

    case "update_business": {
      const p = body.payload;
      if (p.name !== undefined) biz.name = String(p.name);
      if (p.phone !== undefined) biz.phone = String(p.phone);
      if (p.email !== undefined) biz.email = String(p.email);
      if (p.deposit_pct !== undefined) biz.deposit_pct = Number(p.deposit_pct);
      if (p.tax_rate_bps !== undefined) biz.tax_rate_bps = Number(p.tax_rate_bps);
      if (p.buffer_minutes !== undefined) biz.buffer_minutes = Number(p.buffer_minutes);
      if (p.cancellation_window_hours !== undefined) {
        biz.cancellation_window_hours = Number(p.cancellation_window_hours);
      }
      store.businesses.set(biz.id, biz);
      return NextResponse.json({ ok: true, business: biz });
    }

    case "toggle_customer_sms": {
      const custId = String(body.payload.customerId ?? "");
      const cust = store.customers.get(custId);
      if (cust) {
        cust.sms_opt_out = Boolean(body.payload.smsOptOut);
        store.customers.set(custId, cust);
      }
      return NextResponse.json({ ok: true, customer: cust });
    }

    default:
      return NextResponse.json(
        { error: { code: "UNKNOWN_ACTION", message: "Unsupported action" } },
        { status: 400 }
      );
  }
}
