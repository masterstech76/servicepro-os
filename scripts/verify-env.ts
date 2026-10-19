import fs from "fs";
import path from "path";
import { businessConfigSchema } from "../config/business.schema";
import { businessConfig } from "../config/business.config";

function loadEnvFile(filename: string) {
  const filePath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SMS_DRIVER",
  ...(process.env.NODE_ENV === "production" ? ["CRON_SECRET"] : []),
];

export function verifyEnv(): { valid: boolean; missing: string[] } {
  // 1. Validate business.config.ts against business.schema.ts
  businessConfigSchema.parse(businessConfig);

  // 2. Check required env vars
  const required = [
    ...REQUIRED_VARS,
    ...(process.env.NODE_ENV === "production" && !REQUIRED_VARS.includes("CRON_SECRET")
      ? ["CRON_SECRET"]
      : []),
  ];
  const missing: string[] = [];
  for (const key of required) {
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

if (require.main === module) {
  const result = verifyEnv();
  if (!result.valid) {
    console.error(
      `[verify-env] Missing required environment variables:\n  - ${result.missing.join("\n  - ")}`
    );
    process.exit(1);
  }
  console.log("[verify-env] Environment and business.config.ts verified successfully.");
}
