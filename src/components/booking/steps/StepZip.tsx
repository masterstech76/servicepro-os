import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface StepZipProps {
  zip: string;
  zipChecked: boolean;
  zipServed: boolean;
  zipCity: string;
  zipState: string;
  checkingZip: boolean;
  zipError: string | null;
  onChangeZip: (val: string) => void;
}

export function StepZip({
  zip,
  zipChecked,
  zipServed,
  zipCity,
  zipState,
  checkingZip,
  zipError,
  onChangeZip,
}: StepZipProps) {
  return (
    <section aria-labelledby="step-2-heading" className="space-y-5">
      <div>
        <h1
          id="step-2-heading"
          className="font-heading text-[26px] sm:text-[30px] leading-tight font-extrabold text-navy-900"
        >
          Where is the job?
        </h1>
        <p className="text-sm text-navy-700 mt-1">
          Enter your 5-digit ZIP code to check technician coverage in your area.
        </p>
      </div>

      <div>
        <Label htmlFor="zip-input">ZIP code</Label>
        <Input
          id="zip-input"
          data-testid="zip-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          placeholder="33133"
          value={zip}
          onChange={(e) => onChangeZip(e.target.value)}
          aria-invalid={!!zipError}
          aria-describedby="zip-feedback"
          className="h-14 text-lg font-bold tracking-wider"
        />
      </div>

      <div id="zip-feedback" aria-live="polite" className="min-h-[28px]">
        {checkingZip && (
          <p className="text-sm text-navy-700">Checking coverage…</p>
        )}

        {!checkingZip && zipChecked && zipServed && (
          <div
            data-testid="zip-served-msg"
            className="flex items-center gap-2.5 rounded-2xl border border-green-600/30 bg-green-50 px-4 py-3 text-sm font-semibold text-green-900"
          >
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" aria-hidden="true" />
            <span>
              Great — we serve {zipCity}, {zipState}
            </span>
          </div>
        )}

        {!checkingZip && zipError && (
          <div
            role="alert"
            data-testid="zip-error-msg"
            className="flex flex-col gap-2 rounded-2xl border border-danger/30 bg-red-50 px-4 py-3.5 text-sm text-navy-900"
          >
            <div className="flex items-center gap-2 font-semibold text-danger">
              <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{zipError}</span>
            </div>
            <p className="text-xs text-navy-700">
              Need help nearby? Call us at{" "}
              <a
                href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}
                className="font-semibold underline text-orange-700"
              >
                {businessConfig.phone}
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
