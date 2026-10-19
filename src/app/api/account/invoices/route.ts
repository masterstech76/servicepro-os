import { NextResponse } from "next/server";
import { resolveCustomerSession, getCustomerJobs } from "@/lib/server/customer-portal";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const jobs = getCustomerJobs(session.customerId);
  const invoices = jobs
    .filter((j): j is typeof j & { invoice: NonNullable<typeof j.invoice> } => j.invoice !== null)
    .map((j) => ({
      ...j.invoice,
      jobId: j.id,
      jobNumber: j.jobNumber,
      serviceName: j.service.name,
      scheduledDate: j.scheduledStart,
      addressLine1: j.addressLine1,
      city: j.city,
    }));

  const totalSpentCents = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + (inv.amountPaidCents || 0), 0);

  const balanceDueCents = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "draft")
    .reduce((sum, inv) => sum + (inv.amountDueCents || 0), 0);

  return NextResponse.json({
    invoices,
    summary: {
      totalInvoices: invoices.length,
      totalSpentCents,
      balanceDueCents,
    },
  });
}
