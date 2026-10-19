import { NextResponse } from "next/server";
import { resolveAdminSession, getAdminReviewsList, moderateAdminReview } from "@/lib/server/admin-portal";

export async function GET(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("q") || undefined;

  const reviews = getAdminReviewsList({ status, search });
  return NextResponse.json({ reviews, total: reviews.length });
}

export async function PATCH(request: Request) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body.reviewId || !body.status || !["approved", "rejected"].includes(body.status)) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Review ID and valid status ('approved' or 'rejected') required" } },
        { status: 400 }
      );
    }

    const success = moderateAdminReview(body.reviewId, body.status);
    if (!success) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Review not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, status: body.status });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
