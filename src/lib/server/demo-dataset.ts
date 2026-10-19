import { addDays, addHours, addMinutes, subDays } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import { computeInvoiceTotals } from "@/lib/domain/pricing";
import { getLocalDb, saveLocalDbToDisk, type LocalDbStore } from "./local-db-fallback";
import type { Database } from "@/lib/supabase/types";

const seededStores = new WeakSet<LocalDbStore>();

export function isDemoJobId(id: string): boolean {
  return id.startsWith("job_today_") || id.startsWith("job_hist_");
}

export function isDemoCustomerId(id: string): boolean {
  return id.startsWith("cust_demo_");
}

export function ensureDemoDatasetLoaded(store = getLocalDb()): LocalDbStore {
  if (store.demoCleared) {
    return store;
  }
  if (!seededStores.has(store) && !store.jobs.has("job_today_1")) {
    seededStores.add(store);
    populateRichDemoDataset(store);
  }
  return store;
}

export function getLocalDbWithDemo(): LocalDbStore {
  return ensureDemoDatasetLoaded(getLocalDb());
}

export interface DemoDataStats {
  demoJobsCount: number;
  realJobsCount: number;
  demoCustomersCount: number;
  realCustomersCount: number;
  demoInvoicesCount: number;
  demoPaymentsCount: number;
  demoCleared: boolean;
  demoJobs: number;
  realJobs: number;
  demoCustomers: number;
  realCustomers: number;
}

export function getDemoDataStats(store = getLocalDbWithDemo()): DemoDataStats {
  let demoJobsCount = 0;
  let realJobsCount = 0;
  for (const j of store.jobs.values()) {
    if (isDemoJobId(j.id)) demoJobsCount += 1;
    else realJobsCount += 1;
  }

  let demoCustomersCount = 0;
  let realCustomersCount = 0;
  for (const c of store.customers.values()) {
    if (isDemoCustomerId(c.id)) demoCustomersCount += 1;
    else realCustomersCount += 1;
  }

  let demoInvoicesCount = 0;
  for (const inv of store.invoices.values()) {
    if (isDemoJobId(inv.job_id)) demoInvoicesCount += 1;
  }

  let demoPaymentsCount = 0;
  for (const pay of store.payments.values()) {
    if (isDemoJobId(pay.job_id)) demoPaymentsCount += 1;
  }

  return {
    demoJobsCount,
    realJobsCount,
    demoCustomersCount,
    realCustomersCount,
    demoInvoicesCount,
    demoPaymentsCount,
    demoCleared: Boolean(store.demoCleared),
    demoJobs: demoJobsCount,
    realJobs: realJobsCount,
    demoCustomers: demoCustomersCount,
    realCustomers: realCustomersCount,
  };
}

/**
 * Deletes ONLY demo jobs, demo invoices, demo payments, demo events, and demo customers
 * while preserving 100% of real user bookings, real customers, services, technicians, and settings.
 */
export function clearDemoDataset(store = getLocalDb()): {
  deletedJobs: number;
  deletedCustomers: number;
  deletedInvoices: number;
  deletedPayments: number;
  demoJobsRemoved: number;
  demoCustomersRemoved: number;
  stats: DemoDataStats;
} {
  let deletedJobs = 0;
  let deletedCustomers = 0;
  let deletedInvoices = 0;
  let deletedPayments = 0;

  const demoJobIds = new Set<string>();
  for (const jobId of Array.from(store.jobs.keys())) {
    if (isDemoJobId(jobId)) {
      demoJobIds.add(jobId);
      store.jobs.delete(jobId);
      deletedJobs += 1;
    }
  }

  const demoInvoiceIds = new Set<string>();
  for (const [invId, inv] of Array.from(store.invoices.entries())) {
    if (demoJobIds.has(inv.job_id) || invId.startsWith("inv_job_")) {
      demoInvoiceIds.add(invId);
      store.invoices.delete(invId);
      deletedInvoices += 1;
    }
  }

  for (const [liId, li] of Array.from(store.invoice_line_items.entries())) {
    if (demoInvoiceIds.has(li.invoice_id)) {
      store.invoice_line_items.delete(liId);
    }
  }

  for (const [payId, pay] of Array.from(store.payments.entries())) {
    if (demoJobIds.has(pay.job_id)) {
      store.payments.delete(payId);
      deletedPayments += 1;
    }
  }

  for (const [evtId, evt] of Array.from(store.job_events.entries())) {
    if (demoJobIds.has(evt.job_id)) {
      store.job_events.delete(evtId);
    }
  }

  for (const [smsId, sms] of Array.from(store.sms_log.entries())) {
    if (sms.job_id && demoJobIds.has(sms.job_id)) {
      store.sms_log.delete(smsId);
    }
  }

  // Only delete demo customers that are not referenced by any remaining real job
  const activeRealCustomerIds = new Set<string>();
  for (const job of store.jobs.values()) {
    activeRealCustomerIds.add(job.customer_id);
  }

  for (const custId of Array.from(store.customers.keys())) {
    if (isDemoCustomerId(custId) && !activeRealCustomerIds.has(custId)) {
      store.customers.delete(custId);
      deletedCustomers += 1;
    }
  }

  store.demoCleared = true;
  saveLocalDbToDisk(store);

  return {
    deletedJobs,
    deletedCustomers,
    deletedInvoices,
    deletedPayments,
    demoJobsRemoved: deletedJobs,
    demoCustomersRemoved: deletedCustomers,
    stats: getDemoDataStats(store),
  };
}

/**
 * Restores the demo dataset alongside any existing real bookings/customers.
 */
export function restoreDemoDataset(store = getLocalDb()): DemoDataStats & {
  demoJobsRestored: number;
  demoCustomersRestored: number;
} {
  const maxExistingJobNum = Array.from(store.jobs.values()).reduce(
    (max, j) => Math.max(max, j.job_number),
    1029
  );
  store.demoCleared = false;
  seededStores.delete(store);
  populateRichDemoDataset(store);
  if (store.jobSequence < maxExistingJobNum) {
    store.jobSequence = maxExistingJobNum;
  }
  saveLocalDbToDisk(store);
  const stats = getDemoDataStats(store);
  return {
    ...stats,
    demoJobsRestored: stats.demoJobsCount,
    demoCustomersRestored: stats.demoCustomersCount,
  };
}

/**
 * Deletes a single job (demo or real) and its dependent invoice, line items, payments, and events.
 */
export function deleteJobRecord(jobId: string, store = getLocalDbWithDemo()): boolean {
  if (!store.jobs.has(jobId)) return false;
  store.jobs.delete(jobId);

  for (const [invId, inv] of Array.from(store.invoices.entries())) {
    if (inv.job_id === jobId) {
      store.invoices.delete(invId);
      for (const [liId, li] of Array.from(store.invoice_line_items.entries())) {
        if (li.invoice_id === invId) {
          store.invoice_line_items.delete(liId);
        }
      }
    }
  }

  for (const [payId, pay] of Array.from(store.payments.entries())) {
    if (pay.job_id === jobId) {
      store.payments.delete(payId);
    }
  }

  for (const [evtId, evt] of Array.from(store.job_events.entries())) {
    if (evt.job_id === jobId) {
      store.job_events.delete(evtId);
    }
  }

  saveLocalDbToDisk(store);
  return true;
}

/**
 * Deletes a single customer and any jobs belonging to that customer.
 */
export function deleteCustomerRecord(
  customerId: string,
  store = getLocalDbWithDemo()
): boolean {
  if (!store.customers.has(customerId)) return false;
  for (const [jobId, job] of Array.from(store.jobs.entries())) {
    if (job.customer_id === customerId) {
      deleteJobRecord(jobId, store);
    }
  }
  store.customers.delete(customerId);
  saveLocalDbToDisk(store);
  return true;
}

const DEMO_CUSTOMERS = [
  { name: "Maria Rivera", phone: "+13055550142", email: "maria.rivera@example.com", line1: "123 Brickell Ave", zip: "33131", lat: 25.765, lng: -80.1905 },
  { name: "David Chen", phone: "+13055550143", email: "david.chen@example.com", line1: "2840 SW 27th Ave", zip: "33133", lat: 25.7392, lng: -80.2381 },
  { name: "Elena Rodriguez", phone: "+13055550144", email: "elena.r@example.com", line1: "450 Alton Rd", zip: "33139", lat: 25.7743, lng: -80.1408 },
  { name: "Marcus Vance", phone: "+13055550145", email: "marcus.vance@example.com", line1: "1900 Coral Way", zip: "33145", lat: 25.7505, lng: -80.2254 },
  { name: "Sofia Morales", phone: "+13055550146", email: "sofia.m@example.com", line1: "720 Crandon Blvd", zip: "33149", lat: 25.6938, lng: -80.1628 },
  { name: "Robert Caldwell", phone: "+13055550147", email: "rcaldwell@example.com", line1: "3100 NW 7th St", zip: "33125", lat: 25.7791, lng: -80.2458 },
  { name: "Camila Delgado", phone: "+13055550148", email: "camila.d@example.com", line1: "880 NE 79th St", zip: "33138", lat: 25.8482, lng: -80.1785 },
  { name: "Liam O'Connor", phone: "+13055550149", email: "liam.oc@example.com", line1: "1540 Ferdinand St", zip: "33134", lat: 25.7568, lng: -80.2672 },
  { name: "Hannah Sterling", phone: "+13055550150", email: "hsterling@example.com", line1: "510 Ocean Dr", zip: "33139", lat: 25.7751, lng: -80.1312 },
  { name: "Javier Ortiz", phone: "+13055550151", email: "jortiz@example.com", line1: "2215 SW 8th St", zip: "33135", lat: 25.7655, lng: -80.2314 },
  { name: "Nadia Kowalski", phone: "+13055550152", email: "nadia.k@example.com", line1: "3400 Main Hwy", zip: "33133", lat: 25.7271, lng: -80.2419 },
  { name: "Trevor Jenkins", phone: "+13055550153", email: "tjenkins@example.com", line1: "1020 Biscayne Blvd", zip: "33132", lat: 25.7845, lng: -80.1897 },
];

export function populateRichDemoDataset(store: LocalDbStore): void {
  seededStores.add(store);
  const biz = Array.from(store.businesses.values())[0];
  if (!biz) return;
  const tz = biz.timezone;
  const now = new Date();
  const todayStr = formatInTimeZone(now, tz, "yyyy-MM-dd");

  // Create customers
  const custIds: string[] = [];
  DEMO_CUSTOMERS.forEach((c, idx) => {
    const id = `cust_demo_${idx + 1}`;
    custIds.push(id);
    store.customers.set(id, {
      id,
      business_id: biz.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      stripe_customer_id: `cus_demo_${idx + 1}`,
      stripe_payment_method_id: `pm_demo_${idx + 1}`,
      card_brand: idx % 2 === 0 ? "visa" : "mastercard",
      card_last4: idx % 2 === 0 ? "4242" : "8812",
      sms_opt_out: false,
      sms_consent_at: subDays(now, 15).toISOString(),
      created_at: subDays(now, 15).toISOString(),
    });
  });

  // Ensure jobSequence starts at 1030 so active jobs match UI_SPEC (#1030..#1042)
  store.jobSequence = 1029;

  const sampleSvgDataUri =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#0F172A"/><circle cx="200" cy="150" r="60" stroke="#F97316" stroke-width="8" fill="none"/><text x="200" y="260" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="16">HVAC Unit Inspection Photo</text></svg>`
    );

  // Today's active & completed jobs (matching UI_SPEC 4.2 Kanban board)
  const todayJobsSpec = [
    // Completed today
    {
      custIdx: 5,
      serviceId: "svc-ac-repair",
      techId: "tech-carlos",
      status: "completed" as const,
      startHour: 8,
      duration: 90,
      issue: "Condenser fan stopped spinning yesterday afternoon.",
      partsCents: 12000,
      tipPct: 20,
      paid: true,
    },
    // In progress today
    {
      custIdx: 3,
      serviceId: "svc-duct-cleaning",
      techId: "tech-maria",
      status: "in_progress" as const,
      startHour: 9,
      duration: 180,
      issue: "Dust buildup in master bedroom and living room supply vents.",
      partsCents: 0,
      tipPct: 0,
      paid: false,
    },
    {
      custIdx: 7,
      serviceId: "svc-thermostat-install",
      techId: "tech-tony",
      status: "in_progress" as const,
      startHour: 10,
      duration: 60,
      issue: "Upgrading old mercury thermostat to Ecobee Smart Thermostat.",
      partsCents: 0,
      tipPct: 0,
      paid: false,
    },
    // On the way today
    {
      custIdx: 2,
      serviceId: "svc-ac-tuneup",
      techId: "tech-danny",
      status: "on_the_way" as const,
      startHour: 11,
      duration: 60,
      issue: "Annual pre-summer AC tune-up and drain line flush.",
      partsCents: 0,
      tipPct: 0,
      paid: false,
    },
    // Assigned today (for Carlos, Danny, Maria)
    {
      custIdx: 0,
      serviceId: "svc-ac-repair",
      techId: "tech-carlos",
      status: "assigned" as const,
      startHour: 13,
      duration: 90,
      issue: "AC is blowing warm air since last night; outdoor unit humming.",
      partsCents: 0,
      tipPct: 0,
      paid: false,
    },
    {
      custIdx: 6,
      serviceId: "svc-ac-tuneup",
      techId: "tech-danny",
      status: "assigned" as const,
      startHour: 14,
      duration: 60,
      issue: "Routine maintenance check on 3-ton split system.",
      partsCents: 0,
      tipPct: 0,
      paid: false,
    },
    {
      custIdx: 4,
      serviceId: "svc-refrigerant-recharge",
      techId: "tech-maria",
      status: "assigned" as const,
      startHour: 15,
      duration: 60,
      issue: "System running continuously, suction line icing up.",
      partsCents: 0,
      tipPct: 0,
      paid: false,
    },
    // Unassigned starting soon (triggers Dashboard SLA warning banner & has eligible daytime window)
    {
      custIdx: 1,
      serviceId: "svc-ac-repair",
      techId: null,
      status: "unassigned" as const,
      startHour: 12,
      duration: 90,
      issue: "Emergency warm air call — baby nursery room is 84°F.",
      partsCents: 0,
      tipPct: 0,
      paid: false,
    },
    {
      custIdx: 10,
      serviceId: "svc-thermostat-install",
      techId: null,
      status: "unassigned" as const,
      startHour: 15,
      duration: 60,
      issue: "Thermostat blank screen after power surge.",
      partsCents: 0,
      tipPct: 0,
      paid: false,
    },
  ];

  // Ensure demo technicians have a shift for today's day of week (including weekends) in the demo dataset
  const todayDowNum = Number(formatInTimeZone(now, tz, "i"));
  const todayDow = todayDowNum === 7 ? 0 : todayDowNum;
  for (const tech of store.technicians.values()) {
    const thId = `th_${tech.id}_${todayDow}`;
    if (!store.technician_hours.has(thId)) {
      store.technician_hours.set(thId, {
        id: thId,
        business_id: biz.id,
        technician_id: tech.id,
        day_of_week: todayDow,
        start_time: "07:00",
        end_time: "19:00",
      });
    }
  }

  todayJobsSpec.forEach((spec, idx) => {
    store.jobSequence += 1;
    const jobNum = store.jobSequence;
    const jobId = `job_today_${idx + 1}`;
    const cust = DEMO_CUSTOMERS[spec.custIdx];
    const custId = custIds[spec.custIdx];
    const svc = store.services.get(spec.serviceId)!;

    const startIso = fromZonedTime(
      `${todayStr}T${String(spec.startHour).padStart(2, "0")}:00:00`,
      tz
    ).toISOString();
    const endIso = addMinutes(new Date(startIso), spec.duration).toISOString();
    const depositCents = Math.ceil((svc.price_cents * 20) / 100);

    const jobRow = {
      id: jobId,
      job_number: jobNum,
      business_id: biz.id,
      customer_id: custId,
      service_id: svc.id,
      technician_id: spec.techId,
      status: spec.status,
      scheduled_start: startIso,
      scheduled_end: endIso,
      address_line1: cust.line1,
      address_line2: null,
      city: "Miami",
      state: "FL",
      zip: cust.zip,
      lat: cust.lat,
      lng: cust.lng,
      issue_text: spec.issue,
      issue_photos: [sampleSvgDataUri],
      before_photos:
        spec.status === "in_progress" || spec.status === "completed"
          ? [sampleSvgDataUri]
          : [],
      after_photos: spec.status === "completed" ? [sampleSvgDataUri] : [],
      estimated_total_cents: svc.price_cents,
      deposit_cents: depositCents,
      deposit_payment_intent_id: `pi_demo_${jobNum}`,
      deposit_paid_at: subDays(now, 1).toISOString(),
      total_cents: spec.status === "completed" ? 22740 : null,
      tip_cents: spec.status === "completed" ? 4380 : 0,
      billable_minutes: spec.status === "completed" ? svc.duration_minutes : null,
      notes_internal: "Gate code #4421. Friendly dog in backyard.",
      tech_notes:
        spec.status === "completed"
          ? "Replaced failed 45/5 uF dual run capacitor and tested amperage draw."
          : null,
      cancel_reason: null,
      cancelled_at: null,
      on_the_way_at:
        spec.status === "on_the_way" ||
        spec.status === "in_progress" ||
        spec.status === "completed"
          ? addMinutes(new Date(startIso), -18).toISOString()
          : null,
      started_at:
        spec.status === "in_progress" || spec.status === "completed"
          ? startIso
          : null,
      completed_at: spec.status === "completed" ? endIso : null,
      created_at: subDays(now, 1).toISOString(),
      updated_at: now.toISOString(),
    };

    store.jobs.set(jobId, jobRow);

    // Record deposit payment
    store.payments.set(`pay_dep_${jobId}`, {
      id: `pay_dep_${jobId}`,
      business_id: biz.id,
      job_id: jobId,
      invoice_id: null,
      kind: "deposit",
      method: "card",
      status: "succeeded",
      amount_cents: depositCents,
      stripe_payment_intent_id: `pi_demo_${jobNum}`,
      stripe_charge_id: `ch_dep_${jobNum}`,
      stripe_refund_id: null,
      recorded_by: null,
      created_at: subDays(now, 1).toISOString(),
    });

    // Event log
    store.job_events.set(`evt_create_${jobId}`, {
      id: `evt_create_${jobId}`,
      business_id: biz.id,
      job_id: jobId,
      actor_id: null,
      actor_label: "customer",
      event_type: "created",
      from_status: null,
      to_status: "unassigned",
      meta: { deposit_cents: depositCents },
      created_at: subDays(now, 1).toISOString(),
    });

    if (spec.techId) {
      store.job_events.set(`evt_assign_${jobId}`, {
        id: `evt_assign_${jobId}`,
        business_id: biz.id,
        job_id: jobId,
        actor_id: "user_owner",
        actor_label: "owner",
        event_type: "assigned",
        from_status: "unassigned",
        to_status: "assigned",
        meta: { technician_id: spec.techId },
        created_at: addHours(now, -3).toISOString(),
      });
    }

    if (spec.status === "completed") {
      createCompletedInvoiceAndPayments(store, biz.id, jobRow, svc, spec.partsCents, spec.tipPct, spec.paid);
    } else if (jobNum === 1035) {
      createCompletedInvoiceAndPayments(store, biz.id, jobRow, svc, 4500, 0, false);
    }
  });

  // Historical completed jobs across the past 14 days for rich Reports & Revenue charts
  const techRotation = ["tech-carlos", "tech-danny", "tech-maria", "tech-tony"];
  const serviceRotation = [
    "svc-ac-repair",
    "svc-ac-tuneup",
    "svc-thermostat-install",
    "svc-duct-cleaning",
    "svc-refrigerant-recharge",
  ];

  for (let daysAgo = 1; daysAgo <= 14; daysAgo++) {
    const pastDate = subDays(now, daysAgo);
    const dateStr = formatInTimeZone(pastDate, tz, "yyyy-MM-dd");
    const jobsCountForDay = (daysAgo % 3) + 1;

    for (let j = 0; j < jobsCountForDay; j++) {
      store.jobSequence += 1;
      const jobNum = store.jobSequence;
      const jobId = `job_hist_${daysAgo}_${j}`;
      const custIdx = (daysAgo + j) % DEMO_CUSTOMERS.length;
      const cust = DEMO_CUSTOMERS[custIdx];
      const custId = custIds[custIdx];
      const techId = techRotation[(daysAgo + j) % techRotation.length];
      const svcId = serviceRotation[(daysAgo * 2 + j) % serviceRotation.length];
      const svc = store.services.get(svcId)!;

      const startIso = fromZonedTime(`${dateStr}T${String(9 + j * 3).padStart(2, "0")}:00:00`, tz).toISOString();
      const endIso = addMinutes(new Date(startIso), svc.duration_minutes).toISOString();
      const depositCents = Math.ceil((svc.price_cents * 20) / 100);
      const partsCents = j % 2 === 0 ? 8500 : 0;
      const tipPct = j % 2 === 0 ? 20 : 15;

      const jobRow = {
        id: jobId,
        job_number: jobNum,
        business_id: biz.id,
        customer_id: custId,
        service_id: svc.id,
        technician_id: techId,
        status: "completed" as const,
        scheduled_start: startIso,
        scheduled_end: endIso,
        address_line1: cust.line1,
        address_line2: null,
        city: "Miami",
        state: "FL",
        zip: cust.zip,
        lat: cust.lat,
        lng: cust.lng,
        issue_text: "Scheduled HVAC service & diagnostic inspection.",
        issue_photos: [sampleSvgDataUri],
        before_photos: [sampleSvgDataUri],
        after_photos: [sampleSvgDataUri],
        estimated_total_cents: svc.price_cents,
        deposit_cents: depositCents,
        deposit_payment_intent_id: `pi_hist_${jobNum}`,
        deposit_paid_at: startIso,
        total_cents: svc.price_cents + partsCents,
        tip_cents: 0,
        billable_minutes: svc.duration_minutes,
        notes_internal: null,
        tech_notes: "System tested within manufacturer specifications.",
        cancel_reason: null,
        cancelled_at: null,
        on_the_way_at: addMinutes(new Date(startIso), -15).toISOString(),
        started_at: startIso,
        completed_at: endIso,
        created_at: startIso,
        updated_at: endIso,
      };

      store.jobs.set(jobId, jobRow);
      createCompletedInvoiceAndPayments(store, biz.id, jobRow, svc, partsCents, tipPct, true);
    }
  }
}

function createCompletedInvoiceAndPayments(
  store: LocalDbStore,
  businessId: string,
  jobRow: Database["public"]["Tables"]["jobs"]["Row"],
  svc: Database["public"]["Tables"]["services"]["Row"],
  partsCents: number,
  tipPct: number,
  paid: boolean
) {
  const totals = computeInvoiceTotals({
    pricingType: svc.pricing_type,
    servicePriceCents: svc.price_cents,
    billableMinutes: svc.duration_minutes,
    parts:
      partsCents > 0
        ? [
            {
              description: "OEM Dual Run Capacitor & Contactor Kit",
              quantity: 1,
              unitPriceCents: partsCents,
              taxable: true,
            },
          ]
        : [],
    taxRateBps: 700,
    taxAppliesTo: "parts",
    depositPaidCents: jobRow.deposit_cents,
    tipPct,
  });

  const invId = `inv_${jobRow.id}`;
  const invNumber = `INV-2026-${String(jobRow.job_number).padStart(5, "0")}`;
  const token = `tok_${jobRow.job_number}`;

  store.invoices.set(invId, {
    id: invId,
    business_id: businessId,
    job_id: jobRow.id,
    invoice_number: invNumber,
    public_token: token,
    status: paid ? "paid" : "sent",
    labor_cents: totals.laborCents,
    parts_cents: totals.partsCents,
    fees_cents: 0,
    discount_cents: 0,
    subtotal_cents: totals.subtotalCents,
    tax_rate_bps: 700,
    tax_cents: totals.taxCents,
    total_cents: totals.totalCents,
    deposit_paid_cents: jobRow.deposit_cents,
    tip_cents: totals.tipCents,
    amount_due_cents: paid ? 0 : totals.amountDueCents,
    stripe_checkout_session_id: null,
    sent_at: jobRow.completed_at,
    paid_at: paid ? jobRow.completed_at : null,
    created_at: jobRow.completed_at ?? new Date().toISOString(),
    updated_at: jobRow.completed_at ?? new Date().toISOString(),
  });

  jobRow.total_cents = totals.totalCents;
  jobRow.tip_cents = totals.tipCents;
  store.jobs.set(jobRow.id, jobRow);

  // Labor line item
  store.invoice_line_items.set(`li_labor_${invId}`, {
    id: `li_labor_${invId}`,
    business_id: businessId,
    invoice_id: invId,
    kind: "labor",
    description: `${svc.name} (${svc.pricing_type === "hourly" ? `${svc.duration_minutes} mins` : "Flat rate"})`,
    quantity: 1,
    unit_price_cents: totals.laborCents,
    taxable: false,
    amount_cents: totals.laborCents,
    sort_order: 0,
  });

  if (partsCents > 0) {
    store.invoice_line_items.set(`li_parts_${invId}`, {
      id: `li_parts_${invId}`,
      business_id: businessId,
      invoice_id: invId,
      kind: "parts",
      description: "OEM Dual Run Capacitor & Contactor Kit",
      quantity: 1,
      unit_price_cents: partsCents,
      taxable: true,
      amount_cents: partsCents,
      sort_order: 1,
    });
  }

  if (paid) {
    store.payments.set(`pay_rem_${jobRow.id}`, {
      id: `pay_rem_${jobRow.id}`,
      business_id: businessId,
      job_id: jobRow.id,
      invoice_id: invId,
      kind: "remaining",
      method: "card",
      status: "succeeded",
      amount_cents: totals.amountDueCents,
      stripe_payment_intent_id: `pi_rem_${jobRow.job_number}`,
      stripe_charge_id: `ch_rem_${jobRow.job_number}`,
      stripe_refund_id: null,
      recorded_by: null,
      created_at: jobRow.completed_at ?? new Date().toISOString(),
    });
  }
}

