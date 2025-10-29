# Master Master Index
_Last updated: 2025-10-29T21:11:01.134Z_

## Table of Contents
- [Appointments](#appointments)
  - [1. Purpose & Scope](docs/sections/appointments/MASTER.md#1-purpose-scope)
  - [2. UX & Layout Spec](docs/sections/appointments/MASTER.md#2-ux-layout-spec)
  - [2.1 Screen Map](docs/sections/appointments/MASTER.md#21-screen-map)
  - [2.2 Exact Layout Details](docs/sections/appointments/MASTER.md#22-exact-layout-details)
  - [2.3 Accessibility](docs/sections/appointments/MASTER.md#23-accessibility)
  - [3. Workflows](docs/sections/appointments/MASTER.md#3-workflows)
  - [4. Data & Supabase Schema](docs/sections/appointments/MASTER.md#4-data-supabase-schema)
  - [4.1 Entities & Tables](docs/sections/appointments/MASTER.md#41-entities-tables)
  - [4.2 Migrations](docs/sections/appointments/MASTER.md#42-migrations)
  - [5. API & Integration Contracts](docs/sections/appointments/MASTER.md#5-api-integration-contracts)
  - [6. State Management & Caching](docs/sections/appointments/MASTER.md#6-state-management-caching)
  - [7. Error Handling & Observability](docs/sections/appointments/MASTER.md#7-error-handling-observability)
  - [8. Security & Privacy](docs/sections/appointments/MASTER.md#8-security-privacy)
  - [9. Test Plan](docs/sections/appointments/MASTER.md#9-test-plan)
  - [10. Performance Budget](docs/sections/appointments/MASTER.md#10-performance-budget)
  - [11. Porting Notes for Native Swift](docs/sections/appointments/MASTER.md#11-porting-notes-for-native-swift)
  - [12. How-To Guides](docs/sections/appointments/MASTER.md#12-how-to-guides)
  - [13. Glossary](docs/sections/appointments/MASTER.md#13-glossary)
  - [14. Changelog](docs/sections/appointments/MASTER.md#14-changelog)
  - [15. Swift Implementation Tips](docs/sections/appointments/MASTER.md#15-swift-implementation-tips)
- [Staff Operations](#staff-operations)
  - [1. Purpose & Scope](docs/sections/staff/MASTER.md#1-purpose-scope)
  - [2. UX & Layout Spec](docs/sections/staff/MASTER.md#2-ux-layout-spec)
  - [2.1 Screen Map](docs/sections/staff/MASTER.md#21-screen-map)
  - [2.2 Exact Layout Details](docs/sections/staff/MASTER.md#22-exact-layout-details)
  - [2.3 Accessibility](docs/sections/staff/MASTER.md#23-accessibility)
  - [3. Workflows](docs/sections/staff/MASTER.md#3-workflows)
  - [4. Data & Supabase Schema](docs/sections/staff/MASTER.md#4-data-supabase-schema)
  - [4.1 Entities & Tables](docs/sections/staff/MASTER.md#41-entities-tables)
  - [4.2 Migrations](docs/sections/staff/MASTER.md#42-migrations)
  - [5. API & Integration Contracts](docs/sections/staff/MASTER.md#5-api-integration-contracts)
  - [6. State Management & Caching](docs/sections/staff/MASTER.md#6-state-management-caching)
  - [7. Error Handling & Observability](docs/sections/staff/MASTER.md#7-error-handling-observability)
  - [8. Security & Privacy](docs/sections/staff/MASTER.md#8-security-privacy)
  - [9. Test Plan](docs/sections/staff/MASTER.md#9-test-plan)
  - [10. Performance Budget](docs/sections/staff/MASTER.md#10-performance-budget)
  - [11. Porting Notes for Native Swift](docs/sections/staff/MASTER.md#11-porting-notes-for-native-swift)
  - [12. How-To Guides](docs/sections/staff/MASTER.md#12-how-to-guides)
  - [13. Glossary](docs/sections/staff/MASTER.md#13-glossary)
  - [14. Changelog](docs/sections/staff/MASTER.md#14-changelog)
  - [15. Swift Implementation Tips](docs/sections/staff/MASTER.md#15-swift-implementation-tips)

## Appointments
**Routes:** /appointments, /appointments/waitlist
**Primary entities:** appointments, appointment_waitlist

### Headings
- [1. Purpose & Scope](docs/sections/appointments/MASTER.md#1-purpose-scope)
- [2. UX & Layout Spec](docs/sections/appointments/MASTER.md#2-ux-layout-spec)
  - [2.1 Screen Map](docs/sections/appointments/MASTER.md#21-screen-map)
  - [2.2 Exact Layout Details](docs/sections/appointments/MASTER.md#22-exact-layout-details)
  - [2.3 Accessibility](docs/sections/appointments/MASTER.md#23-accessibility)
- [3. Workflows](docs/sections/appointments/MASTER.md#3-workflows)
- [4. Data & Supabase Schema](docs/sections/appointments/MASTER.md#4-data-supabase-schema)
  - [4.1 Entities & Tables](docs/sections/appointments/MASTER.md#41-entities-tables)
    - [appointments](docs/sections/appointments/MASTER.md#appointments)
    - [appointment_waitlist](docs/sections/appointments/MASTER.md#appointmentwaitlist)
  - [4.2 Migrations](docs/sections/appointments/MASTER.md#42-migrations)
- [5. API & Integration Contracts](docs/sections/appointments/MASTER.md#5-api-integration-contracts)
- [6. State Management & Caching](docs/sections/appointments/MASTER.md#6-state-management-caching)
- [7. Error Handling & Observability](docs/sections/appointments/MASTER.md#7-error-handling-observability)
- [8. Security & Privacy](docs/sections/appointments/MASTER.md#8-security-privacy)
- [9. Test Plan](docs/sections/appointments/MASTER.md#9-test-plan)
- [10. Performance Budget](docs/sections/appointments/MASTER.md#10-performance-budget)
- [11. Porting Notes for Native Swift](docs/sections/appointments/MASTER.md#11-porting-notes-for-native-swift)
- [12. How-To Guides](docs/sections/appointments/MASTER.md#12-how-to-guides)
- [13. Glossary](docs/sections/appointments/MASTER.md#13-glossary)
- [14. Changelog](docs/sections/appointments/MASTER.md#14-changelog)
- [15. Swift Implementation Tips](docs/sections/appointments/MASTER.md#15-swift-implementation-tips)

### Latest Changelog
- 2025-10-29 — Documented appointments schedule and waitlist module with Supabase schema and workflows.

## Staff Operations
**Routes:** /staff, /staff/schedule, /staff/payroll, /staff/performance, /staff/onboarding
**Primary entities:** staff_directory, staff_schedule, staff_payroll

### Headings
- [1. Purpose & Scope](docs/sections/staff/MASTER.md#1-purpose-scope)
- [2. UX & Layout Spec](docs/sections/staff/MASTER.md#2-ux-layout-spec)
  - [2.1 Screen Map](docs/sections/staff/MASTER.md#21-screen-map)
  - [2.2 Exact Layout Details](docs/sections/staff/MASTER.md#22-exact-layout-details)
  - [2.3 Accessibility](docs/sections/staff/MASTER.md#23-accessibility)
- [3. Workflows](docs/sections/staff/MASTER.md#3-workflows)
- [4. Data & Supabase Schema](docs/sections/staff/MASTER.md#4-data-supabase-schema)
  - [4.1 Entities & Tables](docs/sections/staff/MASTER.md#41-entities-tables)
    - [staff_directory](docs/sections/staff/MASTER.md#staffdirectory)
    - [staff_schedule](docs/sections/staff/MASTER.md#staffschedule)
    - [staff_payroll](docs/sections/staff/MASTER.md#staffpayroll)
    - [staff_performance_reviews](docs/sections/staff/MASTER.md#staffperformancereviews)
    - [staff_onboarding_checklists](docs/sections/staff/MASTER.md#staffonboardingchecklists)
  - [4.2 Migrations](docs/sections/staff/MASTER.md#42-migrations)
- [5. API & Integration Contracts](docs/sections/staff/MASTER.md#5-api-integration-contracts)
- [6. State Management & Caching](docs/sections/staff/MASTER.md#6-state-management-caching)
- [7. Error Handling & Observability](docs/sections/staff/MASTER.md#7-error-handling-observability)
- [8. Security & Privacy](docs/sections/staff/MASTER.md#8-security-privacy)
- [9. Test Plan](docs/sections/staff/MASTER.md#9-test-plan)
- [10. Performance Budget](docs/sections/staff/MASTER.md#10-performance-budget)
- [11. Porting Notes for Native Swift](docs/sections/staff/MASTER.md#11-porting-notes-for-native-swift)
- [12. How-To Guides](docs/sections/staff/MASTER.md#12-how-to-guides)
- [13. Glossary](docs/sections/staff/MASTER.md#13-glossary)
- [14. Changelog](docs/sections/staff/MASTER.md#14-changelog)
- [15. Swift Implementation Tips](docs/sections/staff/MASTER.md#15-swift-implementation-tips)

### Latest Changelog
- 2025-10-29 — Initial Next.js + Supabase staff documentation package created.
