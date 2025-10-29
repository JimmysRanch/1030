---
title: "Staff Operations"
slug: "staff"
status: "complete"
owner: "Product: Me | Eng: Agent"
routes:
  - "/staff"
  - "/staff/schedule"
  - "/staff/payroll"
  - "/staff/performance"
  - "/staff/onboarding"
updated_at: "2025-10-29T18:05:55Z"
---

# 1. Purpose & Scope
The staff section centralizes every operational workflow related to team members. It mirrors the legacy Vite experience while running entirely in Next.js, fetching live data from Supabase. The scope covers roster management, shift planning, payroll reconciliation, performance tracking, and onboarding. Success is measured by: (1) roster loads under 400 ms P95, (2) zero data mismatches between Supabase and rendered state, and (3) full keyboard accessibility across all tables and cards.

# 2. UX & Layout Spec
## 2.1 Screen Map
- `/staff` — roster dashboard with summary metrics and full table view.
- `/staff/schedule` — grouped shift board with open/confirmed states.
- `/staff/payroll` — payroll run ledger with earnings breakdown.
- `/staff/performance` — review cards showing goals and accolades.
- `/staff/onboarding` — checklist cards monitoring new hire progress.

Diagram reference: ./diagrams/layout-overview.md

## 2.2 Exact Layout Details
- **Grid & breakpoints:**
  - Uses CSS Grid (`.metrics-grid`, `.schedule-grid`, `.performance-grid`, `.onboarding-grid`) with `repeat(auto-fill, minmax())` to fluidly adapt between 320 px cards at `min-width: 220px` and full-width layouts. Panels (`.panel`) respect a 12-column grid on screens ≥ 1280 px with 72 px gutters, collapsing to single column below 960 px.
- **Spacing scale:**
  - Stack gaps: 28 px (`.gap-large`).
  - Panel padding: 22 px desktop, 18 px on inner cards, 16 px cell gutters. Table rows are 72 px tall with 16 px padding.
- **Type scale:**
  - Heading 1: 32 px / 700 weight (`.page-header h1`).
  - Panel titles: 20 px / 600 weight.
  - Metrics values: 30 px / 700 weight.
  - Body copy: 14 px default, 12 px for labels, 11 px uppercase headers.
  - Line height defaults to 1.4 rem via system fonts defined in `app/globals.css`.
- **Color tokens (globals.css):**
  - `--bg` `#0f1115`, `--panel` `#161a22`, `--text` `#e6e8ee`, `--muted` `#9aa4b2`, `--brand` `#4ea1ff`.
  - Status pills map to active (`#7cfed2`), leave (`#ffbb91`), onboarding (`#ffdf7a`), neutral (`#d1d6e3`).
- **Components & props:**
  - `<StaffTabs>` renders five `Link` tabs with `href` and `label`, relying on `usePathname()` for active state.
  - Roster table rows map `StaffRosterMember` fields (name, role, status, specialties array, clientsCount, utilization, email, phone, nextShiftAt, startDate).
  - Schedule cards consume `StaffShift` with `staffName`, `role`, `status`, `location`, `service`, `clients`, `notes`.
  - Payroll rows use `StaffPayrollRow` (`periodStart`, `periodEnd`, `hoursWorked`, `serviceRevenue`, `commission`, `tips`, `grossPay`, `status`, `processedAt`).
  - Performance cards use `StaffPerformanceRow` with nested `goals`, `accolades`, `specialties` arrays.
  - Onboarding cards use `StaffOnboardingRow` plus checklist items.
- **Widget dimensions:**
  - Metrics card min width: 220 px, ideal 320 px, height 188 px.
  - Schedule card min width: 260 px, ideal 280–320 px, height auto with 14 px internal padding. Works for 16:9 screenshot cropping when width ≥ 320 px.
  - Performance / onboarding cards min width: 280 px, ideal 320–360 px.
  - Table min width: 960 px; horizontally scrollable container ensures layout integrity below that width.
- **Interactive states:**
  - Tabs: `:hover` lighten background; `active` state uses brand gradient.
  - Table rows rely on pointer focus highlighting through browser defaults; keyboard focusable via `<table>` semantics.
  - Status pills have semantic color variations but no hover change; they maintain 4.8:1 contrast.
  - Empty states show dashed borders and muted copy for all list views.

## 2.3 Accessibility
- Keyboard map: Tab order flows from global navigation, through `<StaffTabs>`, then into metrics cards and tables. All actionable elements are anchor links or table cells with semantic roles.
- Roles/ARIA: Tables rely on native `<table>` semantics; progress bars include `aria-label`. Status pills are inline text.
- Focus order: Navigation → Tabs → Metrics (reading order) → Primary panels. Table cells remain focusable via screen reader row/column navigation.
- Contrast: Foreground `#e6e8ee` on background `#161a22` yields 8.9:1; status colors meet WCAG AA (≥ 4.5:1).
- Additional: Empty states deliver descriptive text for screen readers; checklists use textual icons `✓/○` with hidden role.

# 3. Workflows
- **Review roster health**
  - Trigger: Manager opens `/staff`.
  - Preconditions: Authenticated manager role, Supabase tables populated.
  - Steps: (1) Request `staff_directory` via `getStaffRoster()`. (2) Aggregate totals client-side. (3) Render metrics and roster table.
  - Data: Read `staff_directory` columns listed in §4.1; no writes.
  - Side effects: None.
  - Error handling: Logging to console; UI shows "Connect Supabase" empty state.
  - Metrics: `roster.load.success` (count), `roster.load.duration_ms` (client span).

- **Plan upcoming shifts**
  - Trigger: Scheduler opens `/staff/schedule`.
  - Preconditions: Authenticated manager; schedule rows exist.
  - Steps: (1) Fetch `staff_schedule`. (2) Group by start date. (3) Compute weekly totals via `computeTotals()`.
  - Data: Read schedule table; derived stats only.
  - Side effects: None.
  - Errors: Console log; empty grid message.
  - Metrics: `schedule.open_shift.count`, `schedule.hours_scheduled`.

- **Reconcile payroll**
  - Trigger: Payroll lead opens `/staff/payroll`.
  - Preconditions: Payroll records exist.
  - Steps: (1) Fetch `staff_payroll`. (2) Sum gross, tips, commission. (3) Render ledger table.
  - Data: Read payroll table; writes performed through Supabase SQL outside UI.
  - Side effects: None.
  - Errors: Same empty state pattern.
  - Metrics: `payroll.pending.count`, `payroll.gross.total`.

- **Assess performance**
  - Trigger: Manager navigates to `/staff/performance`.
  - Preconditions: Performance review rows with `goals` JSON.
  - Steps: (1) Fetch `staff_performance_reviews`. (2) Calculate goal progress. (3) Render cards with chips.
  - Data: Read performance table.
  - Side effects: None.
  - Errors: Empty card message.
  - Metrics: `performance.review.count`, `performance.goal_progress.avg`.

- **Track onboarding**
  - Trigger: People ops reviews `/staff/onboarding`.
  - Preconditions: Onboarding checklist rows exist.
  - Steps: (1) Fetch `staff_onboarding_checklists`. (2) Compute percent complete. (3) Render checklists with progress bar.
  - Data: Read onboarding table.
  - Side effects: None.
  - Errors: Panel-level empty state.
  - Metrics: `onboarding.active.count`, `onboarding.avg_progress`.

# 4. Data & Supabase Schema
## 4.1 Entities & Tables
### staff_directory
- Columns:
  - `id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL`
  - `full_name text NOT NULL` — canonical display name.
  - `first_name text NULL`
  - `last_name text NULL`
  - `role text NULL`
  - `status text NOT NULL DEFAULT 'active'`
  - `location text NULL`
  - `email text NULL`
  - `phone text NULL`
  - `photo_url text NULL`
  - `specialties text[] NOT NULL DEFAULT '{}'`
  - `certifications jsonb NOT NULL DEFAULT '[]'::jsonb`
  - `start_date date NULL`
  - `last_shift_at timestamptz NULL`
  - `next_shift_at timestamptz NULL`
  - `clients_count integer NULL`
  - `utilization numeric NULL`
  - `rating numeric NULL`
  - `inserted_at timestamptz NOT NULL DEFAULT now()`
- Indexes: `staff_directory_status_idx` on `status`; `staff_directory_next_shift_idx` on `next_shift_at` for weekly queries.
- RLS: `Authenticated users using role 'manager' can select`, `service_role` full access. Others denied.
- Triggers: `set_updated_at()` to maintain `updated_at timestamptz` column.
- Example row:
  ```sql
  insert into staff_directory (full_name, role, status, location, email, phone, specialties, start_date)
  values ('Alex Morgan', 'Senior Stylist', 'active', 'Seattle', 'alex@scruffybutts.com', '+1-555-333-2211', '{Color,Extensions}', '2023-02-14');
  ```
- Query pattern:
  ```sql
  select * from staff_directory order by full_name;
  ```

### staff_schedule
- Columns:
  - `id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL`
  - `staff_id uuid NOT NULL REFERENCES staff_directory(id)`
  - `staff_name text NOT NULL`
  - `role text NULL`
  - `location text NULL`
  - `service text NULL`
  - `status text NOT NULL DEFAULT 'scheduled'`
  - `clients integer NULL`
  - `notes text NULL`
  - `start timestamptz NOT NULL`
  - `end timestamptz NULL`
  - `inserted_at timestamptz NOT NULL DEFAULT now()`
- Indexes: `staff_schedule_start_idx` on `start`, `staff_schedule_status_idx` on `status`.
- RLS: Managers (`auth.role() = 'manager'`) select/update, staff (`auth.uid() = staff_id`) select limited columns via view, service_role unrestricted.
- Triggers: `ensure_shift_end_after_start()` to check `end >= start`.
- Example row:
  ```sql
  insert into staff_schedule (staff_id, staff_name, role, start, end, location, status, clients)
  values ('00000000-0000-0000-0000-000000000001', 'Alex Morgan', 'Senior Stylist', '2024-07-01T16:00:00Z', '2024-07-01T23:00:00Z', 'Capitol Hill', 'confirmed', 6);
  ```
- Query pattern: `select * from staff_schedule where start >= now() - interval '7 days';`

### staff_payroll
- Columns:
  - `id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL`
  - `staff_id uuid NOT NULL REFERENCES staff_directory(id)`
  - `staff_name text NOT NULL`
  - `period_start date NOT NULL`
  - `period_end date NOT NULL`
  - `hours_worked numeric(6,2) NULL`
  - `service_revenue numeric(12,2) NULL`
  - `commission numeric(12,2) NULL`
  - `tips numeric(12,2) NULL`
  - `gross_pay numeric(12,2) NOT NULL`
  - `status text NOT NULL DEFAULT 'pending'`
  - `processed_at timestamptz NULL`
  - `inserted_at timestamptz NOT NULL DEFAULT now()`
- Indexes: `staff_payroll_period_idx` on (`period_end`, `period_start`), `staff_payroll_status_idx` on `status`.
- RLS: Managers select/update, service_role full rights, no staff access.
- Triggers: `set_processed_timestamp()` ensures `processed_at = now()` when status transitions to `paid`.
- Example row:
  ```sql
  insert into staff_payroll (staff_id, staff_name, period_start, period_end, hours_worked, service_revenue, commission, tips, gross_pay, status)
  values ('00000000-0000-0000-0000-000000000001', 'Alex Morgan', '2024-06-01', '2024-06-15', 74.5, 11800, 820, 940, 6300, 'processed');
  ```
- Query pattern: `select * from staff_payroll order by period_end desc limit 50;`

### staff_performance_reviews
- Columns:
  - `id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL`
  - `staff_id uuid NOT NULL REFERENCES staff_directory(id)`
  - `staff_name text NOT NULL`
  - `avg_rating numeric(3,2) NULL`
  - `review_count integer NOT NULL DEFAULT 0`
  - `last_review_at timestamptz NULL`
  - `goals jsonb NOT NULL DEFAULT '[]'::jsonb`
  - `accolades jsonb NOT NULL DEFAULT '[]'::jsonb`
  - `specialties text[] NOT NULL DEFAULT '{}'`
  - `inserted_at timestamptz NOT NULL DEFAULT now()`
- Indexes: `staff_performance_staff_idx` on `staff_id`.
- RLS: Managers select/update; staff can select their own rows via `auth.uid()` mapping.
- Triggers: `validate_goals_payload()` ensuring JSON schema compliance.
- Example row:
  ```sql
  insert into staff_performance_reviews (staff_id, staff_name, avg_rating, review_count, last_review_at, goals, accolades, specialties)
  values ('00000000-0000-0000-0000-000000000001', 'Alex Morgan', 4.7, 12, '2024-05-22T19:30:00Z', '[{"title":"Retail attach","progress":72}]', '["Top stylist Q1"]', '{Color,Extensions}');
  ```
- Query pattern: `select * from staff_performance_reviews order by avg_rating desc nulls last;`

### staff_onboarding_checklists
- Columns:
  - `id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL`
  - `staff_id uuid NOT NULL REFERENCES staff_directory(id)`
  - `staff_name text NOT NULL`
  - `start_date date NULL`
  - `mentor text NULL`
  - `status text NOT NULL DEFAULT 'Onboarding'`
  - `checklist jsonb NOT NULL DEFAULT '[]'::jsonb`
  - `notes text NULL`
  - `inserted_at timestamptz NOT NULL DEFAULT now()`
- Indexes: `staff_onboarding_status_idx` on `status`.
- RLS: Managers select/update; mentors (role claim `mentor`) select assigned entries; service_role unrestricted.
- Triggers: `ensure_checklist_json()` verifying array shape.
- Example row:
  ```sql
  insert into staff_onboarding_checklists (staff_id, staff_name, start_date, mentor, status, checklist)
  values ('00000000-0000-0000-0000-000000000002', 'Jamie Chen', '2024-06-10', 'Alex Morgan', 'Active', '[{"label":"Shadow senior stylist","completed":true}]');
  ```
- Query pattern: `select * from staff_onboarding_checklists where status != 'Complete';`

## 4.2 Migrations
- Migration files: `20240613094500_staff_module.sql`
- Diff summary: Creates the five tables above with indexes, defaults, and triggers. Adds helper functions `set_updated_at()`, `ensure_shift_end_after_start()`, `set_processed_timestamp()`, `validate_goals_payload()`, `ensure_checklist_json()`.
- Safety: All tables created with `if not exists` guards; triggers wrap checks in exceptions for invalid payloads. Foreign key references use `on delete cascade` to remove child rows when staff is deleted.
- Verify SQL:
  ```sql
  begin;
  select assert_not_null(column_default) from information_schema.columns where table_name = 'staff_directory' and column_name = 'id';
  select count(*) from pg_indexes where schemaname = 'public' and indexname in (
    'staff_directory_status_idx',
    'staff_schedule_start_idx',
    'staff_payroll_period_idx',
    'staff_performance_staff_idx',
    'staff_onboarding_status_idx'
  );
  select tgname from pg_trigger where tgname = 'set_processed_timestamp';
  rollback;
  ```

# 5. API & Integration Contracts
- Client API (Next.js):
  - `getStaffRoster(): Promise<{ staff: StaffRosterMember[]; summary: StaffRosterSummary }>`
  - `getStaffSchedule(): Promise<StaffShift[]>`
  - `getStaffPayroll(): Promise<StaffPayrollRow[]>`
  - `getStaffPerformance(): Promise<StaffPerformanceRow[]>`
  - `getStaffOnboarding(): Promise<StaffOnboardingRow[]>`
- Each helper selects `*` from its table and maps column variants (camel_case, etc.) to canonical fields, tolerating flexible Supabase column names.
- Realtime: Subscribe via Supabase channel `postgres_changes` on each table (opt-in, not yet wired in UI).
- Webhooks: None.
- Rate limits/timeouts: Supabase default (6 req/s). Avoid exceeding by debouncing manual refresh triggers to once per 10 s.

# 6. State Management & Caching
- Each page is an async server component; data fetched at request time with caching disabled (Supabase client bypass). Use Next.js route segment caching for 30 s if SSR load grows.
- Query keys: If migrating to React Query, use `['staff','roster']`, `['staff','schedule']`, etc., invalidated after Supabase writes.
- No local storage usage.
- Offline: Server-rendered pages degrade gracefully; client only reads static HTML.

# 7. Error Handling & Observability
- Errors from Supabase select log to server console and fall back to empty arrays (`console.error` in `app/staff/data.ts`).
- User messages: Roster table shows "Connect Supabase" copy; other tabs show analog.
- Logging: Add structured logs via Next.js instrumentation to emit `staff.fetch.error` with error message when Supabase errors occur.
- Metrics: Capture fetch duration with `performance.mark` (future). Alerts for `>5` consecutive failures via monitoring stack.

# 8. Security & Privacy
- AuthZ matrix:
  - **Manager**: read/write all tables.
  - **Mentor**: read onboarding entries where `mentor = auth.email()`.
  - **Staff**: read-only self rows from `staff_directory`, `staff_performance_reviews`.
  - **Service role**: full rights for automation.
- PII: Email, phone, payroll numbers are PII; restrict to manager role; encrypt connections via HTTPS only.
- Threats: Prevent ID enumeration by using UUID PKs and RLS. Ensure Supabase anon key is stored server-side (env var) and not leaked to client beyond necessary.

# 9. Test Plan
- **Unit:** Validate `mapRosterMember`, `mapShift`, etc., with representative Supabase payloads.
- **Component:** Snapshot metrics grid with non-empty data; verify empty state render.
- **Integration:** Mock Supabase client to return dataset and assert formatted outputs (`formatUtilization`, `formatTimeRange`).
- **E2E:** Cypress scenario — seed Supabase with fixture rows, navigate to each tab, assert counts and statuses.
- Seed data: Use SQL inserts from §4.1.
- Commands: `npm run typecheck`, `npm run lint` (after ESLint config is initialized), `npm run test` (future Playwright harness).

# 10. Performance Budget
- TTI target: ≤ 2.5 s on 3G. LCP (metrics grid) ≤ 2.0 s.
- Query budgets: Each Supabase select ≤ 120 ms P95 with indexes. Limit schedule fetch to 14 days when dataset grows.
- Known hotspots: `Array.prototype.sort` on large rosters (>500). Mitigation: push ordering to SQL.

# 11. Porting Notes for Native Swift
- Screens map to SwiftUI `NavigationStack` with `TabView` for Roster/Schedule/Payroll/Performance/Onboarding.
- Use `LazyVGrid` for metrics and card grids with adaptive columns (min 220 pt).
- Data models mirror §4.1 tables as Codable structs with `UUID`, `Date`, `Decimal` types.
- Offline sync: Persist Supabase responses in Core Data or SQLite; refresh via background tasks when network resumes.
- Gotchas: Format numbers using `MeasurementFormatter`; watch for timezone conversions on `timestamptz` (use `ISO8601DateFormatter` with `.withInternetDateTime`).

# 12. How-To Guides
- **Create a new staff record**
  1. Open Supabase SQL editor.
  2. Run the insert example from §4.1 to add `staff_directory` row.
  3. Refresh `/staff`; verify metrics update.
  Expected: New roster row with correct status pill.

- **Edit a shift assignment**
  1. Update `staff_schedule` row with new `staff_id`.
  2. Confirm RLS allows manager update.
  3. Reload `/staff/schedule`; card shows new assignee.

- **Resolve payroll "pending" status**
  1. Run `update staff_payroll set status='processed' where id = ?;`.
  2. Trigger `set_processed_timestamp()` to backfill `processed_at`.
  3. Verify `/staff/payroll` shows "Processed" pill.

Diagrams: see ASCII diagrams in `./diagrams/` for layout, widget sizing, workflows, and data model.

# 13. Glossary
- **Roster** — Canonical list of active, inactive, and onboarding staff.
- **Shift** — Scheduled service block with start/end times.
- **Payroll run** — Aggregated earnings for a pay period.
- **Performance review** — Aggregated metrics and goals from feedback cycles.
- **Onboarding checklist** — Task list tracked for a new hire until completion.

# 14. Changelog
- 2025-10-29 — Initial Next.js + Supabase staff documentation package created.

# 15. Swift Implementation Tips
- Use `StaffTabView` containing five `NavigationLink` destinations, each backed by `ObservableObject` store (e.g., `StaffRosterStore`) loading Supabase via `SupabaseClient` Swift SDK.
- Implement `StaffRosterStore` with `@Published var members: [StaffRosterMember]` and async `load()` using `try await supabase.from("staff_directory").select().execute()`.
- Layout metrics grid with `LazyVGrid(columns: [GridItem(.adaptive(minimum: 220))])` and cards using `RoundedRectangle` backgrounds matching brand colors.
- Mirror JSON columns using `Codable` wrappers (`Certification`, `Goal`, `ChecklistItem`).
- Handle errors with `Task` cancellation and present `Alert` on failure; retry by swiping down.
- Testing: Use `XCTest` to inject mock Supabase client returning fixtures; SwiftUI preview data ensures RosterView renders states.
