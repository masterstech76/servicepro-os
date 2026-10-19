import { NextRequest, NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

const OPT_OUT_WORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"]);
const OPT_IN_WORDS = new Set(["START", "YES", "UNSTOP"]);

export async function POST(req: NextRequest) {
  try {
    let from = "";
    let body = "";

    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = await req.json();
      from = String(json.From ?? json.from ?? "");
      body = String(json.Body ?? json.body ?? "");
    } else {
      const formData = await req.formData();
      from = String(formData.get("From") ?? "");
      body = String(formData.get("Body") ?? "");
    }

    const normalizedKeyword = body.trim().toUpperCase();
    const store = getLocalDbWithDemo();
    const cleanPhone = from.replace(/[^\d+]/g, "");

    let updatedCount = 0;
    let action: "opt_out" | "opt_in" | "none" = "none";

    for (const [id, cust] of Array.from(store.customers.entries())) {
      const custDigits = cust.phone.replace(/[^\d]/g, "");
      const fromDigits = cleanPhone.replace(/[^\d]/g, "");
      if (custDigits && fromDigits && custDigits.slice(-10) === fromDigits.slice(-10)) {
        if (OPT_OUT_WORDS.has(normalizedKeyword)) {
          cust.sms_opt_out = true;
          store.customers.set(id, cust);
          updatedCount += 1;
          action = "opt_out";
        } else if (OPT_IN_WORDS.has(normalizedKeyword)) {
          cust.sms_opt_out = false;
          store.customers.set(id, cust);
          updatedCount += 1;
          action = "opt_in";
        }
      }
    }

    return NextResponse.json({
      ok: true,
      action,
      updatedCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to process inbound SMS";
    return NextResponse.json(
      { error: { code: "SMS_INBOUND_ERROR", message } },
      { status: 400 }
    );
  }
}
