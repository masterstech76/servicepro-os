import { NextResponse } from "next/server";
import { suggestTechniciansForJob } from "@/lib/server/operations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "jobId is required" } },
      { status: 400 }
    );
  }

  const suggestions = suggestTechniciansForJob(jobId);
  return NextResponse.json({ suggestions });
}
