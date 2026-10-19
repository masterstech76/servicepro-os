import { businessConfigSchema, type BusinessConfig } from "./business.schema";

// Generate 33125..33146 plus 33149 per PHASES.md Phase 1
const miamiZips: string[] = [];
for (let z = 33125; z <= 33146; z++) {
  miamiZips.push(String(z));
}
miamiZips.push("33149");

const rawConfig: BusinessConfig = {
  businessName: "Cool Air HVAC Miami",
  slug: "cool-air-hvac-miami",
  legalName: "Cool Air Conditioning & Heating Services LLC",
  licenseNumber: "CAC1819420",
  phone: "(305) 555-0100",
  email: "service@servicepro.in",
  address: "1200 Brickell Ave, Suite 400, Miami, FL 33131",
  city: "Miami",
  state: "FL",
  logo: {
    light: "/logo-placeholder.svg",
    dark: "/logo-placeholder.svg",
    favicon: "/favicon.ico",
  },
  colors: {
    primary: "#0F172A",
    primaryHover: "#1E293B",
    primaryMuted: "#334155",
    accent: "#F97316",
    accentHover: "#EA580C",
    accentDark: "#C2410C",
    accentTint: "#FFF7ED",
  },
  currency: "USD",
  timezone: "America/New_York",
  zipCodes: miamiZips,
  hours: {
    0: null, // Sunday closed
    1: { open: "07:00", close: "19:00" }, // Monday
    2: { open: "07:00", close: "19:00" }, // Tuesday
    3: { open: "07:00", close: "19:00" }, // Wednesday
    4: { open: "07:00", close: "19:00" }, // Thursday
    5: { open: "07:00", close: "19:00" }, // Friday
    6: { open: "08:00", close: "16:00" }, // Saturday
  },
  services: [
    {
      id: "svc-ac-repair",
      name: "AC Repair",
      category: "Cooling",
      skillTag: "hvac",
      pricing: "flat",
      price: 9900, // $99.00
      durationMinutes: 90,
      description: "Full system diagnostic and troubleshooting for warm air, leaks, or noises.",
    },
    {
      id: "svc-ac-tuneup",
      name: "AC Tune-Up",
      category: "Maintenance",
      skillTag: "hvac",
      pricing: "flat",
      price: 8900, // $89.00
      durationMinutes: 60,
      description: "21-point seasonal inspection, coil rinse, drain line flush, and filter check.",
    },
    {
      id: "svc-thermostat-install",
      name: "Thermostat Install",
      category: "Controls",
      skillTag: "hvac",
      pricing: "flat",
      price: 14900, // $149.00
      durationMinutes: 60,
      description: "Smart or programmable thermostat installation, wiring check, and Wi-Fi setup.",
    },
    {
      id: "svc-duct-cleaning",
      name: "Duct Cleaning",
      category: "Air Quality",
      skillTag: "hvac",
      pricing: "flat",
      price: 24900, // $249.00
      durationMinutes: 180,
      description: "Whole-home negative-pressure air duct cleaning and register sanitization.",
    },
    {
      id: "svc-refrigerant-recharge",
      name: "Refrigerant Recharge",
      category: "Cooling",
      skillTag: "hvac",
      pricing: "hourly",
      price: 12500, // $125.00/hr
      durationMinutes: 60,
      minBillableMinutes: 60,
      description: "Pressure test, subcooling balance, and R-410A refrigerant recharge ($125/hr, 1 hr minimum).",
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
    rateBps: 700, // 7.00%
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
    reviewUrl: "https://g.page/r/cool-air-hvac-miami/review",
  },
  stripe: {
    publishableKeyEnv: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    secretKeyEnv: "STRIPE_SECRET_KEY",
    webhookSecretEnv: "STRIPE_WEBHOOK_SECRET",
  },
  mapbox: {
    publicTokenEnv: "NEXT_PUBLIC_MAPBOX_TOKEN",
    defaultCenter: [-80.1918, 25.7617],
    defaultZoom: 11,
  },
  seo: {
    title: "Cool Air HVAC Miami — Same-Day AC Repair & Service",
    description: "Licensed & insured Miami HVAC technicians. Book online in 60 seconds with upfront pricing.",
    heroHeadline: "Fast, Upfront AC Repair & Service in Miami",
    heroSubheadline: "Licensed local technicians at your door today. Book online in 60 seconds — no phone tag.",
  },
};

export const businessConfig: BusinessConfig = businessConfigSchema.parse(rawConfig);
export default businessConfig;
