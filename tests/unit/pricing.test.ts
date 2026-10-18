import { describe, it, expect } from "vitest";
import { computeBookingEstimate, computeInvoiceTotals } from "@/lib/domain/pricing";
import { businessConfig } from "@config/business.config";
import { getContrastRatio } from "@config/business.schema";

describe("Pricing & Deposit Engine (BUILD_PLAN Section 14)", () => {
  it("computes AC Repair $99 flat -> $19.80 deposit and $79.20 remaining", () => {
    const res = computeBookingEstimate({
      pricingType: "flat",
      priceCents: 9900,
      durationMinutes: 90,
      depositPct: 20,
    });

    expect(res.baseCents).toBe(9900);
    expect(res.estimateCents).toBe(9900);
    expect(res.depositCents).toBe(1980); // $19.80
    expect(res.remainingEstimateCents).toBe(7920); // $79.20
  });

  it("computes hourly service estimate using minimum billable time ($125/hr, 60 min min)", () => {
    const res = computeBookingEstimate({
      pricingType: "hourly",
      priceCents: 12500,
      durationMinutes: 45,
      minBillableMinutes: 60,
      depositPct: 20,
    });

    expect(res.baseCents).toBe(12500);
    expect(res.estimateCents).toBe(12500);
    expect(res.depositCents).toBe(2500); // $25.00
    expect(res.remainingEstimateCents).toBe(10000); // $100.00
  });

  it("enforces Stripe $0.50 (50 cents) minimum deposit rule", () => {
    const res = computeBookingEstimate({
      pricingType: "flat",
      priceCents: 100, // $1.00
      durationMinutes: 30,
      depositPct: 20, // 20 cents < 50 cents
    });

    expect(res.depositCents).toBe(50);
    expect(res.remainingEstimateCents).toBe(50);
  });

  it("supports deposit_pct_override and zip surcharge", () => {
    const res = computeBookingEstimate({
      pricingType: "flat",
      priceCents: 14900,
      durationMinutes: 60,
      surchargeCents: 1500,
      depositPct: 20,
      depositPctOverride: 25,
    });

    expect(res.estimateCents).toBe(16400);
    expect(res.depositPctUsed).toBe(25);
    expect(res.depositCents).toBe(4100);
    expect(res.remainingEstimateCents).toBe(12300);
  });

  it("matches the worked invoice example from BUILD_PLAN Section 14 ($99 flat + $120 parts @ 7% + 20% tip - $19.80 deposit = $251.40)", () => {
    const invoice = computeInvoiceTotals({
      pricingType: "flat",
      servicePriceCents: 9900,
      parts: [
        {
          description: "Dual run capacitor",
          quantity: 1,
          unitPriceCents: 12000,
          taxable: true,
        },
      ],
      taxRateBps: 700,
      taxAppliesTo: "parts",
      depositPaidCents: 1980,
      tipPct: 20,
    });

    expect(invoice.subtotalCents).toBe(21900);
    expect(invoice.taxCents).toBe(840);
    expect(invoice.totalCents).toBe(22740);
    expect(invoice.tipCents).toBe(4380);
    expect(invoice.amountDueCents).toBe(25140); // $251.40
  });

  it("validates Cool Air HVAC Miami businessConfig and contrast rules", () => {
    expect(businessConfig.businessName).toBe("Cool Air HVAC Miami");
    expect(businessConfig.timezone).toBe("America/New_York");
    expect(businessConfig.zipCodes).toContain("33133");
    expect(businessConfig.zipCodes).toContain("33149");
    expect(businessConfig.zipCodes).not.toContain("90210");
    expect(businessConfig.services).toHaveLength(5);

    // Orange button (#F97316) with navy text (#0F172A) contrast must be >= 4.5:1
    const ratio = getContrastRatio(businessConfig.colors.primary, businessConfig.colors.accent);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
