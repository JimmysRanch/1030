---
title: "[SECTION_TITLE]"
slug: "[kebab-section-name]"
status: "complete"          # complete | in-progress | draft
owner: "Product: Me | Eng: Agent"
routes:
  - "/[route-1]"
  - "/[route-2]"
updated_at: "<ISO8601 timestamp>"
---

# 1. Purpose & Scope
Explain what this section does for the app, its domain boundaries, and key success metrics.

# 2. UX & Layout Spec
## 2.1 Screen Map
List pages and states.
Include/link text-based diagram: ./diagrams/layout-overview.md

## 2.2 Exact Layout Details
- Grid/breakpoints
- Spacing scale (px/rem)
- Type scale (font sizes/weights/line-height)
- Color tokens
- Components list with props and state
- Widget dimensions (min/max/ideal), include 16:9 notes where applicable
- Interactive states (hover, focus, disabled, loading, empty, error)
Include/link diagram: ./diagrams/widget-sizes.md

## 2.3 Accessibility
Keyboard nav map, roles, ARIA, focus order, color contrast checks.

# 3. Workflows
For each core task:
- Trigger
- Preconditions
- Steps (numbered)
- Data read/written (by table/column)
- Side effects (realtime, notifications)
- Error handling and retries
- Metrics/events emitted
Include/link diagram: ./diagrams/key-workflows.md

# 4. Data & Supabase Schema
## 4.1 Entities & Tables
Columns with type, pk/fk, default, nullable, description
Indexes and why
RLS policies
Triggers/functions
Example rows (INSERT)
Example SELECT/UPSERT patterns
Include/link diagram: ./diagrams/data-model.md

## 4.2 Migrations
Migration filename(s)
Diff summary
Safety notes
Verify SQL to assert state

# 5. API & Integration Contracts
- Client API surface (function signatures, inputs/outputs)
- Realtime channels
- Webhooks or cron functions
- Rate/limits and timeouts

# 6. State Management & Caching
Query keys, invalidation rules
Local storage usage
Offline behavior

# 7. Error Handling & Observability
- Error taxonomy
- User-facing messages
- Logs/metrics/traces
- Example alerts

# 8. Security & Privacy
- AuthZ matrix (roles vs actions)
- PII handling
- Threat considerations

# 9. Test Plan
- Unit, component, integration, E2E scenarios
- Given/When/Then cases
- Seed data
- Commands to run tests

# 10. Performance Budget
- Target TTI/INP/LCP
- Query budgets and pagination
- Known hotspots and mitigations

# 11. Porting Notes for Native Swift
- View hierarchy mapping to SwiftUI
- Data models and DTOs
- Offline sync hints
- Platform-specific gotchas

# 12. How-To Guides
Task-focused guides:
- “Create X”
- “Edit X”
- “Resolve error Y”
Each shows steps, screenshots, and expected results.

# 13. Glossary
Precise definitions of domain terms used here.

# 14. Changelog
Dated changes since inception.

# 15. Swift Implementation Tips
Explain exactly how to implement the same functionality in Swift:
- SwiftUI components and layout primitives that match this section’s behavior
- State management approach (ObservableObject, @State, @StateObject, @EnvironmentObject, bindings)
- Data models as Swift Codable structs, value semantics, and any DTOs
- Networking/database layer shape to mirror Supabase usage (e.g., Supabase Swift client, async/await patterns)
- Error handling, retries, and task cancellation
- Concurrency notes (MainActor vs background work)
- Testing approach in Swift (View testing, model testing)
Provide short Swift code snippets where useful. No visual mockups.
