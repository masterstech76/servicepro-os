import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getDbNow } from "@/lib/server/local-db-fallback";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { assertRuntimeSecrets } from "@/lib/server/runtime-env";

export const runtime = "nodejs";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  // In production, CRON_SECRET and runtime secrets are mandatory (fail closed).
  // In local development, CRON_SECRET is optional so developers/tests can trigger housekeeping directly,
  // but if CRON_SECRET is set in .env.local it is still enforced.
  if (process.env.NODE_ENV === "production" && !process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: { code: "CRON_MISCONFIGURED", message: "Missing CRON_SECRET" } },
      { status: 500 }
    );
  }

  if (process.env.NODE_ENV === "production") {
    try {
      assertRuntimeSecrets();
    } catch (envErr) {
      return NextResponse.json(
        {
          error: {
            code: "CRON_MISCONFIGURED",
            message:
              envErr instanceof Error
                ? envErr.message
                : "Missing runtime secrets",
          },
        },
        { status: 500 }
      );
    }
  }

  if (
    process.env.CRON_SECRET &&
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Invalid cron secret" } },
      { status: 401 }
    );
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const now = new Date();
    const nowIso = now.toISOString();
    const staleDraftCutoffIso = new Date(now.getTime() - TWENTY_FOUR_HOURS_MS).toISOString();
    const stripePruneCutoffIso = new Date(now.getTime() - THIRTY_DAYS_MS).toISOString();

    // 1. Collect draft photo paths from expired unconverted holds (> 24h old) before deleting holds
    const { data: expiredHolds, error: holdsErr } = await supabase
      .from("slot_holds")
      .select("id, payload, created_at")
      .is("converted_job_id", null)
      .lt("expires_at", nowIso);

    if (holdsErr) {
      return NextResponse.json(
        { error: { code: "CRON_FAILED", message: holdsErr.message } },
        { status: 500 }
      );
    }

    const staleDraftPaths: string[] = [];
    for (const h of expiredHolds ?? []) {
      if (new Date(h.created_at) <= new Date(staleDraftCutoffIso)) {
        const payload = (h.payload ?? {}) as Record<string, unknown>;
        if (Array.isArray(payload.photoPaths)) {
          for (const p of payload.photoPaths) {
            if (typeof p === "string") staleDraftPaths.push(p);
          }
        }
      }
    }

    let purgedDraftPhotos = 0;
    const warnings: string[] = [];
    if (staleDraftPaths.length > 0) {
      const { data: removedFiles, error: rmErr } = await supabase.storage
        .from("job-photos")
        .remove(staleDraftPaths);
      if (rmErr) {
        warnings.push(rmErr.message);
      } else {
        purgedDraftPhotos = removedFiles?.length ?? 0;
      }
    }

    // 2. Purge expired unconverted holds
    const { error, count: purgedHolds } = await supabase
      .from("slot_holds")
      .delete({ count: "exact" })
      .is("converted_job_id", null)
      .lt("expires_at", nowIso);

    if (error) {
      return NextResponse.json(
        { error: { code: "CRON_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    // 3. Prune stripe_events older than 30 days
    const { count: prunedStripeEvents } = await supabase
      .from("stripe_events")
      .delete({ count: "exact" })
      .lt("processed_at", stripePruneCutoffIso);

    return NextResponse.json({
      ok: true,
      purgedHolds: purgedHolds ?? 0,
      purgedDraftPhotos,
      prunedStripeEvents: prunedStripeEvents ?? 0,
      mode: "supabase",
      timestamp: nowIso,
      ...(warnings.length > 0 ? { storage_warning: warnings } : {}),
    });
  }

  const store = getLocalDbWithDemo();
  const nowMs = getDbNow(store).getTime();
  let purgedHolds = 0;
  let purgedDraftPhotos = 0;
  let prunedStripeEvents = 0;

  for (const [holdId, hold] of Array.from(store.slot_holds.entries())) {
    if (
      hold.converted_job_id === null &&
      new Date(hold.expires_at).getTime() <= nowMs
    ) {
      const payload = (hold.payload ?? {}) as Record<string, unknown>;
      if (Array.isArray(payload.photoPaths)) {
        for (const p of payload.photoPaths) {
          if (typeof p === "string" && store.storage_objects.delete(p)) {
            purgedDraftPhotos += 1;
          }
        }
      }
      store.slot_holds.delete(holdId);
      purgedHolds += 1;
    }
  }

  // Also purge any orphaned drafts/* objects whose hold no longer exists
  for (const objPath of Array.from(store.storage_objects.keys())) {
    const match = objPath.match(/\/drafts\/([^\/]+)\//);
    if (match && !store.slot_holds.has(match[1])) {
      store.storage_objects.delete(objPath);
      purgedDraftPhotos += 1;
    }
  }

  // Prune stripe_events older than 30 days
  for (const [evtId, evt] of Array.from(store.stripe_events.entries())) {
    if (nowMs - new Date(evt.processed_at).getTime() > THIRTY_DAYS_MS) {
      store.stripe_events.delete(evtId);
      prunedStripeEvents += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    purgedHolds,
    purgedDraftPhotos,
    prunedStripeEvents,
    mode: "local",
    timestamp: new Date(nowMs).toISOString(),
  });
}
