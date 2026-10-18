"use client";

import * as React from "react";
import { formatMoneyCents } from "@/lib/domain/format";
import { roundHalfUp } from "@/lib/domain/pricing";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TipSelectorProps {
  subtotalCents: number;
  presets?: [number, number, number];
  selectedTipCents?: number;
  tipCents?: number;
  onChange: (tipCents: number) => void;
}

export function TipSelector({
  subtotalCents,
  presets = [15, 20, 25],
  selectedTipCents,
  tipCents,
  onChange,
}: TipSelectorProps) {
  const currentTip = selectedTipCents ?? tipCents ?? 0;
  const [mode, setMode] = React.useState<"preset" | "custom" | "none">("preset");
  const [activePreset, setActivePreset] = React.useState<number>(presets[1]);
  const [customDollars, setCustomDollars] = React.useState<string>("");

  function selectPreset(pct: number) {
    setMode("preset");
    setActivePreset(pct);
    const cents = roundHalfUp((subtotalCents * pct) / 100);
    onChange(cents);
  }

  function selectNone() {
    setMode("none");
    onChange(0);
  }

  function selectCustom() {
    setMode("custom");
    const parsed = Math.round(parseFloat(customDollars || "0") * 100);
    onChange(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
  }

  return (
    <div className="space-y-2">
      <div
        className="grid grid-cols-5 gap-1.5"
        role="radiogroup"
        aria-label="Select a tip"
      >
        {presets.map((pct) => {
          const tipAmount = roundHalfUp((subtotalCents * pct) / 100);
          const isSelected =
            mode === "preset" &&
            activePreset === pct &&
            currentTip === tipAmount;
          return (
            <button
              key={pct}
              type="button"
              role="radio"
              aria-checked={isSelected}
              data-testid={`tip-preset-${pct}`}
              onClick={() => selectPreset(pct)}
              className={cn(
                "flex flex-col items-center justify-center rounded-input border px-2 py-2 text-xs font-semibold min-h-[48px] transition-colors",
                isSelected
                  ? "border-2 border-orange-500 bg-orange-50 text-navy-900"
                  : "border-slate-200 bg-white text-navy-900 hover:bg-slate-50"
              )}
            >
              <span>{pct}%</span>
              <span className="text-[11px] font-normal tabular-nums text-navy-700">
                {formatMoneyCents(tipAmount)}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          role="radio"
          aria-checked={mode === "custom"}
          data-testid="tip-preset-custom"
          onClick={selectCustom}
          className={cn(
            "flex flex-col items-center justify-center rounded-input border px-2 py-2 text-xs font-semibold min-h-[48px] transition-colors",
            mode === "custom"
              ? "border-2 border-orange-500 bg-orange-50 text-navy-900"
              : "border-slate-200 bg-white text-navy-900 hover:bg-slate-50"
          )}
        >
          <span>Custom</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={mode === "none"}
          data-testid="tip-preset-none"
          onClick={selectNone}
          className={cn(
            "flex flex-col items-center justify-center rounded-input border px-2 py-2 text-xs font-semibold min-h-[48px] transition-colors",
            mode === "none"
              ? "border-2 border-orange-500 bg-orange-50 text-navy-900"
              : "border-slate-200 bg-white text-navy-900 hover:bg-slate-50"
          )}
        >
          <span>No tip</span>
        </button>
      </div>

      {mode === "custom" && (
        <div className="pt-1">
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="Enter tip amount ($)"
            value={customDollars}
            onChange={(e) => {
              setCustomDollars(e.target.value);
              const val = Math.round(parseFloat(e.target.value || "0") * 100);
              onChange(Number.isFinite(val) && val >= 0 ? val : 0);
            }}
            aria-label="Custom tip amount in dollars"
          />
        </div>
      )}
    </div>
  );
}
