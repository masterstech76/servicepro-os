"use client";

import * as React from "react";
import { CreditCard, MessageSquare, Users } from "lucide-react";
import { toast } from "sonner";
import { Money } from "@/components/shared/Money";
import { PhoneLink } from "@/components/shared/PhoneLink";

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  card_brand: string | null;
  card_last4: string | null;
  sms_opt_out: boolean;
  jobsCount: number;
  totalSpentCents: number;
}

interface SmsLogRow {
  id: string;
  template: string;
  to_phone: string;
  body: string;
  provider: string;
  status: string;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<CustomerRow[]>([]);
  const [smsLogs, setSmsLogs] = React.useState<SmsLogRow[]>([]);

  const loadData = React.useCallback(async () => {
    const res = await fetch("/api/admin/catalog");
    const data = (await res.json()) as {
      customers: CustomerRow[];
      smsLogs: SmsLogRow[];
    };
    setCustomers(data.customers ?? []);
    setSmsLogs(data.smsLogs ?? []);
  }, []);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  async function toggleOptOut(cust: CustomerRow) {
    await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle_customer_sms",
        payload: { customerId: cust.id, smsOptOut: !cust.sms_opt_out },
      }),
    });
    toast.success(
      `SMS notifications ${!cust.sms_opt_out ? "opted out" : "re-enabled"} for ${cust.name}`
    );
    await loadData();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          Customers & SMS Communications
        </h1>
        <p className="text-xs text-navy-700">
          View customer directory, saved payment methods, TCPA SMS consent, and automated message logs
        </p>
      </div>

      <section className="rounded-card border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-600" />
            Customer Directory ({customers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-navy-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone & Email</th>
                <th className="px-4 py-3">Card on File</th>
                <th className="px-4 py-3">Jobs</th>
                <th className="px-4 py-3">Lifetime Spend</th>
                <th className="px-4 py-3">SMS Consent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-navy-900">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-xs text-navy-700">
                    <PhoneLink phone={c.phone} />
                    {c.email ? <div className="mt-0.5">{c.email}</div> : null}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {c.card_last4 ? (
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium uppercase text-navy-900">
                        <CreditCard className="h-3 w-3 text-slate-500" />
                        {c.card_brand} •••• {c.card_last4}
                      </span>
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-navy-900 tabular-nums">
                    {c.jobsCount}
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy-900">
                    <Money cents={c.totalSpentCents} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void toggleOptOut(c)}
                      className={`rounded-pill px-2.5 py-0.5 text-xs font-semibold ${
                        c.sms_opt_out
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {c.sms_opt_out ? "Opted Out (STOP)" : "Subscribed"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-card border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-orange-600" />
          Outbound SMS Delivery Log ({smsLogs.length})
        </h2>
        {smsLogs.length === 0 ? (
          <p className="text-xs text-navy-700">
            Trigger an &quot;On The Way&quot;, &quot;Pay Link&quot;, or &quot;Booking&quot; event to see real-time SMS logs here.
          </p>
        ) : (
          <div className="space-y-2.5">
            {smsLogs.slice(0, 12).map((log) => (
              <div
                key={log.id}
                className="rounded-input border border-slate-200 bg-slate-50/60 p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-navy-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      {log.template}
                    </span>
                    <span className="font-semibold text-navy-900">
                      To: {log.to_phone}
                    </span>
                    <span className="text-emerald-700 font-semibold capitalize">
                      · {log.status} ({log.provider})
                    </span>
                  </div>
                  <p className="text-navy-700">{log.body}</p>
                </div>
                <span className="text-navy-700 tabular-nums shrink-0">
                  {new Date(log.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
