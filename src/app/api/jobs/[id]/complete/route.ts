import { NextResponse } from "next/server";
import { createOrUpdateInvoiceForJob } from "@/lib/server/operations";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
    billableMinutes?: number;
    tipCents?: number;
    techNotes?: string;
    lineItems?: Array<{
      kind: "labor" | "parts" | "fee" | "discount";
      description: string;
      quantity: number;
      unitPriceCents: number;
      taxable: boolean;
    }>;
  };

  const res = await createOrUpdateInvoiceForJob({
    jobId: params.id,
    billableMinutes: body.billableMinutes,
    tipCents: body.tipCents,
    techNotes: body.techNotes,
    lineItems: body.lineItems ?? [],
  });

  if (!res.ok) {
    return NextResponse.json(
      {
        error: {
          code: res.errorCode ?? "INVOICE_ERROR",
          message: "Could not create or update invoice",
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ job: res.job });
}
