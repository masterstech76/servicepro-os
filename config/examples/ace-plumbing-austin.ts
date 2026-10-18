import { businessConfigSchema, type BusinessConfig } from "../business.schema";

const rawAcePlumbingConfig: BusinessConfig = {
  businessName: "Ace Plumbing Austin",
  slug: "ace-plumbing-austin",
  legalName: "Ace Plumbing & Drain Specialists LLC",
  licenseNumber: "TX-M40921",
  phone: "(512) 555-0188",
  email: "dispatch@aceplumbingaustin.com",
  address: "500 Congress Ave, Suite 200, Austin, TX 78701",
  city: "Austin",
  state: "TX",
  logo: {
    light: "/logo-placeholder.svg",
    dark: "/logo-placeholder.svg",
    favicon: "/favicon.ico",
  },
  colors: {
    primary: "#0F172A",
    primaryHover: "#1E293B",
    primaryMuted: "#334155",
    accent: "#F59E0B",
    accentHover: "#D97706",
    accentDark: "#B45309",
    accentTint: "#FFFBEB",
  },
  currency: "USD",
  timezone: "America/Chicago",
  zipCodes: ["78701", "78702", "78703", "78704", "78705", "78731", "78745"],
  hours: {
    0: null,
    1: { open: "07:00", close: "19:00" },
    2: { open: "07:00", close: "19:00" },
    3: { open: "07:00", close: "19:00" },
    4: { open: "07:00", close: "19:00" },
    5: { open: "07:00", close: "19:00" },
    6: { open: "08:00", close: "17:00" },
  },
  services: [
    {
      id: "svc-drain-clearing",
      name: "Main Line & Drain Clearing",
      description:
        "Hydro-jet or auger clearing for clogged kitchen, bath, or main sewer drains.",
      category: "Plumbing",
      skillTag: "plumbing",
      pricing: "flat",
      price: 11900,
      durationMinutes: 60,
    },
    {
      id: "svc-water-heater",
      name: "Tankless Water Heater Flush & Tune-Up",
      description:
        "Complete descaling, filter cleaning, and burner safety inspection.",
      category: "Plumbing",
      skillTag: "plumbing",
      pricing: "flat",
      price: 14900,
      durationMinutes: 90,
    },
    {
      id: "svc-leak-detection",
      name: "Slab & Pipe Leak Detection",
      description:
        "Acoustic and thermal pinpoint leak detection with upfront repair quote.",
      category: "Plumbing",
      skillTag: "plumbing",
      pricing: "hourly",
      price: 13500,
      durationMinutes: 60,
      minBillableMinutes: 60,
    },
  ],
  booking: {
    depositPct: 20,
    tipPresets: [15, 20, 25],
    slotIntervalMinutes: 60,
    bufferMinutes: 30,
    minNoticeHours: 2,
    maxAdvanceDays: 30,
    holdMinutes: 10,
    maxPhotos: 5,
  },
  tax: {
    rateBps: 825, // 8.25% TX parts sales tax
    appliesTo: "parts",
  },
  policy: {
    cancellationWindowHours: 24,
    requireBeforePhoto: true,
    requireAfterPhoto: true,
    techCanEditHours: true,
  },
  dispatch: {
    autoAssign: false,
    weights: {
      loadPerJob: 15,
      travelPerMin: 0.5,
      clusterBonus: 10,
      exactSkillBonus: 5,
    },
  },
  sms: {
    driver: "console",
    fromEnv: "TWILIO_FROM_NUMBER",
    reviewUrl: "https://g.page/r/ace-plumbing-austin/review",
  },
  stripe: {
    publishableKeyEnv: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    secretKeyEnv: "STRIPE_SECRET_KEY",
    webhookSecretEnv: "STRIPE_WEBHOOK_SECRET",
  },
  mapbox: {
    publicTokenEnv: "NEXT_PUBLIC_MAPBOX_TOKEN",
    defaultCenter: [-97.7431, 30.2672],
    defaultZoom: 11,
  },
  seo: {
    title: "Ace Plumbing Austin — Same-Day Drain & Water Heater Service",
    description:
      "Licensed Austin plumbers. Upfront pricing and 60-second online booking.",
    heroHeadline: "Fast, Licensed Plumbing Service in Austin",
    heroSubheadline:
      "Same-day drain clearing, leak detection, and water heater service across Austin.",
  },
};

export const acePlumbingAustinConfig = businessConfigSchema.parse(
  rawAcePlumbingConfig
);
