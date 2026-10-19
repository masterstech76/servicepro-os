import * as React from "react";
import { ChevronRight } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import type { AvailableSlotDTO } from "@/lib/api/types";
import { formatBusinessTime } from "@/lib/domain/format";
import { SlotChip } from "@/components/booking/SlotChip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface StepSlotProps {
  scrollerDays: Array<{ dateStr: string; label: string; shortLabel: string }>;
  selectedDay: string;
  loadingSlots: boolean;
  daySlots: AvailableSlotDTO[];
  morningSlots: AvailableSlotDTO[];
  afternoonSlots: AvailableSlotDTO[];
  nextAvailableDay: { dateStr: string; label: string } | null | undefined;
  selectedSlotStart: string | null;
  onSelectDay: (dayStr: string) => void;
  onSelectSlot: (slotStart: string) => void;
}

export function StepSlot({
  scrollerDays,
  selectedDay,
  loadingSlots,
  daySlots,
  morningSlots,
  afternoonSlots,
  nextAvailableDay,
  selectedSlotStart,
  onSelectDay,
  onSelectSlot,
}: StepSlotProps) {
  return (
    <section aria-labelledby="step-4-heading" className="space-y-5">
      <div>
        <h1
          id="step-4-heading"
          className="font-heading text-[26px] sm:text-[30px] leading-tight font-extrabold text-navy-900"
        >
          Pick a time
        </h1>
        <p className="text-sm text-navy-700 mt-1">
          Select a day and arrival window below.
        </p>
      </div>

      {/* Horizontal 7-day scroller */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
        role="group"
        aria-label="Available days"
      >
        {scrollerDays.map((day, idx) => {
          const isSelected = selectedDay === day.dateStr;
          return (
            <button
              key={day.dateStr}
              type="button"
              data-testid={`day-tab-${idx}`}
              aria-pressed={isSelected}
              onClick={() => onSelectDay(day.dateStr)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition-all min-h-[44px]",
                isSelected
                  ? "border-2 border-orange-500 bg-orange-500 text-navy-900 shadow-md"
                  : "border-slate-200 bg-white text-navy-900 hover:bg-slate-50"
              )}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      {loadingSlots ? (
        <div className="space-y-3" role="status" aria-label="Loading time slots">
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      ) : daySlots.length === 0 ? (
        <div
          data-testid="fully-booked-state"
          className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center space-y-2"
        >
          <p className="text-sm font-semibold text-navy-900">
            Fully booked on this day.
          </p>
          {nextAvailableDay && (
            <button
              type="button"
              data-testid="next-available-day-link"
              onClick={() => onSelectDay(nextAvailableDay.dateStr)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 underline hover:text-navy-900 min-h-[44px] px-2"
            >
              <span>Fully booked — try {nextAvailableDay.label}</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {morningSlots.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-navy-900 mb-2.5">
                Morning
              </h2>
              <div className="grid grid-cols-3 gap-2.5">
                {morningSlots.map((slot) => {
                  const label = formatBusinessTime(slot.start);
                  const hr = formatInTimeZone(
                    new Date(slot.start),
                    businessConfig.timezone,
                    "HH"
                  );
                  return (
                    <SlotChip
                      key={slot.start}
                      testId={`slot-chip-${hr}`}
                      label={label}
                      selected={selectedSlotStart === slot.start}
                      lowAvailability={slot.lowAvailability}
                      remaining={slot.remaining}
                      onClick={() => onSelectSlot(slot.start)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {afternoonSlots.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-navy-900 mb-2.5">
                Afternoon
              </h2>
              <div className="grid grid-cols-3 gap-2.5">
                {afternoonSlots.map((slot) => {
                  const label = formatBusinessTime(slot.start);
                  const hr = formatInTimeZone(
                    new Date(slot.start),
                    businessConfig.timezone,
                    "HH"
                  );
                  return (
                    <SlotChip
                      key={slot.start}
                      testId={`slot-chip-${hr}`}
                      label={label}
                      selected={selectedSlotStart === slot.start}
                      lowAvailability={slot.lowAvailability}
                      remaining={slot.remaining}
                      onClick={() => onSelectSlot(slot.start)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-xs text-navy-700 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            Arrival window starts at the time shown; we&apos;ll text you when the tech is on the way.
          </p>
        </div>
      )}
    </section>
  );
}
