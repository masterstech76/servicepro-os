import * as React from "react";
import { cn } from "@/lib/utils";

export interface SlotChipProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  lowAvailability?: boolean;
  remaining?: number;
  onClick: () => void;
  testId?: string;
}

export function SlotChip({
  label,
  selected,
  disabled = false,
  lowAvailability = false,
  remaining,
  onClick,
  testId,
}: SlotChipProps) {
  const lowText =
    remaining === 1 ? "Only 1 left" : lowAvailability ? "Only 2 left" : null;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={disabled}
        data-testid={testId}
        aria-pressed={selected}
        onClick={onClick}
        className={cn(
          "w-full h-12 rounded-full px-3 text-sm font-bold tabular-nums transition-all duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 focus-visible:outline-offset-2 min-h-[48px]",
          selected
            ? "border-2 border-orange-500 bg-orange-500 text-navy-900 shadow-md"
            : "border border-slate-200 bg-white text-navy-900 hover:border-orange-500/60 hover:bg-orange-50/40 shadow-sm",
          disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        {label}
      </button>
      {lowText && (
        <span className="mt-1 text-xs font-semibold text-danger leading-4">
          {lowText}
        </span>
      )}
    </div>
  );
}
