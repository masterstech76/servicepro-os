import "server-only";
import { jsonError } from "./api-errors";

export async function verifyTurnstileTokenIfEnabled(token?: string) {
  const enabled = process.env.TURNSTILE_ENABLED === "true";
  if (!enabled) return null;

  const secret = process.env.TURNSTILE_SECRET_KEY ?? "";
  if (!token) {
    return jsonError("TURNSTILE_REQUIRED", "Bot verification is required.", 400);
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json();
    if (!data.success) {
      return jsonError("TURNSTILE_FAILED", "Bot verification failed.", 403);
    }
  } catch {
    return jsonError("TURNSTILE_FAILED", "Could not verify security token.", 403);
  }

  return null;
}
