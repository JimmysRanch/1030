# Key Workflows (ASCII)

```
[Manager taps "Check in"]
        |
        v
+----------------------+      +---------------------------+
| Supabase: appointments| --> | UI: Station board updates |
| update status='check-in'    | status pill + timeline    |
+----------------------+      +---------------------------+

[Stylist marks complete]
        |
        v
+----------------------+      +-------------------------------+
| Supabase: appointments| --> | UI: Moves to "Complete" column|
| update status='complete',   | and updates projected revenue |
| set check_out_at=now()      +-------------------------------+
+----------------------+

[Front desk promotes waitlist]
        |
        v
+-----------------------------+      +-----------------------------+
| Supabase: appointments      | <--+ | Supabase: appointment_waitlist|
| insert new row from waitlist|      | update status='scheduled'     |
+-----------------------------+      +-----------------------------+
        |
        v
+-----------------------------+
| UI: Waitlist preview drops  |
| entry and timeline shows new|
| appointment slot            |
+-----------------------------+
```
