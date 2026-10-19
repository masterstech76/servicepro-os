import { NextResponse } from "next/server";
import {
  resolveCustomerSession,
  getCustomerReviews,
  submitCustomerReview,
} from "@/lib/server/customer-portal";

export async function GET(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const reviews = getCustomerReviews(session.customerId);
  return NextResponse.json({ reviews, total: reviews.length });
}

export async function POST(request: Request) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const res = submitCustomerReview(session.customerId, {
      jobId: body.jobId,
      rating: Number(body.rating),
      content: String(body.content || ""),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: { code: "INVALID_REVIEW", message: res.error || "Failed to submit review" } },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, review: res.review });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
