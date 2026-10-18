import { roundHalfUp } from "./pricing";

export interface TipOption {
  pct: number;
  amountCents: number;
}

/**
 * Computes preset tip options as percentages of pre-tax subtotal (BUILD_PLAN Section 14)
 */
export function computeTipPresets(
  subtotalCents: number,
  presets: [number, number, number] = [15, 20, 25]
): TipOption[] {
  const cleanSubtotal = Math.max(0, subtotalCents);
  return presets.map((pct) => ({
    pct,
    amountCents: roundHalfUp((cleanSubtotal * pct) / 100),
  }));
}

export function computeTipFromPercent(subtotalCents: number, pct: number): number {
  if (pct <= 0 || subtotalCents <= 0) return 0;
  return roundHalfUp((subtotalCents * pct) / 100);
}
