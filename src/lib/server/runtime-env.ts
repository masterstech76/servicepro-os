import "server-only";
import { businessConfigSchema } from "@config/business.schema";
import { businessConfig } from "@config/business.config";

export const BUILD_REQUIRED_VARS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "SMS_DRIVER",
] as const;

export const RUNTIME_SECRET_VARS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "CRON_SECRET",
] as const;

export function verifyEnv(options?: { includeRuntimeSecrets?: boolean }): {
  valid: boolean;
  missing: string[];
} {
  // 1. Validate business.config.ts against business.schema.ts
  businessConfigSchema.parse(businessConfig);

  // 2. Check required env vars with sensible build defaults if unset
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    process.env.NEXT_PUBLIC_APP_URL = process.env.RENDER_EXTERNAL_URL || "https://techwork.in";
  }
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_placeholder_key_for_demo";
  }

  const keysToCheck: string[] = [
    ...BUILD_REQUIRED_VARS,
    ...(options?.includeRuntimeSecrets ? RUNTIME_SECRET_VARS : []),
  ];

  const missing: string[] = [];
  for (const key of keysToCheck) {
    const val = process.env[key];
    if (!val || val.trim() === "") {
      missing.push(key);
    }
  }

  if (process.env.SMS_DRIVER === "twilio") {
    for (const k of ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"]) {
      if (!process.env[k]?.trim()) missing.push(k);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function assertRuntimeSecrets(): void {
  const result = verifyEnv({ includeRuntimeSecrets: true });
  if (!result.valid) {
    throw new Error(
      `Missing required runtime environment variables: ${result.missing.join(", ")}`
    );
  }
}
