import { describe, it, expect } from "vitest";
import {
  sanitizeRedirectUrl,
  getHomeForRole,
  validatePasswordStrength,
} from "@/lib/server/redirect-safety";
import type { UserRole } from "@/lib/supabase/types";

describe("Batch 2: Authentication & Gatekeeper Flow", () => {
  describe("Redirect URL Sanitization & Security", () => {
    it("allows valid internal application paths", () => {
      expect(sanitizeRedirectUrl("/book")).toBe("/book");
      expect(sanitizeRedirectUrl("/book?serviceId=ac-repair&step=2")).toBe(
        "/book?serviceId=ac-repair&step=2"
      );
      expect(sanitizeRedirectUrl("/account")).toBe("/account");
      expect(sanitizeRedirectUrl("/tech/jobs/job-1001")).toBe("/tech/jobs/job-1001");
      expect(sanitizeRedirectUrl("/admin/dispatch")).toBe("/admin/dispatch");
    });

    it("rejects dangerous external URLs with protocols", () => {
      expect(sanitizeRedirectUrl("https://evil.com")).toBe("/account");
      expect(sanitizeRedirectUrl("http://attacker.org/steal")).toBe("/account");
      expect(sanitizeRedirectUrl("javascript:alert(1)")).toBe("/account");
      expect(sanitizeRedirectUrl("data:text/html,malicious")).toBe("/account");
    });

    it("rejects protocol-relative URLs (//) and backslash bypass attempts", () => {
      expect(sanitizeRedirectUrl("//evil.com")).toBe("/account");
      expect(sanitizeRedirectUrl("///evil.com")).toBe("/account");
      expect(sanitizeRedirectUrl("/\\evil.com")).toBe("/account");
      expect(sanitizeRedirectUrl("\\evil.com")).toBe("/account");
      expect(sanitizeRedirectUrl("/account\\test")).toBe("/account");
    });

    it("prevents redirect loops back to auth entrypoints", () => {
      expect(sanitizeRedirectUrl("/login")).toBe("/account");
      expect(sanitizeRedirectUrl("/register")).toBe("/account");
      expect(sanitizeRedirectUrl("/forgot-password")).toBe("/account");
      expect(sanitizeRedirectUrl("/reset-password")).toBe("/account");
      expect(sanitizeRedirectUrl("/unauthorized")).toBe("/account");
      expect(sanitizeRedirectUrl("/LOGIN?ref=test")).toBe("/account");
    });

    it("respects custom fallback when provided", () => {
      expect(sanitizeRedirectUrl(null, "/admin")).toBe("/admin");
      expect(sanitizeRedirectUrl("", "/tech")).toBe("/tech");
      expect(sanitizeRedirectUrl("https://bad.com", "/services")).toBe("/services");
    });
  });

  describe("Role-Based Home Destinations", () => {
    it("maps owner and admin to /admin", () => {
      expect(getHomeForRole("owner")).toBe("/admin");
      expect(getHomeForRole("admin")).toBe("/admin");
    });

    it("maps technician to /tech", () => {
      expect(getHomeForRole("technician")).toBe("/tech");
    });

    it("maps customer to /account", () => {
      expect(getHomeForRole("customer")).toBe("/account");
    });

    it("falls back to /account for undefined or unrecognized roles", () => {
      expect(getHomeForRole(undefined)).toBe("/account");
      expect(getHomeForRole(null)).toBe("/account");
      expect(getHomeForRole("guest")).toBe("/account");
    });
  });

  describe("Password Strength Validation", () => {
    it("rejects passwords shorter than 8 characters", () => {
      const res = validatePasswordStrength("Ab1!");
      expect(res.valid).toBe(false);
      expect(res.feedback).toContain("Must be at least 8 characters long");
    });

    it("requires at least one lowercase letter", () => {
      const res = validatePasswordStrength("PASSWORD123!");
      expect(res.valid).toBe(false);
      expect(res.feedback).toContain("Must contain at least one lowercase letter");
    });

    it("requires at least one uppercase letter", () => {
      const res = validatePasswordStrength("password123!");
      expect(res.valid).toBe(false);
      expect(res.feedback).toContain("Must contain at least one uppercase letter");
    });

    it("requires at least one digit", () => {
      const res = validatePasswordStrength("PasswordSecret!");
      expect(res.valid).toBe(false);
      expect(res.feedback).toContain("Must contain at least one number");
    });

    it("accepts robust passwords meeting all criteria", () => {
      const res = validatePasswordStrength("SecurePass2026!");
      expect(res.valid).toBe(true);
      expect(res.feedback).toHaveLength(0);
      expect(res.score).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Access Control & Role Separation", () => {
    const roles: UserRole[] = ["owner", "admin", "technician", "customer"];

    it("ensures all operational roles are typed and recognized", () => {
      expect(roles).toHaveLength(4);
      expect(roles).toContain("customer");
      expect(roles).toContain("technician");
      expect(roles).toContain("owner");
      expect(roles).toContain("admin");
    });
  });
});
