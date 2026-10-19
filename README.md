# ServicePro OS — Field Service & Dispatch Operating System

> **Turnkey Next.js 14 & Supabase Field Service Platform for HVAC, Plumbing, and Electrical Contractors.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff.svg)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-Commercial-green.svg)](docs/HANDOVER.md)

---

## 🌟 Overview

**ServicePro OS** is a complete, full-stack field service management and dispatch system built for service businesses with 2–20 technicians. It replaces fragmented tools (Jobber, Housecall Pro, ServiceTitan) with a single owned software asset.

### 🚀 Key Features & Portals
- **Public Marketing Website (26 Pages):** SEO-optimized service pages, dynamic service area locator, customer reviews, FAQ, pricing, and contact desk.
- **7-Step Customer Booking Wizard:** Diagnostic issue intake, dynamic pricing calculator, calendar slot engine with 10-minute anti-concurrency holds, and Stripe deposit checkout.
- **Owner & Dispatcher Operations (`/admin`):**
  - Interactive Dispatch Board with Drag-and-Drop Kanban, Map, and Day Calendar.
  - Smart Technician Assignment scoring (0–100 pts) based on skills, geography, and real-time workload.
  - Work order ledger, itemized invoice generator, customer CRM, technician roster, and CSV payroll reports.
- **Technician Field PWA (`/tech`):**
  - Mobile-first Progressive Web App designed for iPhone and Android.
  - Turn-by-turn Google/Apple Maps routing, before & after camera photo capture, touchscreen digital signature sign-offs, and in-field parts/materials ledger.
- **Customer Self-Service Portal (`/account`):** Live appointment tracking, past invoice history, saved addresses, and 1-click rebooking.
- **3-Layer Security Architecture:**
  - Centralized CSRF Origin Verification on all API mutations.
  - Sliding-window IP rate limiting (20 req/min for payments/holds; 60 req/min general).
  - HttpOnly, SameSite=Strict cookies with zero client-side `document.cookie` execution.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Components & Route Handlers) |
| **Language** | TypeScript (Strict mode, 100% typed) |
| **Styling** | Tailwind CSS + Radix UI + Lucide Icons |
| **Database & Auth** | Supabase PostgreSQL with Row Level Security (RLS) + In-Process Local Fallback |
| **Payments** | Stripe Checkout, Payment Intents, Customer Portals, and Webhook Idempotency |
| **SMS Notifications** | Twilio 2-Way Dispatch Driver with local console fallback |
| **Testing** | Vitest (112 unit & domain tests) + Playwright (E2E mobile test suite) |

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18.18+ or 20+
- pnpm 9+ (`npm install -g pnpm`)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/masterstech76/servicepro-os.git
cd servicepro-os

# Install dependencies
pnpm install

# Copy environment variables
cp .env.production.example .env.local

# Verify business configuration
pnpm verify-env
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public site or [http://localhost:3000/demo](http://localhost:3000/demo) to explore the interactive role walkthrough.

---

## 🧪 Testing & Verification

```bash
# Run TypeScript typecheck
pnpm typecheck

# Run unit and integration tests (112 tests)
pnpm test

# Run production build
pnpm build
```

---

## 📚 Documentation & Guides

Comprehensive documentation is available in the [`docs/`](docs/) directory:
- [**Client Quickstart Guide**](docs/CLIENT_QUICKSTART.md): Daily operational guide for shop owners and field technicians.
- [**Client Handover Pack**](docs/HANDOVER.md): Account credentials, domain mapping, and monthly infrastructure cost breakdown.
- [**30-Minute Onboarding Runbook**](docs/ONBOARDING.md): Step-by-step setup guide for deploying a new instance with Supabase, Stripe, and Twilio.

---

## 📄 License & Commercial Rights

Commercial Software Asset. Refer to [docs/HANDOVER.md](docs/HANDOVER.md) for licensing and deployment rights.
