"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Snowflake,
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
  const [cardName, setCardName] = React.useState("");

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

  async function handlePayNow(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    try {
      const res = await fetch(`/api/invoices/public/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipCents }),
      });
      if (!res.ok) {
        toast.error("Payment could not be processed. Please try again.");
        return;
      }
      const data = (await res.json()) as { job: EnrichedJob };
      setJob(data.job);
      toast.success("Payment complete! Thank you for choosing Cool Air HVAC.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-input bg-navy-900 text-orange-500">
              <Snowflake className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-sm font-bold text-navy-900">
                {businessConfig.businessName}
              </span>
              <span className="block text-xs text-navy-700">
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
            className="rounded-card border border-emerald-200 bg-emerald-50/70 p-6 text-center space-y-3 shadow-sm"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-navy-900">
              Paid in Full — Thank You!
            </h1>
            <p className="text-sm text-navy-700">
              Receipt for <strong>{job.service.name}</strong> has been sent to{" "}
              <span className="font-medium">{job.customer.email ?? job.customer.phone}</span>.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                Total Paid: <Money cents={inv.totalCents} />
              </span>
            </div>
          </section>
        ) : null}

        <section className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-700">
                Service Invoice
              </span>
              <h1 className="text-lg font-bold text-navy-900 mt-0.5">
                {job.service.name}
              </h1>
              <p className="text-xs text-navy-700 flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {job.addressLine1}, {job.city}, {job.state} {job.zip}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-navy-700 block">Customer</span>
              <span className="text-sm font-semibold text-navy-900 block">
                {job.customer.name}
              </span>
              {job.technician ? (
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-navy-700">
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
                  <p className="font-medium text-navy-900">{li.description}</p>
                  <p className="text-xs text-navy-700 capitalize">
                    {li.kind} {li.quantity > 1 ? `× ${li.quantity}` : ""}
                    {li.taxable ? " · Taxable" : ""}
                  </p>
                </div>
                <Money cents={li.amountCents} className="font-medium text-navy-900" />
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-navy-700">
              <span>Subtotal</span>
              <Money cents={inv.subtotalCents} />
            </div>
            <div className="flex justify-between text-navy-700">
              <span>Sales Tax ({(businessConfig.tax.rateBps / 100).toFixed(1)}%)</span>
              <Money cents={inv.taxCents} />
            </div>
            {inv.depositCreditCents > 0 ? (
              <div className="flex justify-between text-emerald-700 font-medium">
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
            <div className="flex justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-navy-900">
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
            <section className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div>
                <h2 className="text-sm font-bold text-navy-900">
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

            <section className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-orange-600" />
                  Payment Method
                </h2>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <Lock className="h-3.5 w-3.5" />
                  256-bit SSL encrypted
                </span>
              </div>

              {job.customer.cardLast4 ? (
                <div className="rounded-input border border-orange-500 bg-orange-50/40 p-3 flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-semibold text-navy-900 uppercase">
                      Saved {job.customer.cardBrand ?? "Card"} •••• {job.customer.cardLast4}
                    </p>
                    <p className="text-navy-700">Authorized during booking</p>
                  </div>
                  <span className="text-xs font-semibold text-orange-700">Active</span>
                </div>
              ) : null}

              <div className="space-y-3">
                <div>
                  <Label htmlFor="pay-cardholder">Name on card</Label>
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
                className="w-full"
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
