import "server-only";
import { getSupabaseAdminClient } from "./supabase-admin";
import { getLocalDb } from "./local-db-fallback";

/**
 * Generates short-lived (1h TTL = 3600s) signed download URLs for private job photos
 * per BUILD_PLAN Section 17.
 */
export async function createSignedPhotoUrls(paths: string[]): Promise<string[]> {
  if (paths.length === 0) return [];

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase.storage
      .from("job-photos")
      .createSignedUrls(paths, 3600);
    if (!error && data) {
      return data
        .map((d) => d.signedUrl)
        .filter((u): u is string => typeof u === "string" && u.length > 0);
    }
  }

  const db = getLocalDb();
  return paths.map((p) => {
    const exists = db.storage_objects.has(p);
    const expires = Date.now() + 3600 * 1000;
    return `/api/uploads/view?path=${encodeURIComponent(p)}&expires=${expires}&valid=${exists ? 1 : 0}`;
  });
}
