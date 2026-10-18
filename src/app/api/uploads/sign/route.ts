import { NextResponse } from "next/server";
import crypto from "crypto";
import { signUploadsRequestSchema } from "@/lib/validation/booking";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getLocalDb, getDbNow, DbException } from "@/lib/server/local-db-fallback";
import { handleRouteError } from "@/lib/server/api-errors";
import { businessConfig } from "@config/business.config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUploadsRequestSchema.parse(body);

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data: hold } = await supabase
        .from("slot_holds")
        .select("id, business_id, expires_at, converted_job_id")
        .eq("id", parsed.holdId)
        .maybeSingle();

      const holdRow = hold as {
        id: string;
        business_id: string;
        expires_at: string;
        converted_job_id: string | null;
      } | null;

      if (!holdRow || holdRow.converted_job_id || new Date(holdRow.expires_at) <= new Date()) {
        throw new DbException("HOLD_NOT_FOUND");
      }

      const uploads = [];
      for (const file of parsed.files) {
        const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const path = `${holdRow.business_id}/drafts/${holdRow.id}/${crypto.randomUUID()}.${ext}`;
        const { data: signed, error } = await supabase.storage
          .from("job-photos")
          .createSignedUploadUrl(path);
        if (error || !signed) {
          throw new Error(error?.message ?? "Failed to create signed upload URL");
        }
        uploads.push({
          path,
          uploadUrl: signed.signedUrl,
          token: signed.token,
        });
      }

      return NextResponse.json({ uploads });
    }

    // Local DB fallback
    const db = getLocalDb();
    const hold = db.slot_holds.get(parsed.holdId);
    const now = getDbNow(db);
    if (!hold || hold.converted_job_id !== null || new Date(hold.expires_at) <= now) {
      throw new DbException("HOLD_NOT_FOUND");
    }

    const uploads = parsed.files.map((file) => {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `${hold.business_id}/drafts/${hold.id}/${crypto.randomUUID()}.${ext}`;
      db.storage_objects.set(path, {
        bucket: "job-photos",
        path,
        size: file.size,
        mimeType: file.type,
      });
      return {
        path,
        uploadUrl: `/api/uploads/put?path=${encodeURIComponent(path)}`,
      };
    });

    return NextResponse.json({ uploads });
  } catch (err) {
    return handleRouteError(err);
  }
}
