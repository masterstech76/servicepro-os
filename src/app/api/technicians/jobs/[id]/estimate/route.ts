import { NextResponse } from "next/server";
import {
  resolveTechnicianSession,
  getJobEstimates,
  saveJobEstimate,
  recordEstimateDecision,
} from "@/lib/server/tech-portal";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  const estimates = getJobEstimates(params.id);
  return NextResponse.json({ estimates });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const res = saveJobEstimate({
      techId: session.techId,
      jobId: params.id,
      title: body.title || "",
      description: body.description,
      items: body.items || [],
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: { code: "ESTIMATE_ERROR", message: res.error || "Failed to create estimate" } },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, estimate: res.estimate });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveTechnicianSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Technician login required" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const res = recordEstimateDecision({
      techId: session.techId,
      jobId: params.id,
      estimateId: body.estimateId,
      decision: body.decision,
      customerSignatureName: body.customerSignatureName,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: { code: "ESTIMATE_DECISION_ERROR", message: res.error || "Failed to update estimate" } },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, estimate: res.estimate });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: msg } },
      { status: 400 }
    );
  }
}
