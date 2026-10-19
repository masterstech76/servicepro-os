import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isRemoteSupabaseConfigured } from "@/lib/supabase/middleware";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { saveLocalDbToDisk } from "@/lib/server/local-db-fallback";
import { enrichJob, type EnrichedJob } from "@/lib/server/operations";
import { businessConfig } from "@config/business.config";
import type { Database } from "@/lib/supabase/types";

export interface ChecklistItem {
  id: string;
  category: "electrical" | "mechanical" | "refrigeration" | "safety" | "airflow" | "controls";
  label: string;
  description: string;
  required: boolean;
  status: "pass" | "fail" | "na" | "pending";
  notes?: string;
  inspectedAt?: string;
}

export interface EstimateLineItem {
  id: string;
  kind: "labor" | "parts";
  description: string;
  quantity: number;
  unitPriceCents: number;
  amountCents: number;
}

export interface JobEstimate {
  id: string;
  jobId: string;
  technicianId: string;
  title: string;
  description?: string;
  items: EstimateLineItem[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  status: "draft" | "pending_customer_approval" | "approved" | "declined";
  customerSignatureName?: string;
  decisionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VanPartItem {
  id: string;
  sku: string;
  name: string;
  category: "electrical" | "motors" | "refrigerant" | "piping" | "controls" | "safety";
  quantity: number;
  minQuantity: number;
  unitCostCents: number;
  unitPriceCents: number;
  unit: string;
}

export interface InventoryMovement {
  id: string;
  technicianId: string;
  jobId: string;
  partId: string;
  partName: string;
  sku: string;
  type: "consumed" | "returned";
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  notes?: string;
  createdAt: string;
}

// In-memory persistent stores for technician portal data
const globalTechStore = globalThis as unknown as {
  __spJobChecklists?: Map<string, ChecklistItem[]>;
  __spJobEstimates?: Map<string, JobEstimate[]>;
  __spVanInventory?: Map<string, Map<string, VanPartItem>>; // techId -> partId -> VanPartItem
  __spInventoryMovements?: InventoryMovement[];
};

function getChecklistMap(): Map<string, ChecklistItem[]> {
  if (!globalTechStore.__spJobChecklists) {
    globalTechStore.__spJobChecklists = new Map();
  }
  return globalTechStore.__spJobChecklists;
}

function getEstimatesMap(): Map<string, JobEstimate[]> {
  if (!globalTechStore.__spJobEstimates) {
    globalTechStore.__spJobEstimates = new Map();
  }
  return globalTechStore.__spJobEstimates;
}

function getVanInventoryStore(): Map<string, Map<string, VanPartItem>> {
  if (!globalTechStore.__spVanInventory) {
    globalTechStore.__spVanInventory = new Map();
  }
  return globalTechStore.__spVanInventory;
}

function getMovementsList(): InventoryMovement[] {
  if (!globalTechStore.__spInventoryMovements) {
    globalTechStore.__spInventoryMovements = [];
  }
  return globalTechStore.__spInventoryMovements;
}

const DEFAULT_VAN_PARTS: Omit<VanPartItem, "id">[] = [
  { sku: "CAP-45-5", name: "Dual Run Capacitor 45/5 MFD 440V", category: "electrical", quantity: 6, minQuantity: 2, unitCostCents: 1800, unitPriceCents: 8500, unit: "ea" },
  { sku: "CAP-35-5", name: "Dual Run Capacitor 35/5 MFD 440V", category: "electrical", quantity: 4, minQuantity: 2, unitCostCents: 1600, unitPriceCents: 8000, unit: "ea" },
  { sku: "CONT-2P-30A", name: "Contactor 2-Pole 30A 24V Coil", category: "electrical", quantity: 5, minQuantity: 2, unitCostCents: 2200, unitPriceCents: 9500, unit: "ea" },
  { sku: "HSTART-521", name: "Hard Start Kit (Compressor Saver)", category: "electrical", quantity: 3, minQuantity: 1, unitCostCents: 3500, unitPriceCents: 16500, unit: "ea" },
  { sku: "REF-410A-LB", name: "R-410A Refrigerant Virgin (Per Lb)", category: "refrigerant", quantity: 25, minQuantity: 10, unitCostCents: 2400, unitPriceCents: 8900, unit: "lb" },
  { sku: "SW-FLOAT-SS2", name: "Safe-T-Switch Condensate Float Switch", category: "safety", quantity: 4, minQuantity: 2, unitCostCents: 1900, unitPriceCents: 9000, unit: "ea" },
  { sku: "TRAP-EZT-210", name: "3/4\" Transparent EZ-Trap Kit with Brush", category: "piping", quantity: 4, minQuantity: 2, unitCostCents: 2100, unitPriceCents: 9500, unit: "ea" },
  { sku: "STAT-PRO-T701", name: "Pro1 Digital Non-Prog Thermostat", category: "controls", quantity: 2, minQuantity: 1, unitCostCents: 3800, unitPriceCents: 14500, unit: "ea" },
  { sku: "FUSE-DISC-30A", name: "30-Amp Time Delay Fuses (Pair)", category: "electrical", quantity: 8, minQuantity: 3, unitCostCents: 600, unitPriceCents: 3500, unit: "pair" },
  { sku: "TRANS-40VA", name: "Multi-Tap Control Transformer 40VA", category: "electrical", quantity: 3, minQuantity: 1, unitCostCents: 2400, unitPriceCents: 11000, unit: "ea" },
];

export function getTechVanInventory(techId: string): VanPartItem[] {
  const store = getVanInventoryStore();
  let techVan = store.get(techId);

  if (!techVan) {
    techVan = new Map();
    DEFAULT_VAN_PARTS.forEach((p, idx) => {
      const id = `van_${techId}_part_${idx + 1}`;
      techVan!.set(id, { ...p, id });
    });
    store.set(techId, techVan);
  }

  return Array.from(techVan.values());
}

export function consumeVanPart(params: {
  techId: string;
  jobId: string;
  partId: string;
  quantity: number;
  notes?: string;
}): { ok: boolean; error?: string; remainingQuantity?: number; movement?: InventoryMovement } {
  const store = getVanInventoryStore();
  const techVan = store.get(params.techId) || new Map();
  const part = techVan.get(params.partId);

  if (!part) {
    return { ok: false, error: "Part not found in technician van inventory" };
  }

  if (params.quantity <= 0) {
    return { ok: false, error: "Quantity consumed must be greater than zero" };
  }

  if (part.quantity < params.quantity) {
    return {
      ok: false,
      error: `Insufficient van stock. Available: ${part.quantity} ${part.unit}, requested: ${params.quantity}`,
    };
  }

  // Concurrency-safe atomic decrement
  part.quantity -= params.quantity;

  const movement: InventoryMovement = {
    id: `mov_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    technicianId: params.techId,
    jobId: params.jobId,
    partId: part.id,
    partName: part.name,
    sku: part.sku,
    type: "consumed",
    quantity: params.quantity,
    unitPriceCents: part.unitPriceCents,
    totalCents: part.unitPriceCents * params.quantity,
    notes: params.notes,
    createdAt: new Date().toISOString(),
  };

  getMovementsList().push(movement);

  return { ok: true, remainingQuantity: part.quantity, movement };
}

export function returnVanPart(params: {
  techId: string;
  jobId: string;
  partId: string;
  quantity: number;
  notes?: string;
}): { ok: boolean; error?: string; remainingQuantity?: number; movement?: InventoryMovement } {
  const store = getVanInventoryStore();
  const techVan = store.get(params.techId) || new Map();
  const part = techVan.get(params.partId);

  if (!part) {
    return { ok: false, error: "Part not found in technician van inventory" };
  }

  if (params.quantity <= 0) {
    return { ok: false, error: "Quantity returned must be greater than zero" };
  }

  part.quantity += params.quantity;

  const movement: InventoryMovement = {
    id: `mov_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    technicianId: params.techId,
    jobId: params.jobId,
    partId: part.id,
    partName: part.name,
    sku: part.sku,
    type: "returned",
    quantity: params.quantity,
    unitPriceCents: part.unitPriceCents,
    totalCents: part.unitPriceCents * params.quantity,
    notes: params.notes,
    createdAt: new Date().toISOString(),
  };

  getMovementsList().push(movement);

  return { ok: true, remainingQuantity: part.quantity, movement };
}

export function getJobInventoryMovements(jobId: string): InventoryMovement[] {
  return getMovementsList().filter((m) => m.jobId === jobId);
}

/**
 * Standard 10-point HVAC inspection checklist
 */
export const STANDARD_CHECKLIST_TEMPLATE: Omit<ChecklistItem, "status" | "notes" | "inspectedAt">[] = [
  { id: "chk-1", category: "controls", label: "Thermostat Calibration & Heating/Cooling Call", description: "Verify thermostat calls for cooling/heat properly with accurate temperature reading.", required: true },
  { id: "chk-2", category: "electrical", label: "Contactor Points & Disconnect Switch", description: "Inspect contactor for pitting or burning; test 24V coil pull-in and 240V high-voltage supply.", required: true },
  { id: "chk-3", category: "electrical", label: "Dual Run Capacitor Microfarad Tolerance", description: "Meter HERM and FAN terminals under load; must read within +/- 6% of rated MFD value.", required: true },
  { id: "chk-4", category: "safety", label: "High/Low Pressure Cutout & Safety Switches", description: "Verify safety disconnect, float switches, and emergency drain cutouts trip properly.", required: true },
  { id: "chk-5", category: "airflow", label: "Air Filter Condition & Static Return Flow", description: "Inspect MERV filter rating, static airflow resistance, and return plenum seal.", required: true },
  { id: "chk-6", category: "mechanical", label: "Blower Wheel & Motor Amperage", description: "Check blower wheel for dust build-up, motor bearings, and running amps against FLA specs.", required: true },
  { id: "chk-7", category: "airflow", label: "Condensate Drain Line & Trap Flow", description: "Clear and flush primary condensate line; verify P-trap water seal and drain pan integrity.", required: true },
  { id: "chk-8", category: "refrigeration", label: "Suction & Liquid Line Operating Pressures", description: "Measure suction/head pressures, target superheat, and subcooling to ensure proper charge.", required: true },
  { id: "chk-9", category: "mechanical", label: "Condenser Fan Motor & Coil Cleanliness", description: "Inspect condenser coil fins for blockage and check top-discharge fan motor rotation.", required: true },
  { id: "chk-10", category: "electrical", label: "Compressor Run Amps & Temperature Delta", description: "Measure compressor RLA during operation and verify 16-22°F temperature drop across evaporator.", required: true },
];

export function getJobChecklist(jobId: string): ChecklistItem[] {
  const map = getChecklistMap();
  let list = map.get(jobId);

  if (!list) {
    list = STANDARD_CHECKLIST_TEMPLATE.map((t) => ({
      ...t,
      status: "pending",
    }));
    map.set(jobId, list);
  }

  return list;
}

export function saveJobChecklist(
  techId: string,
  jobId: string,
  items: ChecklistItem[]
): { ok: boolean; error?: string; checklist: ChecklistItem[] } {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(jobId);

  if (!job) {
    return { ok: false, error: "Job not found", checklist: [] };
  }

  // Security: Technician can only update checklist for jobs assigned to them
  if (job.technician_id && job.technician_id !== techId) {
    return { ok: false, error: "Unauthorized: You are not assigned to this job.", checklist: [] };
  }

  // Validate that any failed items include an explanatory note
  for (const it of items) {
    if (it.status === "fail" && (!it.notes || it.notes.trim().length < 3)) {
      return {
        ok: false,
        error: `Notes explaining the issue are required for failed item: "${it.label}".`,
        checklist: items,
      };
    }
  }

  const timestamp = new Date().toISOString();
  const updated = items.map((it) => ({
    ...it,
    inspectedAt: it.status !== "pending" ? it.inspectedAt || timestamp : undefined,
  }));

  getChecklistMap().set(jobId, updated);
  return { ok: true, checklist: updated };
}

export function isChecklistComplete(jobId: string): boolean {
  const items = getJobChecklist(jobId);
  return items.every((it) => !it.required || it.status !== "pending");
}

/**
 * On-site Estimates
 */
export function getJobEstimates(jobId: string): JobEstimate[] {
  const map = getEstimatesMap();
  return map.get(jobId) || [];
}

export function saveJobEstimate(params: {
  techId: string;
  jobId: string;
  title: string;
  description?: string;
  items: Array<Omit<EstimateLineItem, "id" | "amountCents">>;
}): { ok: boolean; error?: string; estimate?: JobEstimate } {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(params.jobId);

  if (!job) return { ok: false, error: "Job not found" };
  if (job.technician_id && job.technician_id !== params.techId) {
    return { ok: false, error: "Unauthorized to create estimate on this job" };
  }

  if (!params.title.trim() || params.items.length === 0) {
    return { ok: false, error: "Estimate title and at least one line item are required" };
  }

  const processedItems: EstimateLineItem[] = params.items.map((it, idx) => ({
    id: `est_item_${idx + 1}`,
    kind: it.kind,
    description: it.description.trim(),
    quantity: Math.max(1, it.quantity),
    unitPriceCents: it.unitPriceCents,
    amountCents: Math.round(Math.max(1, it.quantity) * it.unitPriceCents),
  }));

  const subtotalCents = processedItems.reduce((sum, it) => sum + it.amountCents, 0);
  const taxRate = (businessConfig.tax?.rateBps ?? 700) / 10000;
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;

  const estimate: JobEstimate = {
    id: `est_${params.jobId}_${Date.now()}`,
    jobId: params.jobId,
    technicianId: params.techId,
    title: params.title.trim(),
    description: params.description?.trim(),
    items: processedItems,
    subtotalCents,
    taxCents,
    totalCents,
    status: "pending_customer_approval",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const map = getEstimatesMap();
  const existing = map.get(params.jobId) || [];
  existing.push(estimate);
  map.set(params.jobId, existing);

  return { ok: true, estimate };
}

export function recordEstimateDecision(params: {
  techId: string;
  jobId: string;
  estimateId: string;
  decision: "approved" | "declined";
  customerSignatureName?: string;
}): { ok: boolean; error?: string; estimate?: JobEstimate } {
  const map = getEstimatesMap();
  const list = map.get(params.jobId) || [];
  const estimate = list.find((e) => e.id === params.estimateId);

  if (!estimate) {
    return { ok: false, error: "Estimate not found" };
  }

  if (estimate.status === "approved" || estimate.status === "declined") {
    return { ok: false, error: `Estimate has already been ${estimate.status}` };
  }

  if (params.decision === "approved" && !params.customerSignatureName?.trim()) {
    return { ok: false, error: "Customer name or signature verification is required to approve work" };
  }

  estimate.status = params.decision;
  estimate.customerSignatureName = params.customerSignatureName?.trim();
  estimate.decisionAt = new Date().toISOString();
  estimate.updatedAt = new Date().toISOString();

  return { ok: true, estimate };
}

/**
 * Resolves the authenticated technician session
 */
export async function resolveTechnicianSession(request?: Request): Promise<{
  techId: string;
  name: string;
  email: string | null;
  phone: string;
  role: "technician";
  color: string;
  vehicle: { model: string; plate: string; status: string };
} | null> {
  const store = getLocalDbWithDemo();

  let techId = "tech-carlos";
  let role = "technician";

  try {
    const cookieStore = cookies();
    const cookieRole = cookieStore.get("servicepro_dev_role")?.value;
    const cookieTechId = cookieStore.get("sp_demo_tech_id")?.value;
    if (cookieRole) role = cookieRole;
    if (cookieTechId) techId = cookieTechId;
  } catch {
    // outside request context
  }

  if (request) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    if (cookieHeader) {
      const parsed = Object.fromEntries(
        cookieHeader.split(";").map((p) => {
          const [k, ...v] = p.trim().split("=");
          return [k, decodeURIComponent(v.join("="))];
        })
      );
      if (parsed["sp_demo_tech_id"]) techId = parsed["sp_demo_tech_id"];
    }
  }

  const tech = store.technicians.get(techId) || store.technicians.get("tech-carlos");
  if (!tech) return null;

  return {
    techId: tech.id,
    name: tech.name,
    email: tech.email,
    phone: tech.phone,
    role: "technician",
    color: tech.color || "#F97316",
    vehicle: {
      model: "2023 Ford Transit 250 EcoBoost",
      plate: `FL-HVAC-${tech.id.slice(-2).toUpperCase()}`,
      status: "Fully Equipped & Stocked",
    },
  };
}

/**
 * Returns jobs assigned to technician with optional date filtering
 */
export function getTechnicianScheduleJobs(
  techId: string,
  filter: "today" | "tomorrow" | "week" | "all" = "today"
): EnrichedJob[] {
  const store = getLocalDbWithDemo();
  const list: EnrichedJob[] = [];

  for (const job of store.jobs.values()) {
    if (job.technician_id === techId && job.status !== "cancelled") {
      const enriched = enrichJob(job.id, store);
      if (enriched) list.push(enriched);
    }
  }
  return list.sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());
}

export interface TechEarningJob {
  jobId: string;
  jobNumber: number;
  serviceName: string;
  completedAt: string;
  billedCents: number;
  commissionRatePct: number;
  commissionEarnedCents: number;
  tipsCents: number;
  totalPayoutCents: number;
  status: "paid" | "pending";
}

export interface TechEarningsSummary {
  period: "this_week" | "this_month" | "all_time";
  commissionRatePct: number;
  completedJobsCount: number;
  totalBilledCents: number;
  totalCommissionCents: number;
  totalTipsCents: number;
  totalEarningsCents: number;
  pendingPayoutCents: number;
  paidPayoutCents: number;
  jobs: TechEarningJob[];
}

export function getTechEarnings(
  techId: string,
  period: "this_week" | "this_month" | "all_time" = "this_month"
): TechEarningsSummary {
  const store = getLocalDbWithDemo();
  const tech = store.technicians.get(techId);
  const commissionRatePct = tech?.commission_pct || 25;

  const jobsList: TechEarningJob[] = [];
  let totalBilled = 0;
  let totalCommission = 0;
  let totalTips = 0;
  let pendingPayout = 0;
  let paidPayout = 0;

  for (const j of store.jobs.values()) {
    if (j.technician_id === techId && j.status === "completed") {
      const service = store.services.get(j.service_id);
      const billedCents = j.total_cents || j.estimated_total_cents || 18900;
      const commissionCents = Math.round((billedCents * commissionRatePct) / 100);
      const tipsCents = j.tip_cents || 0;
      const totalPayoutCents = commissionCents + tipsCents;

      // Status: if completed more than 7 days ago, considered paid
      const completedTime = new Date(j.completed_at || j.scheduled_end).getTime();
      const isPaid = Date.now() - completedTime > 7 * 86400000;

      if (isPaid) {
        paidPayout += totalPayoutCents;
      } else {
        pendingPayout += totalPayoutCents;
      }

      totalBilled += billedCents;
      totalCommission += commissionCents;
      totalTips += tipsCents;

      jobsList.push({
        jobId: j.id,
        jobNumber: j.job_number || 1000,
        serviceName: service?.name || "HVAC Diagnostic & Repair",
        completedAt: j.completed_at || j.scheduled_end,
        billedCents,
        commissionRatePct,
        commissionEarnedCents: commissionCents,
        tipsCents,
        totalPayoutCents,
        status: isPaid ? "paid" : "pending",
      });
    }
  }

  jobsList.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return {
    period,
    commissionRatePct,
    completedJobsCount: jobsList.length,
    totalBilledCents: totalBilled,
    totalCommissionCents: totalCommission,
    totalTipsCents: totalTips,
    totalEarningsCents: totalCommission + totalTips,
    pendingPayoutCents: pendingPayout,
    paidPayoutCents: paidPayout,
    jobs: jobsList,
  };
}

export interface TechNotificationItem {
  id: string;
  type: "job_assigned" | "schedule_change" | "customer_note" | "inventory_alert";
  title: string;
  message: string;
  jobId?: string;
  jobNumber?: number;
  read: boolean;
  createdAt: string;
}

const globalTechNotifStore = globalThis as unknown as { __spTechNotifs?: Map<string, TechNotificationItem[]> };
if (!globalTechNotifStore.__spTechNotifs) {
  globalTechNotifStore.__spTechNotifs = new Map([
    [
      "tech-carlos",
      [
        {
          id: "tn_1",
          type: "job_assigned",
          title: "New Job Assigned",
          message: "You have been assigned to Job #1004 (AC Repair Diagnostic) at 1200 Brickell Ave.",
          jobId: "job_1004",
          jobNumber: 1004,
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "tn_2",
          type: "customer_note",
          title: "Customer Note Added",
          message: "Gate code is #4492. Beware of friendly dog in side yard.",
          jobId: "job_1001",
          jobNumber: 1001,
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "tn_3",
          type: "inventory_alert",
          title: "Van Restock Ready",
          message: "2x 45/5 Dual Run Capacitors have been allocated for your van at the central warehouse.",
          read: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ],
    ],
  ]);
}

export function getTechNotifications(techId: string): TechNotificationItem[] {
  const notifs = globalTechNotifStore.__spTechNotifs?.get(techId) || [
    {
      id: `tn_${Date.now()}`,
      type: "job_assigned",
      title: "Today's Schedule Active",
      message: "Check your schedule tab for your next dispatch appointment window.",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];
  return notifs;
}

export function markTechNotificationRead(techId: string, notifId: string): boolean {
  const notifs = globalTechNotifStore.__spTechNotifs?.get(techId);
  if (!notifs) return false;
  const n = notifs.find((x) => x.id === notifId);
  if (n) {
    n.read = true;
    return true;
  }
  return false;
}
