import { NextResponse } from "next/server";
import { resolveAdminSession, getAdminInvoiceDetail } from "@/lib/server/admin-portal";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await resolveAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 }
    );
  }

  const detail = getAdminInvoiceDetail(params.id);
  if (!detail) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Invoice not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json(detail);
}
