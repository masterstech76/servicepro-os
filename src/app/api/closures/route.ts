import { NextRequest, NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export async function GET() {
  const store = getLocalDbWithDemo();
  const closures = Array.from(store.business_closures.values()).sort((a, b) =>
    a.closed_on.localeCompare(b.closed_on)
  );
  return NextResponse.json({ closures });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const store = getLocalDbWithDemo();
  const biz = Array.from(store.businesses.values())[0];
  const id = `clos_${Date.now()}`;
  const row = {
    id,
    business_id: biz?.id ?? "00000000-0000-4000-8000-000000000001",
    closed_on: String(body.closedOn),
    reason: body.reason ? String(body.reason) : "Holiday Closure",
  };
  store.business_closures.set(id, row);
  return NextResponse.json({ closure: row }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const store = getLocalDbWithDemo();
  if (id) {
    store.business_closures.delete(id);
  }
  return NextResponse.json({ ok: true });
}
