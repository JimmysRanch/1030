# Key Workflows (ASCII)

```
[Manager Opens Tab]
        |
        v
+----------------------+    +-----------------------+    +------------------------+
| /staff               | -> | Supabase: staff_      | -> | Render Metrics + Table |
| (Roster Dashboard)   |    | directory select      |    | (handle empty/error)   |
+----------------------+    +-----------------------+    +------------------------+
        |
        v
+----------------------+    +-----------------------+    +------------------------+
| /staff/schedule      | -> | Supabase: staff_      | -> | Group by day, compute  |
| (Shift Board)        |    | schedule select       |    | open vs confirmed      |
+----------------------+    +-----------------------+    +------------------------+
        |
        v
+----------------------+    +-----------------------+    +------------------------+
| /staff/payroll       | -> | Supabase: staff_      | -> | Sum gross, tips,       |
| (Payroll Ledger)     |    | payroll select        |    | render ledger + pills  |
+----------------------+    +-----------------------+    +------------------------+
        |
        v
+----------------------+    +-----------------------+    +------------------------+
| /staff/performance   | -> | Supabase: staff_      | -> | Map goals/accolades to |
| (Reviews)            |    | performance_reviews   |    | cards with progress    |
+----------------------+    +-----------------------+    +------------------------+
        |
        v
+----------------------+    +-----------------------+    +------------------------+
| /staff/onboarding    | -> | Supabase: staff_      | -> | Checklist progress     |
| (Checklists)         |    | onboarding_checklists |    | bars + mentors         |
+----------------------+    +-----------------------+    +------------------------+
```
