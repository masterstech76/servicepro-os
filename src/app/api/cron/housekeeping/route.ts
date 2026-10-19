import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getDbNow } from "@/lib/server/local-db-fallback";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export const runtime = "nodejs";

export async function GET(req: Request) {
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
    const { error, count } = await supabase
      .from("slot_holds")
      .delete({ count: "exact" })
      .is("converted_job_id", null)
      .lt("expires_at", new Date().toISOString());

    if (error) {
      return NextResponse.json(
        { error: { code: "CRON_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      purgedHolds: count ?? 0,
      mode: "supabase",
      timestamp: new Date().toISOString(),
    });
  }

  const store = getLocalDbWithDemo();
  const nowMs = getDbNow(store).getTime();
  let purgedHolds = 0;

  for (const [holdId, hold] of Array.from(store.slot_holds.entries())) {
    if (
      hold.converted_job_id === null &&
      new Date(hold.expires_at).getTime() <= nowMs
    ) {
      store.slot_holds.delete(holdId);
      purgedHolds += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    purgedHolds,
    mode: "local",
    timestamp: new Date(nowMs).toISOString(),
  });
}
