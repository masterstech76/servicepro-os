# ServicePro OS — Client Handover Pack

## 1. Accounts Owned by the Client

| Service | Purpose | Client Ownership & Access | Estimated Monthly Cost |
|---|---|---|---|
| **Domain Registrar** | Custom booking domain (`book.<domain>.com`) | Client owns domain & DNS | ~$12 / year |
| **Supabase** | Postgres Database, Auth, Storage (`job-photos`), Realtime | Client organization owner | $0 (Free tier) or $25/mo (Pro) |
| **Stripe** | Deposit checkout, Card-on-file, Hosted invoice pay links | Client bank payout account | 2.9% + 30¢ per card charge |
| **Twilio** | Automated customer SMS alerts (`booked`, `on_the_way`, `completed`) | Client subaccount or direct account | ~$1.15/mo number + $0.0079/SMS |
| **Mapbox** | Address geocoding, travel time matrix, dispatch map | Client token | $0 within free tier (50k loads/mo) |
| **Vercel** | Next.js hosting, edge middleware, daily housekeeping cron | Client team or agency-managed | $0 (Hobby) or $20/mo (Pro) |

---

## 2. Admin & Technician Credentials Handover

- **Owner Portal**: `/admin` (Sign in at `/login`)
- **Dispatch Board**: `/admin/dispatch`
- **Technician Mobile App (PWA)**: `/tech` (Technicians sign in via magic link or credentials and tap **"Add to Home Screen"** on iOS Safari / Android Chrome)
- **Public Customer Booking**: `/book`

---

## 3. Routine Maintenance & Support

- **Updating Prices, Services, or ZIP Codes**:
  - Edit via `/admin/services` and `/admin/service-areas` in the Owner Console, or update `config/business.config.ts` and run `pnpm sync-config`.
- **Adding or Inviting Technicians**:
  - Open `/admin/technicians`, click **Add Technician**, set skills, ZIP coverage, and working hours.
- **Automated Housekeeping**:
  - Expired slot holds are ignored immediately at query time and purged daily at 07:00 UTC via `/api/cron/housekeeping` (`vercel.json`).
