import { NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to avoid memory accumulation
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  if (timer.unref) {
    timer.unref();
  }
}

export interface RateLimitOptions {
  limit?: number; // max requests per window
  windowMs?: number; // window duration in ms
  keyPrefix?: string;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

export function checkRateLimit(
  request: Request,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetSeconds: number; response?: NextResponse } {
  const limit = options.limit ?? 20;
  const windowMs = options.windowMs ?? 60_000;
  const prefix = options.keyPrefix ?? "default";
  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;

  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= limit) {
    const resetSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    const response = NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: `Too many requests. Please wait ${resetSeconds} seconds before trying again.`,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(resetSeconds),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(existing.resetAt / 1000)),
        },
      }
    );
    return { allowed: false, remaining: 0, resetSeconds, response };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

/** Clear all rate limits (useful in unit tests) */
export function resetRateLimits(): void {
  rateLimitStore.clear();
}
