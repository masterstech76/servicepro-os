import "server-only";
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function isRealStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  return (
    (key.startsWith("sk_test_") || key.startsWith("sk_live_")) &&
    !key.includes("placeholder") &&
    key.length > 30
  );
}

export function getStripeClient(): Stripe | null {
  if (!isRealStripeConfigured()) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return stripeInstance;
}

export interface CreateDepositIntentParams {
  holdId: string;
  businessId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  depositCents: number;
}

export async function createDepositPaymentIntent(
  params: CreateDepositIntentParams
): Promise<{
  paymentIntentId: string;
  clientSecret: string;
  stripeCustomerId: string | null;
  mode: "stripe" | "simulated";
}> {
  const stripe = getStripeClient();
  if (!stripe) {
    const paymentIntentId = `pi_sim_${params.holdId}`;
    return {
      paymentIntentId,
      clientSecret: `${paymentIntentId}_secret_sim`,
      stripeCustomerId: `cus_sim_${params.holdId.slice(-8)}`,
      mode: "simulated",
    };
  }

  const customers = await stripe.customers.list({
    email: params.customerEmail,
    limit: 1,
  });

  const customer =
    customers.data[0] ??
    (await stripe.customers.create({
      email: params.customerEmail,
      name: params.customerName,
      phone: params.customerPhone,
      metadata: { business_id: params.businessId },
    }));

  const intent = await stripe.paymentIntents.create(
    {
      amount: params.depositCents,
      currency: "usd",
      customer: customer.id,
      setup_future_usage: "off_session",
      automatic_payment_methods: { enabled: true },
      metadata: {
        hold_id: params.holdId,
        business_id: params.businessId,
        kind: "deposit",
      },
    },
    {
      idempotencyKey: `hold_deposit_${params.holdId}`,
    }
  );

  return {
    paymentIntentId: intent.id,
    clientSecret: intent.client_secret ?? `${intent.id}_secret`,
    stripeCustomerId: customer.id,
    mode: "stripe",
  };
}

export async function chargeCustomerOffSession(params: {
  jobId: string;
  invoiceId: string;
  amountCents: number;
  stripeCustomerId?: string | null;
  stripePaymentMethodId?: string | null;
  simulateAuthRequired?: boolean;
}): Promise<{
  status: "succeeded" | "requires_action";
  paymentIntentId: string;
  fallback?: "link";
}> {
  if (params.simulateAuthRequired) {
    return {
      status: "requires_action",
      paymentIntentId: `pi_auth_req_${params.jobId}`,
      fallback: "link",
    };
  }

  const stripe = getStripeClient();
  if (
    stripe &&
    params.stripeCustomerId &&
    params.stripePaymentMethodId &&
    !params.stripeCustomerId.startsWith("cus_sim_")
  ) {
    try {
      const intent = await stripe.paymentIntents.create(
        {
          amount: params.amountCents,
          currency: "usd",
          customer: params.stripeCustomerId,
          payment_method: params.stripePaymentMethodId,
          off_session: true,
          confirm: true,
          metadata: {
            job_id: params.jobId,
            invoice_id: params.invoiceId,
            kind: "remaining",
          },
        },
        {
          idempotencyKey: `off_session_${params.invoiceId}_${params.amountCents}`,
        }
      );

      if (intent.status === "succeeded") {
        return {
          status: "succeeded",
          paymentIntentId: intent.id,
        };
      }
      return {
        status: "requires_action",
        paymentIntentId: intent.id,
        fallback: "link",
      };
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "authentication_required") {
        return {
          status: "requires_action",
          paymentIntentId: `pi_3ds_${params.invoiceId}`,
          fallback: "link",
        };
      }
      throw err;
    }
  }

  return {
    status: "succeeded",
    paymentIntentId: `pi_cof_${params.jobId}_${Date.now()}`,
  };
}

export async function issueStripeRefund(params: {
  paymentIntentId: string | null;
  amountCents: number;
  reason?: string;
}): Promise<{ refundId: string; mode: "stripe" | "simulated" }> {
  const stripe = getStripeClient();
  if (
    stripe &&
    params.paymentIntentId &&
    params.paymentIntentId.startsWith("pi_") &&
    !params.paymentIntentId.startsWith("pi_fake_") &&
    !params.paymentIntentId.startsWith("pi_sim_") &&
    !params.paymentIntentId.startsWith("pi_demo_")
  ) {
    const refund = await stripe.refunds.create({
      payment_intent: params.paymentIntentId,
      amount: params.amountCents,
      reason: "requested_by_customer",
      metadata: { note: params.reason ?? "ServicePro refund" },
    });
    return { refundId: refund.id, mode: "stripe" };
  }

  return {
    refundId: `re_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    mode: "simulated",
  };
}
