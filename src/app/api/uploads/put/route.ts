import { NextResponse } from "next/server";
import { getLocalDb } from "@/lib/server/local-db-fallback";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const VALID_PATH_REGEX = /^[a-zA-Z0-9\/\-_.]+\.(jpg|jpeg|png|webp)$/;

export async function PUT(request: Request) {
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

  const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: { code: "UNSUPPORTED_MEDIA_TYPE", message: "Only JPEG, PNG, and WEBP images are allowed" } },
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

  const db = getLocalDb();
  db.storage_objects.set(path, {
    bucket: "job-photos",
    path,
    size: arrayBuffer.byteLength,
    mimeType: contentType,
    data: Buffer.from(arrayBuffer),
  });

  return NextResponse.json({ uploaded: true, path });
}
