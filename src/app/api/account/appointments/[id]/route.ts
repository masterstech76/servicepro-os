import { NextResponse } from "next/server";
import {
  resolveCustomerSession,
  getCustomerAppointmentById,
} from "@/lib/server/customer-portal";
import {
  cancelJobWithPolicy,
  rescheduleJobWindow,
} from "@/lib/server/operations";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const job = getCustomerAppointmentById(session.customerId, params.id);
  if (!job) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Appointment not found or unauthorized" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ job });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Customer login required" } },
      { status: 401 }
    );
  }

  const job = getCustomerAppointmentById(session.customerId, params.id);
  if (!job) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Appointment not found or unauthorized" } },
      { status: 404 }
    );
  }

  const body = (await request.json()) as {
    action: "cancel" | "reschedule";
    reason?: string;
    startsAt?: string;
    endsAt?: string;
  };

  if (body.action === "cancel") {
    // Check if job is in a cancellable state
    if (!["unassigned", "assigned"].includes(job.status)) {
      return NextResponse.json(
        {
          error: {
            code: "CANCEL_RESTRICTED",
            message: `Appointments in '${job.status}' status cannot be cancelled online. Please call dispatch directly.`,
          },
        },
        { status: 400 }
      );
    }

    const cancelRes = await cancelJobWithPolicy({
      jobId: params.id,
      reason: body.reason || "Cancelled by customer through portal",
      refundDeposit: "auto",
    });

    if (!cancelRes.ok) {
      return NextResponse.json(
        { error: { code: cancelRes.errorCode || "CANCEL_FAILED", message: "Failed to cancel appointment" } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      job: cancelRes.job,
      refundCents: cancelRes.refundCents,
      refunded: cancelRes.refunded,
    });
  }

  if (body.action === "reschedule") {
    if (!["unassigned", "assigned"].includes(job.status)) {
      return NextResponse.json(
        {
          error: {
            code: "RESCHEDULE_RESTRICTED",
            message: `Appointments in '${job.status}' status cannot be rescheduled online. Please contact office dispatch.`,
          },
        },
        { status: 400 }
      );
    }

    if (!body.startsAt) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "startsAt is required for rescheduling" } },
        { status: 400 }
      );
    }

    const reschedRes = await rescheduleJobWindow({
      jobId: params.id,
      newStartIso: body.startsAt,
      newEndIso: body.endsAt,
      actorLabel: body.reason || "Customer requested schedule change",
    });

    if (!reschedRes.ok) {
      return NextResponse.json(
        { error: { code: reschedRes.errorCode || "RESCHEDULE_FAILED", message: "Failed to reschedule appointment" } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      job: reschedRes.job,
    });
  }

  return NextResponse.json(
    { error: { code: "INVALID_ACTION", message: "Unsupported appointment action" } },
    { status: 400 }
  );
}
