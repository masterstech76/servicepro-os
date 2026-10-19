import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
