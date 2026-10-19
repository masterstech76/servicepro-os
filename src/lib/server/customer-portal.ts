import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isRemoteSupabaseConfigured } from "@/lib/supabase/middleware";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { saveLocalDbToDisk } from "@/lib/server/local-db-fallback";
import { enrichJob, type EnrichedJob } from "@/lib/server/operations";
import type { Database } from "@/lib/supabase/types";

export interface CustomerAddress {
  id: string;
  customerId: string;
  label: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CustomerSupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  jobId?: string | null;
  subject: string;
  category: "rescheduling" | "billing" | "warranty" | "equipment" | "general";
  priority: "normal" | "urgent";
  message: string;
  status: "open" | "in_review" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface CustomerNotification {
  id: string;
  customerId: string;
  title: string;
  message: string;
  type: "booking" | "dispatch" | "invoice" | "system";
  linkUrl?: string;
  read: boolean;
  createdAt: string;
}

// In-memory persistent collections for customer portal data extensions
const globalCustomerStore = globalThis as unknown as {
  __spCustomerAddresses?: Map<string, CustomerAddress>;
  __spCustomerTickets?: Map<string, CustomerSupportTicket>;
  __spCustomerNotifications?: Map<string, CustomerNotification>;
};

function getAddressMap(): Map<string, CustomerAddress> {
  if (!globalCustomerStore.__spCustomerAddresses) {
    globalCustomerStore.__spCustomerAddresses = new Map();
  }
  return globalCustomerStore.__spCustomerAddresses;
}

function getTicketMap(): Map<string, CustomerSupportTicket> {
  if (!globalCustomerStore.__spCustomerTickets) {
    globalCustomerStore.__spCustomerTickets = new Map();
  }
  return globalCustomerStore.__spCustomerTickets;
}

function getNotificationMap(): Map<string, CustomerNotification> {
  if (!globalCustomerStore.__spCustomerNotifications) {
    globalCustomerStore.__spCustomerNotifications = new Map();
  }
  return globalCustomerStore.__spCustomerNotifications;
}

/**
 * Resolves the authenticated customer session safely.
 * Returns the customer entity or null if unauthenticated.
 */
export async function resolveCustomerSession(request?: Request): Promise<{
  customerId: string;
  name: string;
  email: string;
  phone: string;
  isDemo: boolean;
} | null> {
  const store = getLocalDbWithDemo();
  const defaultBiz = Array.from(store.businesses.values())[0];
  const defaultBizId = defaultBiz?.id ?? "00000000-0000-4000-8000-000000000001";

  // 1. Check request cookies or Next.js cookies store for demo session
  let roleCookie: string | undefined;
  let customEmail: string | undefined;

  try {
    const cookieStore = cookies();
    roleCookie =
      cookieStore.get("servicepro_dev_role")?.value ||
      cookieStore.get("sp_demo_role")?.value;
    customEmail = cookieStore.get("sp_demo_customer_email")?.value;
  } catch {
    // outside request context fallback
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
      if (parsed["servicepro_dev_role"] || parsed["sp_demo_role"]) {
        roleCookie = parsed["servicepro_dev_role"] || parsed["sp_demo_role"];
      }
      if (parsed["sp_demo_customer_email"]) {
        customEmail = parsed["sp_demo_customer_email"];
      }
    }
  }

  // 2. Check remote Supabase Auth if configured
  if (isRemoteSupabaseConfigured()) {
    try {
      const cookieStore = cookies();
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

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email) {
        // Find existing customer by email or create profile
        let matchedCustomer = Array.from(store.customers.values()).find(
          (c) => c.email?.toLowerCase() === user.email?.toLowerCase()
        );

        if (!matchedCustomer) {
          const newId = `cust_${user.id.slice(0, 12)}`;
          matchedCustomer = {
            id: newId,
            business_id: defaultBizId,
            name:
              (user.user_metadata?.full_name as string) ||
              user.email.split("@")[0],
            email: user.email,
            phone: (user.user_metadata?.phone as string) || "+13055550100",
            stripe_customer_id: null,
            stripe_payment_method_id: null,
            card_brand: null,
            card_last4: null,
            sms_opt_out: false,
            sms_consent_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          };
          store.customers.set(newId, matchedCustomer);
          saveLocalDbToDisk(store);
        }

        return {
          customerId: matchedCustomer.id,
          name: matchedCustomer.name,
          email: matchedCustomer.email || user.email,
          phone: matchedCustomer.phone,
          isDemo: false,
        };
      }
    } catch {
      // Fallback to dev session
    }
  }

  // 3. Demo / development customer resolution
  if (roleCookie === "customer" || roleCookie === "owner" || roleCookie === "admin") {
    // If a specific customer email is set in demo session:
    if (customEmail) {
      const found = Array.from(store.customers.values()).find(
        (c) => c.email?.toLowerCase() === customEmail?.toLowerCase()
      );
      if (found) {
        return {
          customerId: found.id,
          name: found.name,
          email: found.email || customEmail,
          phone: found.phone,
          isDemo: true,
        };
      }
    }

    // Default demo customer: cust_demo_1 (Maria Rivera - has active & completed appointments)
    const demoCust =
      store.customers.get("cust_demo_1") ||
      Array.from(store.customers.values())[0];

    if (demoCust) {
      return {
        customerId: demoCust.id,
        name: demoCust.name,
        email: demoCust.email || "maria.rivera@example.com",
        phone: demoCust.phone,
        isDemo: true,
      };
    }
  }

  return null;
}

/**
 * Returns enriched jobs belonging strictly to the specified customer.
 */
export function getCustomerJobs(customerId: string): EnrichedJob[] {
  const store = getLocalDbWithDemo();
  const list: EnrichedJob[] = [];

  for (const job of store.jobs.values()) {
    if (job.customer_id === customerId) {
      const enriched = enrichJob(job.id, store);
      if (enriched) {
        list.push(enriched);
      }
    }
  }

  // Sort: upcoming & active first (by scheduledStart ascending), then past jobs (descending)
  return list.sort((a, b) => {
    return new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime();
  });
}

/**
 * Returns customer dashboard overview metrics and latest records.
 */
export async function getCustomerDashboardData(customerId: string) {
  const jobs = getCustomerJobs(customerId);
  const now = new Date();

  const activeJobs = jobs.filter((j) =>
    ["unassigned", "assigned", "on_the_way", "in_progress"].includes(j.status)
  );

  const completedJobs = jobs.filter((j) => j.status === "completed");

  const invoices = jobs
    .map((j) => j.invoice)
    .filter((inv): inv is NonNullable<typeof inv> => inv !== null);

  const totalBalanceDueCents = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "draft")
    .reduce((sum, inv) => sum + (inv.amountDueCents || 0), 0);

  const addresses = getCustomerAddresses(customerId);

  // Next upcoming appointment (closest future or active today)
  const nextAppointment = activeJobs[0] || null;

  return {
    metrics: {
      activeAppointments: activeJobs.length,
      completedServices: completedJobs.length,
      balanceDueCents: totalBalanceDueCents,
      savedAddresses: addresses.length,
    },
    nextAppointment,
    recentAppointments: jobs.slice(0, 4),
    recentInvoices: invoices.slice(0, 4),
    addresses: addresses.slice(0, 3),
  };
}

/**
 * Returns single appointment details with customer ownership validation.
 */
export function getCustomerAppointmentById(customerId: string, jobId: string): EnrichedJob | null {
  const store = getLocalDbWithDemo();
  const job = store.jobs.get(jobId);
  if (!job || job.customer_id !== customerId) {
    return null;
  }
  return enrichJob(job.id, store);
}

/**
 * Returns all saved service addresses for a customer.
 */
export function getCustomerAddresses(customerId: string): CustomerAddress[] {
  const map = getAddressMap();
  const list: CustomerAddress[] = [];

  for (const addr of map.values()) {
    if (addr.customerId === customerId) {
      list.push(addr);
    }
  }

  // If no addresses yet, seed with primary address from customer record or demo
  if (list.length === 0) {
    const store = getLocalDbWithDemo();
    const cust = store.customers.get(customerId);
    const defaultAddr: CustomerAddress = {
      id: `addr_${customerId}_default`,
      customerId,
      label: "Primary Residence",
      line1: "123 Brickell Ave",
      line2: "Apt 14B",
      city: "Miami",
      state: "FL",
      zip: "33131",
      isDefault: true,
      createdAt: new Date().toISOString(),
    };
    map.set(defaultAddr.id, defaultAddr);
    list.push(defaultAddr);
  }

  return list;
}

export function saveCustomerAddress(
  customerId: string,
  data: Omit<CustomerAddress, "id" | "customerId" | "createdAt"> & { id?: string }
): CustomerAddress {
  const map = getAddressMap();
  const id = data.id || `addr_${customerId}_${Date.now()}`;

  const address: CustomerAddress = {
    id,
    customerId,
    label: data.label.trim(),
    line1: data.line1.trim(),
    line2: data.line2?.trim() || null,
    city: data.city.trim(),
    state: data.state.trim().toUpperCase(),
    zip: data.zip.trim(),
    isDefault: Boolean(data.isDefault),
    createdAt: new Date().toISOString(),
  };

  // If set to default, unset other defaults
  if (address.isDefault) {
    for (const other of map.values()) {
      if (other.customerId === customerId && other.id !== id) {
        other.isDefault = false;
      }
    }
  }

  map.set(id, address);
  return address;
}

export function deleteCustomerAddress(customerId: string, addressId: string): boolean {
  const map = getAddressMap();
  const addr = map.get(addressId);
  if (!addr || addr.customerId !== customerId) {
    return false;
  }
  return map.delete(addressId);
}

/**
 * Support Tickets
 */
export function getCustomerSupportTickets(customerId: string): CustomerSupportTicket[] {
  const map = getTicketMap();
  const list: CustomerSupportTicket[] = [];

  for (const t of map.values()) {
    if (t.customerId === customerId) {
      list.push(t);
    }
  }

  // Seed with an initial sample ticket if empty
  if (list.length === 0) {
    const initialTicket: CustomerSupportTicket = {
      id: `tick_${customerId}_1`,
      ticketNumber: "TICK-4028",
      customerId,
      subject: "Annual Maintenance Plan Inquiry",
      category: "general",
      priority: "normal",
      message: "Inquiring about bi-annual AC maintenance scheduling and priority dispatch coverage.",
      status: "resolved",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    };
    map.set(initialTicket.id, initialTicket);
    list.push(initialTicket);
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createCustomerSupportTicket(
  customerId: string,
  input: {
    subject: string;
    category: CustomerSupportTicket["category"];
    priority: CustomerSupportTicket["priority"];
    message: string;
    jobId?: string | null;
  }
): CustomerSupportTicket {
  const map = getTicketMap();
  const num = Math.floor(1000 + Math.random() * 9000);
  const ticket: CustomerSupportTicket = {
    id: `tick_${customerId}_${Date.now()}`,
    ticketNumber: `TICK-${num}`,
    customerId,
    jobId: input.jobId || null,
    subject: input.subject.trim(),
    category: input.category,
    priority: input.priority,
    message: input.message.trim(),
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  map.set(ticket.id, ticket);
  return ticket;
}

/**
 * Notifications
 */
export function getCustomerNotifications(customerId: string): CustomerNotification[] {
  const map = getNotificationMap();
  const list: CustomerNotification[] = [];

  for (const n of map.values()) {
    if (n.customerId === customerId) {
      list.push(n);
    }
  }

  // Seed default notifications if empty
  if (list.length === 0) {
    const seed: CustomerNotification[] = [
      {
        id: `notif_${customerId}_1`,
        customerId,
        title: "Upcoming HVAC Service Window",
        message: "Your AC diagnostic visit is scheduled with Technician Carlos Mendez.",
        type: "booking",
        linkUrl: "/account/appointments",
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: `notif_${customerId}_2`,
        customerId,
        title: "Invoice Paid - Thank You",
        message: "Receipt for Job #1030 is ready. Deposit credit was applied successfully.",
        type: "invoice",
        linkUrl: "/account/invoices",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    seed.forEach((item) => map.set(item.id, item));
    return seed;
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function markCustomerNotificationRead(customerId: string, notifId: string): boolean {
  const map = getNotificationMap();
  const item = map.get(notifId);
  if (!item || item.customerId !== customerId) return false;
  item.read = true;
  return true;
}

export function markAllCustomerNotificationsRead(customerId: string): number {
  const map = getNotificationMap();
  let count = 0;
  for (const item of map.values()) {
    if (item.customerId === customerId && !item.read) {
      item.read = true;
      count++;
    }
  }
  return count;
}
