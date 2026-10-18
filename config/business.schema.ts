import { z } from "zod";

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [R, G, B] = [toLinear(r), toLinear(g), toLinear(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a 6-digit hex color");

const dayHoursSchema = z
  .object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
  })
  .nullable();

export const serviceConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  skillTag: z.string().min(1),
  pricing: z.enum(["flat", "hourly"]),
  price: z.number().int().nonnegative(), // integer cents
  durationMinutes: z.number().int().min(15).max(480),
  minBillableMinutes: z.number().int().min(15).optional(),
  depositPctOverride: z.number().int().min(10).max(100).optional(),
  description: z.string(),
});

export const businessConfigSchema = z
  .object({
    businessName: z.string().min(1),
    slug: z.string().min(1),
    legalName: z.string().optional(),
    licenseNumber: z.string().optional(),
    phone: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(2),
    logo: z.object({
      light: z.string().min(1),
      dark: z.string().optional(),
      favicon: z.string().min(1),
    }),
    colors: z.object({
      primary: hexColorSchema.default("#0F172A"),
      primaryHover: hexColorSchema.default("#1E293B"),
      primaryMuted: hexColorSchema.default("#334155"),
      accent: hexColorSchema.default("#F97316"),
      accentHover: hexColorSchema.default("#EA580C"),
      accentDark: hexColorSchema.default("#C2410C"),
      accentTint: hexColorSchema.default("#FFF7ED"),
    }),
    currency: z.literal("USD"),
    timezone: z.string().min(1),
    zipCodes: z.array(z.string().regex(/^\d{5}$/)).min(1),
    hours: z.object({
      0: dayHoursSchema, // Sunday
      1: dayHoursSchema, // Monday
      2: dayHoursSchema, // Tuesday
      3: dayHoursSchema, // Wednesday
      4: dayHoursSchema, // Thursday
      5: dayHoursSchema, // Friday
      6: dayHoursSchema, // Saturday
    }),
    services: z.array(serviceConfigSchema).min(1),
    booking: z.object({
      depositPct: z.number().int().min(10).max(100).default(20),
      tipPresets: z.tuple([z.number().int(), z.number().int(), z.number().int()]).default([15, 20, 25]),
      slotIntervalMinutes: z.enum(["30", "60", "120"]).transform(Number).or(z.union([z.literal(30), z.literal(60), z.literal(120)])),
      bufferMinutes: z.number().int().min(0).max(240).default(30),
      minNoticeHours: z.number().int().min(0).default(2),
      maxAdvanceDays: z.number().int().min(1).max(90).default(30),
      holdMinutes: z.number().int().min(5).max(30).default(10),
      maxPhotos: z.number().int().min(1).max(10).default(5),
    }),
    tax: z.object({
      rateBps: z.number().int().min(0).max(2500),
      appliesTo: z.enum(["parts", "parts_and_labor"]),
    }),
    policy: z.object({
      cancellationWindowHours: z.number().int().nonnegative().default(24),
      requireBeforePhoto: z.boolean().default(true),
      requireAfterPhoto: z.boolean().default(true),
      techCanEditHours: z.boolean().default(true),
    }),
    dispatch: z.object({
      autoAssign: z.boolean().default(false),
      weights: z.object({
        loadPerJob: z.number().default(15),
        travelPerMin: z.number().default(0.5),
        clusterBonus: z.number().default(10),
        exactSkillBonus: z.number().default(5),
      }),
    }),
    sms: z.object({
      driver: z.enum(["twilio", "console"]),
      fromEnv: z.string().min(1),
      reviewUrl: z.string().url(),
    }),
    stripe: z.object({
      publishableKeyEnv: z.string().min(1),
      secretKeyEnv: z.string().min(1),
      webhookSecretEnv: z.string().min(1),
    }),
    mapbox: z.object({
      publicTokenEnv: z.string().min(1),
      defaultCenter: z.tuple([z.number(), z.number()]),
      defaultZoom: z.number(),
    }),
    seo: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      heroHeadline: z.string().min(1),
      heroSubheadline: z.string().min(1),
    }),
  })
  .superRefine((cfg, ctx) => {
    // Check primary on white >= 4.5:1
    const primaryOnWhite = getContrastRatio(cfg.colors.primary, "#FFFFFF");
    if (primaryOnWhite < 4.5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["colors", "primary"],
        message: `Primary color (${cfg.colors.primary}) on white (#FFFFFF) has contrast ${primaryOnWhite.toFixed(2)}:1, must be >= 4.5:1`,
      });
    }
    // Check primary text on accent button fill >= 4.5:1 (UI_SPEC 1.1: orange buttons use navy text)
    const primaryOnAccent = getContrastRatio(cfg.colors.primary, cfg.colors.accent);
    if (primaryOnAccent < 4.5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["colors", "accent"],
        message: `Primary text (${cfg.colors.primary}) on accent button (${cfg.colors.accent}) has contrast ${primaryOnAccent.toFixed(2)}:1, must be >= 4.5:1`,
      });
    }
  });

export type BusinessConfig = z.infer<typeof businessConfigSchema>;
export type ServiceConfig = z.infer<typeof serviceConfigSchema>;
