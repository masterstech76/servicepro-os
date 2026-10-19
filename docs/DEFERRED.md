# ServicePro OS — Deferred External Account Items

All application code, database migrations, RLS policies, domain engines, API routes,Owner/Tech/Public UIs, and automated unit + E2E tests for Phases 1–5 are complete.

The following external third-party account actions require human credentials/approvals when going live with a production shop:

1. **Twilio A2P 10DLC / Toll-Free Carrier Registration**:
   - Until carrier registration is approved, `SMS_DRIVER=console` is active and records every outbound SMS in `sms_log` and `job_events`.
2. **Live Stripe Account Activation & Webhook Endpoint**:
   - Swap `pk_test_...` / `sk_test_...` for live keys and register `/api/stripe/webhook` in the Stripe Dashboard.
3. **Mapbox Production Token URL Restriction**:
   - Set `NEXT_PUBLIC_MAPBOX_TOKEN` (URL-restricted to production domain) and `MAPBOX_SERVER_TOKEN` in Vercel environment variables.
