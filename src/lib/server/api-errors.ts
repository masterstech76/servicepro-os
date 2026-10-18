import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DbException } from "./local-db-fallback";

const ERROR_MESSAGES: Record<string, { status: number; message: string }> = {
  SLOT_TAKEN: {
    status: 409,
    message: "That time was just taken. Please pick another available window.",
  },
  TOO_MANY_HOLDS: {
    status: 429,
    message: "You have too many active time holds. Please wait a few minutes or complete your booking.",
  },
  ZIP_NOT_SERVED: {
    status: 400,
    message: "Sorry, we don't serve that ZIP code yet.",
  },
  SLOT_LOST: {
    status: 409,
    message: "Your time hold expired and the slot is no longer available.",
  },
  HOLD_NOT_FOUND: {
    status: 404,
    message: "That time hold was not found or has expired.",
  },
  HOLD_EXPIRED: {
    status: 410,
    message: "Your time hold has expired. Please pick a new time.",
  },
  SERVICE_NOT_FOUND: {
    status: 404,
    message: "Requested service was not found.",
  },
  BUSINESS_NOT_FOUND: {
    status: 404,
    message: "Business configuration not found.",
  },
  INVALID_TRANSITION: {
    status: 400,
    message: "That status change is not allowed.",
  },
  TECH_CONFLICT: {
    status: 409,
    message: "The technician has an overlapping job during that window.",
  },
  OUTSIDE_COVERAGE: {
    status: 400,
    message: "The technician does not cover that ZIP code.",
  },
  SKILL_MISMATCH: {
    status: 400,
    message: "The technician does not have the required skill for this service.",
  },
};

export function jsonError(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function handleRouteError(err: unknown) {
  if (err instanceof ZodError) {
    const first = err.issues[0];
    return jsonError(
      "VALIDATION_ERROR",
      first ? `${first.path.join(".") || "input"}: ${first.message}` : "Invalid request payload.",
      400
    );
  }

  if (err instanceof DbException) {
    const mapped = ERROR_MESSAGES[err.code];
    if (mapped) {
      return jsonError(err.code, mapped.message, mapped.status);
    }
    return jsonError(err.code, err.message, 400);
  }

  if (err && typeof err === "object" && "message" in err) {
    const msg = String((err as { message: unknown }).message);
    if (ERROR_MESSAGES[msg]) {
      const mapped = ERROR_MESSAGES[msg];
      return jsonError(msg, mapped.message, mapped.status);
    }
  }

  return jsonError("INTERNAL_ERROR", "An unexpected error occurred.", 500);
}
