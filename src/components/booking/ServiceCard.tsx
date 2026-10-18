import * as React from "react";
import { Snowflake, Wrench, Zap, Sparkles } from "lucide-react";
import type { ServiceDTO } from "@/lib/api/types";
import { formatMoneyCents } from "@/lib/domain/format";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  service: ServiceDTO;
  selected: boolean;
  onSelect: (service: ServiceDTO) => void;
}

function getCategoryIcon(category: string) {
  const lower = category.toLowerCase();
  if (lower.includes("cool") || lower.includes("hvac")) return Snowflake;
  if (lower.includes("control") || lower.includes("elec")) return Zap;
  if (lower.includes("air") || lower.includes("clean")) return Sparkles;
  return Wrench;
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  const Icon = getCategoryIcon(service.category);
  const priceDisplay =
    service.pricing === "hourly"
      ? `${formatMoneyCents(service.priceCents, { omitZeroCents: true })}/hr`
      : formatMoneyCents(service.priceCents, { omitZeroCents: true });

  const durationDisplay =
    service.pricing === "hourly"
      ? `~${service.durationMinutes} min · ${Math.round((service.minBillableMinutes ?? 60) / 60)} hr minimum`
      : `~${service.durationMinutes} min`;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      data-testid={`service-card-${service.id}`}
      onClick={() => onSelect(service)}
      className={cn(
        "w-full text-left rounded-card border p-4 transition-all duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 focus-visible:outline-offset-2 min-h-[72px]",
        selected
          ? "border-2 border-orange-500 bg-orange-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-input",
              selected ? "bg-orange-500 text-navy-900" : "bg-slate-100 text-navy-900"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-lg font-semibold leading-6 text-navy-900">
              {service.name}
            </div>
            <div className="text-sm text-navy-700 mt-0.5">{durationDisplay}</div>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-lg font-bold tabular-nums text-navy-900">
            {priceDisplay}
          </span>
        </div>
      </div>
    </button>
  );
}
