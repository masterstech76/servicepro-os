"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Printer,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/shared/Money";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";

interface InvoiceDetailResponse {
  invoice: {
    id: string;
    invoice_number: string;
    job_id: string;
    customer_id: string;
    status: string;
    subtotal_cents: number;
    tax_cents: number;
    total_cents: number;
    amount_paid_cents: number;
    amount_due_cents: number;
    due_date: string;
    created_at: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    jobNumber: number;
    serviceName: string;
  };
  lineItems: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price_cents: number;
    total_cents: number;
  }>;
  payments: Array<{
    id: string;
    amount_cents: number;
    method: string;
    card_brand: string | null;
    card_last4: string | null;
    status: string;
    created_at: string;
  }>;
}

export default function AdminInvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const invoiceId = params?.id ?? "";

  const [data, setData] = React.useState<InvoiceDetailResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  const tz = businessConfig.timezone;

  React.useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/invoices/${encodeURIComponent(invoiceId)}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } finally {
        setLoading(false);
      }
    }
    if (invoiceId) void fetchDetail();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mx-auto" />
        <p className="text-xs">Loading invoice records...</p>
      </div>
    );
  }

  if (!data || !data.invoice) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-navy-900">Invoice Not Found</h2>
        <p className="text-xs text-navy-500 max-w-sm mx-auto">
          The requested invoice identifier does not match any records.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/invoices">&larr; Back to Invoices</Link>
        </Button>
      </div>
    );
  }

  const { invoice, lineItems, payments } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-600 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="rounded-xl border-slate-300 font-bold text-navy-800"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Print / Save PDF
          </Button>
          <Link
            href={`/admin/jobs/${invoice.job_id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs"
          >
            Inspect Job #{invoice.jobNumber} &rarr;
          </Link>
        </div>
      </div>

      {/* Invoice Document Paper Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-8">
        {/* Header: Company & Invoice Info */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-lg font-black text-navy-900 block font-heading">
              {businessConfig.businessName}
            </span>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              {businessConfig.address}
              <br />
              State Mechanical License #{businessConfig.licenseNumber}
              <br />
              Support: {businessConfig.phone} • {businessConfig.email}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-navy-800">
              INVOICE
            </span>
            <h2 className="font-mono text-2xl font-black text-navy-900">
              {invoice.invoice_number}
            </h2>
            <p className="text-xs text-slate-500">
              Issue Date: {formatInTimeZone(new Date(invoice.created_at), tz, "MMM d, yyyy")}
            </p>
            <p className="text-xs text-slate-500">
              Payment Due: {formatInTimeZone(new Date(invoice.due_date), tz, "MMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* Bill To & Job Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
              BILLED TO:
            </span>
            <div className="font-bold text-navy-900 text-sm">{invoice.customerName}</div>
            <div className="text-slate-600">{invoice.customerPhone}</div>
            <div className="text-slate-600">{invoice.customerEmail}</div>
            <div className="text-slate-600 pt-1">
              Service Location: {invoice.addressLine1}, {invoice.city}, {invoice.state} {invoice.zip}
            </div>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
              SERVICE DETAILS:
            </span>
            <div className="font-bold text-navy-900 text-sm">Job #{invoice.jobNumber}</div>
            <div className="text-slate-600 font-semibold">{invoice.serviceName}</div>
            <div className="pt-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  invoice.status === "paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : invoice.status === "sent"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                Status: {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-navy-700 uppercase font-bold tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Rate</th>
                <th className="py-2.5 px-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lineItems.length === 0 ? (
                <tr>
                  <td className="py-3 px-3 font-medium text-navy-900">
                    {invoice.serviceName} (Flat-Rate Diagnostic &amp; Repair)
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600">1</td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    {formatMoney(invoice.subtotal_cents)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-navy-900">
                    {formatMoney(invoice.subtotal_cents)}
                  </td>
                </tr>
              ) : (
                lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3 font-medium text-navy-900">{item.description}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-slate-600">
                      {formatMoney(item.unit_price_cents)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-navy-900">
                      {formatMoney(item.total_cents)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex flex-col sm:flex-row justify-between pt-4 border-t border-slate-200 gap-6 text-xs">
          <div className="text-slate-500 max-w-xs space-y-1">
            <p className="font-bold text-slate-700">Warranty &amp; Guarantee:</p>
            <p>
              1-Year limited warranty on all labor and installed replacement components. All diagnostics are 100% credited toward completed service.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-right">
            <div className="flex justify-between py-1 text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-navy-900">{formatMoney(invoice.subtotal_cents)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Florida Sales Tax (7.0%):</span>
              <span className="font-semibold text-navy-900">{formatMoney(invoice.tax_cents)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm font-black text-navy-950 border-t border-slate-200">
              <span>Invoice Total:</span>
              <span>{formatMoney(invoice.total_cents)}</span>
            </div>
            <div className="flex justify-between py-1 text-emerald-700 font-bold border-t border-slate-100">
              <span>Paid to Date:</span>
              <span>-{formatMoney(invoice.amount_paid_cents)}</span>
            </div>
            <div className="flex justify-between py-2 text-base font-black text-orange-600 border-t-2 border-slate-900">
              <span>Balance Due:</span>
              <span>{formatMoney(invoice.amount_due_cents)}</span>
            </div>
          </div>
        </div>

        {/* Recorded Payments */}
        {payments.length > 0 && (
          <div className="pt-6 border-t border-slate-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-navy-700">
              Payment Transactions
            </h4>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50">
              {payments.map((p) => (
                <div key={p.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-navy-900 capitalize">{p.method} Payment</span>
                      {p.card_last4 && (
                        <span className="text-slate-500 ml-1">
                          ({p.card_brand || "Card"} •••• {p.card_last4})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 block">{formatMoney(p.amount_cents)}</span>
                    <span className="text-[11px] text-slate-400">
                      {formatInTimeZone(new Date(p.created_at), tz, "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
