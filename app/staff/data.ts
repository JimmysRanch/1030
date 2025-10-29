import { getSupabaseClient } from "@/app/lib/supabaseClient";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const TABLES = {
  roster:
    process.env.NEXT_PUBLIC_SUPABASE_STAFF_ROSTER_TABLE ?? "staff_directory",
  schedule:
    process.env.NEXT_PUBLIC_SUPABASE_STAFF_SCHEDULE_TABLE ?? "staff_schedule",
  payroll:
    process.env.NEXT_PUBLIC_SUPABASE_STAFF_PAYROLL_TABLE ?? "staff_payroll",
  performance:
    process.env.NEXT_PUBLIC_SUPABASE_STAFF_PERFORMANCE_TABLE ??
    "staff_performance_reviews",
  onboarding:
    process.env.NEXT_PUBLIC_SUPABASE_STAFF_ONBOARDING_TABLE ??
    "staff_onboarding_checklists",
} as const;

export type StaffRosterMember = {
  id: string;
  name: string;
  role: string | null;
  status: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  specialties: string[];
  certifications: StaffCertification[];
  startDate: string | null;
  lastShiftAt: string | null;
  nextShiftAt: string | null;
  clientsCount: number | null;
  utilization: number | null;
  rating: number | null;
};

export type StaffCertification = {
  name: string;
  status: string | null;
  expiresOn: string | null;
};

export type StaffRosterSummary = {
  total: number;
  active: number;
  onLeave: number;
  onboarding: number;
};

export type StaffShift = {
  id: string;
  staffName: string;
  role: string | null;
  start: string | null;
  end: string | null;
  location: string | null;
  status: string | null;
  service: string | null;
  clients: number | null;
  notes: string | null;
};

export type StaffPayrollRow = {
  id: string;
  staffName: string;
  periodStart: string | null;
  periodEnd: string | null;
  hoursWorked: number | null;
  serviceRevenue: number | null;
  commission: number | null;
  tips: number | null;
  grossPay: number | null;
  status: string | null;
  processedAt: string | null;
};

export type StaffPerformanceRow = {
  id: string;
  staffName: string;
  avgRating: number | null;
  reviewCount: number;
  lastReviewAt: string | null;
  goals: StaffGoal[];
  accolades: string[];
  specialties: string[];
};

export type StaffGoal = {
  title: string;
  progress: number;
};

export type StaffOnboardingRow = {
  id: string;
  staffName: string;
  startDate: string | null;
  mentor: string | null;
  status: string | null;
  checklist: ChecklistItem[];
  notes: string | null;
};

export type ChecklistItem = {
  label: string;
  completed: boolean;
};

const EMPTY_ROSTER_SUMMARY: StaffRosterSummary = {
  total: 0,
  active: 0,
  onLeave: 0,
  onboarding: 0,
};

export async function getStaffRoster(): Promise<{
  staff: StaffRosterMember[];
  summary: StaffRosterSummary;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { staff: [], summary: EMPTY_ROSTER_SUMMARY };
  }

  const { data, error } = await client.from(TABLES.roster).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load staff roster", error);
    return { staff: [], summary: EMPTY_ROSTER_SUMMARY };
  }

  const staff = data.map(mapRosterMember).sort(sortByName);
  const summary = buildRosterSummary(staff);

  return { staff, summary };
}

export async function getStaffSchedule(): Promise<StaffShift[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client.from(TABLES.schedule).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load staff schedule", error);
    return [];
  }

  return data.map(mapShift).sort((a, b) => {
    const aStart = a.start ?? "";
    const bStart = b.start ?? "";
    return aStart.localeCompare(bStart);
  });
}

export async function getStaffPayroll(): Promise<StaffPayrollRow[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client.from(TABLES.payroll).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load staff payroll", error);
    return [];
  }

  return data.map(mapPayrollRow).sort((a, b) => {
    const aPeriod = a.periodEnd ?? a.periodStart ?? "";
    const bPeriod = b.periodEnd ?? b.periodStart ?? "";
    return bPeriod.localeCompare(aPeriod);
  });
}

export async function getStaffPerformance(): Promise<StaffPerformanceRow[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client.from(TABLES.performance).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load staff performance", error);
    return [];
  }

  return data.map(mapPerformanceRow).sort(sortByNamePerformance);
}

export async function getStaffOnboarding(): Promise<StaffOnboardingRow[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client.from(TABLES.onboarding).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load onboarding data", error);
    return [];
  }

  return data.map(mapOnboardingRow).sort((a, b) => {
    const aStart = a.startDate ?? "";
    const bStart = b.startDate ?? "";
    return (aStart || "").localeCompare(bStart || "");
  });
}

function mapRosterMember(row: Record<string, Json>): StaffRosterMember {
  const first = pickString(row, ["first_name", "firstname", "given_name"]);
  const last = pickString(row, ["last_name", "lastname", "family_name"]);
  const full =
    pickString(row, ["full_name", "name", "display_name"]) ||
    [first, last].filter(Boolean).join(" ") ||
    "Unnamed";

  return {
    id: pickString(row, ["id", "staff_id", "uuid"]) || cryptoId(full),
    name: full,
    role: pickString(row, ["role", "title", "position", "job_title"]),
    status:
      pickString(row, ["status", "employment_status", "state"])?.toLowerCase() ||
      null,
    location: pickString(row, ["location", "primary_location", "site"]),
    email: pickString(row, ["email", "contact_email", "work_email"]),
    phone: pickString(row, ["phone", "mobile", "contact_phone", "phone_number"]),
    photoUrl:
      pickString(row, ["photo_url", "avatar_url", "image_url", "headshot"]),
    specialties: pickStringArray(row, ["specialties", "services", "skills"]),
    certifications: normalizeCertifications(
      row.certifications ?? row.licenses ?? row.credentials
    ),
    startDate:
      pickDate(row, ["start_date", "hire_date", "employment_start"]) ?? null,
    lastShiftAt: pickDate(row, ["last_shift_at", "last_shift", "last_seen"]),
    nextShiftAt: pickDate(row, ["next_shift_at", "next_shift", "next_booked"]),
    clientsCount: pickNumber(row, ["clients", "clients_count", "active_clients"]),
    utilization: pickNumber(row, ["utilization", "utilization_rate", "booked_pct"]),
    rating: pickNumber(row, ["rating", "avg_rating", "score"]),
  };
}

function mapShift(row: Record<string, Json>): StaffShift {
  const staffName =
    pickString(row, ["staff_name", "employee_name", "name"]) || "Unassigned";

  return {
    id: pickString(row, ["id", "shift_id", "uuid"]) || cryptoId(staffName),
    staffName,
    role: pickString(row, ["role", "title", "position"]),
    start: pickDate(row, ["start", "start_at", "start_time", "begins_at"]),
    end: pickDate(row, ["end", "end_at", "end_time", "finishes_at"]),
    location: pickString(row, ["location", "site", "room"]),
    status: pickString(row, ["status", "state"]),
    service: pickString(row, ["service", "service_type", "assignment"]),
    clients: pickNumber(row, ["clients", "clients_count", "bookings"]),
    notes: pickString(row, ["notes", "memo", "comment"]),
  };
}

function mapPayrollRow(row: Record<string, Json>): StaffPayrollRow {
  const staffName = pickString(row, ["staff_name", "name", "employee"]);

  return {
    id: pickString(row, ["id", "payroll_id", "uuid"]) || cryptoId(staffName ?? "payroll"),
    staffName: staffName ?? "Unknown",
    periodStart: pickDate(row, ["period_start", "start", "start_date"]),
    periodEnd: pickDate(row, ["period_end", "end", "end_date"]),
    hoursWorked: pickNumber(row, ["hours", "hours_worked", "approved_hours"]),
    serviceRevenue: pickNumber(row, ["service_revenue", "revenue", "sales"]),
    commission: pickNumber(row, ["commission", "commission_total", "commissions"]),
    tips: pickNumber(row, ["tips", "tip_total", "gratuity"]),
    grossPay: pickNumber(row, ["gross_pay", "gross", "total_pay"]),
    status: pickString(row, ["status", "state"]),
    processedAt: pickDate(row, ["processed_at", "approved_at", "paid_at"]),
  };
}

function mapPerformanceRow(row: Record<string, Json>): StaffPerformanceRow {
  const staffName = pickString(row, ["staff_name", "name", "employee_name"]);
  const goals = normalizeGoals(row.goals ?? row.targets ?? row.focus_areas);

  return {
    id: pickString(row, ["id", "review_id", "uuid"]) || cryptoId(staffName ?? "performance"),
    staffName: staffName ?? "Unknown",
    avgRating: pickNumber(row, ["avg_rating", "rating", "score"]),
    reviewCount:
      pickNumber(row, ["reviews", "review_count", "feedback_count"]) ?? goals.length,
    lastReviewAt: pickDate(row, ["last_review_at", "updated_at", "reviewed_at"]),
    goals,
    accolades: pickStringArray(row, ["accolades", "recognition", "shoutouts"]),
    specialties: pickStringArray(row, ["specialties", "services", "skills"]),
  };
}

function mapOnboardingRow(row: Record<string, Json>): StaffOnboardingRow {
  const staffName = pickString(row, ["staff_name", "name", "employee_name"]);

  return {
    id: pickString(row, ["id", "onboarding_id", "uuid"]) || cryptoId(staffName ?? "onboarding"),
    staffName: staffName ?? "Unknown",
    startDate: pickDate(row, ["start_date", "hire_date", "begin_date"]),
    mentor: pickString(row, ["mentor", "coach", "trainer"]),
    status: pickString(row, ["status", "state", "stage"]),
    checklist: normalizeChecklist(row.checklist ?? row.tasks ?? row.requirements),
    notes: pickString(row, ["notes", "memo", "comment"]),
  };
}

function sortByName(a: StaffRosterMember, b: StaffRosterMember) {
  return a.name.localeCompare(b.name);
}

function sortByNamePerformance(a: StaffPerformanceRow, b: StaffPerformanceRow) {
  return a.staffName.localeCompare(b.staffName);
}

function buildRosterSummary(staff: StaffRosterMember[]): StaffRosterSummary {
  const total = staff.length;
  const active = staff.filter(member =>
    (member.status ?? "active").toLowerCase().includes("active")
  ).length;
  const onLeave = staff.filter(member =>
    (member.status ?? "").toLowerCase().includes("leave") ||
    (member.status ?? "").toLowerCase().includes("inactive")
  ).length;
  const onboarding = staff.filter(member =>
    (member.status ?? "").toLowerCase().includes("onboarding") ||
    (member.status ?? "").toLowerCase().includes("training")
  ).length;

  return { total, active, onLeave, onboarding };
}

function pickString(row: Record<string, Json>, keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

function pickNumber(row: Record<string, Json>, keys: string[]): number | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return null;
}

function pickDate(row: Record<string, Json>, keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key];
    const normalized = normalizeDate(value);
    if (normalized) {
      return normalized;
    }
  }
  return null;
}

function normalizeDate(value: Json | undefined): string | null {
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  }
  if (typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return null;
}

function pickStringArray(row: Record<string, Json>, keys: string[]): string[] {
  for (const key of keys) {
    const value = row[key];
    const normalized = normalizeStringArray(value);
    if (normalized.length > 0) {
      return normalized;
    }
  }
  return [];
}

function normalizeStringArray(value: Json | undefined): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeCertifications(value: Json | undefined): StaffCertification[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === "string") {
          return { name: item, status: null, expiresOn: null };
        }
        if (item && typeof item === "object") {
          const record = item as Record<string, Json>;
          return {
            name:
              pickString(record, ["name", "certification", "title"]) ??
              "Certification",
            status: pickString(record, ["status", "state"]),
            expiresOn: pickDate(record, ["expires_on", "expiry", "expires"]),
          };
        }
        return null;
      })
      .filter((item): item is StaffCertification => Boolean(item));
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, Json>).map(([key, entry]) => ({
      name: key,
      status:
        typeof entry === "object" && entry !== null
          ? pickString(entry as Record<string, Json>, ["status", "state"])
          : null,
      expiresOn:
        typeof entry === "object" && entry !== null
          ? pickDate(entry as Record<string, Json>, ["expires_on", "expiry"])
          : null,
    }));
  }

  return [];
}

function normalizeGoals(value: Json | undefined): StaffGoal[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === "string") {
          return { title: item, progress: 0 };
        }
        if (item && typeof item === "object") {
          const record = item as Record<string, Json>;
          return {
            title:
              pickString(record, ["title", "goal", "name"]) ?? "Goal",
            progress:
              pickNumber(record, ["progress", "progress_percent", "pct"]) ?? 0,
          };
        }
        return null;
      })
      .filter((goal): goal is StaffGoal => Boolean(goal));
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, Json>).map(([key, entry]) => ({
      title: key,
      progress:
        typeof entry === "object" && entry !== null
          ? pickNumber(entry as Record<string, Json>, ["progress", "pct"]) ?? 0
          : 0,
    }));
  }

  return [];
}

function normalizeChecklist(value: Json | undefined): ChecklistItem[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === "string") {
          return { label: item, completed: false };
        }
        if (item && typeof item === "object") {
          const record = item as Record<string, Json>;
          const label =
            pickString(record, ["label", "name", "task"]) ?? "Task";
          const completedRaw =
            record.completed ?? record.done ?? record.is_complete;
          const completed =
            typeof completedRaw === "boolean"
              ? completedRaw
              : typeof completedRaw === "string"
              ? ["true", "done", "complete", "yes"].includes(
                  completedRaw.toLowerCase()
                )
              : false;
          return { label, completed };
        }
        return null;
      })
      .filter((item): item is ChecklistItem => Boolean(item));
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, Json>).map(([key, entry]) => ({
      label: startCase(key),
      completed:
        typeof entry === "boolean"
          ? entry
          : typeof entry === "string"
          ? ["true", "done", "complete", "yes"].includes(entry.toLowerCase())
          : false,
    }));
  }

  return [];
}

function startCase(input: string): string {
  return input
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function cryptoId(seed: string): string {
  const base = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 16);
  return `temp-${base}-${Math.random().toString(36).slice(2, 8)}`;
}
