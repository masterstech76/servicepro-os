import type { JobStatus } from "@/lib/supabase/types";

export type ActorRole = "owner" | "technician" | "system";

export interface TransitionRule {
  from: JobStatus;
  to: JobStatus;
  allowedActors: ActorRole[];
  requiresReason?: boolean;
}

/**
 * Job state machine transitions (BUILD_PLAN Section 12):
 * unassigned -> assigned (owner)
 * assigned -> unassigned (owner)
 * assigned -> assigned (owner reassign)
 * assigned -> on_the_way (tech own job or owner)
 * on_the_way -> in_progress (tech or owner)
 * in_progress -> completed (tech or owner)
 * unassigned | assigned | on_the_way | in_progress -> cancelled (owner, reason required)
 * completed, cancelled -> terminal
 */
const LEGAL_TRANSITIONS: TransitionRule[] = [
  { from: "unassigned", to: "assigned", allowedActors: ["owner", "system"] },
  { from: "assigned", to: "unassigned", allowedActors: ["owner"] },
  { from: "assigned", to: "assigned", allowedActors: ["owner", "system"] },
  { from: "assigned", to: "on_the_way", allowedActors: ["technician", "owner"] },
  { from: "on_the_way", to: "in_progress", allowedActors: ["technician", "owner"] },
  { from: "in_progress", to: "completed", allowedActors: ["technician", "owner"] },
  {
    from: "unassigned",
    to: "cancelled",
    allowedActors: ["owner"],
    requiresReason: true,
  },
  {
    from: "assigned",
    to: "cancelled",
    allowedActors: ["owner"],
    requiresReason: true,
  },
  {
    from: "on_the_way",
    to: "cancelled",
    allowedActors: ["owner"],
    requiresReason: true,
  },
  {
    from: "in_progress",
    to: "cancelled",
    allowedActors: ["owner"],
    requiresReason: true,
  },
];

export interface TransitionValidationInput {
  from: JobStatus;
  to: JobStatus;
  actor: ActorRole;
  reason?: string;
  beforePhotosCount?: number;
  afterPhotosCount?: number;
  requireBeforePhoto?: boolean;
  requireAfterPhoto?: boolean;
}

export interface TransitionValidationResult {
  valid: boolean;
  code?:
    | "INVALID_TRANSITION"
    | "FORBIDDEN_ACTOR"
    | "CANCEL_REASON_REQUIRED"
    | "BEFORE_PHOTO_REQUIRED"
    | "AFTER_PHOTO_REQUIRED";
  message?: string;
}

export function validateJobTransition(
  input: TransitionValidationInput
): TransitionValidationResult {
  const rule = LEGAL_TRANSITIONS.find(
    (r) => r.from === input.from && r.to === input.to
  );

  if (!rule) {
    return {
      valid: false,
      code: "INVALID_TRANSITION",
      message: `Cannot move a job directly from ${formatStatusLabel(input.from)} to ${formatStatusLabel(input.to)}.`,
    };
  }

  if (!rule.allowedActors.includes(input.actor)) {
    return {
      valid: false,
      code: "FORBIDDEN_ACTOR",
      message: `Only ${rule.allowedActors.join(" or ")} can change status from ${formatStatusLabel(input.from)} to ${formatStatusLabel(input.to)}.`,
    };
  }

  if (rule.requiresReason && (!input.reason || input.reason.trim().length === 0)) {
    return {
      valid: false,
      code: "CANCEL_REASON_REQUIRED",
      message: "A cancellation reason is required.",
    };
  }

  if (input.to === "completed") {
    if (input.requireBeforePhoto && (input.beforePhotosCount ?? 0) < 1) {
      return {
        valid: false,
        code: "BEFORE_PHOTO_REQUIRED",
        message: "Add at least 1 before photo to complete this job.",
      };
    }
    if (input.requireAfterPhoto && (input.afterPhotosCount ?? 0) < 1) {
      return {
        valid: false,
        code: "AFTER_PHOTO_REQUIRED",
        message: "Add at least 1 after photo to complete this job.",
      };
    }
  }

  return { valid: true };
}

export function formatStatusLabel(status: JobStatus): string {
  switch (status) {
    case "unassigned":
      return "Unassigned";
    case "assigned":
      return "Assigned";
    case "on_the_way":
      return "On The Way";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
  }
}

/**
 * Cancellation refund policy (Decision D12):
 * Full deposit refund if cancelled >= cancellationWindowHours (default 24) before scheduled_start,
 * otherwise deposit is retained unless owner overrides (`refundDeposit === "yes"`).
 */
export function shouldRefundDepositOnCancel(input: {
  scheduledStart: Date | string;
  cancelledAt?: Date | string;
  cancellationWindowHours: number;
  refundDeposit: "auto" | "yes" | "no";
}): boolean {
  if (input.refundDeposit === "yes") return true;
  if (input.refundDeposit === "no") return false;

  const startMs = new Date(input.scheduledStart).getTime();
  const nowMs = input.cancelledAt
    ? new Date(input.cancelledAt).getTime()
    : Date.now();
  const hoursBeforeStart = (startMs - nowMs) / (1000 * 60 * 60);
  return hoursBeforeStart >= input.cancellationWindowHours;
}
