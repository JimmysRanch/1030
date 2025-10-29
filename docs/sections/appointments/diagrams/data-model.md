# Data Model (ASCII)

```
+---------------------+
|  appointments       |
|---------------------|
| id uuid PK          |
| client_name text    |
| pet_name text       |
| status text         |
| start_at timestamptz|
| end_at timestamptz  |
| services jsonb      |
| staff_name text     |
| room text           |
| total_due numeric   |
| deposit_due numeric |
| check_in_at timestamptz |
| check_out_at timestamptz|
| source text         |
| notes text          |
+---------------------+
          ^
          | promote from waitlist
          |
+-----------------------------+
| appointment_waitlist        |
|-----------------------------|
| id uuid PK                  |
| client_name text            |
| pet_name text               |
| service text                |
| preferred_start timestamptz |
| channel text                |
| priority text               |
| status text                 |
| requested_at timestamptz    |
| notes text                  |
+-----------------------------+
```
