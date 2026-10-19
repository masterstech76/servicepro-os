import * as React from "react";
import Image from "next/image";
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
        "w-full text-left rounded-2xl border p-4 sm:p-5 transition-all duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 focus-visible:outline-offset-2 min-h-[84px]",
        selected
          ? "border-2 border-orange-500 bg-orange-50/90 shadow-lg"
          : "border-slate-200/80 bg-white hover:border-orange-500/60 hover:shadow-md shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3.5">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-navy-900 shadow-sm">
            <Image
              src={`/images/${service.id}.jpg`}
              alt={service.name}
              fill
              sizes="64px"
              className="object-cover"
            />
            <div
              className={cn(
                "absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-md shadow transition-colors",
                selected ? "bg-orange-500 text-navy-900" : "bg-navy-900/90 text-orange-500"
              )}
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-lg font-bold leading-6 text-navy-900">
              {service.name}
            </div>
            <div className="text-xs font-semibold text-navy-700 mt-0.5">
              {durationDisplay}
            </div>
            <p className="text-sm text-navy-700 mt-1.5 line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-base font-extrabold tabular-nums",
              selected
                ? "bg-orange-500 text-navy-900"
                : "bg-slate-100 text-navy-900"
            )}
          >
            {priceDisplay}
          </span>
        </div>
      </div>
    </button>
  );
}
