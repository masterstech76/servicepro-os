# ServicePro OS — Deferred Items

Items explicitly deferred out of scope per `BUILD_PLAN.md` §1 and `PHASES.md`:

- **Multi-tenant SaaS**: Each client receives their own isolated deployment (Vercel + Supabase + Stripe + Twilio + Mapbox) per D1.
- **Native mobile apps**: Technician surface is an installable mobile-first PWA (`/tech`).
- **Recurring maintenance agreements, inventory, QuickBooks sync, payroll export**: Paid add-ons outside v1.
- **Live GPS tracking**: Technician ETA is computed at "Start Route" via Mapbox Matrix / haversine fallback.
- **Stripe Terminal / Tap to Pay**: On-device payment uses Stripe Payment Element or text pay link.
- **Customer self-serve cancel/reschedule & 24h automated reminder SMS**: Out of v1 scope.
- **Dark mode**: Explicitly out of scope for v1 (`UI_SPEC.md` §10.6).
