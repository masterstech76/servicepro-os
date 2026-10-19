import * as React from "react";
import type { AddressSuggestionDTO } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface StepDetailsProps {
  addressLine1: string;
  addressLine2: string;
  zip: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fieldErrors: Record<string, string>;
  suggestions: AddressSuggestionDTO[];
  showSuggestions: boolean;
  onAddressChange: (val: string) => void;
  onSelectSuggestion: (s: AddressSuggestionDTO) => void;
  onFieldChange: (field: "addressLine2" | "customerName" | "customerPhone" | "customerEmail", val: string) => void;
  setShowSuggestions: (show: boolean) => void;
}

export function StepDetails({
  addressLine1,
  addressLine2,
  zip,
  customerName,
  customerPhone,
  customerEmail,
  fieldErrors,
  suggestions,
  showSuggestions,
  onAddressChange,
  onSelectSuggestion,
  onFieldChange,
  setShowSuggestions,
}: StepDetailsProps) {
  return (
    <section aria-labelledby="step-5-heading" className="space-y-4">
      <h1
        id="step-5-heading"
        className="font-heading text-[26px] sm:text-[30px] leading-tight font-extrabold text-navy-900"
      >
        Service address & contact
      </h1>

      <div className="relative">
        <Label htmlFor="address-line1">Service street address</Label>
        <Input
          id="address-line1"
          data-testid="address-line1"
          placeholder="123 Brickell Ave"
          value={addressLine1}
          onChange={(e) => onAddressChange(e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
          aria-invalid={!!fieldErrors.addressLine1}
          aria-describedby={fieldErrors.addressLine1 ? "err-address" : undefined}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul
            role="listbox"
            aria-label="Address suggestions"
            className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg divide-y divide-slate-100"
          >
            {suggestions.map((s, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onMouseDown={() => onSelectSuggestion(s)}
                  className="w-full px-3.5 py-2.5 text-left text-sm text-navy-900 hover:bg-orange-50"
                >
                  {s.placeName}
                </button>
              </li>
            ))}
          </ul>
        )}
        {fieldErrors.addressLine1 && (
          <p id="err-address" role="alert" className="mt-1 text-xs font-medium text-danger">
            {fieldErrors.addressLine1}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="address-line2">Apt / Suite (optional)</Label>
          <Input
            id="address-line2"
            placeholder="Unit 4B"
            value={addressLine2}
            onChange={(e) => onFieldChange("addressLine2", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="address-zip">ZIP code</Label>
          <Input id="address-zip" value={zip} disabled readOnly />
        </div>
      </div>

      <div>
        <Label htmlFor="customer-name">Full name</Label>
        <Input
          id="customer-name"
          data-testid="customer-name"
          placeholder="Maria Rivera"
          value={customerName}
          onChange={(e) => onFieldChange("customerName", e.target.value)}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "err-name" : undefined}
        />
        {fieldErrors.name && (
          <p id="err-name" role="alert" className="mt-1 text-xs font-medium text-danger">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="customer-phone">Mobile phone (for ETA texts)</Label>
        <Input
          id="customer-phone"
          data-testid="customer-phone"
          type="tel"
          placeholder="(305) 555-0142"
          value={customerPhone}
          onChange={(e) => onFieldChange("customerPhone", e.target.value)}
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
        />
        {fieldErrors.phone && (
          <p id="err-phone" role="alert" className="mt-1 text-xs font-medium text-danger">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="customer-email">Email address</Label>
        <Input
          id="customer-email"
          data-testid="customer-email"
          type="email"
          placeholder="maria@example.com"
          value={customerEmail}
          onChange={(e) => onFieldChange("customerEmail", e.target.value)}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "err-email" : undefined}
        />
        {fieldErrors.email && (
          <p id="err-email" role="alert" className="mt-1 text-xs font-medium text-danger">
            {fieldErrors.email}
          </p>
        )}
      </div>
    </section>
  );
}
