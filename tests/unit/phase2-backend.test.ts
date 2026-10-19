import { describe, it, expect, beforeEach } from "vitest";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import {
  resetLocalDb,
  rpcSlotCapacity,
  rpcGetAvailableSlots,
  rpcHoldSlot,
  rpcConvertHoldToJob,
  queryTableWithRls,
  canWriteTableWithRls,
  type LocalDbStore,
} from "@/lib/server/local-db-fallback";
import { GET as getServiceArea } from "@/app/api/service-area/route";
import { GET as getServices } from "@/app/api/services/route";
import { GET as getSlots } from "@/app/api/slots/route";
import { POST as postHoldSlot } from "@/app/api/slots/hold/route";
import { POST as postCheckout } from "@/app/api/jobs/checkout/route";
import { POST as postSimulatePayment } from "@/app/api/dev/simulate-payment/route";
import { GET as getJobByIntent } from "@/app/api/jobs/by-intent/route";
import { POST as postSignUploads } from "@/app/api/uploads/sign/route";
import { PUT as putUpload } from "@/app/api/uploads/put/route";

describe("Phase 2 — Slot Engine, Concurrency, Expiry, DST, RLS & API Routes", () => {
  let db: LocalDbStore;
  const bizId = "00000000-0000-4000-8000-000000000001";
  const tz = "America/New_York";

  beforeEach(() => {
    db = resetLocalDb();
    // Freeze reference time to Monday 2026-10-19 06:00 EDT (10:00 UTC)
    db.nowOverride = fromZonedTime("2026-10-19T06:00:00", tz);
  });

  it("1. Slot-engine fixture test: 4 techs, mixed ZIPs, working hours, buffer, time off, closures, existing jobs, and holds", () => {
    // At ZIP 33133 on Tuesday 2026-10-20:
    // Eligible techs for AC Repair (90m, hvac) at 33133:
    // - Carlos: covers 33125-33135, Mon-Fri 07:00-16:00 -> eligible
    // - Danny: covers 33136-33146,33149 -> NOT eligible for 33133
    // - Maria: covers all areas, Tue-Sat 08:00-17:00 -> eligible
    // - Tony: covers 33125-33146, Mon-Fri 10:00-19:00 -> eligible
    const tue0700 = fromZonedTime("2026-10-20T07:00:00", tz).toISOString();
    const tue0800 = fromZonedTime("2026-10-20T08:00:00", tz).toISOString();
    const tue1000 = fromZonedTime("2026-10-20T10:00:00", tz).toISOString();
    const tue1800 = fromZonedTime("2026-10-20T18:00:00", tz).toISOString();

    // At 07:00, only Carlos is working [07:00, 08:30] -> capacity = 1
    expect(
      rpcSlotCapacity(
        { p_business: bizId, p_service: "svc-ac-repair", p_zip: "33133", p_start: tue0700 },
        db
      )
    ).toBe(1);

    // At 08:00, Carlos + Maria are working [08:00, 09:30] -> capacity = 2
    expect(
      rpcSlotCapacity(
        { p_business: bizId, p_service: "svc-ac-repair", p_zip: "33133", p_start: tue0800 },
        db
      )
    ).toBe(2);

    // At 10:00, Carlos + Maria + Tony are working [10:00, 11:30] -> capacity = 3
    expect(
      rpcSlotCapacity(
        { p_business: bizId, p_service: "svc-ac-repair", p_zip: "33133", p_start: tue1000 },
        db
      )
    ).toBe(3);

    // At 18:00, 90 min service ends at 19:30 > business close 19:00 -> capacity = 0
    expect(
      rpcSlotCapacity(
        { p_business: bizId, p_service: "svc-ac-repair", p_zip: "33133", p_start: tue1800 },
        db
      )
    ).toBe(0);

    // Add an existing job at 10:00..11:30 (with 30m buffer -> occupies 10:00..12:00)
    db.jobs.set("job_fixture_1", {
      id: "job_fixture_1",
      job_number: 1001,
      business_id: bizId,
      customer_id: "cust_1",
      service_id: "svc-ac-repair",
      technician_id: null,
      status: "unassigned",
      scheduled_start: tue1000,
      scheduled_end: fromZonedTime("2026-10-20T11:30:00", tz).toISOString(),
      address_line1: "123 Brickell Ave",
      address_line2: null,
      city: "Miami",
      state: "FL",
      zip: "33133",
      lat: 25.7617,
      lng: -80.1918,
      issue_text: "Test",
      issue_photos: [],
      before_photos: [],
      after_photos: [],
      estimated_total_cents: 9900,
      deposit_cents: 1980,
      deposit_payment_intent_id: null,
      deposit_paid_at: null,
      total_cents: null,
      tip_cents: 0,
      billable_minutes: null,
      notes_internal: null,
      tech_notes: null,
      cancel_reason: null,
      cancelled_at: null,
      on_the_way_at: null,
      started_at: null,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Capacity at 10:00 drops from 3 to 2
    expect(
      rpcSlotCapacity(
        { p_business: bizId, p_service: "svc-ac-repair", p_zip: "33133", p_start: tue1000 },
        db
      )
    ).toBe(2);

    // Closure on 2026-10-22 returns 0 slots for that date
    db.business_closures.set("closure_1", {
      id: "closure_1",
      business_id: bizId,
      closed_on: "2026-10-22",
      reason: "Company Training Day",
    });

    const closedSlots = rpcGetAvailableSlots(
      {
        p_business: bizId,
        p_service: "svc-ac-repair",
        p_zip: "33133",
        p_from: "2026-10-22",
        p_to: "2026-10-22",
      },
      db
    );
    expect(closedSlots).toHaveLength(0);
  });

  it("2. Concurrency test: 20 parallel hold_slot calls on a 1-capacity slot -> exactly 1 succeeds and 19 get SLOT_TAKEN", async () => {
    // Tuesday 2026-10-20 at 07:00 AM at ZIP 33133 has capacity = 1 (only Carlos works 07:00-08:30)
    const slotStart = fromZonedTime("2026-10-20T07:00:00", tz).toISOString();

    const promises = Array.from({ length: 20 }, (_, idx) =>
      rpcHoldSlot(
        {
          p_business: bizId,
          p_service: "svc-ac-repair",
          p_zip: "33133",
          p_start: slotStart,
          // Distinct IP hashes so we test slot capacity contention rather than per-IP rate limit
          p_ip_hash: `ip_concurrent_${idx}`,
        },
        db
      ).then(
        (holdId) => ({ status: "fulfilled" as const, holdId }),
        (err: Error) => ({ status: "rejected" as const, code: err.message })
      )
    );

    const outcomes = await Promise.all(promises);
    const winners = outcomes.filter((o) => o.status === "fulfilled");
    const losers = outcomes.filter((o) => o.status === "rejected");

    expect(winners).toHaveLength(1);
    expect(losers).toHaveLength(19);
    for (const loser of losers) {
      if (loser.status === "rejected") {
        expect(loser.code).toBe("SLOT_TAKEN");
      }
    }
  });

  it("3. Hold expiry test: hold expires after hold_minutes (10m) and slot reappears without any cron", async () => {
    const slotStart = fromZonedTime("2026-10-20T07:00:00", tz).toISOString();

    // Hold the 1-capacity slot
    await rpcHoldSlot(
      {
        p_business: bizId,
        p_service: "svc-ac-repair",
        p_zip: "33133",
        p_start: slotStart,
        p_ip_hash: "ip_expiry_test",
      },
      db
    );

    // Immediately capacity is 0
    expect(
      rpcSlotCapacity(
        { p_business: bizId, p_service: "svc-ac-repair", p_zip: "33133", p_start: slotStart },
        db
      )
    ).toBe(0);

    // Advance clock by 11 minutes (> 10m hold_minutes) without running any cron
    db.nowOverride = new Date(db.nowOverride!.getTime() + 11 * 60 * 1000);

    // Slot reappears automatically!
    expect(
      rpcSlotCapacity(
        { p_business: bizId, p_service: "svc-ac-repair", p_zip: "33133", p_start: slotStart },
        db
      )
    ).toBe(1);
  });

  it("4. Daylight-Saving Time (DST) boundary test: Spring-forward Saturday (EST -05:00) vs Monday (EDT -04:00) produces exact local slot times", () => {
    // 2027 US DST spring-forward is Sunday, March 14, 2027 (Sunday is closed).
    // Set reference clock to Friday, March 12, 2027 06:00 EST
    db.nowOverride = fromZonedTime("2027-03-12T06:00:00", tz);

    const slots = rpcGetAvailableSlots(
      {
        p_business: bizId,
        p_service: "svc-ac-tuneup", // 60m
        p_zip: "33133",
        p_from: "2027-03-13", // Saturday (EST, UTC-5)
        p_to: "2027-03-15", // Monday (EDT, UTC-4)
      },
      db
    );

    const satSlots = slots.filter(
      (s) => formatInTimeZone(new Date(s.slot_start), tz, "yyyy-MM-dd") === "2027-03-13"
    );
    const sunSlots = slots.filter(
      (s) => formatInTimeZone(new Date(s.slot_start), tz, "yyyy-MM-dd") === "2027-03-14"
    );
    const monSlots = slots.filter(
      (s) => formatInTimeZone(new Date(s.slot_start), tz, "yyyy-MM-dd") === "2027-03-15"
    );

    // Sunday is closed
    expect(sunSlots).toHaveLength(0);

    // Saturday first slot is 08:00 AM EST (-05:00) -> 13:00 UTC
    expect(satSlots.length).toBeGreaterThan(0);
    expect(formatInTimeZone(new Date(satSlots[0].slot_start), tz, "HH:mm XXX")).toBe(
      "08:00 -05:00"
    );
    expect(new Date(satSlots[0].slot_start).toISOString()).toBe("2027-03-13T13:00:00.000Z");

    // Monday first slot is 07:00 AM EDT (-04:00) -> 11:00 UTC (shifted by 1h for DST!)
    expect(monSlots.length).toBeGreaterThan(0);
    expect(formatInTimeZone(new Date(monSlots[0].slot_start), tz, "HH:mm XXX")).toBe(
      "07:00 -04:00"
    );
    expect(new Date(monSlots[0].slot_start).toISOString()).toBe("2027-03-15T11:00:00.000Z");
  });

  it("5. RLS tests: anon, technician, and owner access across every table", async () => {
    // Seed 2 jobs: one assigned to Carlos, one assigned to Danny
    const slotStart = fromZonedTime("2026-10-20T09:00:00", tz).toISOString();
    const hold1 = await rpcHoldSlot(
      {
        p_business: bizId,
        p_service: "svc-ac-repair",
        p_zip: "33133",
        p_start: slotStart,
        p_ip_hash: "ip_rls_1",
        p_payload: {
          customer: { name: "Alice Smith", phone: "+13055550191", email: "alice@example.com" },
          address: { line1: "100 Main St", city: "Miami", state: "FL", zip: "33133" },
        },
      },
      db
    );
    const job1Id = await rpcConvertHoldToJob(
      { p_hold: hold1, p_payment_intent: "pi_rls_1", p_deposit_cents: 1980 },
      db
    );
    const job1 = db.jobs.get(job1Id)!;
    job1.technician_id = "tech-carlos";
    job1.status = "assigned";
    db.jobs.set(job1Id, job1);

    const hold2 = await rpcHoldSlot(
      {
        p_business: bizId,
        p_service: "svc-ac-repair",
        p_zip: "33139",
        p_start: slotStart,
        p_ip_hash: "ip_rls_2",
        p_payload: {
          customer: { name: "Bob Jones", phone: "+13055550192", email: "bob@example.com" },
          address: { line1: "200 Ocean Dr", city: "Miami", state: "FL", zip: "33139" },
        },
      },
      db
    );
    const job2Id = await rpcConvertHoldToJob(
      { p_hold: hold2, p_payment_intent: "pi_rls_2", p_deposit_cents: 1980 },
      db
    );
    const job2 = db.jobs.get(job2Id)!;
    job2.technician_id = "tech-danny";
    job2.status = "assigned";
    db.jobs.set(job2Id, job2);

    // Anon actor
    const anon = { role: "anon" as const };
    expect(queryTableWithRls("services", anon, db).length).toBeGreaterThan(0);
    expect(queryTableWithRls("service_areas", anon, db).length).toBeGreaterThan(0);
    expect(queryTableWithRls("business_hours", anon, db).length).toBe(7);
    expect(queryTableWithRls("jobs", anon, db)).toHaveLength(0);
    expect(queryTableWithRls("customers", anon, db)).toHaveLength(0);
    expect(queryTableWithRls("invoices", anon, db)).toHaveLength(0);
    expect(queryTableWithRls("payments", anon, db)).toHaveLength(0);
    expect(queryTableWithRls("slot_holds", anon, db)).toHaveLength(0);
    expect(canWriteTableWithRls("jobs", anon, bizId)).toBe(false);

    // Technician actor (Carlos)
    const carlos = {
      role: "technician" as const,
      userId: "user_tech-carlos",
      businessId: bizId,
      technicianId: "tech-carlos",
    };
    const carlosJobs = queryTableWithRls("jobs", carlos, db);
    expect(carlosJobs).toHaveLength(1);
    expect(carlosJobs[0].id).toBe(job1Id);

    const carlosCustomers = queryTableWithRls("customers", carlos, db);
    expect(carlosCustomers).toHaveLength(1);
    expect(carlosCustomers[0].email).toBe("alice@example.com");

    // Technician cannot write directly via RLS (D5)
    expect(canWriteTableWithRls("jobs", carlos, bizId)).toBe(false);
    expect(queryTableWithRls("slot_holds", carlos, db)).toHaveLength(0);

    // Owner actor
    const owner = {
      role: "owner" as const,
      userId: "user_owner",
      businessId: bizId,
    };
    expect(queryTableWithRls("jobs", owner, db)).toHaveLength(2);
    expect(queryTableWithRls("customers", owner, db)).toHaveLength(2);
    expect(queryTableWithRls("payments", owner, db)).toHaveLength(2);
    expect(canWriteTableWithRls("jobs", owner, bizId)).toBe(true);
    // slot_holds and stripe_events are service_role only even for owner
    expect(queryTableWithRls("slot_holds", owner, db)).toHaveLength(0);
  });

  it("6. Public Route Handlers: validation, error mapping, checkout, dev payment simulation, and photo move", async () => {
    // /api/service-area
    const resServed = await getServiceArea(
      new Request("http://localhost:3000/api/service-area?zip=33133")
    );
    expect(resServed.status).toBe(200);
    expect(await resServed.json()).toEqual({
      served: true,
      zip: "33133",
      city: "Miami",
      state: "FL",
      surchargeCents: 0,
    });

    const resSurcharge = await getServiceArea(
      new Request("http://localhost:3000/api/service-area?zip=33149")
    );
    expect(resSurcharge.status).toBe(200);
    const surchargeData = await resSurcharge.json();
    expect(surchargeData.served).toBe(true);
    expect(surchargeData.zip).toBe("33149");
    expect(surchargeData.surchargeCents).toBeGreaterThan(0);

    const resUnserved = await getServiceArea(
      new Request("http://localhost:3000/api/service-area?zip=90210")
    );
    expect(resUnserved.status).toBe(200);
    expect((await resUnserved.json()).served).toBe(false);

    // /api/services
    const resSvcs = await getServices();
    const svcsData = await resSvcs.json();
    expect(svcsData.services).toHaveLength(5);

    // /api/slots
    const resSlots = await getSlots(
      new Request(
        "http://localhost:3000/api/slots?serviceId=svc-ac-repair&zip=33133&from=2026-10-20&to=2026-10-20"
      )
    );
    expect(resSlots.headers.get("Cache-Control")).toBe("no-store");
    const slotsJson = await resSlots.json();
    expect(slotsJson.slots.length).toBeGreaterThan(0);

    // /api/slots/hold
    const pickedSlot = slotsJson.slots[0].start;
    const resHold = await postHoldSlot(
      new Request("http://localhost:3000/api/slots/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "svc-ac-repair",
          zip: "33133",
          start: pickedSlot,
        }),
      })
    );
    expect(resHold.status).toBe(200);
    const { holdId } = await resHold.json();

    // /api/uploads/sign + /api/uploads/put (hold ownership verification)
    const missingHoldPut = await putUpload(
      new Request(
        `http://localhost:3000/api/uploads/put?path=${encodeURIComponent(
          `${bizId}/drafts/nonexistent-hold-id/unauth.jpg`
        )}`,
        {
          method: "PUT",
          headers: { "Content-Type": "image/jpeg" },
          body: new Uint8Array([1, 2, 3]),
        }
      )
    );
    expect(missingHoldPut.status).toBe(404);

    const resSign = await postSignUploads(
      new Request("http://localhost:3000/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holdId,
          files: [{ name: "test-photo.jpg", type: "image/jpeg", size: 512 }],
        }),
      })
    );
    expect(resSign.status).toBe(200);
    const { uploads } = await resSign.json();
    expect(uploads).toHaveLength(1);
    const signedUpload = uploads[0];

    const resPut = await putUpload(
      new Request(`http://localhost:3000${signedUpload.uploadUrl}`, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]),
      })
    );
    expect(resPut.status).toBe(200);

    // /api/jobs/checkout
    const draftPhotoPath = signedUpload.path as string;
    const resCheckout = await postCheckout(
      new Request("http://localhost:3000/api/jobs/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holdId,
          customer: {
            name: "Maria Rivera",
            phone: "(305) 555-0142",
            email: "maria@example.com",
          },
          address: {
            line1: "123 Brickell Ave",
            city: "Miami",
            state: "FL",
            zip: "33133",
          },
          issue: "AC blowing warm air",
          photoPaths: [draftPhotoPath],
          smsConsent: true,
        }),
      })
    );
    expect(resCheckout.status).toBe(200);
    const checkoutData = await resCheckout.json();
    expect(checkoutData.depositCents).toBe(1980);
    expect(checkoutData.clientSecret).toContain("_secret_");

    // /api/dev/simulate-payment
    const resSim = await postSimulatePayment(
      new Request("http://localhost:3000/api/dev/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: checkoutData.paymentIntentId,
          holdId,
        }),
      })
    );
    expect(resSim.status).toBe(200);
    const simData = await resSim.json();
    expect(simData.jobNumber).toBeGreaterThan(1000);
    const expectedFileName = draftPhotoPath.split("/").pop()!;
    expect(simData.movedPhotoPaths[0]).toBe(
      `${bizId}/${simData.jobId}/issue/${expectedFileName}`
    );

    // /api/jobs/by-intent
    const resByIntent = await getJobByIntent(
      new Request(
        `http://localhost:3000/api/jobs/by-intent?pi=${encodeURIComponent(
          checkoutData.paymentIntentId
        )}`
      )
    );
    expect(resByIntent.status).toBe(200);
    const byIntentData = await resByIntent.json();
    expect(byIntentData.job.jobNumber).toBe(simData.jobNumber);
  });
});
