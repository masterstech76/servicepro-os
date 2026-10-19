import fs from "fs";
import path from "path";
import type { verifyEnv as verifyEnvFn, assertRuntimeSecrets as assertRuntimeSecretsFn } from "../src/lib/server/runtime-env";

// In standalone CLI scripts (tsx scripts/verify-env.ts), mock server-only before loading runtime-env
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  require.cache[require.resolve("server-only")] = {
    id: "server-only",
    filename: "server-only",
    loaded: true,
    exports: {},
  } as any;
} catch {}

// Load after mock is in require.cache
// eslint-disable-next-line @typescript-eslint/no-var-requires
const runtimeEnv = require("../src/lib/server/runtime-env") as {
  verifyEnv: typeof verifyEnvFn;
  assertRuntimeSecrets: typeof assertRuntimeSecretsFn;
  BUILD_REQUIRED_VARS: readonly string[];
  RUNTIME_SECRET_VARS: readonly string[];
};

export const verifyEnv = runtimeEnv.verifyEnv;
export const assertRuntimeSecrets = runtimeEnv.assertRuntimeSecrets;
export const BUILD_REQUIRED_VARS = runtimeEnv.BUILD_REQUIRED_VARS;
export const RUNTIME_SECRET_VARS = runtimeEnv.RUNTIME_SECRET_VARS;

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

if (typeof require !== "undefined" && require.main === module) {
  const result = verifyEnv();
  if (!result.valid) {
    console.error(
      `[verify-env] Missing required environment variables:\n  - ${result.missing.join("\n  - ")}`
    );
    process.exit(1);
  }
  console.log("[verify-env] Environment and business.config.ts verified successfully.");
}
