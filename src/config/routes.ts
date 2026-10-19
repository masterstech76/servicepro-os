/**
 * Centralized Route Registry for TechWork / ServicePro OS
 * Every internal link and navigation action must reference these typed routes.
 */

export const routes = {
  // Public Core
  home: "/",
  about: "/about",
  howItWorks: "/how-it-works",
  reviews: "/reviews",
  specials: "/specials",
  contact: "/contact",
  areas: "/areas",
  areaDetail: (slug: string) => `/areas/${slug}`,
  faq: "/faq",
  careers: "/careers",
  maintenancePlans: "/maintenance-plans",
  financing: "/financing",
  emergency: "/emergency",
  blog: "/blog",
  blogDetail: (slug: string) => `/blog/${slug}`,

  // Legal
  privacy: "/privacy",
  terms: "/terms",
  guarantee: "/guarantee",
  accessibility: "/accessibility",

  // Services Hub & Individual Pages
  services: "/services",
  serviceDetail: (slug: string) => `/services/${slug}`,
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

  // Booking Flow
  book: "/book",
  bookService: (serviceId: string) => `/book?serviceId=${encodeURIComponent(serviceId)}`,
  bookConfirmation: "/book/confirmation",
  bookConfirmationWithPi: (pi: string) => `/book/confirmation?pi=${encodeURIComponent(pi)}`,

  // Auth & Account Access
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  verifyPhone: "/verify-phone",
  unauthorized: "/unauthorized",

  // Customer Portal
  account: {
    dashboard: "/account",
    appointments: "/account/appointments",
    appointmentDetail: (id: string) => `/account/appointments/${encodeURIComponent(id)}`,
    appointmentTrack: (id: string) => `/account/appointments/${encodeURIComponent(id)}/track`,
    invoices: "/account/invoices",
    payments: "/account/payments",
    addresses: "/account/addresses",
    profile: "/account/profile",
    notifications: "/account/notifications",
    support: "/account/support",
  },

  // Payments
  pay: (token: string) => `/pay/${encodeURIComponent(token)}`,

  // Technician Portal
  tech: {
    dashboard: "/tech",
    schedule: "/tech/schedule",
    profile: "/tech/profile",
    jobDetail: (id: string) => `/tech/jobs/${encodeURIComponent(id)}`,
    jobChecklist: (id: string) => `/tech/jobs/${encodeURIComponent(id)}/checklist`,
    jobEstimate: (id: string) => `/tech/jobs/${encodeURIComponent(id)}/estimate`,
    jobParts: (id: string) => `/tech/jobs/${encodeURIComponent(id)}/parts`,
  },

  // Admin Operating System
  admin: {
    dashboard: "/admin",
    dispatch: "/admin/dispatch",
    dispatchDetail: (id: string) => `/admin/dispatch/${encodeURIComponent(id)}`,
    calendar: "/admin/calendar",
    jobs: "/admin/jobs",
    jobNew: "/admin/jobs/new",
    jobDetail: (id: string) => `/admin/jobs/${encodeURIComponent(id)}`,
    customers: "/admin/customers",
    technicians: "/admin/technicians",
    services: "/admin/services",
    serviceAreas: "/admin/service-areas",
    reports: "/admin/reports",
    settings: "/admin/settings",
    estimates: "/admin/estimates",
    invoices: "/admin/invoices",
    payments: "/admin/payments",
    refunds: "/admin/refunds",
    inventory: "/admin/inventory",
    equipment: "/admin/equipment",
    maintenancePlans: "/admin/maintenance-plans",
    communications: "/admin/communications",
    notifications: "/admin/notifications",
    users: "/admin/users",
    roles: "/admin/roles",
    integrations: "/admin/integrations",
    auditLogs: "/admin/audit-logs",
    automations: "/admin/automations",
    reviews: "/admin/reviews",
  },
} as const;

export default routes;
