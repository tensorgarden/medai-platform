# MedAI Platform

**Patient Intake & Clinical Notes Automation — HIPAA-Compliant Healthcare Demo**

---

## Overview

Healthcare administrators face crushing administrative overload — patients waiting, forms piling up, clinical notes backlogged, and compliance deadlines looming. MedAI Platform demonstrates how AI-powered automation transforms these workflows: intelligent patient intake that flags issues before the visit, ambient clinical note generation that captures every encounter, smart appointment scheduling, and prescription tracking — all wrapped in a HIPAA-compliant data handling framework.

This is a portfolio demo repository showcasing modern full-stack healthcare application patterns.

---

## Features

- **AI-Powered Clinical Notes** — Ambient transcription with automatic SOAP note generation, diagnosis coding, and follow-up planning
- **Smart Patient Intake** — Digital intake forms with AI flagging for drug interactions, missing history, and compliance gaps
- **Appointment Management** — Full scheduling lifecycle with real-time status tracking and physician assignment
- **Prescription Tracker** — Active medication monitoring with refill counts, dosage details, and pharmacy routing
- **Clinic Analytics** — Real-time metrics dashboard with trend indicators for patient volume, wait times, and note throughput
- **HIPAA-Compliant Architecture** — Demo of access controls, audit trails, and data minimization patterns

---

## Tech Stack

| Layer       | Technology                                 |
|-------------|--------------------------------------------|
| Framework   | Next.js 15 (App Router)                    |
| Language    | TypeScript 5.7                             |
| Styling     | Tailwind CSS 3.4                           |
| Testing     | Vitest 4.x                                 |
| Linting     | ESLint 9 (flat config)                     |
| AI Backend  | Mock provider (OpenAI/Anthropic ready)     |
| Database    | Supabase (optional, for production)        |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Scripts

| Command           | Description                         |
|-------------------|-------------------------------------|
| `npm run dev`     | Start Next.js dev server            |
| `npm run build`   | Production build                    |
| `npm run lint`    | ESLint with zero warnings           |
| `npm run test`    | Vitest test suite                   |
| `npm run typecheck` | TypeScript type checking          |

---

## Project Structure

```
src/
  app/
    globals.css        — Tailwind base + brand tokens
    layout.tsx         — Root layout with metadata
    page.tsx           — Main dashboard page
  components/ui/
    badge.tsx          — Status/chip badge component
    card.tsx           — Card, CardHeader, CardTitle
    progress-bar.tsx   — Animated progress bar
    status-dot.tsx     — Colored status indicator
    stat-card.tsx      — KPI stat display
  lib/
    types.ts           — TypeScript interfaces
    demo-data.ts       — 12 patients, 15 appointments, 10 clinical notes,
                         intake forms, prescriptions, clinic metrics
tests/
  medai.test.ts        — 20 Vitest assertions across 7 suites
```

---

## Demo Data

The platform ships with realistic demo data:

- **12 patients** across various statuses (active, on-hold, inactive, discharged)
- **15 appointments** spanning checkups, follow-ups, specialist visits, telehealth, and urgent care
- **10 clinical notes** with AI-generated summaries and diagnosis codes
- **5 intake forms** at different completion stages with AI-flagged items
- **13 prescriptions** across active, completed, and discontinued states
- **6 clinic-level metrics** with trend indicators

---

## Compliance Notes

This demo illustrates HIPAA-compliant patterns including:

- Data minimization in UI displays (no full PHI in listings)
- Role-based access simulation through physician assignment
- Audit trail readiness with createdAt timestamps on all records
- Encrypted credentials via `.env` configuration

**This is a demo.** Do not use with real patient data without a full security audit and BAA in place.

---

## License

Private portfolio demo. All rights reserved.
