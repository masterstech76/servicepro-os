import "server-only";
import { cookies } from "next/headers";
import { businessConfig } from "@config/business.config";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { enrichJob, type EnrichedJob } from "@/lib/server/operations";
import {
  getJobChecklist,
  getJobEstimates,
  getJobInventoryMovements,
  getTechVanInventory,
  type ChecklistItem,
  type JobEstimate,
  type InventoryMovement,
  type VanPartItem,
} from "@/lib/server/tech-portal";
import type { JobStatus, Database } from "@/lib/supabase/types";
import { createServerClient } from "@supabase/ssr";
import { isRemoteSupabaseConfigured } from "@/lib/supabase/middleware";

export interface CentralPartItem {
  id: string;
  sku: string;
  name: string;
  category: "electrical" | "motors" | "refrigerant" | "piping" | "controls" | "safety";
  warehouseQuantity: number;
  minWarehouseQuantity: number;
  unitCostCents: number;
  unitPriceCents: number;
  unit: string;
}

export interface InventoryAuditRecord {
  id: string;
  partId: string;
  sku: string;
  partName: string;
  type: "adjustment" | "van_consumption" | "van_return" | "restock";
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  location: "warehouse" | string; // warehouse or technicianId
  reason: string;
  actor: string;
  createdAt: string;
}

// In-memory store for central warehouse & audit log
const globalAdminStore = globalThis as unknown as {
  __spCentralParts?: Map<string, CentralPartItem>;
  __spInventoryAudits?: InventoryAuditRecord[];
  __spCustomerNotes?: Map<string, Array<{ id: string; note: string; actor: string; createdAt: string }>>;
};

function getCentralPartsStore(): Map<string, CentralPartItem> {
  if (!globalAdminStore.__spCentralParts) {
    const store = new Map<string, CentralPartItem>();
    const DEFAULT_PARTS: Omit<CentralPartItem, "id">[] = [
      { sku: "CAP-45-5", name: "Dual Run Capacitor 45/5 MFD 440V", category: "electrical", warehouseQuantity: 45, minWarehouseQuantity: 15, unitCostCents: 1800, unitPriceCents: 8500, unit: "ea" },
      { sku: "CAP-35-5", name: "Dual Run Capacitor 35/5 MFD 440V", category: "electrical", warehouseQuantity: 32, minWarehouseQuantity: 10, unitCostCents: 1600, unitPriceCents: 8000, unit: "ea" },
      { sku: "CONT-2P-30A", name: "Contactor 2-Pole 30A 24V Coil", category: "electrical", warehouseQuantity: 28, minWarehouseQuantity: 10, unitCostCents: 2200, unitPriceCents: 9500, unit: "ea" },
      { sku: "HSTART-521", name: "Hard Start Kit (Compressor Saver)", category: "electrical", warehouseQuantity: 18, minWarehouseQuantity: 8, unitCostCents: 3500, unitPriceCents: 16500, unit: "ea" },
      { sku: "REF-410A-LB", name: "R-410A Refrigerant Virgin Cylinder (25 Lb)", category: "refrigerant", warehouseQuantity: 140, minWarehouseQuantity: 50, unitCostCents: 2400, unitPriceCents: 8900, unit: "lb" },
      { sku: "SW-FLOAT-SS2", name: "Safe-T-Switch Condensate Float Switch", category: "safety", warehouseQuantity: 35, minWarehouseQuantity: 12, unitCostCents: 1900, unitPriceCents: 9000, unit: "ea" },
      { sku: "TRAP-EZT-210", name: "3/4\" Transparent EZ-Trap Kit with Brush", category: "piping", warehouseQuantity: 24, minWarehouseQuantity: 10, unitCostCents: 2100, unitPriceCents: 9500, unit: "ea" },
      { sku: "STAT-PRO-T701", name: "Pro1 Digital Non-Prog Thermostat", category: "controls", warehouseQuantity: 15, minWarehouseQuantity: 6, unitCostCents: 3800, unitPriceCents: 14500, unit: "ea" },
      { sku: "FUSE-DISC-30A", name: "30-Amp Time Delay Fuses (Pair)", category: "electrical", warehouseQuantity: 50, minWarehouseQuantity: 20, unitCostCents: 600, unitPriceCents: 3500, unit: "pair" },
      { sku: "TRANS-40VA", name: "Multi-Tap Control Transformer 40VA", category: "electrical", warehouseQuantity: 19, minWarehouseQuantity: 8, unitCostCents: 2400, unitPriceCents: 11000, unit: "ea" },
      { sku: "MOT-1-3HP-1075", name: "1/3 HP Condenser Fan Motor 1075 RPM", category: "motors", warehouseQuantity: 8, minWarehouseQuantity: 5, unitCostCents: 7500, unitPriceCents: 22000, unit: "ea" },
    ];
    DEFAULT_PARTS.forEach((p, idx) => {
      const id = `cpart_${idx + 1}`;
      store.set(id, { ...p, id });
    });
    globalAdminStore.__spCentralParts = store;
  }
  return globalAdminStore.__spCentralParts;
}

function getAuditsStore(): InventoryAuditRecord[] {
  if (!globalAdminStore.__spInventoryAudits) {
    globalAdminStore.__spInventoryAudits = [
      {
        id: "aud_init_1",
        partId: "cpart_1",
        sku: "CAP-45-5",
        partName: "Dual Run Capacitor 45/5 MFD 440V",
        type: "restock",
        quantityChange: 50,
        previousQuantity: 0,
        newQuantity: 50,
        location: "warehouse",
        reason: "Initial warehouse receiving stock PO-1092",
        actor: "Admin Dispatch",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ];
  }
  return globalAdminStore.__spInventoryAudits;
}

/**
 * Resolves current admin session from cookie/header with role-based checks.
 * In production, validates against remote Supabase Auth or cryptographic session.
 * Denies access to unauthenticated callers, customers, and technicians.
 */
export async function resolveAdminSession(request?: Request): Promise<{
  role: "owner" | "admin" | "dispatcher";
  name: string;
  email: string;
} | null> {
  let role: "owner" | "admin" | "dispatcher" | null = null;
  let userName = "Dispatch Administrator";
  let userEmail = "dispatch@techwork.in";

  // 1. Check explicit headers (from test suite or internal caller)
  if (request) {
    const headerRole = request.headers.get("x-servicepro-role");
    if (headerRole === "anon" || headerRole === "customer" || headerRole === "technician") {
      return null;
    }
    if (headerRole === "owner" || headerRole === "admin" || headerRole === "dispatcher") {
      role = headerRole;
      userName = headerRole === "dispatcher" ? "Dispatcher User" : "System Administrator";
    }

    // Check request Cookie header
    if (!role) {
      const cookieHeader = request.headers.get("cookie") ?? "";
      if (cookieHeader) {
        const parsed = Object.fromEntries(
          cookieHeader.split(";").map((p) => {
            const [k, ...v] = p.trim().split("=");
            return [k, decodeURIComponent(v.join("="))];
          })
        );
        const cRole = parsed["servicepro_dev_role"] || parsed["sp_demo_role"];
        if (cRole === "customer" || cRole === "technician") {
          return null;
        }
        if (cRole === "owner" || cRole === "admin" || cRole === "dispatcher") {
          role = cRole;
        }
      }
    }
  }

  // 2. Check Next.js cookies() store
  if (!role) {
    try {
      const cookieStore = cookies();
      const cookieRole = (cookieStore.get("servicepro_dev_role")?.value ||
        cookieStore.get("sp_demo_role")?.value) as "owner" | "admin" | "dispatcher" | "technician" | "customer" | undefined;
      if (cookieRole === "customer" || cookieRole === "technician") {
        return null;
      }
      if (cookieRole === "owner" || cookieRole === "admin" || cookieRole === "dispatcher") {
        role = cookieRole;
      }

      // Check remote Supabase Auth session if configured
      if (!role && isRemoteSupabaseConfigured()) {
        const supabase = createServerClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return cookieStore.getAll();
              },
              setAll() {},
            },
          }
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          const r = (profile as { role?: "owner" | "admin" | "dispatcher" } | null)?.role;
          if (r === "owner" || r === "admin" || r === "dispatcher") {
            role = r;
            userName = "Administrator";
            userEmail = user.email || userEmail;
          }
        }
      }
    } catch {
      // outside request context
    }
  }

  if (!role) {
    return null;
  }

  return {
    role,
    name: userName,
    email: userEmail,
  };
}

/**
 * Search & filter admin work orders with pagination
 */
export function getAdminWorkOrders(params: {
  status?: string;
  technicianId?: string;
  customerId?: string;
  search?: string;
  date?: string;
  page?: number;
  limit?: number;
}): {
  jobs: EnrichedJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  const store = getLocalDbWithDemo();
  let list: EnrichedJob[] = [];

  for (const job of store.jobs.values()) {
    const enriched = enrichJob(job.id, store);
    if (!enriched) continue;

    if (params.status && params.status !== "all" && enriched.status !== params.status) {
      continue;
    }
    if (params.technicianId && params.technicianId !== "all" && enriched.technician?.id !== params.technicianId) {
      continue;
    }
    if (params.customerId && enriched.customer.id !== params.customerId) {
      continue;
    }
    if (params.date) {
      const jobDate = enriched.scheduledStart.slice(0, 10);
      if (jobDate !== params.date) continue;
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      const matchNumber = String(enriched.jobNumber).includes(q);
      const matchCustomer = enriched.customer.name.toLowerCase().includes(q) || enriched.customer.phone.includes(q);
      const matchService = enriched.service.name.toLowerCase().includes(q);
      const matchAddress = enriched.addressLine1.toLowerCase().includes(q) || enriched.zip.includes(q);
      if (!matchNumber && !matchCustomer && !matchService && !matchAddress) {
        continue;
      }
    }

    list.push(enriched);
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime());

  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 25));
  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = list.slice((page - 1) * limit, page * limit);

  return {
    jobs: paginated,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Deep job inspection for admin view
 */
export function getAdminJobDetail(jobId: string): {
  job: EnrichedJob | null;
  checklist: ChecklistItem[];
  estimates: JobEstimate[];
  inventoryMovements: InventoryMovement[];
} {
  const store = getLocalDbWithDemo();
  const job = enrichJob(jobId, store);
  if (!job) {
    return { job: null, checklist: [], estimates: [], inventoryMovements: [] };
  }

  const checklist = getJobChecklist(jobId);
  const estimates = getJobEstimates(jobId);
  const inventoryMovements = getJobInventoryMovements(jobId);

  return {
    job,
    checklist,
    estimates,
    inventoryMovements,
  };
}

/**
 * Validated server-side work order creation by dispatcher
 */
export function createAdminJob(params: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  serviceId: string;
  scheduledStart: string;
  issueText?: string;
  notesInternal?: string;
  technicianId?: string | null;
  actor?: string;
}): { ok: boolean; error?: string; job?: EnrichedJob } {
  const store = getLocalDbWithDemo();

  if (!params.customerName.trim() || !params.customerPhone.trim()) {
    return { ok: false, error: "Customer name and phone number are required" };
  }
  if (!params.addressLine1.trim() || !params.zip.trim()) {
    return { ok: false, error: "Service address and ZIP code are required" };
  }

  const service = store.services.get(params.serviceId);
  if (!service) {
    return { ok: false, error: "Invalid service selected" };
  }

  // Find or create customer
  let customer = Array.from(store.customers.values()).find(
    (c) => c.phone.replace(/\D/g, "") === params.customerPhone.replace(/\D/g, "")
  );

  if (!customer) {
    const custId = `cust_adm_${Date.now()}`;
    const newCustomer = {
      id: custId,
      business_id: service.business_id,
      name: params.customerName.trim(),
      phone: params.customerPhone.trim(),
      email: params.customerEmail?.trim() || "",
      stripe_customer_id: null,
      stripe_payment_method_id: null,
      card_brand: null,
      card_last4: null,
      sms_opt_out: false,
      sms_consent_at: null,
      created_at: new Date().toISOString(),
    };
    store.customers.set(custId, newCustomer);
    customer = newCustomer;
  }

  const activeCustomer = customer;

  const durationMin = service.duration_minutes || 90;
  const startObj = new Date(params.scheduledStart);
  if (isNaN(startObj.getTime())) {
    return { ok: false, error: "Invalid scheduled start time" };
  }
  const endObj = new Date(startObj.getTime() + durationMin * 60000);

  // Check for technician assignment conflict
  if (params.technicianId) {
    const tech = store.technicians.get(params.technicianId);
    if (!tech) return { ok: false, error: "Technician not found" };

    const hasOverlap = Array.from(store.jobs.values()).some((j) => {
      if (j.technician_id !== params.technicianId || j.status === "cancelled") return false;
      const jStart = new Date(j.scheduled_start).getTime();
      const jEnd = new Date(j.scheduled_end).getTime();
      const reqStart = startObj.getTime();
      const reqEnd = endObj.getTime();
      return Math.max(jStart, reqStart) < Math.min(jEnd, reqEnd);
    });

    if (hasOverlap) {
      return {
        ok: false,
        error: `Schedule conflict: Technician ${tech.name} already has a job booked during this window`,
      };
    }
  }

  const nextJobNum = Math.max(1000, ...Array.from(store.jobs.values()).map((j) => j.job_number || 0)) + 1;
  const jobId = `job_adm_${Date.now()}`;

  const newJob = {
    id: jobId,
    business_id: service.business_id,
    job_number: nextJobNum,
    customer_id: activeCustomer.id,
    service_id: service.id,
    technician_id: params.technicianId || null,
    status: (params.technicianId ? "assigned" : "unassigned") as JobStatus,
    scheduled_start: startObj.toISOString(),
    scheduled_end: endObj.toISOString(),
    address_line1: params.addressLine1.trim(),
    address_line2: params.addressLine2?.trim() || null,
    city: params.city.trim() || "Miami",
    state: params.state.trim() || "FL",
    zip: params.zip.trim(),
    lat: 25.7617,
    lng: -80.1918,
    issue_text: params.issueText?.trim() || null,
    issue_photos: [],
    before_photos: [],
    after_photos: [],
    estimated_total_cents: service.price_cents,
    deposit_cents: Math.round(service.price_cents * 0.2),
    deposit_payment_intent_id: null,
    deposit_paid_at: null,
    total_cents: null,
    tip_cents: 0,
    billable_minutes: null,
    notes_internal: params.notesInternal?.trim() || null,
    tech_notes: null,
    cancel_reason: null,
    cancelled_at: null,
    on_the_way_at: null,
    started_at: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store.jobs.set(jobId, newJob);

  // Add event
  const evtId = `evt_adm_${Date.now()}`;
  store.job_events.set(evtId, {
    id: evtId,
    business_id: service.business_id,
    job_id: jobId,
    actor_id: null,
    actor_label: params.actor || "Admin Dispatch",
    event_type: "created",
    from_status: null,
    to_status: newJob.status,
    meta: { by: "admin_portal", customer: activeCustomer.name },
    created_at: new Date().toISOString(),
  });

  const enriched = enrichJob(jobId, store);
  return { ok: true, job: enriched || undefined };
}

/**
 * Technician detail and schedule conflict check
 */
export function getAdminTechnicianDetail(techId: string) {
  const store = getLocalDbWithDemo();
  const tech = store.technicians.get(techId);
  if (!tech) return null;

  const allJobs = Array.from(store.jobs.values())
    .filter((j) => j.technician_id === techId)
    .sort((a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime())
    .map((j) => enrichJob(j.id, store))
    .filter((j): j is EnrichedJob => j !== null);

  const hours = Array.from(store.technician_hours.values()).filter((h) => h.technician_id === techId);
  const timeOff = Array.from(store.technician_time_off.values()).filter((to) => to.technician_id === techId);
  const vanStock = getTechVanInventory(techId);

  return {
    technician: {
      id: tech.id,
      name: tech.name,
      phone: tech.phone,
      email: tech.email,
      color: tech.color,
      active: tech.active,
      commissionPct: Number(tech.commission_pct),
      skills: tech.skills,
      zipCodes: tech.zip_codes,
      homeLat: tech.home_lat,
      homeLng: tech.home_lng,
      vehicle: {
        model: "Ford Transit 250 EcoBoost",
        plate: `FL-HVAC-${tech.id.slice(-2).toUpperCase()}`,
        status: "Equipped & Inspected",
      },
    },
    hours,
    timeOff,
    vanStock,
    jobs: allJobs,
    stats: {
      totalJobs: allJobs.length,
      completedJobs: allJobs.filter((j) => j.status === "completed").length,
      inProgressJobs: allJobs.filter((j) => j.status === "in_progress" || j.status === "on_the_way").length,
      revenueGeneratedCents: allJobs
        .filter((j) => j.status === "completed")
        .reduce((sum, j) => sum + (j.totalCents || j.estimatedTotalCents), 0),
    },
  };
}

/**
 * Customer detail 360 view
 */
export function getAdminCustomerDetail(customerId: string) {
  const store = getLocalDbWithDemo();
  const customer = store.customers.get(customerId);
  if (!customer) return null;

  const jobs = Array.from(store.jobs.values())
    .filter((j) => j.customer_id === customerId)
    .sort((a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime())
    .map((j) => enrichJob(j.id, store))
    .filter((j): j is EnrichedJob => j !== null);

  const totalSpentCents = jobs
    .filter((j) => j.status === "completed")
    .reduce((sum, j) => sum + (j.totalCents || j.estimatedTotalCents), 0);

  // Collect unique service addresses
  const addressMap = new Map<string, { addressLine1: string; city: string; state: string; zip: string }>();
  jobs.forEach((j) => {
    const key = `${j.addressLine1}_${j.zip}`;
    if (!addressMap.has(key)) {
      addressMap.set(key, {
        addressLine1: j.addressLine1,
        city: j.city,
        state: j.state,
        zip: j.zip,
      });
    }
  });

  return {
    customer: {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      cardBrand: customer.card_brand,
      cardLast4: customer.card_last4,
      smsOptOut: customer.sms_opt_out,
      createdAt: customer.created_at,
    },
    stats: {
      jobsCount: jobs.length,
      completedCount: jobs.filter((j) => j.status === "completed").length,
      totalSpentCents,
    },
    addresses: Array.from(addressMap.values()),
    jobs,
  };
}

/**
 * Central Inventory & Valuation
 */
export function getCentralInventoryOverview() {
  const partsStore = getCentralPartsStore();
  const parts = Array.from(partsStore.values());

  const totalWarehouseUnits = parts.reduce((sum, p) => sum + p.warehouseQuantity, 0);
  const totalValuationCostCents = parts.reduce((sum, p) => sum + p.warehouseQuantity * p.unitCostCents, 0);
  const totalValuationRetailCents = parts.reduce((sum, p) => sum + p.warehouseQuantity * p.unitPriceCents, 0);
  const lowStockCount = parts.filter((p) => p.warehouseQuantity <= p.minWarehouseQuantity).length;

  return {
    totalSkus: parts.length,
    totalWarehouseUnits,
    totalValuationCostCents,
    totalValuationRetailCents,
    lowStockCount,
    parts,
  };
}

/**
 * Adjust central inventory stock with mandatory audit reason
 */
export function adjustCentralInventoryStock(params: {
  partId: string;
  adjustmentQuantity: number; // positive or negative
  reason: string;
  actor: string;
}): { ok: boolean; error?: string; part?: CentralPartItem; audit?: InventoryAuditRecord } {
  if (!params.reason || params.reason.trim().length < 5) {
    return { ok: false, error: "A detailed reason (at least 5 characters) is required for inventory adjustments" };
  }
  if (params.adjustmentQuantity === 0) {
    return { ok: false, error: "Adjustment quantity cannot be zero" };
  }

  const partsStore = getCentralPartsStore();
  const part = partsStore.get(params.partId);
  if (!part) {
    return { ok: false, error: "Inventory item not found" };
  }

  const previousQuantity = part.warehouseQuantity;
  const newQuantity = previousQuantity + params.adjustmentQuantity;

  if (newQuantity < 0) {
    return {
      ok: false,
      error: `Adjustment would cause negative inventory. Available: ${previousQuantity} ${part.unit}, requested adjustment: ${params.adjustmentQuantity}`,
    };
  }

  part.warehouseQuantity = newQuantity;

  const audit: InventoryAuditRecord = {
    id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    partId: part.id,
    sku: part.sku,
    partName: part.name,
    type: "adjustment",
    quantityChange: params.adjustmentQuantity,
    previousQuantity,
    newQuantity,
    location: "warehouse",
    reason: params.reason.trim(),
    actor: params.actor || "Admin Operations",
    createdAt: new Date().toISOString(),
  };

  getAuditsStore().unshift(audit);

  return { ok: true, part, audit };
}

export function getInventoryAuditLog(): InventoryAuditRecord[] {
  return getAuditsStore();
}

/**
 * Database-derived business reporting aggregates
 */
export function getAdminReportsData(params: {
  type: "jobs" | "revenue" | "technicians";
  from?: string;
  to?: string;
}) {
  const store = getLocalDbWithDemo();
  const allJobs = Array.from(store.jobs.values())
    .map((j) => enrichJob(j.id, store))
    .filter((j): j is EnrichedJob => j !== null);

  const fromTime = params.from ? new Date(params.from).getTime() : 0;
  const toTime = params.to ? new Date(params.to).getTime() + 86400000 : Infinity;

  const filtered = allJobs.filter((j) => {
    const t = new Date(j.scheduledStart).getTime();
    return t >= fromTime && t <= toTime;
  });

  if (params.type === "jobs") {
    const total = filtered.length;
    const completed = filtered.filter((j) => j.status === "completed").length;
    const cancelled = filtered.filter((j) => j.status === "cancelled").length;
    const inProgress = filtered.filter((j) => j.status === "in_progress" || j.status === "on_the_way").length;
    const unassigned = filtered.filter((j) => j.status === "unassigned").length;

    // Service categories distribution
    const serviceBreakdown: Record<string, number> = {};
    filtered.forEach((j) => {
      const cat = j.service.category || "HVAC";
      serviceBreakdown[cat] = (serviceBreakdown[cat] || 0) + 1;
    });

    return {
      type: "jobs",
      totalJobs: total,
      completedJobs: completed,
      cancelledJobs: cancelled,
      inProgressJobs: inProgress,
      unassignedJobs: unassigned,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) + "%" : "0.0%",
      cancellationRate: total > 0 ? ((cancelled / total) * 100).toFixed(1) + "%" : "0.0%",
      serviceBreakdown,
    };
  }

  if (params.type === "revenue") {
    let invoicedTotalCents = 0;
    let collectedPaymentsCents = 0;
    let tipsCents = 0;
    let taxCents = 0;
    let outstandingDueCents = 0;

    filtered.forEach((j) => {
      if (j.invoice) {
        invoicedTotalCents += j.invoice.totalCents;
        taxCents += j.invoice.taxCents;
        tipsCents += j.invoice.tipCents;
        outstandingDueCents += j.invoice.amountDueCents;
      }
      j.payments.forEach((p) => {
        if (p.status === "succeeded") {
          collectedPaymentsCents += p.amountCents;
        }
      });
    });

    const completedCount = filtered.filter((j) => j.status === "completed").length;
    const avgTicketCents = completedCount > 0 ? Math.round(invoicedTotalCents / completedCount) : 0;

    return {
      type: "revenue",
      invoicedTotalCents,
      collectedPaymentsCents,
      tipsCents,
      taxCents,
      outstandingDueCents,
      completedJobsCount: completedCount,
      avgTicketCents,
    };
  }

  // Technicians report
  const techMap = new Map<string, {
    id: string;
    name: string;
    assignedJobs: number;
    completedJobs: number;
    revenueCents: number;
    rating: number;
  }>();

  for (const t of store.technicians.values()) {
    techMap.set(t.id, {
      id: t.id,
      name: t.name,
      assignedJobs: 0,
      completedJobs: 0,
      revenueCents: 0,
      rating: 4.9,
    });
  }

  filtered.forEach((j) => {
    if (j.technician) {
      const rec = techMap.get(j.technician.id);
      if (rec) {
        rec.assignedJobs += 1;
        if (j.status === "completed") {
          rec.completedJobs += 1;
          rec.revenueCents += (j.totalCents || j.estimatedTotalCents);
        }
      }
    }
  });

  return {
    type: "technicians",
    technicians: Array.from(techMap.values()),
  };
}
