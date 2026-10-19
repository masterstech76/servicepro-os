import { type NextRequest } from "next/server";
import { updateSessionAndEnforceRoles } from "@/lib/supabase/middleware";
import { verifyCsrfOrigin } from "@/lib/server/csrf";
import { checkRateLimit } from "@/lib/server/rate-limit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Centralized Protection for all API mutation endpoints (~75 routes)
  if (pathname.startsWith("/api/")) {
    const method = request.method.toUpperCase();
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

    // Signature-verified or token-authenticated external endpoints are exempt from CSRF
    const isExternalWebhookOrCron =
      pathname.startsWith("/api/stripe/webhook") ||
      pathname.startsWith("/api/sms/inbound") ||
      pathname.startsWith("/api/sms/status") ||
      pathname.startsWith("/api/cron/");

    if (isMutation && !isExternalWebhookOrCron) {
      // Enforce Cross-Site Request Forgery (CSRF) Origin Verification
      const csrf = verifyCsrfOrigin(request);
      if (!csrf.valid && csrf.response) {
        return csrf.response;
      }

      // Enforce Tiered Rate Limiting per IP
      const isPaymentOrBooking =
        pathname.startsWith("/api/jobs/checkout") ||
        pathname.startsWith("/api/slots/hold") ||
        pathname.startsWith("/api/payments/") ||
        pathname.startsWith("/api/stripe/") ||
        pathname.startsWith("/api/auth/");

      const limit = isPaymentOrBooking ? 20 : 60;
      const keyPrefix = isPaymentOrBooking ? "api_mutation_sensitive" : "api_mutation_general";

      const rl = checkRateLimit(request, { limit, windowMs: 60_000, keyPrefix });
      if (!rl.allowed && rl.response) {
        return rl.response;
      }
    }
  }

  // 2. Role-based portal gatekeeping & Supabase session enforcement
  return updateSessionAndEnforceRoles(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
