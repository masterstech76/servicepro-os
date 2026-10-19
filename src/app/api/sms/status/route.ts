import { NextRequest, NextResponse } from "next/server";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import { saveLocalDbToDisk } from "@/lib/server/local-db-fallback";
import { verifyTwilioWebhookSignature } from "@/lib/server/sms";

export async function POST(req: NextRequest) {
  try {
    let messageSid = "";
    let messageStatus = "";
    const formParams: Record<string, string> = {};

    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = await req.json();
      messageSid = String(json.MessageSid ?? json.messageSid ?? "");
      messageStatus = String(json.MessageStatus ?? json.messageStatus ?? "");
      for (const [k, v] of Object.entries(json)) {
        formParams[k] = String(v ?? "");
      }
    } else {
      const formData = await req.formData();
      formData.forEach((v, k) => {
        formParams[k] = String(v);
      });
      messageSid = String(formData.get("MessageSid") ?? "");
      messageStatus = String(formData.get("MessageStatus") ?? "");
    }

    const signature = req.headers.get("x-twilio-signature");
    const isValidSig = verifyTwilioWebhookSignature({
      signature,
      url: req.url,
      formParams,
    });

    if (!isValidSig) {
      return NextResponse.json(
        { error: { code: "INVALID_SIGNATURE", message: "Invalid X-Twilio-Signature." } },
        { status: 403 }
      );
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

    if (updated) {
      saveLocalDbToDisk(store);
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
