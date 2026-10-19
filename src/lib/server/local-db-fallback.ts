import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { addMinutes, addDays } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import type { Database, JobStatus, UserRole } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

export interface RlsActorContext {
  role: "anon" | UserRole;
  userId?: string;
  businessId?: string;
  technicianId?: string;
}

export class DbException extends Error {
  code: string;
  errcode: string;
  constructor(message: string, errcode = "P0001") {
    super(message);
    this.name = "DbException";
    this.code = message;
    this.errcode = errcode;
  }
}

export interface LocalDbStore {
  businesses: Map<string, Tables["businesses"]["Row"]>;
  profiles: Map<string, Tables["profiles"]["Row"]>;
  service_areas: Map<string, Tables["service_areas"]["Row"]>;
  business_hours: Map<string, Tables["business_hours"]["Row"]>;
  business_closures: Map<string, Tables["business_closures"]["Row"]>;
  services: Map<string, Tables["services"]["Row"]>;
  technicians: Map<string, Tables["technicians"]["Row"]>;
  technician_hours: Map<string, Tables["technician_hours"]["Row"]>;
  technician_time_off: Map<string, Tables["technician_time_off"]["Row"]>;
  customers: Map<string, Tables["customers"]["Row"]>;
  jobs: Map<string, Tables["jobs"]["Row"]>;
  invoices: Map<string, Tables["invoices"]["Row"]>;
  invoice_line_items: Map<string, Tables["invoice_line_items"]["Row"]>;
  payments: Map<string, Tables["payments"]["Row"]>;
  slot_holds: Map<string, Tables["slot_holds"]["Row"]>;
  job_events: Map<string, Tables["job_events"]["Row"]>;
  sms_log: Map<string, Tables["sms_log"]["Row"]>;
  stripe_events: Map<string, Tables["stripe_events"]["Row"]>;
  storage_objects: Map<string, { bucket: string; path: string; size: number; mimeType: string; data?: Buffer }>;
  advisory_locks: Map<string, Promise<void>>;
  jobSequence: number;
  nowOverride: Date | null;
  demoCleared?: boolean;
}

const globalForDb = globalThis as unknown as { __serviceProLocalDb?: LocalDbStore };

const PERSIST_FILE =
  process.env.LOCAL_DB_PATH ||
  path.join(os.tmpdir(), `servicepro-os-${businessConfig.slug}-db.json`);

export function saveLocalDbToDisk(store = getLocalDb()): void {
  if (process.env.VITEST || process.env.NODE_ENV === "test") return;
  try {
    const dir = path.dirname(PERSIST_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const snapshot = {
      jobSequence: store.jobSequence,
      demoCleared: Boolean(store.demoCleared),
      businesses: Array.from(store.businesses.entries()),
      service_areas: Array.from(store.service_areas.entries()),
      business_hours: Array.from(store.business_hours.entries()),
      business_closures: Array.from(store.business_closures.entries()),
      services: Array.from(store.services.entries()),
      technicians: Array.from(store.technicians.entries()),
      technician_hours: Array.from(store.technician_hours.entries()),
      technician_time_off: Array.from(store.technician_time_off.entries()),
      customers: Array.from(store.customers.entries()),
      jobs: Array.from(store.jobs.entries()),
      invoices: Array.from(store.invoices.entries()),
      invoice_line_items: Array.from(store.invoice_line_items.entries()),
      payments: Array.from(store.payments.entries()),
      slot_holds: Array.from(store.slot_holds.entries()),
      job_events: Array.from(store.job_events.entries()),
      sms_log: Array.from(store.sms_log.entries()),
      stripe_events: Array.from(store.stripe_events.entries()),
    };
    fs.writeFileSync(PERSIST_FILE, JSON.stringify(snapshot), "utf8");
  } catch {
    // Ignore transient disk write errors
  }
}

function createInitialStore(loadDisk = false): LocalDbStore {
  const store: LocalDbStore = {
    businesses: new Map(),
    profiles: new Map(),
    service_areas: new Map(),
    business_hours: new Map(),
    business_closures: new Map(),
    services: new Map(),
    technicians: new Map(),
    technician_hours: new Map(),
    technician_time_off: new Map(),
    customers: new Map(),
    jobs: new Map(),
    invoices: new Map(),
    invoice_line_items: new Map(),
    payments: new Map(),
    slot_holds: new Map(),
    job_events: new Map(),
    sms_log: new Map(),
    stripe_events: new Map(),
    storage_objects: new Map(),
    advisory_locks: new Map(),
    jobSequence: 1000,
    nowOverride: null,
    demoCleared: false,
  };

  seedStoreFromConfigAndDemo(store);

  if (
    loadDisk &&
    !process.env.VITEST &&
    process.env.NODE_ENV !== "test" &&
    fs.existsSync(PERSIST_FILE)
  ) {
    try {
      const raw = JSON.parse(fs.readFileSync(PERSIST_FILE, "utf8")) as Record<string, unknown>;
      if (typeof raw.jobSequence === "number") store.jobSequence = raw.jobSequence;
      if (typeof raw.demoCleared === "boolean") store.demoCleared = raw.demoCleared;
      if (Array.isArray(raw.customers)) store.customers = new Map(raw.customers);
      if (Array.isArray(raw.jobs)) store.jobs = new Map(raw.jobs);
      if (Array.isArray(raw.invoices)) store.invoices = new Map(raw.invoices);
      if (Array.isArray(raw.invoice_line_items)) {
        store.invoice_line_items = new Map(raw.invoice_line_items);
      }
      if (Array.isArray(raw.payments)) store.payments = new Map(raw.payments);
      if (Array.isArray(raw.slot_holds)) store.slot_holds = new Map(raw.slot_holds);
      if (Array.isArray(raw.job_events)) store.job_events = new Map(raw.job_events);
      if (Array.isArray(raw.sms_log)) store.sms_log = new Map(raw.sms_log);
      if (Array.isArray(raw.stripe_events)) store.stripe_events = new Map(raw.stripe_events);
      if (Array.isArray(raw.business_closures)) {
        store.business_closures = new Map(raw.business_closures);
      }
    } catch {
      // Ignore corrupt snapshot
    }
  }

  return store;
}

export function getLocalDb(): LocalDbStore {
  if (!globalForDb.__serviceProLocalDb) {
    globalForDb.__serviceProLocalDb = createInitialStore(true);
  }
  return globalForDb.__serviceProLocalDb;
}

export function resetLocalDb(): LocalDbStore {
  globalForDb.__serviceProLocalDb = createInitialStore(false);
  return globalForDb.__serviceProLocalDb;
}

export function getDbNow(store = getLocalDb()): Date {
  return store.nowOverride ? new Date(store.nowOverride) : new Date();
}

export function seedStoreFromConfigAndDemo(store: LocalDbStore): void {
  const bizId = "00000000-0000-4000-8000-000000000001";
  const nowIso = new Date().toISOString();

  store.businesses.set(bizId, {
    id: bizId,
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
    created_at: nowIso,
  });

  // Service areas
  for (const zip of businessConfig.zipCodes) {
    const id = `sa_${zip}`;
    store.service_areas.set(id, {
      id,
      business_id: bizId,
      zip,
      city: businessConfig.city,
      state: businessConfig.state,
      surcharge_cents: zip === "33149" ? 1500 : 0,
      active: true,
    });
  }

  // Business hours (0 = Sunday .. 6 = Saturday)
  for (let dow = 0; dow <= 6; dow++) {
    const h = businessConfig.hours[dow as 0 | 1 | 2 | 3 | 4 | 5 | 6];
    const id = `bh_${dow}`;
    store.business_hours.set(id, {
      id,
      business_id: bizId,
      day_of_week: dow,
      open_time: h ? h.open : null,
      close_time: h ? h.close : null,
      is_closed: !h,
    });
  }

  // Services
  businessConfig.services.forEach((svc, idx) => {
    store.services.set(svc.id, {
      id: svc.id,
      business_id: bizId,
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
      sort_order: idx,
      created_at: nowIso,
    });
  });

  // 4 Demo Technicians per PHASES.md Phase 2:
  // 1. Carlos Mendez (skills hvac; covers 33125–33135; Mon–Fri 7–16)
  // 2. Danny Reyes (hvac; 33136–33146,33149; Mon–Fri 9–18)
  // 3. Maria Alvarez (hvac; all areas; Tue–Sat 8–17)
  // 4. Tony Brooks (hvac; 33125–33146; Mon–Fri 10–19) + 1 time-off next Wednesday
  const zips33125_33135: string[] = [];
  for (let z = 33125; z <= 33135; z++) zips33125_33135.push(String(z));

  const zips33136_33146_33149: string[] = [];
  for (let z = 33136; z <= 33146; z++) zips33136_33146_33149.push(String(z));
  zips33136_33146_33149.push("33149");

  const zips33125_33146: string[] = [];
  for (let z = 33125; z <= 33146; z++) zips33125_33146.push(String(z));

  const demoTechs = [
    {
      id: "tech-carlos",
      name: "Carlos Mendez",
      phone: "(305) 555-0101",
      email: "carlos@coolairmiami.com",
      skills: ["hvac"],
      zip_codes: zips33125_33135,
      commission_pct: 20,
      color: "#3B82F6",
      days: [1, 2, 3, 4, 5],
      start: "07:00",
      end: "16:00",
    },
    {
      id: "tech-danny",
      name: "Danny Reyes",
      phone: "(305) 555-0102",
      email: "danny@coolairmiami.com",
      skills: ["hvac"],
      zip_codes: zips33136_33146_33149,
      commission_pct: 20,
      color: "#14B8A6",
      days: [1, 2, 3, 4, 5],
      start: "09:00",
      end: "18:00",
    },
    {
      id: "tech-maria",
      name: "Maria Alvarez",
      phone: "(305) 555-0103",
      email: "maria@coolairmiami.com",
      skills: ["hvac"],
      zip_codes: [], // all areas
      commission_pct: 22,
      color: "#A855F7",
      days: [2, 3, 4, 5, 6],
      start: "08:00",
      end: "17:00",
    },
    {
      id: "tech-tony",
      name: "Tony Brooks",
      phone: "(305) 555-0104",
      email: "tony@coolairmiami.com",
      skills: ["hvac"],
      zip_codes: zips33125_33146,
      commission_pct: 18,
      color: "#EC4899",
      days: [1, 2, 3, 4, 5],
      start: "10:00",
      end: "19:00",
    },
  ];

  for (const t of demoTechs) {
    store.technicians.set(t.id, {
      id: t.id,
      business_id: bizId,
      user_id: `user_${t.id}`,
      name: t.name,
      phone: t.phone,
      email: t.email,
      skills: t.skills,
      zip_codes: t.zip_codes,
      commission_pct: t.commission_pct,
      color: t.color,
      home_lat: 25.7617,
      home_lng: -80.1918,
      active: true,
      created_at: nowIso,
    });

    for (const d of t.days) {
      const thId = `th_${t.id}_${d}`;
      store.technician_hours.set(thId, {
        id: thId,
        business_id: bizId,
        technician_id: t.id,
        day_of_week: d,
        start_time: t.start,
        end_time: t.end,
      });
    }

    store.profiles.set(`user_${t.id}`, {
      id: `user_${t.id}`,
      business_id: bizId,
      role: "technician",
      technician_id: t.id,
      full_name: t.name,
      created_at: nowIso,
    });
  }

  // Owner profile
  store.profiles.set("user_owner", {
    id: "user_owner",
    business_id: bizId,
    role: "owner",
    technician_id: null,
    full_name: "Owner Admin",
    created_at: nowIso,
  });

  // Tony Brooks time off next Wednesday
  const today = new Date();
  let nextWed = addDays(today, 1);
  while (Number(formatInTimeZone(nextWed, businessConfig.timezone, "i")) !== 3) {
    nextWed = addDays(nextWed, 1);
  }
  const wedStr = formatInTimeZone(nextWed, businessConfig.timezone, "yyyy-MM-dd");
  const startsAt = fromZonedTime(`${wedStr}T00:00:00`, businessConfig.timezone).toISOString();
  const endsAt = fromZonedTime(`${wedStr}T23:59:59`, businessConfig.timezone).toISOString();

  store.technician_time_off.set("tto_tony_wed", {
    id: "tto_tony_wed",
    business_id: bizId,
    technician_id: "tech-tony",
    starts_at: startsAt,
    ends_at: endsAt,
    reason: "Personal day off",
  });
}

/**
 * Advisory lock helper (simulates pg_advisory_xact_lock per key)
 */
async function withAdvisoryLock<T>(
  store: LocalDbStore,
  key: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const prev = store.advisory_locks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  store.advisory_locks.set(
    key,
    prev.then(() => current)
  );

  await prev;
  try {
    return await fn();
  } finally {
    release();
  }
}

/**
 * Exact implementation of migration 0004 `slot_capacity(p_business, p_service, p_zip, p_start)`
 */
export function rpcSlotCapacity(
  params: {
    p_business: string;
    p_service: string;
    p_zip: string;
    p_start: string;
  },
  store = getLocalDb()
): number {
  const { p_business, p_service, p_zip, p_start } = params;
  const biz = store.businesses.get(p_business);
  if (!biz) return 0;

  // 1. Zip check
  const areaServed = Array.from(store.service_areas.values()).some(
    (sa) => sa.business_id === p_business && sa.zip === p_zip && sa.active
  );
  if (!areaServed) return 0;

  const svc = store.services.get(p_service);
  if (!svc || svc.business_id !== p_business || !svc.active) return 0;

  const startMs = new Date(p_start).getTime();
  const nowMs = getDbNow(store).getTime();

  // Check min_notice_hours
  if (startMs < nowMs + biz.min_notice_hours * 3600 * 1000) {
    return 0;
  }

  const tz = biz.timezone;
  const localDate = formatInTimeZone(new Date(startMs), tz, "yyyy-MM-dd");
  const isoDow = Number(formatInTimeZone(new Date(startMs), tz, "i")); // 1..7 (7 = Sun)
  const dow = isoDow === 7 ? 0 : isoDow;

  // Check max_advance_days
  const todayLocalStr = formatInTimeZone(new Date(nowMs), tz, "yyyy-MM-dd");
  const maxDateStr = formatInTimeZone(
    addDays(fromZonedTime(`${todayLocalStr}T12:00:00`, tz), biz.max_advance_days),
    tz,
    "yyyy-MM-dd"
  );
  if (localDate > maxDateStr) return 0;

  // Check business_closures
  const isClosedHoliday = Array.from(store.business_closures.values()).some(
    (c) => c.business_id === p_business && c.closed_on === localDate
  );
  if (isClosedHoliday) return 0;

  // Check business_hours
  const bh = Array.from(store.business_hours.values()).find(
    (h) => h.business_id === p_business && h.day_of_week === dow
  );
  if (!bh || bh.is_closed || !bh.open_time || !bh.close_time) return 0;

  const dayOpenMs = fromZonedTime(`${localDate}T${bh.open_time}:00`, tz).getTime();
  const dayCloseMs = fromZonedTime(`${localDate}T${bh.close_time}:00`, tz).getTime();
  const endMs = startMs + svc.duration_minutes * 60 * 1000;
  const occEndMs = endMs + biz.buffer_minutes * 60 * 1000;

  if (startMs < dayOpenMs || endMs > dayCloseMs) return 0;

  // 4. Eligible techs
  const eligibleTechs = Array.from(store.technicians.values()).filter(
    (t) =>
      t.business_id === p_business &&
      t.active &&
      t.skills.includes(svc.skill_tag) &&
      (t.zip_codes.length === 0 || t.zip_codes.includes(p_zip))
  );

  // 7. techCount(start): window contains [start, start + D] and no time-off overlap
  let techCount = 0;
  const eligibleTechIds = new Set<string>();
  for (const t of eligibleTechs) {
    eligibleTechIds.add(t.id);
    const th = Array.from(store.technician_hours.values()).find(
      (h) => h.technician_id === t.id && h.day_of_week === dow
    );
    if (!th) continue;

    const techOpenMs = Math.max(
      dayOpenMs,
      fromZonedTime(`${localDate}T${th.start_time}:00`, tz).getTime()
    );
    const techCloseMs = Math.min(
      dayCloseMs,
      fromZonedTime(`${localDate}T${th.end_time}:00`, tz).getTime()
    );

    if (startMs < techOpenMs || endMs > techCloseMs) continue;

    const hasTimeOffOverlap = Array.from(store.technician_time_off.values()).some(
      (tto) =>
        tto.technician_id === t.id &&
        new Date(tto.starts_at).getTime() < endMs &&
        new Date(tto.ends_at).getTime() > startMs
    );
    if (hasTimeOffOverlap) continue;

    techCount += 1;
  }

  if (techCount <= 0) return 0;

  // 8a. busy jobs over [startMs, occEndMs)
  let busyJobs = 0;
  for (const j of Array.from(store.jobs.values())) {
    if (j.business_id !== p_business) continue;
    if (j.status === "cancelled" || j.status === "completed") continue;

    const jStartMs = new Date(j.scheduled_start).getTime();
    const jOccEndMs = new Date(j.scheduled_end).getTime() + biz.buffer_minutes * 60 * 1000;

    if (jStartMs < occEndMs && jOccEndMs > startMs) {
      const jSvc = store.services.get(j.service_id);
      const matchesEligibleTech = j.technician_id !== null && eligibleTechIds.has(j.technician_id);
      const matchesUnassignedSkill =
        j.technician_id === null && jSvc?.skill_tag === svc.skill_tag;
      if (matchesEligibleTech || matchesUnassignedSkill) {
        busyJobs += 1;
      }
    }
  }

  // 8b. busy unexpired unconverted holds over [startMs, occEndMs)
  let busyHolds = 0;
  for (const h of Array.from(store.slot_holds.values())) {
    if (h.business_id !== p_business) continue;
    if (h.converted_job_id !== null) continue;
    if (new Date(h.expires_at).getTime() <= nowMs) continue;

    const hSvc = store.services.get(h.service_id);
    if (hSvc?.skill_tag !== svc.skill_tag) continue;

    const hStartMs = new Date(h.starts_at).getTime();
    const hOccEndMs = new Date(h.ends_at).getTime() + biz.buffer_minutes * 60 * 1000;
    if (hStartMs < occEndMs && hOccEndMs > startMs) {
      busyHolds += 1;
    }
  }

  return Math.max(0, techCount - (busyJobs + busyHolds));
}

/**
 * Exact implementation of migration 0004 `get_available_slots(p_business, p_service, p_zip, p_from, p_to)`
 */
export function rpcGetAvailableSlots(
  params: {
    p_business: string;
    p_service: string;
    p_zip: string;
    p_from: string;
    p_to: string;
  },
  store = getLocalDb()
): Array<{ slot_start: string; slot_end: string; remaining: number }> {
  const { p_business, p_service, p_zip, p_from, p_to } = params;
  const biz = store.businesses.get(p_business);
  if (!biz) return [];

  const areaServed = Array.from(store.service_areas.values()).some(
    (sa) => sa.business_id === p_business && sa.zip === p_zip && sa.active
  );
  if (!areaServed) return [];

  const svc = store.services.get(p_service);
  if (!svc || svc.business_id !== p_business || !svc.active) return [];

  const tz = biz.timezone;
  const results: Array<{ slot_start: string; slot_end: string; remaining: number }> = [];

  // Iterate dates in business timezone up to 14 days max
  let curNoonUtc = fromZonedTime(`${p_from}T12:00:00`, tz);
  for (let dayIdx = 0; dayIdx < 14; dayIdx++) {
    const curDateStr = formatInTimeZone(curNoonUtc, tz, "yyyy-MM-dd");
    if (curDateStr > p_to) break;

    const isoDow = Number(formatInTimeZone(curNoonUtc, tz, "i"));
    const dow = isoDow === 7 ? 0 : isoDow;

    const bh = Array.from(store.business_hours.values()).find(
      (h) => h.business_id === p_business && h.day_of_week === dow
    );

    const isClosedHoliday = Array.from(store.business_closures.values()).some(
      (c) => c.business_id === p_business && c.closed_on === curDateStr
    );

    if (bh && !bh.is_closed && bh.open_time && bh.close_time && !isClosedHoliday) {
      let candUtc = fromZonedTime(`${curDateStr}T${bh.open_time}:00`, tz);
      const closeUtc = fromZonedTime(`${curDateStr}T${bh.close_time}:00`, tz);

      while (addMinutes(candUtc, svc.duration_minutes).getTime() <= closeUtc.getTime()) {
        const candIso = candUtc.toISOString();
        const rem = rpcSlotCapacity(
          {
            p_business,
            p_service,
            p_zip,
            p_start: candIso,
          },
          store
        );
        if (rem >= 1) {
          results.push({
            slot_start: candIso,
            slot_end: addMinutes(candUtc, svc.duration_minutes).toISOString(),
            remaining: rem,
          });
        }
        candUtc = addMinutes(candUtc, biz.slot_interval_minutes);
      }
    }

    curNoonUtc = addDays(curNoonUtc, 1);
  }

  return results;
}

/**
 * Exact implementation of migration 0004 `hold_slot` with advisory lock
 */
export async function rpcHoldSlot(
  params: {
    p_business: string;
    p_service: string;
    p_zip: string;
    p_start: string;
    p_ip_hash: string;
    p_payload?: Record<string, unknown>;
  },
  store = getLocalDb()
): Promise<string> {
  const { p_business, p_service, p_zip, p_start, p_ip_hash, p_payload } = params;
  const biz = store.businesses.get(p_business);
  if (!biz) throw new DbException("BUSINESS_NOT_FOUND");

  const areaServed = Array.from(store.service_areas.values()).some(
    (sa) => sa.business_id === p_business && sa.zip === p_zip && sa.active
  );
  if (!areaServed) throw new DbException("ZIP_NOT_SERVED");

  const svc = store.services.get(p_service);
  if (!svc || svc.business_id !== p_business || !svc.active) {
    throw new DbException("SERVICE_NOT_FOUND");
  }

  const localDate = formatInTimeZone(new Date(p_start), biz.timezone, "yyyy-MM-dd");
  const lockKey = `${p_business}:${localDate}`;

  return withAdvisoryLock(store, lockKey, () => {
    const now = getDbNow(store);
    const nowMs = now.getTime();

    // 1. Delete expired holds
    for (const [hId, h] of Array.from(store.slot_holds.entries())) {
      if (
        h.business_id === p_business &&
        h.converted_job_id === null &&
        new Date(h.expires_at).getTime() <= nowMs
      ) {
        store.slot_holds.delete(hId);
      }
    }

    // 2. Check IP active holds >= 3 -> TOO_MANY_HOLDS
    if (p_ip_hash) {
      const ipHolds = Array.from(store.slot_holds.values()).filter(
        (h) =>
          h.business_id === p_business &&
          h.ip_hash === p_ip_hash &&
          h.converted_job_id === null &&
          new Date(h.expires_at).getTime() > nowMs
      );
      if (ipHolds.length >= 3) {
        throw new DbException("TOO_MANY_HOLDS");
      }
    }

    // 3. Check slot_capacity >= 1 else SLOT_TAKEN
    const cap = rpcSlotCapacity(
      { p_business, p_service, p_zip, p_start },
      store
    );
    if (cap < 1) {
      throw new DbException("SLOT_TAKEN");
    }

    const holdId = `hold_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const startsAt = new Date(p_start).toISOString();
    const endsAt = addMinutes(new Date(p_start), svc.duration_minutes).toISOString();
    const expiresAt = addMinutes(now, biz.hold_minutes).toISOString();

    store.slot_holds.set(holdId, {
      id: holdId,
      business_id: p_business,
      service_id: p_service,
      zip: p_zip,
      starts_at: startsAt,
      ends_at: endsAt,
      expires_at: expiresAt,
      ip_hash: p_ip_hash,
      payload: (p_payload ?? {}) as Database["public"]["Tables"]["slot_holds"]["Row"]["payload"],
      stripe_payment_intent_id: null,
      converted_job_id: null,
      created_at: now.toISOString(),
    });

    return holdId;
  });
}

/**
 * Exact implementation of migration 0004 `convert_hold_to_job`
 */
export async function rpcConvertHoldToJob(
  params: {
    p_hold: string;
    p_payment_intent: string;
    p_deposit_cents: number;
  },
  store = getLocalDb()
): Promise<string> {
  const { p_hold, p_payment_intent, p_deposit_cents } = params;

  // Idempotent on p_payment_intent
  if (p_payment_intent) {
    const existingByPi = Array.from(store.jobs.values()).find(
      (j) => j.deposit_payment_intent_id === p_payment_intent
    );
    if (existingByPi) return existingByPi.id;
  }

  const hold = store.slot_holds.get(p_hold);
  if (!hold) throw new DbException("HOLD_NOT_FOUND");
  if (hold.converted_job_id) return hold.converted_job_id;

  const biz = store.businesses.get(hold.business_id);
  if (!biz) throw new DbException("BUSINESS_NOT_FOUND");

  const localDate = formatInTimeZone(new Date(hold.starts_at), biz.timezone, "yyyy-MM-dd");
  const lockKey = `${hold.business_id}:${localDate}`;

  return withAdvisoryLock(store, lockKey, () => {
    const now = getDbNow(store);
    // Re-check if already converted while waiting for lock
    if (hold.converted_job_id) return hold.converted_job_id;

    // If hold expired, re-check capacity
    if (new Date(hold.expires_at).getTime() <= now.getTime()) {
      const cap = rpcSlotCapacity(
        {
          p_business: hold.business_id,
          p_service: hold.service_id,
          p_zip: hold.zip,
          p_start: hold.starts_at,
        },
        store
      );
      if (cap < 1) {
        throw new DbException("SLOT_LOST");
      }
    }

    const payload = (hold.payload ?? {}) as Record<string, unknown>;
    const custPayload = (payload.customer ?? {}) as Record<string, string>;
    const addrPayload = (payload.address ?? {}) as Record<string, unknown>;
    const photoPaths = Array.isArray(payload.photoPaths)
      ? (payload.photoPaths as string[])
      : [];

    const email = (custPayload.email ?? "customer@example.com").toLowerCase();
    let customer = Array.from(store.customers.values()).find(
      (c) => c.business_id === hold.business_id && c.email.toLowerCase() === email
    );

    const cardBrand = String(payload.cardBrand ?? custPayload.cardBrand ?? "visa");
    const cardLast4 = String(payload.cardLast4 ?? custPayload.cardLast4 ?? "4242");
    const stripeCustomerId = String(
      payload.stripeCustomerId ?? `cus_${hold.id.replace(/[^a-zA-Z0-9]/g, "").slice(-10)}`
    );
    const stripePaymentMethodId = String(
      payload.stripePaymentMethodId ?? `pm_${hold.id.replace(/[^a-zA-Z0-9]/g, "").slice(-10)}`
    );

    if (!customer) {
      const custId = `cust_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      customer = {
        id: custId,
        business_id: hold.business_id,
        name: custPayload.name ?? "Customer",
        phone: custPayload.phone ?? "+13055550100",
        email,
        stripe_customer_id: stripeCustomerId,
        stripe_payment_method_id: stripePaymentMethodId,
        card_brand: cardBrand,
        card_last4: cardLast4,
        sms_opt_out: false,
        sms_consent_at: now.toISOString(),
        created_at: now.toISOString(),
      };
      store.customers.set(custId, customer);
    } else {
      customer.name = custPayload.name ?? customer.name;
      customer.phone = custPayload.phone ?? customer.phone;
      customer.card_brand = customer.card_brand ?? cardBrand;
      customer.card_last4 = customer.card_last4 ?? cardLast4;
      customer.stripe_customer_id = customer.stripe_customer_id ?? stripeCustomerId;
      customer.stripe_payment_method_id =
        customer.stripe_payment_method_id ?? stripePaymentMethodId;
      store.customers.set(customer.id, customer);
    }

    store.jobSequence += 1;
    const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const jobRow: Tables["jobs"]["Row"] = {
      id: jobId,
      job_number: store.jobSequence,
      business_id: hold.business_id,
      customer_id: customer.id,
      service_id: hold.service_id,
      technician_id: null,
      status: "unassigned",
      scheduled_start: hold.starts_at,
      scheduled_end: hold.ends_at,
      address_line1: String(addrPayload.line1 ?? "123 Brickell Ave"),
      address_line2: addrPayload.line2 ? String(addrPayload.line2) : null,
      city: String(addrPayload.city ?? "Miami"),
      state: String(addrPayload.state ?? "FL"),
      zip: hold.zip,
      lat: typeof addrPayload.lat === "number" ? addrPayload.lat : 25.7617,
      lng: typeof addrPayload.lng === "number" ? addrPayload.lng : -80.1918,
      issue_text: payload.issue ? String(payload.issue) : null,
      issue_photos: photoPaths,
      before_photos: [],
      after_photos: [],
      estimated_total_cents:
        typeof payload.estimatedTotalCents === "number"
          ? payload.estimatedTotalCents
          : p_deposit_cents * 5,
      deposit_cents: p_deposit_cents,
      deposit_payment_intent_id: p_payment_intent,
      deposit_paid_at: now.toISOString(),
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
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    store.jobs.set(jobId, jobRow);

    hold.converted_job_id = jobId;
    hold.stripe_payment_intent_id = p_payment_intent;
    store.slot_holds.set(hold.id, hold);

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    store.job_events.set(eventId, {
      id: eventId,
      business_id: hold.business_id,
      job_id: jobId,
      actor_id: null,
      actor_label: "customer",
      event_type: "created",
      from_status: null,
      to_status: "unassigned",
      meta: {
        hold_id: p_hold,
        deposit_cents: p_deposit_cents,
        card_brand: customer.card_brand,
        card_last4: customer.card_last4,
      },
      created_at: now.toISOString(),
    });

    const payId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    store.payments.set(payId, {
      id: payId,
      business_id: hold.business_id,
      job_id: jobId,
      invoice_id: null,
      kind: "deposit",
      method: "card",
      status: "succeeded",
      amount_cents: p_deposit_cents,
      stripe_payment_intent_id: p_payment_intent,
      stripe_charge_id: `ch_${p_payment_intent.replace(/[^a-zA-Z0-9]/g, "").slice(-10)}`,
      stripe_refund_id: null,
      recorded_by: null,
      created_at: now.toISOString(),
    });

    saveLocalDbToDisk(store);
    return jobId;
  });
}

/**
 * RLS policy evaluation helper matching `0005_rls.sql`
 * Used by RLS verification tests and local client queries
 */
export function queryTableWithRls<K extends keyof Tables>(
  table: K,
  actor: RlsActorContext,
  store = getLocalDb()
): Array<Tables[K]["Row"]> {
  const rows = Array.from((store[table] as unknown as Map<string, Tables[K]["Row"]>).values());

  switch (table) {
    case "services":
    case "service_areas":
      if (actor.role === "owner") {
        return rows.filter(
          (r) =>
            (r as unknown as { business_id: string }).business_id === actor.businessId ||
            (r as unknown as { active: boolean }).active
        );
      }
      return rows.filter((r) => (r as unknown as { active: boolean }).active);

    case "business_hours":
    case "business_closures":
      return rows;

    case "businesses":
      if (actor.role === "anon") return [];
      return rows.filter((r) => (r as unknown as { id: string }).id === actor.businessId);

    case "profiles":
      if (actor.role === "anon") return [];
      return rows.filter((r) => {
        const p = r as unknown as Tables["profiles"]["Row"];
        return (
          p.id === actor.userId ||
          (actor.role === "owner" && p.business_id === actor.businessId)
        );
      });

    case "technicians":
      if (actor.role === "anon") return [];
      if (actor.role === "owner") {
        return rows.filter(
          (r) => (r as unknown as { business_id: string }).business_id === actor.businessId
        );
      }
      return rows.filter((r) => (r as unknown as { id: string }).id === actor.technicianId);

    case "technician_hours":
    case "technician_time_off":
      if (actor.role === "anon") return [];
      if (actor.role === "owner") {
        return rows.filter(
          (r) => (r as unknown as { business_id: string }).business_id === actor.businessId
        );
      }
      return rows.filter(
        (r) => (r as unknown as { technician_id: string }).technician_id === actor.technicianId
      );

    case "jobs":
      if (actor.role === "anon") return [];
      if (actor.role === "owner") {
        return rows.filter(
          (r) => (r as unknown as { business_id: string }).business_id === actor.businessId
        );
      }
      return rows.filter(
        (r) => (r as unknown as { technician_id: string }).technician_id === actor.technicianId
      );

    case "customers":
      if (actor.role === "anon") return [];
      if (actor.role === "owner") {
        return rows.filter(
          (r) => (r as unknown as { business_id: string }).business_id === actor.businessId
        );
      }
      return rows.filter((r) => {
        const c = r as unknown as Tables["customers"]["Row"];
        return Array.from(store.jobs.values()).some(
          (j) => j.customer_id === c.id && j.technician_id === actor.technicianId
        );
      });

    case "invoices":
      if (actor.role === "anon") return [];
      if (actor.role === "owner") {
        return rows.filter(
          (r) => (r as unknown as { business_id: string }).business_id === actor.businessId
        );
      }
      return rows.filter((r) => {
        const inv = r as unknown as Tables["invoices"]["Row"];
        const job = store.jobs.get(inv.job_id);
        return job?.technician_id === actor.technicianId;
      });

    case "invoice_line_items":
      if (actor.role === "anon") return [];
      if (actor.role === "owner") {
        return rows.filter(
          (r) => (r as unknown as { business_id: string }).business_id === actor.businessId
        );
      }
      return rows.filter((r) => {
        const li = r as unknown as Tables["invoice_line_items"]["Row"];
        const inv = store.invoices.get(li.invoice_id);
        const job = inv ? store.jobs.get(inv.job_id) : null;
        return job?.technician_id === actor.technicianId;
      });

    case "payments":
    case "job_events":
    case "sms_log":
      if (actor.role === "owner") {
        return rows.filter(
          (r) => (r as unknown as { business_id: string }).business_id === actor.businessId
        );
      }
      return [];

    case "slot_holds":
    case "stripe_events":
      // Service role only; no RLS policies for anon or authenticated
      return [];

    default:
      return [];
  }
}

export function canWriteTableWithRls<K extends keyof Tables>(
  table: K,
  actor: RlsActorContext,
  businessIdTarget: string
): boolean {
  if (actor.role !== "owner" || actor.businessId !== businessIdTarget) {
    return false;
  }
  const ownerWritableTables: Array<keyof Tables> = [
    "businesses",
    "service_areas",
    "business_hours",
    "business_closures",
    "services",
    "technicians",
    "technician_hours",
    "technician_time_off",
    "customers",
    "jobs",
    "invoices",
    "invoice_line_items",
  ];
  return ownerWritableTables.includes(table);
}
