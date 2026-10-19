import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/server/supabase-admin";
import { getLocalDb, getDbNow } from "@/lib/server/local-db-fallback";
import { verifyCsrfOrigin } from "@/lib/server/csrf";
import { checkRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const VALID_PATH_REGEX = /^[a-zA-Z0-9\/\-_.]+\.(jpg|jpeg|png|webp)$/;

export async function PUT(request: Request) {
  // 1. CSRF Protection
  const csrf = verifyCsrfOrigin(request);
  if (!csrf.valid && csrf.response) {
    return csrf.response;
  }

  // 2. Rate limiting (20 upload puts / min per IP)
  const rl = checkRateLimit(request, { limit: 20, windowMs: 60_000, keyPrefix: "upload_put" });
  if (!rl.allowed && rl.response) {
    return rl.response;
  }

  // When Supabase is configured, uploads must use signed URLs from /api/uploads/sign directly to Supabase Storage.
  if (getSupabaseAdminClient()) {
    return NextResponse.json(
      {
        error: {
          code: "DIRECT_UPLOAD_REQUIRED",
          message: "Use signed Supabase storage URL when Supabase is configured",
        },
      },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") ?? "";
  if (!path) {
    return NextResponse.json(
      { error: { code: "BAD_PATH", message: "Missing path" } },
      { status: 400 }
    );
  }

  if (
    path.includes("..") ||
    path.startsWith("/") ||
    !path.includes("/drafts/") ||
    !VALID_PATH_REGEX.test(path)
  ) {
    return NextResponse.json(
      { error: { code: "INVALID_PATH", message: "Invalid upload path" } },
      { status: 400 }
    );
  }

  const m = path.match(/\/drafts\/([^\/]+)\//);
  if (!m) {
    return NextResponse.json(
      { error: { code: "INVALID_PATH", message: "Invalid upload path" } },
      { status: 400 }
    );
  }
  const holdId = m[1];

  const db = getLocalDb();
  const h = db.slot_holds.get(holdId);
  const now = getDbNow(db);
  if (!h || h.converted_job_id !== null || new Date(h.expires_at) <= now) {
    return NextResponse.json(
      { error: { code: "HOLD_NOT_FOUND", message: "Slot hold not found or expired" } },
      { status: 404 }
    );
  }

  if (!db.storage_objects.has(path)) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Upload path was not pre-signed for this hold",
        },
      },
      { status: 403 }
    );
  }

  const contentType = (request.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    return NextResponse.json(
      {
        error: {
          code: "UNSUPPORTED_MEDIA_TYPE",
          message: "Only JPEG, PNG, and WEBP images are allowed",
        },
      },
      { status: 415 }
    );
  }

  const arrayBuffer = await request.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: { code: "PAYLOAD_TOO_LARGE", message: "File exceeds 10MB limit" } },
      { status: 413 }
    );
  }

  db.storage_objects.set(path, {
    bucket: "job-photos",
    path,
    size: arrayBuffer.byteLength,
    mimeType: contentType,
    data: Buffer.from(arrayBuffer),
  });

  return NextResponse.json({ uploaded: true, path });
}
