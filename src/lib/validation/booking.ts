import { z } from "zod";
import { normalizeUSPhone } from "@/lib/domain/format";

export const zipSchema = z
  .string()
  .trim()
  .regex(/^\d{5}$/, "Enter a 5-digit US ZIP code.");

export const phoneSchema = z
  .string()
  .trim()
  .refine((val) => normalizeUSPhone(val) !== null, {
    message: "Enter a valid 10-digit US phone number.",
  });

export const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.");

export const step3IssueSchema = z.object({
  issueText: z
    .string()
    .trim()
    .min(5, "Please briefly describe what's going on (at least 5 characters).")
    .max(500, "Description must be 500 characters or fewer."),
});

export const step5DetailsSchema = z.object({
  addressLine1: z.string().trim().min(4, "Enter a street address."),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().min(2, "State is required."),
  zip: zipSchema,
  name: z.string().trim().min(2, "Enter your full name."),
  phone: phoneSchema,
  email: emailSchema,
});

export const holdSlotRequestSchema = z.object({
  serviceId: z.string().min(1),
  zip: zipSchema,
  start: z.string().datetime({ offset: true }).or(z.string().min(10)),
  turnstileToken: z.string().optional(),
});

export const signUploadsRequestSchema = z.object({
  holdId: z.string().min(1),
  files: z
    .array(
      z.object({
        name: z.string().min(1),
        type: z.enum(["image/jpeg", "image/png", "image/webp"]),
        size: z.number().int().positive().max(10 * 1024 * 1024, "Max file size is 10 MB"),
      })
    )
    .min(1)
    .max(5, "Maximum 5 photos allowed"),
});

export const checkoutRequestSchema = z.object({
  holdId: z.string().min(1),
  customer: z.object({
    name: z.string().trim().min(2),
    phone: phoneSchema,
    email: emailSchema,
  }),
  address: z.object({
    line1: z.string().trim().min(4),
    line2: z.string().trim().optional(),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    zip: zipSchema,
  }),
  issue: z.string().trim().max(500),
  photoPaths: z.array(z.string()).max(5).default([]),
  smsConsent: z.boolean().default(true),
});
