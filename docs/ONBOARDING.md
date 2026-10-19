# ServicePro OS — 30-Minute White-Label Client Onboarding Runbook

This runbook deploys a dedicated, isolated instance of **ServicePro OS** for a new HVAC, plumbing, or electrical client in under 30 minutes (excluding third-party carrier approval windows).

---

## Step 1: Clone & Configure Brand (`5 min`)

1. Create a new repository from the ServicePro OS template:
   ```bash
   git clone <repo-url> client-slug-servicepro
   cd client-slug-servicepro
   pnpm install
   ```
2. Edit `config/business.config.ts` (or copy from `config/examples/ace-plumbing-austin.ts` as a starting template):
   - Set `businessName`, `slug`, `phone`, `email`, `address`, `city`, `state`, and `timezone` (e.g. `America/New_York`, `America/Chicago`).
   - Set `colors.primary` and `colors.accent` (validated automatically by `config/business.schema.ts` for WCAG 4.5:1 contrast).
   - Set `zipCodes`, `hours`, `services` (prices in integer cents), `tax`, and `booking` policies.
3. Place brand assets in `/public/brand/` (`logo.svg`, `favicon.ico`).
4. Validate configuration and contrast rules:
   ```bash
   pnpm verify-env
   ```

---

## Step 2: Provision Supabase Project (`8 min`)

1. Create a new Supabase project in the region closest to the shop (e.g., `us-east-1`).
2. Copy `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` into `.env.local`.
3. Push database migrations (`0001` through `0007`), sync config to the database, and create the initial Owner user:
   ```bash
   supabase db push
   pnpm sync-config
   pnpm create-owner
   ```
4. In **Supabase Dashboard → Authentication → URL Configuration**:
   - Set **Site URL**: `https://book.<client-domain>.com`
   - Add **Redirect URLs**:
     - `https://book.<client-domain>.com/**`
     - `http://localhost:3000/**`

---

## Step 3: Configure Stripe (`7 min`)

1. Create or connect the client's Stripe account.
2. Copy `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` into `.env.local` and Vercel Environment Variables.
3. In **Stripe Dashboard → Developers → Webhooks**, add an endpoint:
   - **Endpoint URL**: `https://book.<client-domain>.com/api/stripe/webhook`
   - **Events to listen to**:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
     - `charge.dispute.created`
4. Copy the signing secret (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`.

---

## Step 4: Configure Twilio SMS & 10DLC (`5 min` setup + carrier approval)

1. Until 10DLC or Toll-Free verification completes, set `SMS_DRIVER=console` so the system logs all SMS messages to `sms_log` without failing.
2. Purchase a local or toll-free number in Twilio and submit A2P 10DLC / Toll-Free verification.
3. Configure Twilio webhook URLs on the phone number:
   - **Inbound Message Webhook (`POST`)**: `https://book.<client-domain>.com/api/sms/inbound`
   - **Delivery Status Callback (`POST`)**: `https://book.<client-domain>.com/api/sms/status`
4. Set `SMS_DRIVER=twilio`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` in Vercel.

---

## Step 5: Configure Mapbox & Deploy to Vercel (`5 min`)

1. Create two Mapbox tokens:
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: Public token restricted to `https://book.<client-domain>.com/*`.
   - `MAPBOX_SERVER_TOKEN`: Secret server token for geocoding and travel matrix scoring.
2. Import the repository into Vercel, paste all environment variables from `.env.example`, and deploy.
3. Point the client's subdomain (`book.<client-domain>.com`) to `cname.vercel-dns.com`.
4. Verify `/api/health` returns `{"ok":true}`.

---

## Known Architectural Limits (`BUILD_PLAN.md` §9 & §23)

- **Single-Business Isolation per Deployment**: Each shop runs its own isolated Supabase + Vercel instance (`D1`).
- **Pooled Slot Capacity**: Slot availability counts eligible technicians minus overlapping jobs and active holds (`slot_capacity`). Exact technician assignment happens on the Owner Dispatch Board (`D6`).
- **14-Day Slot Horizon per Request**: `/api/slots` queries up to 14 days at a time (`maxAdvanceDays` up to 90 days).
