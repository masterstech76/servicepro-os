import "server-only";
import twilio from "twilio";
import { businessConfig } from "@config/business.config";
import type { SmsTemplate } from "@/lib/supabase/types";
import { getLocalDb, saveLocalDbToDisk } from "@/lib/server/local-db-fallback";

export interface SendSmsInput {
  to: string;
  template: SmsTemplate;
  vars: Record<string, string | number>;
  jobId?: string | null;
  customerId?: string | null;
}

export interface SendSmsResult {
  sent: boolean;
  optedOut?: boolean;
  provider: "twilio" | "console";
  providerSid: string | null;
  body: string;
}

export function maskPhoneForLogs(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.length < 7) return "***";
  return `${digits.slice(0, 5)}***${digits.slice(-4)}`;
}

/**
 * Renders SMS templates per BUILD_PLAN Section 16 (<= 2 segments each)
 */
export function renderSmsTemplate(
  template: SmsTemplate,
  vars: Record<string, string | number>
): string {
  const biz = String(vars.biz ?? businessConfig.businessName);
  const phone = String(vars.phone ?? businessConfig.phone);
  const n = String(vars.n ?? "1001");

  switch (template) {
    case "booked":
      return `${biz}: You're booked! ${vars.service ?? "Service"} on ${vars.date ?? ""} at ${vars.time ?? ""}. Job #${n}. Questions? Call ${phone}. Reply STOP to opt out.`;
    case "on_the_way":
      return `${biz}: ${vars.techFirst ?? "Your tech"} is on the way to ${vars.addressShort ?? "your address"}. ETA about ${vars.eta ?? 15} min. Job #${n}.`;
    case "completed":
      return `${biz}: Job #${n} is complete. ${vars.balanceLine ?? "Thanks for your payment!"} How did we do? ${vars.reviewUrl ?? businessConfig.sms.reviewUrl}`;
    case "rescheduled":
      return `${biz}: Job #${n} has been rescheduled to ${vars.date ?? ""} at ${vars.time ?? ""}. Questions? Call ${phone}.`;
    case "cancelled":
      return `${biz}: Job #${n} has been cancelled. ${vars.refundNote ?? ""} Questions? Call ${phone}.`.trim();
    case "payment_link":
      return `${biz}: Invoice ${vars.invoiceNumber ?? ""} for Job #${n} is ready. Balance due $${vars.amountDollars ?? "0.00"}: ${vars.payUrl ?? ""}`;
    case "slot_lost":
      return `${biz}: We couldn't confirm your selected time for Job #${n}; your deposit was refunded in full. Please rebook or call ${phone}.`;
  }
}

export function verifyTwilioWebhookSignature(params: {
  signature: string | null;
  url: string;
  formParams: Record<string, string>;
}): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN ?? "";
  if (!authToken || authToken.includes("placeholder") || process.env.NODE_ENV !== "production") {
    return true;
  }
  if (!params.signature) {
    return false;
  }
  return twilio.validateRequest(authToken, params.signature, params.url, params.formParams);
}

export async function sendServiceSms(input: SendSmsInput): Promise<SendSmsResult> {
  const db = getLocalDb();
  const biz = Array.from(db.businesses.values())[0];
  const body = renderSmsTemplate(input.template, input.vars);
  const isRealTwilio =
    process.env.SMS_DRIVER === "twilio" &&
    Boolean(process.env.TWILIO_ACCOUNT_SID?.startsWith("AC")) &&
    Boolean(process.env.TWILIO_AUTH_TOKEN) &&
    Boolean(process.env.TWILIO_FROM_NUMBER);

  const driver: "twilio" | "console" = isRealTwilio ? "twilio" : "console";

  // Check opt-out on customer
  const cust = input.customerId
    ? db.customers.get(input.customerId)
    : Array.from(db.customers.values()).find((c) => c.phone === input.to);

  if (cust?.sms_opt_out) {
    return {
      sent: false,
      optedOut: true,
      provider: driver,
      providerSid: null,
      body,
    };
  }

  let providerSid = `${driver}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  let status = "delivered";
  let errorMsg: string | null = null;

  if (isRealTwilio) {
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
      const statusCallbackUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/sms/status`
        : undefined;
      const msg = await client.messages.create({
        to: input.to,
        from: process.env.TWILIO_FROM_NUMBER!,
        body,
        statusCallback: statusCallbackUrl,
      });
      providerSid = msg.sid;
      status = msg.status ?? "sent";
    } catch (err) {
      status = "failed";
      errorMsg = err instanceof Error ? err.message : "Twilio send error";
    }
  } else if (process.env.NODE_ENV !== "test") {
    // Log with masked phone number (no raw PII in console)
    console.info(
      `[sms:${driver}] template=${input.template} to=${maskPhoneForLogs(input.to)} sid=${providerSid}`
    );
  }

  const logId = `sms_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  db.sms_log.set(logId, {
    id: logId,
    business_id: biz.id,
    job_id: input.jobId ?? null,
    customer_id: cust?.id ?? input.customerId ?? null,
    template: input.template,
    to_phone: input.to,
    body,
    provider: driver,
    provider_sid: providerSid,
    status,
    error: errorMsg,
    created_at: new Date().toISOString(),
  });

  if (input.jobId) {
    const evtId = `evt_sms_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    db.job_events.set(evtId, {
      id: evtId,
      business_id: biz.id,
      job_id: input.jobId,
      actor_id: null,
      actor_label: "system",
      event_type: `sms_${input.template}`,
      from_status: null,
      to_status: null,
      meta: {
        template: input.template,
        to_masked: maskPhoneForLogs(input.to),
        provider: driver,
        provider_sid: providerSid,
        status,
      },
      created_at: new Date().toISOString(),
    });
  }

  saveLocalDbToDisk(db);

  return {
    sent: status !== "failed",
    provider: driver,
    providerSid,
    body,
  };
}
