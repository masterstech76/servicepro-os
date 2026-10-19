import { NextResponse } from "next/server";
import { resolveCustomerSession, getCustomerJobs } from "@/lib/server/customer-portal";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const store = getLocalDbWithDemo();
  const jobs = getCustomerJobs(session.customerId);
  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  const payments = Array.from(store.payments.values())
    .filter((pay) => jobMap.has(pay.job_id))
    .map((pay) => {
      const parentJob = jobMap.get(pay.job_id);
      return {
        id: pay.id,
        jobId: pay.job_id,
        jobNumber: parentJob?.jobNumber ?? 1000,
        serviceName: parentJob?.service.name ?? "HVAC Service",
        kind: pay.kind,
        amountCents: pay.amount_cents,
        status: pay.status,
        stripePaymentIntentId: pay.stripe_payment_intent_id,
        createdAt: pay.created_at,
        cardBrand: parentJob?.customer.cardBrand || "visa",
        cardLast4: parentJob?.customer.cardLast4 || "4242",
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Current customer card on file
  const currentCustomer = store.customers.get(session.customerId);
  const paymentMethod = currentCustomer?.card_last4
    ? {
        brand: currentCustomer.card_brand || "visa",
        last4: currentCustomer.card_last4,
        stripeCustomerId: currentCustomer.stripe_customer_id,
      }
    : null;

  return NextResponse.json({
    payments,
    paymentMethod,
    totalTransactions: payments.length,
  });
}
