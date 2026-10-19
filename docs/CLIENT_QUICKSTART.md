# ServicePro OS — Client Quickstart Guide (Owner & Technicians)

---

## Part 1: Owner / Dispatcher Quickstart (`/admin`)

1. **Monitor Today's Operations (`/admin`)**:
   - View today's active jobs, SLA alerts for any job unassigned for >15 minutes, technician field status, and collected revenue.
2. **Assign Jobs on the Dispatch Board (`/admin/dispatch`)**:
   - Switch between **Kanban**, **Map**, and **Day Calendar** views.
   - Click any job card to open the **4-Tab Job Drawer** (*Details*, *Photos*, *Invoice & Pay*, *History*).
   - In the *Details* tab, view **Smart Technician Suggestions (0–100 pts)** ranked by skill match, ZIP coverage, daily workload, and travel distance. Click **Assign** (or **Force Assign** if overriding a schedule conflict).
3. **Manage Invoices, Reschedules & Cancellations**:
   - Reschedule a job window from the *Details* tab.
   - Cancel a job with automatic 24-hour deposit refund policy enforcement (or manual owner override).
   - View or adjust itemized labor/parts invoices and send a customer payment link (`/pay/[token]`).
4. **Track Revenue & Commissions (`/admin/reports`)**:
   - Filter by date range, view revenue by technician, service, and day, and click **Export CSV** for payroll.

---

## Part 2: Field Technician Mobile Quickstart (`/tech`)

1. **Install on Your Phone**:
   - Open `/tech` in Safari (iPhone) or Chrome (Android) and tap **Share → Add to Home Screen**.
2. **Work Your Daily Queue**:
   - Your **Next Up** job appears at the top with 1-tap **Call**, **Navigate (Google Maps)**, and **Open Job** buttons.
3. **3-Tap Job Progression (`/tech/jobs/[id]`)**:
   - **Tap 1 — `Start Drive — On My Way`**: Updates status to `On The Way` and texts the customer your ETA.
   - **Tap 2 — `Arrived — Start Job`**: Marks you on-site (`In Progress`). Upload **Before** and **After** field photos.
   - **Tap 3 — `Complete & Collect Payment`**:
     1. Add any **Parts & Materials** used on the job.
     2. Hand the phone to the customer (or ask) to select a **Tip** (`15%`, `20%`, `25%`, custom, or no tip).
     3. Collect the remaining balance via **Card on File**, **Send Payment Link by SMS**, **Cash**, or **Check**.
