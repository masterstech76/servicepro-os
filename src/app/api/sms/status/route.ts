import { NextRequest, NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

export async function POST(req: NextRequest) {
  try {
    let messageSid = "";
    let messageStatus = "";

    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = await req.json();
      messageSid = String(json.MessageSid ?? json.messageSid ?? "");
      messageStatus = String(json.MessageStatus ?? json.messageStatus ?? "");
    } else {
      const formData = await req.formData();
      messageSid = String(formData.get("MessageSid") ?? "");
      messageStatus = String(formData.get("MessageStatus") ?? "");
    }

    const store = getLocalDbWithDemo();
    let updated = false;

    for (const [id, row] of Array.from(store.sms_log.entries())) {
      if (row.provider_sid === messageSid) {
        row.status = messageStatus || row.status;
        store.sms_log.set(id, row);
        updated = true;
      }
    }

    return NextResponse.json({ ok: true, updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update SMS status";
    return NextResponse.json(
      { error: { code: "SMS_STATUS_ERROR", message } },
      { status: 400 }
    );
  }
}
