import * as React from "react";
import { Clock, CreditCard, Info } from "lucide-react";
import { businessConfig } from "@config/business.config";
import type { ServiceDTO } from "@/lib/api/types";
import { Money } from "@/components/shared/Money";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBusinessDate, formatBusinessTime } from "@/lib/domain/format";

export interface StepPaymentProps {
  remainingSeconds: number | null;
  selectedService: ServiceDTO | null;
  selectedSlotStart: string | null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zip: string;
  estimate: {
    estimateCents: number;
    depositCents: number;
    remainingEstimateCents: number;
    depositPctUsed: number;
  };
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  paymentError: string | null;
  onChangeCardNumber: (val: string) => void;
  onChangeCardExpiry: (val: string) => void;
  onChangeCardCvc: (val: string) => void;
}

function formatCountdown(seconds: number | null): string {
  if (seconds === null) return "10:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function StepPayment({
  remainingSeconds,
  selectedService,
  selectedSlotStart,
  addressLine1,
  addressLine2,
  city,
  zip,
  estimate,
  cardNumber,
  cardExpiry,
  cardCvc,
  paymentError,
  onChangeCardNumber,
  onChangeCardExpiry,
  onChangeCardCvc,
}: StepPaymentProps) {
  return (
    <section aria-labelledby="step-6-heading" className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1
          id="step-6-heading"
          className="font-heading text-[26px] sm:text-[30px] leading-tight font-extrabold text-navy-900"
        >
          Your booking
        </h1>
        <div
          data-testid="hold-countdown"
          className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-500/40 px-3.5 py-1.5 text-xs font-bold tabular-nums text-navy-900"
        >
          <Clock className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
          <span>Hold expires in {formatCountdown(remainingSeconds)}</span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 shadow-sm space-y-3">
        <div>
          <div className="text-base font-bold text-navy-900">
            {selectedService?.name} ·{" "}
            {selectedSlotStart && formatBusinessDate(selectedSlotStart)},{" "}
            {selectedSlotStart && formatBusinessTime(selectedSlotStart)}
          </div>
          <div className="text-sm text-navy-700 mt-0.5">
            {addressLine1}
            {addressLine2 ? `, ${addressLine2}` : ""}, {city} {zip}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3 space-y-1.5 text-sm">
          <div className="flex items-center justify-between text-navy-700">
            <span>Service estimate</span>
            <Money cents={estimate.estimateCents} data-testid="checkout-estimate" />
          </div>
          <div className="flex items-center justify-between font-bold text-base text-navy-900">
            <span>Deposit due now ({estimate.depositPctUsed}%)</span>
            <Money
              cents={estimate.depositCents}
              emphasis
              data-testid="checkout-deposit"
            />
          </div>
          <div className="flex items-center justify-between text-navy-700">
            <span>Remaining after the job</span>
            <Money
              cents={estimate.remainingEstimateCents}
              data-testid="checkout-remaining"
            />
          </div>
          <p className="text-xs text-navy-700">+ parts/tax if any</p>
        </div>
      </div>

      {/* Payment Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-orange-700" aria-hidden="true" />
            <span>Card payment</span>
          </span>
          <span className="text-xs font-semibold text-navy-700">
            Secured by Stripe
          </span>
        </div>

        <div>
          <Label htmlFor="mock-card-number">Card number</Label>
          <Input
            id="mock-card-number"
            data-testid="mock-card-number"
            value={cardNumber}
            onChange={(e) => onChangeCardNumber(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="mock-card-expiry">Expiration</Label>
            <Input
              id="mock-card-expiry"
              value={cardExpiry}
              onChange={(e) => onChangeCardExpiry(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="mock-card-cvc">CVC</Label>
            <Input
              id="mock-card-cvc"
              value={cardCvc}
              onChange={(e) => onChangeCardCvc(e.target.value)}
            />
          </div>
        </div>

        {paymentError && (
          <p role="alert" className="text-xs font-semibold text-danger">
            {paymentError}
          </p>
        )}
      </div>

      {/* Tip Info Banner */}
      <div className="flex items-start gap-2 rounded-xl bg-slate-100 p-3.5 text-xs text-navy-700">
        <Info className="h-4 w-4 text-navy-900 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          You can add a tip ({businessConfig.booking.tipPresets.join("/")}%) after the job is done.
        </span>
      </div>

      {/* SMS Consent Notice */}
      <p className="text-xs text-navy-700 leading-relaxed">
        By booking you agree to receive booking and service texts from{" "}
        {businessConfig.businessName}. Msg &amp; data rates may apply. Reply STOP to opt out.
      </p>
    </section>
  );
}
