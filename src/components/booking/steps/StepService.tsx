import * as React from "react";
import type { ServiceDTO } from "@/lib/api/types";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";

export interface StepServiceProps {
  services: ServiceDTO[];
  loadingServices: boolean;
  selectedService: ServiceDTO | null;
  onSelectService: (service: ServiceDTO) => void;
}

export function StepService({
  services,
  loadingServices,
  selectedService,
  onSelectService,
}: StepServiceProps) {
  return (
    <section aria-labelledby="step-1-heading" className="space-y-5">
      <div>
        <h1
          id="step-1-heading"
          className="font-heading text-[26px] sm:text-[30px] leading-tight font-extrabold text-navy-900"
        >
          What do you need help with?
        </h1>
        <p className="text-sm text-navy-700 mt-1">
          Choose a service below. Upfront pricing with no hidden dispatch fees.
        </p>
      </div>

      {loadingServices ? (
        <div className="space-y-3" role="status" aria-label="Loading services">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : (
        <div role="radiogroup" aria-labelledby="step-1-heading" className="space-y-3.5">
          {services.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              selected={selectedService?.id === svc.id}
              onSelect={onSelectService}
            />
          ))}
        </div>
      )}
    </section>
  );
}
