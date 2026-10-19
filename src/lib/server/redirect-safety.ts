import type { UserRole } from "@/lib/supabase/types";

/**
 * Validates and sanitizes internal redirect URLs.
 * Rejects external URLs, protocol-relative URLs (//), backslashes, schemes,
 * and dangerous auth loop routes.
 */
export function sanitizeRedirectUrl(
  url: string | null | undefined,
  fallback = "/account"
): string {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  const trimmed = url.trim();

  // Must start with exactly one '/' and not '//' or '/\'
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return fallback;
  }

  // Reject URLs containing protocol schemes like http:, https:, javascript:, data:
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  // Reject if it contains backslashes which browsers might normalize to forward slashes
  if (trimmed.includes("\\")) {
    return fallback;
  }

  // Prevent redirect loops back to auth entrypoints
  const pathWithoutQuery = trimmed.split("?")[0].toLowerCase();
  const forbiddenLoopPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/unauthorized",
  ];

  if (forbiddenLoopPaths.includes(pathWithoutQuery)) {
    return fallback;
  }

  return trimmed;
}

/**
 * Returns default home landing route based on verified server role.
 */
export function getHomeForRole(role: UserRole | string | null | undefined): string {
  switch (role) {
    case "owner":
    case "admin":
      return "/admin";
    case "technician":
      return "/tech";
    case "customer":
      return "/account";
    default:
      return "/account";
  }
}

/**
 * Validates password strength according to security standards:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 digit
 */
export interface PasswordValidationResult {
  valid: boolean;
  score: number; // 0 to 4
  feedback: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const feedback: string[] = [];
  let score = 0;

  if (!password || password.length < 8) {
    feedback.push("Must be at least 8 characters long");
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("Must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push("Must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    feedback.push("Must contain at least one number");
  } else {
    score += 1;
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score = Math.min(score + 1, 4);
  }

  return {
    valid: feedback.length === 0,
    score,
    feedback,
  };
}
