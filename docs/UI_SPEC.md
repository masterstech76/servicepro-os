# ServicePro OS — UI_SPEC.md

Look and feel: **trustworthy, clean, no-nonsense** (Housecall Pro-style). Customers should feel they are booking a legitimate local pro; owners should feel in control; technicians should be able to operate the app one-handed, in sunlight, with gloves nearly on.

Surfaces: **Public booking** (mobile-first, also desktop) · **Admin** (desktop-first, tablet-OK) · **Tech app** (mobile-only PWA, 390×844 baseline).

---

## 1. Design tokens

All colors are CSS variables set from `business.config.ts` (`colors`) in `app/layout.tsx`; Tailwind maps to the variables. Defaults below.

### 1.1 Color

| Token | Hex | Use |
|---|---|---|
| `--navy-900` (primary) | `#0F172A` | Headers, sidebar, primary text on light, dark surfaces |
| `--navy-800` | `#1E293B` | Sidebar hover, cards on dark |
| `--navy-700` | `#334155` | Secondary text on light, borders on dark |
| `--orange-500` (accent) | `#F97316` | Primary CTA fill, active indicators, focus ring |
| `--orange-600` | `#EA580C` | CTA hover |
| `--orange-700` | `#C2410C` | CTA pressed; **orange text/links on white** |
| `--orange-50` | `#FFF7ED` | Selected card background, highlights |
| `--slate-50` | `#F8FAFC` | App background (admin/tech) |
| `--slate-100` | `#F1F5F9` | Kanban column background, table stripes |
| `--slate-200` | `#E2E8F0` | Borders, dividers |
| `--slate-500` | `#64748B` | Muted text (≥ 14px only) |
| `--white` | `#FFFFFF` | Cards, inputs |
| `--success` | `#16A34A` | Paid, completed |
| `--danger` | `#DC2626` | Errors, destructive, SLA-risk |
| `--info` | `#2563EB` | Links in body copy, assigned status |

**Status colors** (used identically in Kanban headers, badges, map pins, calendar events):

| Status | Color | Hex |
|---|---|---|
| Unassigned | Amber | `#F59E0B` |
| Assigned | Blue | `#3B82F6` |
| On The Way | Violet | `#8B5CF6` |
| In Progress | Orange | `#F97316` |
| Completed | Green | `#16A34A` |
| Cancelled | Gray | `#94A3B8` |

**Technician colors** (per tech `color` field, picked from this palette in the CRUD form): `#3B82F6 #14B8A6 #A855F7 #EC4899 #84CC16 #0EA5E9 #F43F5E #EAB308`.

**Contrast rules (important):** white text on `#F97316` is only 2.8:1 and **fails**. Therefore:
- Orange filled buttons use **navy text** (`#0F172A`, ~6.4:1), semibold.
- If a white label is wanted on orange, use `--orange-700` (`#C2410C`, ~5.2:1) as the fill.
- Orange *text* on white uses `--orange-700`, never `--orange-500`, unless ≥ 24px.
- Never convey status by color alone: every status has an icon + text label.
- Any client-supplied brand colors must be run through a contrast check in `business.schema.ts` (fail the build if primary/accent text pairs are < 4.5:1).

### 1.2 Typography — Inter (via `next/font/google`, `display: swap`, weights 400/500/600/700)

| Role | Size / line-height | Weight | Notes |
|---|---|---|---|
| Display (landing hero) | 40/44 desktop, 32/36 mobile | 700 | Tight tracking `-0.02em` |
| H1 (page title) | 28/34 | 700 | |
| H2 (section) | 22/28 | 600 | |
| H3 (card title) | 18/24 | 600 | |
| Body | 16/24 | 400 | **Never below 16px in inputs** (prevents iOS zoom) |
| Small | 14/20 | 400–500 | Meta, helper text |
| Caption | 12/16 | 500 | Badges, table headers (uppercase, `0.04em`) |
| Money / numbers | same as context, `font-variant-numeric: tabular-nums` | | Always tabular in tables, invoices, Kanban cards |
| Tech app base | **+2px** vs. body (18/26) | | Larger by default for field use |

### 1.3 Spacing, radius, elevation
- 4-pt grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Radius: inputs/buttons 10px, cards 14px, sheets/modals 20px top corners, pills 999px.
- Elevation: `shadow-sm` for cards (`0 1px 2px rgba(15,23,42,.06)`), `shadow-md` for drag overlay and popovers (`0 8px 24px rgba(15,23,42,.14)`). No heavy shadows.
- Borders: 1px `--slate-200`.

### 1.4 Sizing & touch
- Minimum tap target **44×44** everywhere; **tech app primary actions 56px tall, full width**.
- Input height 48px (public/tech), 40px (admin tables/filters).
- Bottom action bars respect `env(safe-area-inset-bottom)`.

### 1.5 Breakpoints
`sm 640 · md 768 · lg 1024 · xl 1280`. Public: single column < `md`; Admin: sidebar collapses to icon rail < `lg`, drawer < `md`; Tech app is designed for < `md` and centers a 480px column on larger screens.

### 1.6 Motion
150–200 ms ease-out for state changes; drag overlay scale 1.02 with `shadow-md`; step transitions in the wizard slide 12px + fade. Respect `prefers-reduced-motion` (disable slides, keep fades).

### 1.7 Iconography & imagery
`lucide-react`, 20px default, stroke 2. No stock photos of people in the app; the landing page may use one hero image slot from config. Service categories use icons (snowflake, wrench, bolt, sparkles).

---

## 2. Component library (shadcn/ui, restyled)

Install: `button, input, label, textarea, select, checkbox, radio-group, switch, tabs, dialog, sheet, drawer, dropdown-menu, popover, calendar, badge, card, table, toast(sonner), skeleton, tooltip, separator, scroll-area, form, command`.

Custom components:
- **`Button`**: variants `primary` (orange, navy text), `secondary` (navy fill, white text), `outline`, `ghost`, `destructive`; sizes `md 48`, `sm 40`, `lg 56`; loading state replaces label with spinner and keeps width.
- **`StatusBadge`**: pill, status color at 12% background + 100% text/icon (check contrast ≥ 4.5:1 by darkening text), label + icon.
- **`Money`**: `$1,234.56`, tabular nums; props `cents`, `emphasis`.
- **`JobCard`** (Kanban + lists): see 5.2.
- **`SlotChip`**: 48px tall pill, states default/selected (`orange-50` bg + 2px orange border)/disabled; "Only 2 left" caption in `--danger` text at 12px.
- **`ServiceCard`**: radio-card; icon, name, price, duration, 1-line description.
- **`PhotoUploader`**: 3-column thumbnail grid, "+" tile, progress ring per upload, remove ×.
- **`TipSelector`**: segmented control 15 / 20 / 25 / Custom / No tip, each showing the dollar amount under the percent.
- **`ActionBar`** (tech): sticky bottom, one primary action at a time.
- **`EmptyState` / `ErrorState`**: icon, one sentence, one action (see 8).

---

## 3. Public booking (mobile-first)

**Layout:** header (logo + phone "tap to call") → progress bar → step content → sticky footer with `Back` and primary `Continue` (56px). Target: **60-second booking**; no account creation; autosave wizard state to `sessionStorage` so a refresh doesn't lose progress.

**Progress:** "Step 3 of 7" + 7 segments (orange for done/current). Steps: Service → ZIP → Issue → Time → Details → Pay → Confirmed.

### 3.1 Wireframes (mobile 390 wide)

**Step 1 — Select service**
```
┌──────────────────────────────────┐
│ ❄ Cool Air HVAC        📞 Call   │
│ ▓▓▓▓░░░░░░░░░░░░░░  Step 1 of 7  │
│                                  │
│ What do you need help with?      │
│ ┌──────────────────────────────┐ │
│ │ ❄  AC Repair            $99  │ │
│ │    ~90 min · diagnostic      │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ 🔧 AC Tune-Up           $89  │ │
│ │    ~60 min                   │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ 🌡 Thermostat Install  $149  │ │
│ └──────────────────────────────┘ │
│ (hourly services show "$125/hr,  │
│  1 hr minimum")                  │
│──────────────────────────────────│
│ [        Continue  →           ] │
└──────────────────────────────────┘
```

**Step 2 — ZIP** (single input, numeric keypad, auto-check at 5 digits)
```
│ Where is the job?                │
│ ZIP code  [ 33133            ]   │
│ ✔ Great — we serve Miami, FL     │   (error: ✖ Sorry, we don't serve 90210 yet.
│                                  │          "Call us" + "Notify me" is out of v1)
```

**Step 3 — Describe issue + photo**
```
│ Tell us what's going on          │
│ [ AC is blowing warm air since   │
│   last night…                  ] │  textarea, 500 char counter
│ Add photos (optional, up to 5)   │
│ [📷+] [img] [img]                │
```

**Step 4 — Date & time**
```
│ Pick a time                      │
│ ‹  Tue Oct 21 · Wed 22 · Thu 23 ›│  horizontal day scroller (7 days, swipe)
│ Morning                          │
│ [ 8:00 AM ] [ 9:00 AM ] [10:00 ] │
│ Afternoon                        │
│ [12:00 PM ] [ 1:00 PM ] [ 2:00 ] │
│                  Only 1 left ↑   │
│ Arrival window starts at the     │
│ time shown; we'll text you when  │
│ the tech is on the way.          │
```
No slots for a day → "Fully booked — try {next available day}" link.

**Step 5 — Address & contact**
```
│ Service address                  │
│ [ 123 Brickell Ave…  ⌄ ] (Mapbox │
│   autocomplete; unit field below)│
│ Name [        ] Phone [        ] │
│ Email [                        ] │
```
Address autocomplete must resolve inside the entered ZIP; otherwise inline error "That address isn't in 33133."

**Step 6 — Checkout**
```
│ Your booking                     │
│ AC Repair · Tue Oct 21, 2:00 PM  │
│ 123 Brickell Ave, Miami          │
│ ──────────────────────────────── │
│ Service estimate          $99.00 │
│ Deposit due now (20%)     $19.80 │  ← bold
│ Remaining after the job   $79.20 │
│   + parts/tax if any             │
│ ──────────────────────────────── │
│ [ Stripe Payment Element ]       │  card / Apple Pay / Google Pay
│ ℹ You can add a tip (15/20/25%)  │
│   after the job is done.         │
│ By booking you agree to texts…   │  (consent notice) + Terms link
│ [   Pay $19.80 & Book   🔒    ]  │
│ Hold expires in 09:41            │  countdown; on 0 → "Time expired, pick again"
```

**Step 7 — Confirmation**
```
│        ✔ You're booked!          │
│ Job #1042                        │
│ AC Repair                        │
│ Tue Oct 21 · 2:00 PM             │
│ 123 Brickell Ave, Miami          │
│ We texted a confirmation to      │
│ (305) 555-0142.                  │
│ [ Add to calendar ] [ Call us ]  │
```

### 3.2 States
- Payment error → inline message under the Element, keep inputs, button re-enabled.
- `SLOT_TAKEN` on hold → toast "That time was just taken", return to Step 4 with the day pre-selected.
- Network loss → persistent banner "You're offline".
- Hold expired → modal with "Pick a new time".

### 3.3 Landing page `/`
Hero (headline from config, "Book online in 60 seconds" CTA), service grid, "How it works" (3 steps), trust strip (licensed & insured number from config, review link), footer with hours + phone. No blog, no login link visible (footer text link "Staff login").

### 3.4 `/pay/[token]` (remaining balance)
Invoice summary (line items, deposit credited), TipSelector, Payment Element, "Pay $251.40". Paid state shows receipt + review button.

---

## 4. Admin shell

**Layout (≥ 1024):** left sidebar 240px navy; top bar 56px with page title, date picker (where relevant), alerts bell, user menu.

Sidebar: Dashboard · **Dispatch** · Jobs · Technicians · Services · Service Areas · Customers · Reports · Settings. Active item: orange 3px left bar + `navy-800` bg. Brand logo top-left (config logo, light variant).

### 4.1 Dashboard
```
┌ Today · Tue Oct 21 ───────────────────────────────────────────────────┐
│ [Jobs today 9] [Unassigned 2 ⚠] [In progress 3] [Revenue today $1,240]│
│ ⚠ 2 unassigned jobs start within 2 hours  [Open dispatch →]           │
│ Today's schedule (by tech)         │ Alerts                           │
│ Carlos  8a ▇▇ 10a ▇▇▇ 1p ▇▇        │ • SMS failed: Job #1040          │
│ Danny   9a ▇▇▇ 12p ▇▇              │ • Slot lost refund: #—           │
│ Maria   (off)                      │                                  │
└───────────────────────────────────────────────────────────────────────┘
```

### 4.2 Dispatch — Kanban (primary screen)

View toggle (segmented): **Board · Map · Calendar**. Date picker + "Today" button; filters: technician, service.

```
┌ Dispatch ─ ‹ Tue Oct 21 › [Today]   [Board|Map|Calendar]  Filter ▾ ───────────────────────────────────────────┐
│ UNASSIGNED (2) │ ASSIGNED (3)   │ ON THE WAY (1) │ IN PROGRESS (2) │ COMPLETED (4)                           │
│ amber header   │ blue           │ violet         │ orange          │ green                                    │
│┌─────────────┐ │┌─────────────┐ │┌─────────────┐ │┌─────────────┐  │┌─────────────┐                          │
││#1042 2:00PM │ ││#1039 9:00AM │ ││#1037 8:00AM │ ││#1035 7:30AM │  ││#1030 ✔ $99  │                          │
││AC Repair    │ ││Plumbing Leak│ ││Tune-Up      │ ││Duct Clean   │  ││Paid ● Carlos│                          │
││M. Rivera    │ ││● Carlos     │ ││● Danny      │ ││● Maria      │  │└─────────────┘                          │
││33133  ⚠ <2h │ ││33131        │ ││ETA 12 min   │ ││1h 05m       │  │                                         │
││📷 3         │ │└─────────────┘ │└─────────────┘ │└─────────────┘  │                                         │
│└─────────────┘ │                                                                                              │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Drag to technician:** a **technician rail** sits on the right (collapsible, 220px): one drop target per tech with avatar/color, name, "3 jobs · 5.5 h". While dragging, rail targets show: eligible (green ring), conflict (amber, tooltip "Overlaps #1039"), ineligible (dimmed, tooltip reason). Dropping on an eligible tech assigns; on conflict opens confirm dialog "Force assign?"; on ineligible snaps back with toast.
Dragging between status columns follows the state machine; illegal drops snap back with the rule in the toast. Assigned/On-the-way/In-progress cards show a colored tech dot.

**Job card anatomy (compact, ~260px wide):** top row: `#number` · time (bold) · status icon; line 2: service; line 3: customer name; line 4: ZIP/city + chips: `⚠ <2h` (danger) when unassigned and starting soon, `📷 n`, `💳 Deposit paid`, `Unpaid balance` (completed only). Whole card is the drag handle; click opens the Job Drawer.

**Realtime:** card moves animate (200 ms); a changed card gets a 2-second orange outline pulse; a small "Live" dot in the header (green connected / gray polling).

**Keyboard accessibility (dnd-kit):** focus a card → `Space` to lift → arrow keys to move between columns/tech targets → `Space` to drop → `Esc` to cancel; live-region announcements ("Job 1042 assigned to Carlos").

### 4.3 Dispatch — Map view
```
┌ Map ──────────────────────────────────────────────┬ Jobs list (320px) ┐
│  Mapbox (streets-light style)                     │ filters: status ▾ │
│   ● pins colored by status, numbered by order     │ ┌ #1042 2:00PM  ┐ │
│   tech color ring on assigned pins                │ │ AC Repair     │ │
│   service-area ZIP polygons shaded lightly        │ └───────────────┘ │
│   optional route line per selected tech           │ …                 │
│   cluster bubbles when zoomed out                 │                   │
└───────────────────────────────────────────────────┴───────────────────┘
```
Pin click → popover (number, time, customer, status, **Assign…** dropdown, **Open**). Selecting a tech in the legend filters pins and draws their ordered route. Map and list highlight each other on hover. Default center/zoom from config. Pins for jobs without coordinates are listed in a "Needs address check" banner.

### 4.4 Dispatch — Calendar view
FullCalendar `timeGridDay` / `timeGridWeek` (free plugins only); events colored by **technician** (unassigned = amber hatched), title = `#n service`; drag/resize disabled except **drag to reschedule** (unassigned/assigned only) with confirm dialog showing the SMS that will be sent. Filter by tech with checkbox chips above the calendar.

### 4.5 Job Drawer (right sheet 480px; full-screen sheet on mobile)
Tabs: **Details · Photos · Invoice · History**.
- Header: `#1042` · StatusBadge · (primary actions by status: *Assign* (unassigned), *Mark complete* (in progress), *Send invoice* (completed w/ balance), *Cancel*).
- Details: customer (name, tap-to-call, email), address (+ "Open in Maps"), scheduled window with **Reschedule**, assigned tech selector (with suggest ranking: "Best match · 92"), issue text, internal notes (autosave).
- Photos: Issue / Before / After groups, lightbox with swipe/arrow keys.
- Invoice: line items, subtotal, tax, total, deposit credited, tip, amount due; actions: *Edit* (while draft), *Send invoice*, *Record cash/check*, *Refund*.
- History: `job_events` timeline incl. SMS sent/failed.

### 4.6 Jobs list
Table: #, Date/time, Customer, Service, Tech, Status, Total, Balance. Search box, status/tech/date filters, CSV export. Row click → drawer. Pagination 25/page.

### 4.7 CRUD screens (Technicians, Services, Service Areas, Settings)
- **Pattern:** table + "Add" button → right sheet form (react-hook-form + zod). Inline active toggle. Destructive actions need a confirm dialog and are soft-delete where jobs reference the row.
- **Technicians form:** name, phone, email, skills (multi-select chips), ZIP coverage (chips input; "All service areas" checkbox), commission % (0–100), color swatches, weekly hours grid (Mon–Sun, one start/end per day, "Off" toggle), time-off list (+ add range), "Send invite" button (shows invited/active status).
- **Services form:** name, category, skill tag, pricing type (flat/hourly toggle changes price label to "$/hr"), price, duration, min billable (hourly), deposit override, active.
- **Service Areas:** table of ZIPs (city, surcharge, active) with bulk paste ("33125, 33126, …") and "Add".
- **Settings:** business hours grid, closures calendar, deposit %, tip presets, tax rate + applies-to, cancellation window, buffer/interval. SMS templates shown read-only with variable list.

### 4.8 Reports
Header filters: date presets + custom range. Cards: Revenue, Jobs, Avg ticket, Tips. Tabs: **By technician** (table: jobs, revenue, labor, tips, commission owed + bar chart), **By service** (table + horizontal bar), **By day** (line chart). "Export CSV" per tab. Empty state when no completed jobs in range.

---

## 5. Technician app (mobile PWA, 390×844)

Principles: one primary action per screen state; thumb-reachable (actions in bottom third); high contrast; large type; no hover-only interactions; no hidden gestures.

**Shell:** top bar (business logo small, tech first name, online dot); bottom nav with 2 items in v1: **Today** and **Profile** (sign out, install app hint).

### 5.1 My Jobs Today
```
┌──────────────────────────────────┐
│ Hi Carlos         ● Live         │
│ Tue Oct 21 · 4 jobs              │
│ ┌──────────────────────────────┐ │
│ │ NEXT  8:00 AM       ASSIGNED │ │
│ │ AC Repair                    │ │
│ │ M. Rivera                    │ │
│ │ 📍 123 Brickell Ave · 3.2 mi │ │
│ │ [ Start Route ▶ ]            │ │  ← 56px orange
│ └──────────────────────────────┘ │
│ ┌ 10:30 AM · Tune-Up · Assigned ┐│
│ ┌ 1:00 PM · Thermostat · …      ┐│
│ Completed (1) ▾                  │
└──────────────────────────────────┘
```
Ordered by start time; the first non-completed job is highlighted as **NEXT**. New/changed assignments appear live with a toast and haptic vibration (if supported). Pull-to-refresh. Empty: "No jobs today. Enjoy the day!"

### 5.2 Job detail + action bar
```
┌──────────────────────────────────┐
│ ‹ Today              #1042       │
│ AC Repair          [ASSIGNED]    │
│ 8:00 – 9:30 AM                   │
│ ──────────────────────────────── │
│ M. Rivera              [📞 Call] │
│ 123 Brickell Ave, Miami 33131    │
│ [ 🧭 Navigate ]                  │  opens Google Maps directions deep link
│ ──────────────────────────────── │
│ Issue                            │
│ "AC blowing warm air since…"     │
│ [img][img][img]  (tap to zoom)   │
│ ──────────────────────────────── │
│ Deposit paid $19.80 · Card on file│
├──────────────────────────────────┤
│ [      Start Route ▶          ]  │  sticky ActionBar (56px)
└──────────────────────────────────┘
```

**Action bar by status** (exactly one primary button):
1. `assigned` → **Start Route** → sets *On The Way*, sends SMS, opens Google Maps (`https://www.google.com/maps/dir/?api=1&destination=<lat,lng or address>&travelmode=driving`). Confirm sheet first time: "Text Maria Rivera that you're on the way?" with "Send & go".
2. `on_the_way` → **I've Arrived — Start Job** → *In Progress*, then opens **Before photos** capture.
3. `in_progress` → **Complete Job** → opens the Completion flow.
4. `completed` → **Collect Payment** (if balance) or **Done ✔**.

Secondary actions in a "⋯" menu: Call customer, Text customer (opens `sms:` link), Report a problem (adds a note for owner).

### 5.3 Photo capture
Full-screen sheet; native camera via `<input type="file" accept="image/*" capture="environment">`; grid of thumbnails with upload progress and retry; counter "Before: 2 / min 1"; blocked-state message when required photos are missing ("Add at least 1 after photo to complete").

### 5.4 Completion flow (3 steps, stepper at top)
1. **Work summary:** after photos; notes textarea; for hourly jobs, a "Billable time" stepper (15-min steps, prefilled from timer).
2. **Parts & extras:** list with "Add part" (description, qty, price, taxable switch default on); running totals panel (subtotal, tax, total, deposit credited, **Amount due**).
3. **Collect payment:** big amount-due card; **TipSelector** (15/20/25/Custom/None) updating amount live; payment options as large list buttons:
   - **Charge card on file ••4242** (if available)
   - **Customer pays on this phone** (Payment Element)
   - **Text pay link**
   - **Cash / Check** (amount confirm)
   - **Bill later**
   Success: green check, "Paid $251.40 (tip $43.80)", button **Finish** (sends completed SMS + review link) → back to Today.
   Failure: inline reason, alternative methods remain visible.

### 5.5 Error & offline states
Persistent top banner "No connection — actions paused"; buttons disabled with explanatory text; uploads queue and resume (in-memory only, v1). Session expired → full-screen "Sign in again" preserving the route.

---

## 6. Content & microcopy

- Voice: plain, friendly, specific. "We'll text you when your tech is on the way."
- Money always with cents on invoices (`$19.80`), without cents for whole-dollar marketing prices (`$99`).
- Dates: `Tue, Oct 21` · times `2:00 PM` in the **business timezone**, with tz abbreviation shown only on confirmation ("EDT").
- Errors say what to do next; never expose codes (log them).
- Buttons are verbs: "Continue", "Pay $19.80 & Book", "Start Route", "Complete Job".

## 7. Accessibility

WCAG 2.1 AA target: color contrast per 1.1; visible 3px focus ring (`--orange-500` outline + 2px white offset); all controls reachable and operable by keyboard (including drag-and-drop alternative, 4.2); form labels always visible (no placeholder-only labels); error text linked via `aria-describedby`; status announced with `aria-live="polite"`; images have alt text (customer photos: "Issue photo 1 of 3"); respects reduced motion; minimum touch size 44px; no horizontal scroll at 320px width on public pages.

## 8. Empty / loading / error patterns

- **Loading:** skeletons matching the final layout (cards, table rows); never a blank screen > 300 ms; spinner only inside buttons.
- **Empty:** icon + one sentence + one primary action ("No technicians yet — Add your first technician").
- **Error:** inline for forms; toast for transient failures; full `ErrorState` with "Try again" for failed page loads; global error boundary page branded with config logo.
- **Optimistic UI:** dispatch drag updates instantly, rolls back with toast on server rejection.

## 9. White-label theming rules

- Only these may change per client: logo (light/dark/favicon), `primary`, `accent`, business name, hero image, landing copy. Layout, spacing, type scale, and component behavior stay fixed.
- Status colors and success/danger colors are **not** themable (consistency + accessibility).
- Provide `/public/logo-placeholder.svg`; the logo box is max 160×40 in headers, auto-contained.
- Favicon and PWA icons generated from the config favicon (192/512 PNGs checked into `/public`; document the one-time manual step in `ONBOARDING.md`).

## 10. Deliverable checklist for design QA

1. All screens at 390×844 and 1440×900 with no overflow.
2. Booking flow completable in < 60 s with prefilled test data.
3. Tech flow reachable one-handed (primary action in bottom 40% of screen).
4. Contrast audit passes (axe + manual on orange surfaces).
5. Kanban keyboard drag works and announces moves.
6. Dark mode is **out of scope** for v1.
