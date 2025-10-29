---
title: "Appointments"
slug: "appointments"
status: "complete"
owner: "Product: Me | Eng: Agent"
routes:
  - "/appointments"
  - "/appointments/waitlist"
updated_at: "2025-10-29T21:30:00Z"
---

# 1. Purpose & Scope
The appointments section orchestrates the day-of schedule, check-in workflow, and waitlist triage. It replaces the legacy Vite experience with a Next.js server-rendered module that reads directly from Supabase tables. Success is measured by (1) sub-2.2 s LCP on `/appointments`, (2) zero missed check-in updates thanks to live status pills, and (3) the ability for front-desk staff to promote a waitlist guest into the live book in under 10 seconds.

# 2. UX & Layout Spec
## 2.1 Screen Map
- `/appointments` — day-of schedule, station board, and waitlist preview.
- `/appointments/waitlist` — prioritized queue grouped by urgency tiers.

Diagram: [Layout overview](./diagrams/layout-overview.md)

## 2.2 Exact Layout Details
- **Grid & breakpoints**
  - Page stack (`.page-stack`) spaces sections at 28 px; metrics grid uses `repeat(auto-fill, minmax(220px, 1fr))` with 16 px gutters.
  - Timeline rows (`.timeline-row`) render a three-column CSS grid: fixed 120 px time column, fluid body, auto status column. At widths ≤ 900 px it collapses to a single column with the status pill stacked.
  - Station board (`.appointments-board`) uses `repeat(auto-fit, minmax(280px, 1fr))` so each column maintains 280–360 px; below 640 px it becomes a single column stack.
  - Waitlist preview (`.waitlist-preview`) and groups (`.waitlist-groups`) mirror the adaptive grid behaviour with the same 16–20 px spacing.
- **Spacing scale**
  - Page header gap: 16 px between heading copy and metadata (`.page-header`).
  - Panels (`.panel`) padding: 22 px; appointment cards use 14 px internal padding; waitlist cards use 16 px.
  - Timeline row padding: 14 px vertical, 18 px horizontal; metrics cards use 18 px internal padding.
- **Type scale**
  - Page title: 32 px/700 weight (`.page-header h1`).
  - Panel title: 20 px/600 weight; panel subtitle 13 px/400.
  - Metrics value: 30 px/700; metrics label uppercase 12 px with 0.12 em tracking.
  - Timeline client names: 15 px/600; status pills 12 px uppercase.
  - Waitlist notes: 12 px/400 in `#c8d6f2` for contrast against dark background.
- **Color tokens**
  - Root palette from `app/globals.css`: `--bg #0f1115`, `--panel #161a22`, `--text #e6e8ee`, `--muted #9aa4b2`, `--brand #4ea1ff`.
  - Status pills reuse shared tokens: active `#7cfed2`, onboarding `#ffdf7a`, leave `#ffbb91`, neutral `#d1d6e3`.
  - Card backgrounds: schedule board `rgba(12,16,24,0.88)` with `#1a2030` borders.
- **Components & props/state**
  - `<AppointmentsTabs>` renders two `Link` tabs, tracking active state via `usePathname()`.
  - Data helpers in `app/appointments/data.ts`: `getAppointments()`, `getWaitlist()`, `summarizeAppointments()`, `summarizeWaitlist()`. They normalize Supabase payloads into typed objects.
  - Timeline panel maps `Appointment` objects to `<article>` rows with formatted times, staff, and status pill.
  - Station board buckets appointments into arrivals/in-service/completed arrays via `bucketAppointments()` in `page.tsx`.
  - Waitlist preview shows the first three `WaitlistEntry` objects; `/waitlist` groups entries by priority.
- **Widget dimensions** (see [widget sizes](./diagrams/widget-sizes.md))
  - Metrics cards: min 220 px, ideal 280 px, 180 px tall; 18 px border radius.
  - Timeline rows: minimum 640 px width (120 + fluid + 120) with 18 px radius, 92 px vertical height on average.
  - Station board cards: min 260 px width, 164 px tall, 16 px radius.
  - Waitlist cards: min 260 px width, 176 px tall, 18 px radius.
- **Interactive states**
  - Tabs and nav links lighten background and border on hover; active state fills brand gradient.
  - Timeline rows and appointment cards are non-clickable but highlight status via pill classes (`status-active`, etc.).
  - Empty states use dashed borders and muted copy for schedule, timeline, and waitlist containers to keep focus order consistent.

## 2.3 Accessibility
- Keyboard order: global header → appointments tabs → metrics → timeline articles → station board columns → waitlist cards.
- Semantic roles: timeline, appointment, and waitlist items render as `<article>` within sections; waitlist groups use `<header>`/`<footer>` to expose structure to screen readers.
- Status pills rely on text (no icon-only states) and meet ≥4.5:1 contrast on dark backgrounds.
- Focus outlines use browser defaults on interactive elements (tabs, links). Scrollable tab bar exposes a 6 px scrollbar for mouse users.

# 3. Workflows
Diagram: [Key workflows](./diagrams/key-workflows.md)

- **Check in a guest**
  - Trigger: Front desk clicks "Check in" in POS (writes to Supabase).
  - Preconditions: Appointment row exists with status `scheduled`.
  - Steps: (1) `update appointments set status='check-in', check_in_at=now() where id=?`. (2) `getAppointments()` fetches updated row. (3) `bucketAppointments()` moves record into In Service column.
  - Data: Write `appointments.status`, `appointments.check_in_at`.
  - Side effects: None; optional realtime broadcast on `postgres_changes` channel `appointments`.
  - Errors: Failed update logs in server console and timeline falls back to previous state until next poll.
  - Metrics: Emit `appointments.checkin.success` counter and `appointments.checkin.latency_ms` histogram.

- **Complete an appointment**
  - Trigger: Stylist marks job done from service tablet.
  - Preconditions: Appointment `status` includes `check-in` and `check_in_at` is populated.
  - Steps: (1) Supabase RPC `set_status_complete(id uuid)` sets `status='complete'` and `check_out_at=now()`. (2) Next.js fetch recomputes `summarizeAppointments()` to refresh projected revenue. (3) Station board moves card to "Complete" column.
  - Data: Write `appointments.status`, `appointments.check_out_at`; read aggregated revenue from `total_due`.
  - Side effects: Optional push notification to cashier to collect payment.
  - Errors: On Supabase error the UI keeps the card in "In service" with existing status text and logs the failure.
  - Metrics: `appointments.complete.success`, `appointments.projected_revenue.total` gauge.

- **Promote a waitlist guest**
  - Trigger: Front desk promotes entry when slot opens.
  - Preconditions: Entry in `appointment_waitlist` with `status='waiting'`.
  - Steps: (1) Transaction inserts into `appointments` with start/end from waitlist. (2) Update waitlist row `status='scheduled'`. (3) UI fetch sees new appointment, removes preview card, updates waitlist counts.
  - Data: Write `appointments.*`, update `appointment_waitlist.status`.
  - Side effects: Optionally send SMS confirmation via external webhook (future scope).
  - Errors: If transaction fails, entry remains in waitlist with error logged; UI still shows entry in preview.
  - Metrics: `waitlist.promoted.count`, `waitlist.promoted.lead_minutes` (difference between desired start and requested time).

# 4. Data & Supabase Schema
Diagram: [Data model](./diagrams/data-model.md)

## 4.1 Entities & Tables
### appointments
- Columns:
  - `id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL`
  - `client_name text NOT NULL` — owner name surfaced in UI.
  - `pet_name text NULL`
  - `status text NOT NULL DEFAULT 'scheduled'`
  - `start_at timestamptz NOT NULL`
  - `end_at timestamptz NULL`
  - `services jsonb NOT NULL DEFAULT '[]'::jsonb` — list of service labels.
  - `staff_name text NULL`
  - `room text NULL`
  - `total_due numeric(10,2) NULL`
  - `deposit_due numeric(10,2) NULL`
  - `check_in_at timestamptz NULL`
  - `check_out_at timestamptz NULL`
  - `source text NULL`
  - `notes text NULL`
  - `created_at timestamptz NOT NULL DEFAULT now()`
  - `updated_at timestamptz NOT NULL DEFAULT now()`
- Indexes: `appointments_start_idx` on `start_at` for timeline sort; `appointments_status_idx` on `status` for board buckets; `appointments_checkin_idx` on `check_in_at` to query live arrivals.
- RLS policies:
  - Managers (role claim `manager`) `SELECT/INSERT/UPDATE/DELETE`.
  - Front desk (role claim `front_desk`) `SELECT` + `UPDATE status, check_in_at, check_out_at`.
  - Stylists (role claim `stylist`) `SELECT` limited to rows where `staff_name = auth.jwt() ->> 'full_name'`.
  - Service role bypass.
- Triggers/functions:
  - `set_updated_at()` keeps `updated_at` in sync.
  - `set_checkout_timestamp()` sets `check_out_at` automatically when `status` transitions to `complete`.
- Example row:
  ```sql
  insert into appointments (
    client_name, pet_name, status, start_at, end_at, services, staff_name, room,
    total_due, deposit_due, source
  ) values (
    'Jamie Rivera', 'Scout', 'scheduled', '2024-07-01T16:00:00Z', '2024-07-01T17:15:00Z',
    '["Full Groom","Nail Trim"]', 'Alex Morgan', 'Hydro 3', 145.00, 25.00, 'Online'
  );
  ```
- Query pattern:
  ```sql
  select *
  from appointments
  where start_at >= date_trunc('day', now())
  order by start_at asc
  limit 100;
  ```

### appointment_waitlist
- Columns:
  - `id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL`
  - `client_name text NOT NULL`
  - `pet_name text NULL`
  - `service text NOT NULL`
  - `preferred_start timestamptz NULL`
  - `channel text NULL`
  - `priority text NOT NULL DEFAULT 'standard'`
  - `status text NOT NULL DEFAULT 'waiting'`
  - `requested_at timestamptz NOT NULL DEFAULT now()`
  - `notes text NULL`
- Indexes: `appointment_waitlist_priority_idx` on `priority`, `appointment_waitlist_status_idx` on `status`, `appointment_waitlist_requested_idx` on `requested_at` for FIFO ordering.
- RLS policies:
  - Managers full access.
  - Front desk can `INSERT/UPDATE` where `status != 'archived'`.
  - Stylists read-only for entries assigned to them (`notes` may include instructions).
- Triggers: `set_updated_at()` via shared function; `normalize_priority()` lowercases `priority` values before insert.
- Example row:
  ```sql
  insert into appointment_waitlist (
    client_name, pet_name, service, preferred_start, channel, priority, notes
  ) values (
    'Morgan Lee', 'Luna', 'Therapeutic Bath', '2024-07-01T19:00:00Z', 'Phone', 'urgent',
    'Prefers evening slot; high-anxiety pet'
  );
  ```
- Query pattern: `select * from appointment_waitlist where status = 'waiting' order by priority desc, requested_at asc;`

## 4.2 Migrations
- Migration file: `20240614091500_appointments.sql`.
- Diff summary: Creates `appointments` and `appointment_waitlist` tables with indexes, defaults, and triggers above. Registers helper functions `set_checkout_timestamp()` and `normalize_priority()`.
- Safety notes: Migration wraps table creation with `if not exists`; the trigger function guards against null `id` to avoid double inserts. Numeric money columns use `numeric(10,2)` to avoid float rounding.
- Verify SQL:
  ```sql
  begin;
    -- Check primary indexes
    select count(*) from pg_indexes
    where schemaname = 'public'
      and indexname in (
        'appointments_start_idx',
        'appointments_status_idx',
        'appointment_waitlist_status_idx'
      );

    -- Ensure trigger exists
    select tgname from pg_trigger where tgname = 'set_checkout_timestamp';

    -- Confirm priority normalization
    insert into appointment_waitlist (client_name, service, priority)
    values ('Test', 'Nail trim', 'VIP');
    select priority from appointment_waitlist where client_name = 'Test';
    delete from appointment_waitlist where client_name = 'Test';
  rollback;
  ```

# 5. API & Integration Contracts
- Client API:
  - `getAppointments(): Promise<Appointment[]>` — selects `*` and normalizes names, services, and times.
  - `summarizeAppointments(appointments: Appointment[]): AppointmentSummary` — computes totals, checked-in counts, and projected revenue.
  - `getWaitlist(): Promise<WaitlistEntry[]>` — selects `*`, sorts by priority and requested time.
  - `summarizeWaitlist(entries: WaitlistEntry[]): WaitlistSummary` — counts urgent entries and average lead minutes.
- Realtime: subscribe to Supabase `postgres_changes` on `appointments` and `appointment_waitlist` to push updates without refresh.
- Webhooks/cron: none today. Future integration point for SMS confirmations could call Supabase Edge Function `notify_customer`.
- Rate limits/timeouts: Supabase standard (6 req/s). Client fetches both tables in parallel using one request each; throttle manual refresh to every 10 s.

# 6. State Management & Caching
- `/appointments` and `/appointments/waitlist` are async server components; data loads on request without revalidation caching (Supabase client bypasses Next cache).
- If migrating to React Query, use keys `['appointments','all']` and `['appointments','waitlist']`. Invalidate after insert/update operations.
- No localStorage usage. Offline behaviour degrades to last-rendered HTML with stale metrics.

# 7. Error Handling & Observability
- Supabase failures log to server console in `getAppointments()`/`getWaitlist()` and render empty-state messaging.
- User-facing copy: "No appointments scheduled yet." / "Waitlist entries will appear here." ensures clarity.
- Observability: instrument fetch durations with custom span `appointments.fetch` via Next.js instrumentation hook; emit counters for check-in/complete events.
- Alerts: page-level error (HTTP 500) should trigger PagerDuty `appointments-down` service when >3 errors in 5 minutes.

# 8. Security & Privacy
- AuthZ matrix:
  - **Manager**: CRUD on both tables.
  - **Front desk**: Read all, update limited appointment fields (`status`, `check_in_at`, `check_out_at`) and waitlist entries.
  - **Stylist**: Read-only; filtered by staff name.
  - **Service role**: full rights for background automations.
- PII: `client_name`, `pet_name`, `notes`, and monetary fields are PII/financial; restrict to HTTPS and never expose service role keys to client.
- Threat considerations: enforce UUIDs to prevent enumeration, ensure RLS denies cross-role access, sanitize notes to avoid HTML injection in UI (rendered as text).

# 9. Test Plan
- **Unit**: validate `mapAppointment()` and `mapWaitlistEntry()` with mixed-case keys; assert `summarizeAppointments()` handles null totals.
- **Component**: snapshot station board with sample data; verify empty states for timeline and waitlist render correctly.
- **Integration**: stub Supabase client returning fixtures to ensure bucket logic moves cards between columns.
- **E2E**: Cypress flow — seed Supabase with three appointments and two waitlist entries, load `/appointments`, assert counts and status pills; promote waitlist entry via SQL and confirm UI updates after refresh.
- Seed data: use SQL samples in §4.1.
- Commands: `npm run typecheck` plus future Playwright suite `npm run test:e2e` (once harness exists).

# 10. Performance Budget
- Target LCP ≤ 2.2 s (metrics grid), INP ≤ 200 ms for tab clicks.
- Supabase query budget: `appointments` select ≤ 110 ms P95, `appointment_waitlist` ≤ 90 ms P95. Enforce `limit 120` to avoid giant payloads.
- Hotspots: `bucketAppointments()` loops over entire list; push heavy filtering into SQL once dataset exceeds 500 rows.

# 11. Porting Notes for Native Swift
- Layout: Use `NavigationStack` with segmented control for Schedule/Waitlist. Timeline becomes `List` of `TimelineRowView` using `HStack` for time + details.
- Data models: mirror `Appointment` and `WaitlistEntry` as `struct` conforming to `Codable`. Map `services` JSON to `[String]`.
- State: `ObservableObject AppointmentsStore` with `@Published var appointments`, `@Published var waitlist`. Load via Supabase Swift SDK async/await.
- Offline: Cache responses in `FileManager` JSON; refresh on pull-to-refresh. Display stale badge if data older than 10 minutes.
- Gotchas: Convert Supabase `timestamptz` using `ISO8601DateFormatter` with `.withInternetDateTime`. Money columns should use `Decimal` to avoid rounding.

# 12. How-To Guides
- **Create a same-day appointment**
  1. Insert row into `appointments` with desired `start_at` and `services` array.
  2. Reload `/appointments`; new card appears in Arrivals column.
  3. Confirm projected revenue updates.
- **Check in an appointment**
  1. Update `appointments` set `status='check-in', check_in_at=now()` for the row.
  2. Verify timeline row moves to "In service" and status pill turns active green.
  3. Notify stylist of arrival.
- **Promote waitlist guest**
  1. Insert appointment row by copying waitlist data.
  2. Update `appointment_waitlist` entry `status='scheduled'`.
  3. Reload `/appointments`; preview count drops and new slot appears.

# 13. Glossary
- **Check-in** — status representing guest arrival and start of service.
- **Station board** — three-column view of arrivals, active services, and completed checkouts.
- **Projected revenue** — sum of `total_due` across all appointments scheduled today.
- **Lead time** — minutes between waitlist request (`requested_at`) and desired start (`preferred_start`).

# 14. Changelog
- 2025-10-29 — Documented appointments schedule and waitlist module with Supabase schema and workflows.

# 15. Swift Implementation Tips
- Create `AppointmentsView` with `SegmentedControl` binding to `@State var selectedTab` to switch between schedule and waitlist.
- Timeline row: `HStack` containing `VStack` (time), `VStack` (client/service), `StatusPill` component with gradient background matching brand colors.
- Manage state via `@StateObject var store = AppointmentsStore(supabase:)` where `AppointmentsStore.load()` fetches both tables concurrently using `async let`.
- Networking: `let appointments = try await client.from("appointments").select().order("start_at", ascending: true)`; map to domain structs.
- Error handling: wrap fetch in `Task` with `do/catch`; present `Alert` on failure and allow retry.
- Concurrency: annotate UI updates with `@MainActor`; heavy grouping (arrivals/in-service) runs on background `Task` before publishing.
- Testing: use `XCTest` to inject mock Supabase client returning fixture JSON; leverage SwiftUI previews for timeline and waitlist states.
