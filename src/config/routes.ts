/**
 * Centralized Route Registry for TechWork / ServicePro OS
 * Every internal link and navigation action references these typed routes.
 * Aligned 100% with all 84 active Next.js App Router pages.
 */

export const routes = {
  // Public Core (Section A)
  home: "/",
  about: "/about",
  howItWorks: "/how-it-works",
  reviews: "/reviews",
  reviewDetail: (id: string) => `/reviews/${encodeURIComponent(id)}`,
  gallery: "/gallery",
  demo: "/demo",
  specials: "/specials",
  contact: "/contact",
  areas: "/areas",
  areaDetail: (slug: string) => `/service-areas/${encodeURIComponent(slug)}`,
  faq: "/faq",

  // Contextual aliases
  careers: "/about#team",
  maintenancePlans: "/services/ac-tuneup",
  financing: "/specials#financing",
  emergency: "/services/emergency-hvac",
  blog: "/reviews",
  blogDetail: (slug: string) => `/reviews/${encodeURIComponent(slug)}`,

  // Legal
  privacy: "/privacy",
  terms: "/terms",
  guarantee: "/terms#guarantee",
  accessibility: "/accessibility",

  // Services Hub & Individual Pages
  services: "/services",
  serviceDetail: (slug: string) => `/services/${encodeURIComponent(slug)}`,
  servicesCatalog: {
    acRepair: "/services/ac-repair",
    acTuneup: "/services/ac-tuneup",
    thermostatInstall: "/services/thermostat-install",
    ductCleaning: "/services/duct-cleaning",
    refrigerantRecharge: "/services/refrigerant-recharge",
    furnaceRepair: "/services/furnace-repair",
    emergencyHvac: "/services/emergency-hvac",
    commercialHvac: "/services/commercial-hvac",
  },

  // Booking Flow (Section B)
  book: "/book",
  bookService: (serviceId: string) => `/book?serviceId=${encodeURIComponent(serviceId)}`,
  bookConfirmation: "/book/confirmation",
  bookConfirmationWithPi: (pi: string) => `/book/confirmation?pi=${encodeURIComponent(pi)}`,

  // Auth & Account Access (Section B)
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  verifyPhone: "/verify-phone",
  unauthorized: "/unauthorized",

  // Customer Portal (Section D)
  account: {
    dashboard: "/account",
    appointments: "/account/appointments",
    appointmentDetail: (id: string) => `/account/appointments/${encodeURIComponent(id)}`,
    appointmentTrack: (id: string) => `/account/appointments/${encodeURIComponent(id)}/track`,
    invoices: "/account/invoices",
    payments: "/account/payments",
    addresses: "/account/addresses",
    profile: "/account/profile",
    favorites: "/account/favorites",
    notifications: "/account/notifications",
    reviews: "/account/reviews",
    support: "/account/support",
  },

  // Public Payment Portal
  pay: (token: string) => `/pay/${encodeURIComponent(token)}`,

  // Technician Portal (Section F)
  tech: {
    dashboard: "/tech",
    schedule: "/tech/schedule",
    earnings: "/tech/earnings",
    notifications: "/tech/notifications",
    profile: "/tech/profile",
    jobDetail: (id: string) => `/tech/jobs/${encodeURIComponent(id)}`,
    jobChecklist: (id: string) => `/tech/jobs/${encodeURIComponent(id)}/checklist`,
    jobEstimate: (id: string) => `/tech/jobs/${encodeURIComponent(id)}/estimate`,
    jobParts: (id: string) => `/tech/jobs/${encodeURIComponent(id)}/parts`,
  },

  // Admin Operating System (Section E)
  admin: {
    dashboard: "/admin",
    dispatch: "/admin/dispatch",
    dispatchBoard: "/admin/dispatch/board",
    dispatchCalendar: "/admin/dispatch/calendar",
    calendar: "/admin/dispatch/calendar",
    jobs: "/admin/jobs",
    jobNew: "/admin/jobs/create",
    jobCreate: "/admin/jobs/create",
    jobDetail: (id: string) => `/admin/jobs/${encodeURIComponent(id)}`,
    customers: "/admin/customers",
    customerDetail: (id: string) => `/admin/customers/${encodeURIComponent(id)}`,
    technicians: "/admin/technicians",
    technicianDetail: (id: string) => `/admin/technicians/${encodeURIComponent(id)}`,
    technicianSchedule: (id: string) => `/admin/technicians/${encodeURIComponent(id)}/schedule`,
    services: "/admin/services",
    serviceAreas: "/admin/service-areas",
    coupons: "/admin/coupons",
    inventory: "/admin/inventory",
    inventoryParts: "/admin/inventory/parts",
    inventoryTransactions: "/admin/inventory/transactions",
    invoices: "/admin/invoices",
    invoiceDetail: (id: string) => `/admin/invoices/${encodeURIComponent(id)}`,
    payments: "/admin/payments",
    reports: "/admin/reports",
    reportsRevenue: "/admin/reports/revenue",
    reportsJobs: "/admin/reports/jobs",
    reportsTechnicians: "/admin/reports/technicians",
    auditLogs: "/admin/audit-logs",
    reviews: "/admin/reviews",
    notifications: "/admin/notifications",
    settings: "/admin/settings",

    // Aliases to avoid breaking legacy references
    estimates: "/admin/jobs",
    refunds: "/admin/payments",
    equipment: "/admin/inventory",
    maintenancePlans: "/admin/services",
    communications: "/admin/notifications",
    users: "/admin/settings",
    roles: "/admin/settings",
    integrations: "/admin/settings",
    automations: "/admin/settings",
  },
} as const;

export default routes;
