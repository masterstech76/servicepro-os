import { NextResponse } from "next/server";
import { getRevenueReport } from "@/lib/server/operations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromDate = searchParams.get("from") ?? undefined;
  const toDate = searchParams.get("to") ?? undefined;
  const groupBy = (searchParams.get("groupBy") as "tech" | "service" | "day") ?? "tech";

  const report = getRevenueReport({ fromDate, toDate, groupBy });
  return NextResponse.json(report);
}
