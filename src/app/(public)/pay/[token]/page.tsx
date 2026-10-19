"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Printer,
  ShieldCheck,
  Snowflake,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Money, formatMoney } from "@/components/shared/Money";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { TipSelector } from "@/components/tech/TipSelector";
import type { EnrichedJob } from "@/lib/server/operations";

export default function CustomerPayInvoicePage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";

  const [job, setJob] = React.useState<EnrichedJob | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [paying, setPaying] = React.useState(false);
  const [tipCents, setTipCents] = React.useState(0);
  const [lastTxId, setLastTxId] = React.useState<string | null>(null);

  // Payment method selection
  const [payMethod, setPayMethod] = React.useState<"card_on_file" | "new_card" | "check">("card_on_file");
  const [cardName, setCardName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvc, setCardCvc] = React.useState("");
  const [checkRef, setCheckRef] = React.useState("");

  const loadInvoice = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/public/${encodeURIComponent(token)}`);
      if (!res.ok) {
        setJob(null);
        return;
      }
      const data = (await res.json()) as { job: EnrichedJob | null };
      if (data.job) {
        setJob(data.job);
        setTipCents(data.job.invoice?.tipCents ?? 0);
        setCardName(data.job.customer.name);
        if (!data.job.customer.cardLast4) {
          setPayMethod("new_card");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    void loadInvoice();
  }, [loadInvoice]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="mx-auto max-w-lg rounded-card border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-40 w-full animate-pulse rounded bg-slate-100" />
        </div>
      </main>
    );
  }

  if (!job || !job.invoice) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="mx-auto max-w-md rounded-card border border-slate-200 bg-white p-6 text-center shadow-sm space-y-4">
          <h1 className="text-xl font-bold text-navy-900">Invoice Not Found</h1>
          <p className="text-sm text-navy-700">
            This payment link may have expired or does not exist. Please call{" "}
            <PhoneLink phone={businessConfig.phone} /> for assistance.
          </p>
          <Link href="/" className="inline-block text-sm font-semibold text-orange-700 underline">
            Return to {businessConfig.businessName}
          </Link>
        </div>
      </main>
    );
  }

  const inv = job.invoice;
  const isPaid = inv.status === "paid" || inv.amountDueCents === 0;
  const baseDueWithoutTip = Math.max(
    0,
    inv.subtotalCents + inv.taxCents - inv.depositCreditCents - inv.amountPaidCents
  );
  const liveAmountDueCents = isPaid ? 0 : baseDueWithoutTip + tipCents;

  function detectCardBrand(num: string): string {
    const clean = num.replace(/\D/g, "");
    if (/^4/.test(clean)) return "Visa";
    if (/^5[1-5]/.test(clean)) return "Mastercard";
    if (/^3[47]/.test(clean)) return "Amex";
    if (/^6(?:011|5)/.test(clean)) return "Discover";
    return "Card";
  }

  function formatCardInput(val: string) {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    return parts ? parts.join(" ") : raw;
  }

  function formatExpiryInput(val: string) {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length > 2) return `${raw.slice(0, 2)}/${raw.slice(2)}`;
    return raw;
  }

  function fillTestCard(type: "success" | "decline") {
    if (type === "success") {
      setCardNumber("4242 4242 4242 4242");
      setCardExpiry("12/28");
      setCardCvc("123");
      setPayMethod("new_card");
      toast.info("Filled Stripe test card: 4242 (Success)");
    } else {
      setCardNumber("4000 0000 0000 9995");
      setCardExpiry("12/28");
      setCardCvc("999");
      setPayMethod("new_card");
      toast.warning("Filled Stripe test card: 9995 (Simulate Card Error)");
    }
  }

  async function handlePayNow(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    try {
      let methodParam: "card_on_file" | "tap_card" | "check" = "tap_card";
      let cardBrandParam: string | undefined = undefined;
      let cardLast4Param: string | undefined = undefined;

      if (payMethod === "card_on_file") {
        methodParam = "card_on_file";
      } else if (payMethod === "check") {
        methodParam = "check";
      } else {
        methodParam = "tap_card";
        const cleanDigits = cardNumber.replace(/\D/g, "");
        if (cleanDigits.length < 15) {
          toast.error("Please enter a valid 15 or 16-digit card number");
          return;
        }
        cardBrandParam = detectCardBrand(cleanDigits);
        cardLast4Param = cleanDigits.slice(-4);
      }

      const res = await fetch(`/api/invoices/public/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipCents,
          method: methodParam,
          cardBrand: cardBrandParam,
          cardLast4: cardLast4Param,
          cardholderName: cardName,
          checkReference: payMethod === "check" ? checkRef : undefined,
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: { message?: string } };
        toast.error(err.error?.message ?? "Payment could not be processed. Please try again.");
        return;
      }

      const data = (await res.json()) as { job: EnrichedJob; transactionId?: string };
      setJob(data.job);
      if (data.transactionId) {
        setLastTxId(data.transactionId);
      }
      toast.success("Payment complete! Thank you for choosing Cool Air HVAC.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-orange-500 shadow-sm">
              <Snowflake className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-heading text-sm font-bold text-navy-900">
                {businessConfig.businessName}
              </span>
              <span className="block text-xs font-semibold text-navy-700">
                Invoice #{inv.invoiceNumber} · Job #{job.jobNumber}
              </span>
            </div>
          </Link>
          <PhoneLink phone={businessConfig.phone} className="text-xs" />
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-6 space-y-5">
        {isPaid ? (
          <section
            data-testid="invoice-paid-receipt"
            className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xl space-y-4"
          >
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <h1 className="font-heading text-xl font-extrabold text-navy-900">
                Paid in Full — Thank You!
              </h1>
              <p className="text-sm text-navy-700">
                Receipt for <strong>{job.service.name}</strong> has been sent to{" "}
                <span className="font-medium">{job.customer.email ?? job.customer.phone}</span>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs space-y-2">
              <div className="flex justify-between text-navy-700">
                <span>Invoice Number</span>
                <span className="font-bold text-navy-900">#{inv.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-navy-700">
                <span>Job Reference</span>
                <span className="font-bold text-navy-900">Job #{job.jobNumber}</span>
              </div>
              {lastTxId || job.payments[job.payments.length - 1]?.stripePaymentIntentId ? (
                <div className="flex justify-between text-navy-700">
                  <span>Transaction ID</span>
                  <span className="font-mono font-bold text-navy-900">
                    {lastTxId ?? job.payments[job.payments.length - 1]?.stripePaymentIntentId}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between text-navy-700">
                <span>Payment Method</span>
                <span className="font-semibold text-navy-900 uppercase">
                  {job.customer.cardBrand ? `${job.customer.cardBrand} •••• ${job.customer.cardLast4}` : "Card on File"}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-navy-900">
                <span>Total Paid</span>
                <Money cents={inv.totalCents} className="text-emerald-700 font-extrabold" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 rounded-full text-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                Print / Save Receipt
              </Button>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-orange-50 border border-orange-500/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-700">
                Job #{job.jobNumber} · Service Invoice
              </span>
              <h1 className="font-heading text-lg font-extrabold text-navy-900 mt-1.5">
                {job.service.name}
              </h1>
              <p className="text-xs text-navy-700 flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-orange-700 shrink-0" />
                {job.addressLine1}, {job.city}, {job.state} {job.zip}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-navy-700 block">Customer</span>
              <span className="text-sm font-bold text-navy-900 block">
                {job.customer.name}
              </span>
              {job.technician ? (
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-navy-700">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Tech: {job.technician.name}
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            {inv.lineItems.map((li) => (
              <div key={li.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-navy-900">{li.description}</p>
                  <p className="text-xs text-navy-700 capitalize">
                    {li.kind} {li.quantity > 1 ? `× ${li.quantity}` : ""}
                    {li.taxable ? " · Taxable" : ""}
                  </p>
                </div>
                <Money cents={li.amountCents} className="font-semibold text-navy-900" />
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-3.5 space-y-1.5 text-sm">
            <div className="flex justify-between text-navy-700">
              <span>Subtotal</span>
              <Money cents={inv.subtotalCents} />
            </div>
            <div className="flex justify-between text-navy-700">
              <span>Sales Tax ({(businessConfig.tax.rateBps / 100).toFixed(1)}%)</span>
              <Money cents={inv.taxCents} />
            </div>
            {inv.depositCreditCents > 0 ? (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Booking Deposit Credit</span>
                <span>
                  -<Money cents={inv.depositCreditCents} />
                </span>
              </div>
            ) : null}
            <div className="flex justify-between text-navy-700">
              <span>Technician Tip</span>
              <Money cents={isPaid ? inv.tipCents : tipCents} />
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-navy-900">
              <span>{isPaid ? "Balance Due" : "Amount Due Now"}</span>
              <Money
                cents={liveAmountDueCents}
                data-testid="pay-link-amount-due"
                className="text-lg text-navy-900"
              />
            </div>
          </div>
        </section>

        {!isPaid ? (
          <form onSubmit={handlePayNow} className="space-y-5">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl space-y-3">
              <div>
                <h2 className="font-heading text-sm font-bold text-navy-900">
                  Add a tip for {job.technician?.name ?? "your technician"}
                </h2>
                <p className="text-xs text-navy-700">
                  100% of tips go directly to your field technician.
                </p>
              </div>
              <TipSelector
                subtotalCents={inv.subtotalCents}
                tipCents={tipCents}
                onChange={setTipCents}
              />
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold text-navy-900 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-orange-700" />
                  Select Payment Method
                </h2>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <Lock className="h-3.5 w-3.5" />
                  256-bit SSL encrypted
                </span>
              </div>

              {/* Method Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {job.customer.cardLast4 ? (
                  <button
                    type="button"
                    onClick={() => setPayMethod("card_on_file")}
                    className={`rounded-xl border p-2.5 text-xs font-bold transition-all text-left ${
                      payMethod === "card_on_file"
                        ? "border-navy-900 bg-navy-900 text-white shadow-sm"
                        : "border-slate-200 bg-white text-navy-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-[10px] uppercase tracking-wide opacity-80">Saved Card</span>
                    •••• {job.customer.cardLast4}
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setPayMethod("new_card")}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition-all text-left ${
                    payMethod === "new_card"
                      ? "border-navy-900 bg-navy-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-navy-900 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wide opacity-80">New Card</span>
                  Credit / Debit
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod("check")}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition-all text-left ${
                    payMethod === "check"
                      ? "border-navy-900 bg-navy-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-navy-900 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wide opacity-80">Offline</span>
                  Check / Bank
                </button>
              </div>

              {payMethod === "card_on_file" && job.customer.cardLast4 ? (
                <div className="rounded-xl border border-orange-500 bg-orange-50/50 p-3.5 flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-bold text-navy-900 uppercase">
                      Saved {job.customer.cardBrand ?? "Card"} •••• {job.customer.cardLast4}
                    </p>
                    <p className="text-navy-700">Authorized during deposit booking</p>
                  </div>
                  <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[11px] font-bold text-navy-900">
                    Ready to Charge
                  </span>
                </div>
              ) : null}

              {payMethod === "new_card" ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pay-cardnum">Card Number</Label>
                      <span className="text-[11px] font-bold text-navy-700">
                        {detectCardBrand(cardNumber)}
                      </span>
                    </div>
                    <Input
                      id="pay-cardnum"
                      placeholder="4242 •••• •••• 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="pay-expiry">Expiry Date</Label>
                      <Input
                        id="pay-expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiryInput(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pay-cvc">CVC Security Code</Label>
                      <Input
                        id="pay-cvc"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                        required
                      />
                    </div>
                  </div>

                  {/* Quick Test Card Fill Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fillTestCard("success")}
                      className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      Fill Test Card 4242
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={() => fillTestCard("decline")}
                      className="text-[11px] font-semibold text-slate-500 hover:underline"
                    >
                      Test Decline
                    </button>
                  </div>
                </div>
              ) : null}

              {payMethod === "check" ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <Label htmlFor="pay-check-ref">Check / Reference Number</Label>
                    <Input
                      id="pay-check-ref"
                      placeholder="e.g. Check # 1042"
                      value={checkRef}
                      onChange={(e) => setCheckRef(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-navy-700">
                    Hand payment to your technician on site or mail check to{" "}
                    <strong>{businessConfig.businessName}</strong>.
                  </p>
                </div>
              ) : null}

              <div className="space-y-3">
                <div>
                  <Label htmlFor="pay-cardholder">Cardholder / Payer Name</Label>
                  <Input
                    id="pay-cardholder"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={paying}
                data-testid="pay-link-submit-btn"
                className="w-full rounded-full font-bold shadow-lg"
              >
                Pay {formatMoney(liveAmountDueCents)} Now
              </Button>
            </section>
          </form>
        ) : null}
      </div>
    </main>
  );
}
