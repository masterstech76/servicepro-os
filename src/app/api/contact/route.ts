import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { verifyCsrfOrigin } from "@/lib/server/csrf";

export async function POST(request: Request) {
  // 1. CSRF Protection
  const csrf = verifyCsrfOrigin(request);
  if (!csrf.valid && csrf.response) {
    return csrf.response;
  }

  // 2. Rate Limiting (prevent spam submissions: 5 requests per 5 minutes)
  const rl = checkRateLimit(request, { limit: 5, windowMs: 5 * 60_000, keyPrefix: "contact_inquiry" });
  if (!rl.allowed && rl.response) {
    return rl.response;
  }

  try {
    const body = await request.json();
    const { name, phone, email, service, message } = body || {};

    if (!name || !phone || !message) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name, phone number, and a description of your issue." },
        { status: 400 }
      );
    }

    // In a production environment, send email alert or push to dispatch queue
    return NextResponse.json({
      ok: true,
      message: "Your inquiry has been received. Our dispatch team will contact you within 30 minutes.",
      referenceId: `INQ-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
