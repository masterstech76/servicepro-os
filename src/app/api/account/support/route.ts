import { NextResponse } from "next/server";
import {
  resolveCustomerSession,
  getCustomerSupportTickets,
  createCustomerSupportTicket,
  type CustomerSupportTicket,
} from "@/lib/server/customer-portal";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const tickets = getCustomerSupportTickets(session.customerId);
  return NextResponse.json({ tickets });
}

export async function POST(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const body = (await request.json()) as {
    subject?: string;
    category?: CustomerSupportTicket["category"];
    priority?: CustomerSupportTicket["priority"];
    message?: string;
    jobId?: string | null;
  };

  if (!body.subject || !body.message || !body.category) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "Subject, category, and message are required." } },
      { status: 400 }
    );
  }

  const ticket = createCustomerSupportTicket(session.customerId, {
    subject: body.subject,
    category: body.category,
    priority: body.priority || "normal",
    message: body.message,
    jobId: body.jobId,
  });

  return NextResponse.json({ ok: true, ticket });
}
