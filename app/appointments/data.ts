import { getSupabaseClient } from "@/app/lib/supabaseClient";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const TABLES = {
  appointments:
    process.env.NEXT_PUBLIC_SUPABASE_APPOINTMENTS_TABLE ?? "appointments",
  waitlist:
    process.env.NEXT_PUBLIC_SUPABASE_APPOINTMENT_WAITLIST_TABLE ??
    "appointment_waitlist",
} as const;

export type Appointment = {
  id: string;
  clientName: string;
  petName: string | null;
  status: string | null;
  services: string[];
  serviceSummary: string | null;
  start: string | null;
  end: string | null;
  staff: string | null;
  room: string | null;
  totalDue: number | null;
  depositDue: number | null;
  checkInAt: string | null;
  checkOutAt: string | null;
  source: string | null;
  notes: string | null;
};

export type WaitlistEntry = {
  id: string;
  clientName: string;
  petName: string | null;
  service: string | null;
  preferredStart: string | null;
  channel: string | null;
  priority: string | null;
  status: string | null;
  createdAt: string | null;
  notes: string | null;
};

export type AppointmentSummary = {
  total: number;
  scheduledToday: number;
  checkedIn: number;
  completed: number;
  projectedRevenue: number;
};

export type WaitlistSummary = {
  total: number;
  urgent: number;
  averageLeadMinutes: number;
};

const EMPTY_APPOINTMENT_SUMMARY: AppointmentSummary = {
  total: 0,
  scheduledToday: 0,
  checkedIn: 0,
  completed: 0,
  projectedRevenue: 0,
};

const EMPTY_WAITLIST_SUMMARY: WaitlistSummary = {
  total: 0,
  urgent: 0,
  averageLeadMinutes: 0,
};

export async function getAppointments(): Promise<Appointment[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client.from(TABLES.appointments).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load appointments", error);
    return [];
  }

  return data
    .map(row => mapAppointment(row as Record<string, Json>))
    .sort(sortByStartTime);
}

export function summarizeAppointments(appointments: Appointment[]): AppointmentSummary {
  if (!appointments.length) {
    return EMPTY_APPOINTMENT_SUMMARY;
  }

  const now = new Date();
  const startOfDay = startOfDayUtc(now);
  const endOfDay = endOfDayUtc(now);

  let scheduledToday = 0;
  let checkedIn = 0;
  let completed = 0;
  let projectedRevenue = 0;

  for (const appt of appointments) {
    if (appt.totalDue) {
      projectedRevenue += appt.totalDue;
    }

    const status = (appt.status ?? "").toLowerCase();
    if (status.includes("complete") || status.includes("checkout")) {
      completed += 1;
    }
    if (status.includes("check") && !status.includes("checkout")) {
      checkedIn += 1;
    }

    const start = appt.start ? new Date(appt.start) : null;
    if (start && start >= startOfDay && start <= endOfDay) {
      scheduledToday += 1;
    }
  }

  return {
    total: appointments.length,
    scheduledToday,
    checkedIn,
    completed,
    projectedRevenue,
  };
}

export async function getWaitlist(): Promise<WaitlistEntry[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client.from(TABLES.waitlist).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load appointment waitlist", error);
    return [];
  }

  return data
    .map(row => mapWaitlistEntry(row as Record<string, Json>))
    .sort(sortWaitlist);
}

export function summarizeWaitlist(entries: WaitlistEntry[]): WaitlistSummary {
  if (!entries.length) {
    return EMPTY_WAITLIST_SUMMARY;
  }

  let urgent = 0;
  let totalMinutes = 0;
  let counted = 0;

  for (const entry of entries) {
    const priority = (entry.priority ?? "").toLowerCase();
    if (priority.includes("urgent") || priority.includes("vip")) {
      urgent += 1;
    }

    if (entry.createdAt && entry.preferredStart) {
      const created = new Date(entry.createdAt);
      const preferred = new Date(entry.preferredStart);
      if (!Number.isNaN(created.getTime()) && !Number.isNaN(preferred.getTime())) {
        const diff = (preferred.getTime() - created.getTime()) / (1000 * 60);
        totalMinutes += diff;
        counted += 1;
      }
    }
  }

  return {
    total: entries.length,
    urgent,
    averageLeadMinutes: counted ? Math.max(0, Math.round(totalMinutes / counted)) : 0,
  };
}

function mapAppointment(row: Record<string, Json>): Appointment {
  const clientName =
    pickString(row, ["client_name", "client", "customer", "name"]) ??
    "Walk-in";

  const services = normalizeStringArray(row.services ?? row.service ?? row.line_items);
  const status = pickString(row, ["status", "state"]);

  return {
    id: pickString(row, ["id", "appointment_id", "uuid"]) || cryptoId(clientName),
    clientName,
    petName: pickString(row, ["pet_name", "animal", "pet"]),
    status,
    services,
    serviceSummary:
      pickString(row, ["service_summary", "service", "primary_service"]) ||
      services.join(", ") ||
      null,
    start: pickDate(row, ["start", "start_at", "scheduled_start", "time"]),
    end: pickDate(row, ["end", "end_at", "scheduled_end", "finish"]),
    staff: pickString(row, ["staff", "provider", "assigned_staff", "groomer"]),
    room: pickString(row, ["room", "station", "suite"]),
    totalDue: pickNumber(row, ["total_due", "amount", "total", "price"]),
    depositDue: pickNumber(row, ["deposit_due", "deposit", "deposit_amount"]),
    checkInAt: pickDate(row, ["check_in_at", "checkin", "checked_in_at"]),
    checkOutAt: pickDate(row, ["check_out_at", "checkout", "checked_out_at"]),
    source: pickString(row, ["source", "channel", "origin"]),
    notes: pickString(row, ["notes", "memo", "comment"]),
  };
}

function mapWaitlistEntry(row: Record<string, Json>): WaitlistEntry {
  const clientName =
    pickString(row, ["client_name", "client", "customer", "name"]) ??
    "Unknown";

  return {
    id: pickString(row, ["id", "waitlist_id", "uuid"]) || cryptoId(clientName),
    clientName,
    petName: pickString(row, ["pet_name", "animal", "pet"]),
    service: pickString(row, ["service", "requested_service", "primary_service"]),
    preferredStart: pickDate(row, ["preferred_start", "preferred_time", "desired_at"]),
    channel: pickString(row, ["channel", "source", "origin"]),
    priority: pickString(row, ["priority", "tier"]),
    status: pickString(row, ["status", "state"]),
    createdAt: pickDate(row, ["created_at", "inserted_at", "requested_at"]),
    notes: pickString(row, ["notes", "memo", "comment"]),
  };
}

function startOfDayUtc(date: Date) {
  const copy = new Date(date);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

function endOfDayUtc(date: Date) {
  const copy = new Date(date);
  copy.setUTCHours(23, 59, 59, 999);
  return copy;
}

function sortByStartTime(a: Appointment, b: Appointment) {
  const aStart = a.start ?? "";
  const bStart = b.start ?? "";
  return aStart.localeCompare(bStart);
}

function sortWaitlist(a: WaitlistEntry, b: WaitlistEntry) {
  const aPriority = (a.priority ?? "").toLowerCase();
  const bPriority = (b.priority ?? "").toLowerCase();
  if (aPriority !== bPriority) {
    if (aPriority.includes("urgent")) return -1;
    if (bPriority.includes("urgent")) return 1;
  }
  const aTime = a.createdAt ?? "";
  const bTime = b.createdAt ?? "";
  return aTime.localeCompare(bTime);
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
  if (typeof value === "object") {
    return Object.values(value as Record<string, Json>)
      .map(item => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }
  return [];
}

function cryptoId(seed: string): string {
  const base = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 16);
  return `temp-${base}-${Math.random().toString(36).slice(2, 8)}`;
}
