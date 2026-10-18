import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import {
  getLocalDb,
  rpcConvertHoldToJob,
  DbException,
} from "@/lib/server/local-db-fallback";
import { handleRouteError, jsonError } from "@/lib/server/api-errors";

const simulateSchema = z.object({
  paymentIntentId: z.string().min(1),
  holdId: z.string().min(1),
});

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return jsonError(
      "FORBIDDEN_IN_PROD",
      "Payment simulation is disabled in production.",
      403
    );
  }

  try {
    const body = await request.json();
    const parsed = simulateSchema.parse(body);

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data: hold } = await supabase
        .from("slot_holds")
        .select("*")
        .eq("id", parsed.holdId)
        .maybeSingle();

      const holdRow = hold as {
        id: string;
        business_id: string;
        payload: Record<string, unknown> | null;
      } | null;

      if (!holdRow) {
        throw new DbException("HOLD_NOT_FOUND");
      }

      const depositCents = Number(holdRow.payload?.depositCents ?? 1980);

      const { data: jobId, error } = await (supabase.rpc as unknown as (
        fn: string,
        args: Record<string, unknown>
      ) => Promise<{ data: string | null; error: { message: string } | null }>)(
        "convert_hold_to_job",
        {
          p_hold: holdRow.id,
          p_payment_intent: parsed.paymentIntentId,
          p_deposit_cents: depositCents,
        }
      );

      if (error || !jobId) {
        throw new Error(error?.message ?? "Failed to convert hold");
      }

      // Move photos from {business_id}/drafts/{holdId}/* -> {business_id}/{jobId}/issue/*
      const draftPaths = Array.isArray(holdRow.payload?.photoPaths)
        ? (holdRow.payload?.photoPaths as string[])
        : [];
      const movedPaths: string[] = [];

      for (const draftPath of draftPaths) {
        const fileName = draftPath.split("/").pop() ?? "photo.jpg";
        const destPath = `${holdRow.business_id}/${jobId}/issue/${fileName}`;
        await supabase.storage.from("job-photos").move(draftPath, destPath);
        movedPaths.push(destPath);
      }

      if (movedPaths.length > 0) {
        await (supabase.from("jobs") as unknown as {
          update: (v: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<unknown> };
        })
          .update({ issue_photos: movedPaths })
          .eq("id", jobId);
      }

      const { data: job } = await supabase
        .from("jobs")
        .select("job_number")
        .eq("id", jobId)
        .single();

      return NextResponse.json({
        jobId,
        jobNumber: Number((job as { job_number?: number } | null)?.job_number ?? 1001),
        movedPhotoPaths: movedPaths,
      });
    }

    // Local DB fallback
    const db = getLocalDb();
    const hold = db.slot_holds.get(parsed.holdId);
    if (!hold) throw new DbException("HOLD_NOT_FOUND");

    const payload = (hold.payload ?? {}) as Record<string, unknown>;
    const depositCents = Number(payload.depositCents ?? 1980);

    const jobId = await rpcConvertHoldToJob(
      {
        p_hold: hold.id,
        p_payment_intent: parsed.paymentIntentId,
        p_deposit_cents: depositCents,
      },
      db
    );

    const job = db.jobs.get(jobId)!;

    // Move draft photos in local storage bucket to {business_id}/{jobId}/issue/*
    const draftPaths = Array.isArray(payload.photoPaths)
      ? (payload.photoPaths as string[])
      : [];
    const movedPaths: string[] = [];

    for (const draftPath of draftPaths) {
      const fileName = draftPath.split("/").pop() ?? "photo.jpg";
      const destPath = `${hold.business_id}/${jobId}/issue/${fileName}`;
      const existingObj = db.storage_objects.get(draftPath);
      if (existingObj) {
        db.storage_objects.delete(draftPath);
        db.storage_objects.set(destPath, {
          ...existingObj,
          path: destPath,
        });
      } else {
        db.storage_objects.set(destPath, {
          bucket: "job-photos",
          path: destPath,
          size: 1024,
          mimeType: "image/jpeg",
        });
      }
      movedPaths.push(destPath);
    }

    if (movedPaths.length > 0) {
      job.issue_photos = movedPaths;
      db.jobs.set(jobId, job);
    }

    return NextResponse.json({
      jobId,
      jobNumber: job.job_number,
      movedPhotoPaths: movedPaths,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
