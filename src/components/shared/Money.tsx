import * as React from "react";
import { formatMoneyCents } from "@/lib/domain/format";
import { cn } from "@/lib/utils";

export { formatMoneyCents as formatMoney };

export interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  cents: number;
  emphasis?: boolean;
  omitZeroCents?: boolean;
}

export function Money({
  cents,
  emphasis = false,
  omitZeroCents = false,
  className,
  ...props
}: MoneyProps) {
  return (
    <span
      className={cn(
        "tabular-nums",
        emphasis && "font-bold text-navy-900",
        className
      )}
      {...props}
    >
      {formatMoneyCents(cents, { omitZeroCents })}
    </span>
  );
}
