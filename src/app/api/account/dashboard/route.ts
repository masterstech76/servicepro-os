import { NextResponse } from "next/server";
import { resolveCustomerSession, getCustomerDashboardData } from "@/lib/server/customer-portal";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const data = await getCustomerDashboardData(session.customerId);
  return NextResponse.json({
    customer: {
      id: session.customerId,
      name: session.name,
      email: session.email,
      phone: session.phone,
      isDemo: session.isDemo,
    },
    ...data,
  });
}
