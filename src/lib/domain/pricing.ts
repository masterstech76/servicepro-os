/**
 * Pure pricing & deposit calculation engine (BUILD_PLAN Section 14)
 * All money values are integer cents (USD).
 */

export interface EstimateInput {
  pricingType: "flat" | "hourly";
  priceCents: number;
  durationMinutes: number;
  minBillableMinutes?: number;
  surchargeCents?: number;
  depositPct: number;
  depositPctOverride?: number | null;
}

export interface EstimateResult {
  baseCents: number;
  surchargeCents: number;
  estimateCents: number;
  depositPctUsed: number;
  depositCents: number;
  remainingEstimateCents: number;
}

/**
 * Round half up for positive integer math: Math.floor(x + 0.5)
 */
export function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5);
}

/**
 * Computes booking estimate and deposit in integer cents per BUILD_PLAN Section 14:
 * - Flat: base = price_cents
 * - Hourly: base = round(price_cents * max(min_billable_minutes, duration_minutes) / 60)
 * - estimate = base + surcharge_cents(zip)
 * - deposit = ceil(estimate * depositPct / 100), using deposit_pct_override when set
 * - if deposit < 50 (Stripe minimum) -> deposit = min(50, estimate)
 */
export function computeBookingEstimate(input: EstimateInput): EstimateResult {
  const surchargeCents = input.surchargeCents ?? 0;
  let baseCents: number;

  if (input.pricingType === "flat") {
    baseCents = input.priceCents;
  } else {
    const minBillable = input.minBillableMinutes ?? 60;
    const effectiveMinutes = Math.max(minBillable, input.durationMinutes);
    baseCents = roundHalfUp((input.priceCents * effectiveMinutes) / 60);
  }

  const estimateCents = baseCents + surchargeCents;
  const depositPctUsed = input.depositPctOverride ?? input.depositPct;

  let depositCents = Math.ceil((estimateCents * depositPctUsed) / 100);
  if (depositCents < 50 && estimateCents > 0) {
    depositCents = Math.min(50, estimateCents);
  }
  if (estimateCents === 0) {
    depositCents = 0;
  }

  const remainingEstimateCents = Math.max(0, estimateCents - depositCents);

  return {
    baseCents,
    surchargeCents,
    estimateCents,
    depositPctUsed,
    depositCents,
    remainingEstimateCents,
  };
}

export interface InvoicePartInput {
  description: string;
  quantity: number;
  unitPriceCents: number;
  taxable: boolean;
}

export interface InvoiceFeeInput {
  description: string;
  amountCents: number;
  taxable?: boolean;
}

export interface InvoiceComputationInput {
  pricingType: "flat" | "hourly";
  servicePriceCents: number;
  minBillableMinutes?: number;
  billableMinutes?: number;
  startedAt?: Date;
  completedAt?: Date;
  parts?: InvoicePartInput[];
  fees?: InvoiceFeeInput[];
  discountCents?: number;
  taxRateBps: number;
  taxAppliesTo: "parts" | "parts_and_labor";
  depositPaidCents: number;
  otherSucceededPaymentsCents?: number;
  tipPct?: number;
  customTipCents?: number;
}

export interface InvoiceComputationResult {
  laborCents: number;
  partsCents: number;
  feesCents: number;
  discountCents: number;
  subtotalCents: number;
  taxableBaseCents: number;
  taxCents: number;
  totalCents: number;
  tipCents: number;
  depositPaidCents: number;
  amountDueCents: number;
  billableMinutesUsed?: number;
}

/**
 * Full invoice calculation (BUILD_PLAN Section 14)
 */
export function computeInvoiceTotals(input: InvoiceComputationInput): InvoiceComputationResult {
  let laborCents = 0;
  let billableMinutesUsed: number | undefined;

  if (input.pricingType === "flat") {
    laborCents = input.servicePriceCents;
  } else {
    const minBillable = input.minBillableMinutes ?? 60;
    if (typeof input.billableMinutes === "number") {
      billableMinutesUsed = Math.max(minBillable, input.billableMinutes);
    } else if (input.startedAt && input.completedAt) {
      const elapsedMinutes = (input.completedAt.getTime() - input.startedAt.getTime()) / 60000;
      const rounded15 = Math.ceil(Math.max(1, elapsedMinutes) / 15) * 15;
      billableMinutesUsed = Math.max(minBillable, rounded15);
    } else {
      billableMinutesUsed = minBillable;
    }
    laborCents = roundHalfUp((input.servicePriceCents * billableMinutesUsed) / 60);
  }

  const parts = input.parts ?? [];
  let partsCents = 0;
  let taxablePartsCents = 0;

  for (const part of parts) {
    const lineAmount = roundHalfUp(part.quantity * part.unitPriceCents);
    partsCents += lineAmount;
    if (part.taxable) {
      taxablePartsCents += lineAmount;
    }
  }

  const fees = input.fees ?? [];
  let feesCents = 0;
  let taxableFeesCents = 0;
  for (const fee of fees) {
    feesCents += fee.amountCents;
    if (fee.taxable) {
      taxableFeesCents += fee.amountCents;
    }
  }

  const discountCents = Math.max(0, input.discountCents ?? 0);
  const subtotalCents = Math.max(0, laborCents + partsCents + feesCents - discountCents);

  const taxableBaseCents =
    taxablePartsCents +
    (input.taxAppliesTo === "parts_and_labor" ? laborCents : 0) +
    taxableFeesCents;

  const taxCents = roundHalfUp((taxableBaseCents * input.taxRateBps) / 10000);
  const totalCents = subtotalCents + taxCents;

  let tipCents = 0;
  if (typeof input.customTipCents === "number") {
    tipCents = Math.max(0, input.customTipCents);
  } else if (typeof input.tipPct === "number" && input.tipPct > 0) {
    tipCents = roundHalfUp((subtotalCents * input.tipPct) / 100);
  }

  const otherPayments = input.otherSucceededPaymentsCents ?? 0;
  const amountDueCents = totalCents + tipCents - input.depositPaidCents - otherPayments;

  return {
    laborCents,
    partsCents,
    feesCents,
    discountCents,
    subtotalCents,
    taxableBaseCents,
    taxCents,
    totalCents,
    tipCents,
    depositPaidCents: input.depositPaidCents,
    amountDueCents,
    billableMinutesUsed,
  };
}
