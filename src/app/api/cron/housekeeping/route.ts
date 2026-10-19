import { NextResponse } from "next/server";
import { getDbNow } from "@/lib/server/local-db-fallback";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export async function GET() {
  const store = getLocalDbWithDemo();
  const nowMs = getDbNow(store).getTime();
  let purgedCount = 0;

  for (const [holdId, hold] of Array.from(store.slot_holds.entries())) {
    if (
      hold.converted_job_id === null &&
      new Date(hold.expires_at).getTime() <= nowMs
    ) {
      store.slot_holds.delete(holdId);
      purgedCount += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    purgedHolds: purgedCount,
    timestamp: new Date(nowMs).toISOString(),
  });
}
