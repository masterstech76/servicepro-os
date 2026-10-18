import { NextResponse } from "next/server";
import { getLocalDb } from "@/lib/server/local-db-fallback";

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") ?? "";
  if (!path) {
    return NextResponse.json({ error: { code: "BAD_PATH", message: "Missing path" } }, { status: 400 });
  }

  const arrayBuffer = await request.arrayBuffer();
  const db = getLocalDb();
  db.storage_objects.set(path, {
    bucket: "job-photos",
    path,
    size: arrayBuffer.byteLength,
    mimeType: request.headers.get("content-type") ?? "image/jpeg",
    data: Buffer.from(arrayBuffer),
  });

  return NextResponse.json({ uploaded: true, path });
}
