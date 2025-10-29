# Data Model (ASCII)

```
+-----------------------+           +-----------------------+
| staff_directory       |<--+    +--| staff_schedule        |
|-----------------------|   |    |  |-----------------------|
| id (PK)               |   |    |  | id (PK)               |
| full_name             |   |    |  | staff_id (FK) --------+
| role                  |   |    |  | start / end           |
| status                |   |    |  | status                |
| start_date            |   |    |  | location/service      |
| next_shift_at         |   |    |  +-----------------------+
| utilization           |   |    |
| ...                   |   |    |  +-----------------------+
+-----------------------+   |    +->| staff_payroll         |
                            |       |-----------------------|
                            |       | id (PK)               |
                            |       | staff_id (FK) --------+
                            |       | period_start/end      |
                            |       | gross_pay             |
                            |       | status/processed_at   |
                            |       +-----------------------+
                            |
                            |       +-----------------------+
                            +-----> | staff_performance_    |
                                    | reviews               |
                                    |-----------------------|
                                    | id (PK)               |
                                    | staff_id (FK) --------+
                                    | avg_rating            |
                                    | goals (jsonb)         |
                                    | accolades (jsonb)     |
                                    +-----------------------+

                            +-----> +-----------------------+
                                    | staff_onboarding_     |
                                    | checklists            |
                                    |-----------------------|
                                    | id (PK)               |
                                    | staff_id (FK) --------+
                                    | status                |
                                    | checklist (jsonb)     |
                                    | mentor                |
                                    +-----------------------+
```
