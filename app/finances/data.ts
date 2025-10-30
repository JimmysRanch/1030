import { getSupabaseClient } from "@/app/lib/supabaseClient";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

type Row = { [key: string]: Json };

const TABLES = {
  invoices:
    process.env.NEXT_PUBLIC_SUPABASE_FINANCE_INVOICES_TABLE ??
    "finance_invoices",
  expenses:
    process.env.NEXT_PUBLIC_SUPABASE_FINANCE_EXPENSES_TABLE ??
    "finance_expenses",
  payouts:
    process.env.NEXT_PUBLIC_SUPABASE_FINANCE_PAYOUTS_TABLE ??
    "finance_payouts",
} as const;

export type FinanceInvoice = {
  id: string;
  invoiceNumber: string | null;
  clientName: string | null;
  petName: string | null;
  status: string | null;
  issuedOn: string | null;
  dueOn: string | null;
  paidOn: string | null;
  services: string[];
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  balanceDue: number | null;
  paymentMethod: string | null;
  notes: string | null;
  tags: string[];
};

export type FinanceExpense = {
  id: string;
  category: string | null;
  vendor: string | null;
  status: string | null;
  incurredOn: string | null;
  dueOn: string | null;
  paidOn: string | null;
  amount: number | null;
  paymentMethod: string | null;
  notes: string | null;
};

export type FinancePayout = {
  id: string;
  provider: string | null;
  reference: string | null;
  status: string | null;
  payoutDate: string | null;
  gross: number | null;
  fees: number | null;
  net: number | null;
  transactionCount: number | null;
};

export type FinanceInvoiceSummary = {
  total: number;
  collected: number;
  outstanding: number;
  overdue: number;
  invoiceCount: number;
  paidCount: number;
  openCount: number;
  averageInvoice: number;
};

export type FinanceExpenseSummary = {
  total: number;
  count: number;
  upcomingCount: number;
  monthToDate: number;
};

export type FinancePayoutSummary = {
  count: number;
  gross: number;
  fees: number;
  net: number;
  nextPayout: FinancePayout | null;
};

export type ExpenseCategorySummary = {
  category: string;
  total: number;
  count: number;
};

export type CashflowPoint = {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
};

function ensureId(row: Row): string {
  return (
    parseString(row.id) ??
    parseString(row.invoice_id) ??
    parseString(row.invoiceNumber) ??
    parseString(row.invoice_number) ??
    parseString(row.reference) ??
    crypto.randomUUID()
  );
}

function parseString(value: Json): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function parseNumber(value: Json): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.replace(/[$,]/g, "").trim();
    if (!normalized) {
      return null;
    }
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseStringArray(value: Json): string[] {
  if (Array.isArray(value)) {
    return value
      .map(item => parseString(item))
      .filter((item): item is string => Boolean(item));
  }
  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseCount(value: Json): number | null {
  const numeric = parseNumber(value);
  if (numeric === null) {
    return null;
  }
  return Math.max(0, Math.round(numeric));
}

function toInvoice(row: Row): FinanceInvoice {
  const balance =
    parseNumber(row.balance_due) ??
    parseNumber(row.balanceDue) ??
    parseNumber(row.balance) ??
    null;
  const total = parseNumber(row.total) ?? parseNumber(row.total_due) ?? null;
  return {
    id: ensureId(row),
    invoiceNumber:
      parseString(row.invoice_number) ??
      parseString(row.invoiceNumber) ??
      parseString(row.number) ??
      parseString(row.id) ??
      null,
    clientName:
      parseString(row.client_name) ??
      parseString(row.clientName) ??
      parseString(row.customer_name) ??
      null,
    petName: parseString(row.pet_name) ?? parseString(row.petName) ?? null,
    status: parseString(row.status),
    issuedOn:
      parseString(row.issued_on) ??
      parseString(row.issue_date) ??
      parseString(row.issuedOn) ??
      parseString(row.issueDate) ??
      null,
    dueOn:
      parseString(row.due_on) ??
      parseString(row.due_date) ??
      parseString(row.dueOn) ??
      parseString(row.dueDate) ??
      null,
    paidOn:
      parseString(row.paid_on) ??
      parseString(row.paid_at) ??
      parseString(row.paidOn) ??
      parseString(row.paidAt) ??
      null,
    services: parseStringArray(row.services),
    subtotal: parseNumber(row.subtotal),
    tax: parseNumber(row.tax),
    total,
    balanceDue: balance,
    paymentMethod:
      parseString(row.payment_method) ??
      parseString(row.paymentMethod) ??
      parseString(row.method) ??
      null,
    notes: parseString(row.notes),
    tags: parseStringArray(row.tags),
  };
}

function toExpense(row: Row): FinanceExpense {
  return {
    id: ensureId(row),
    category:
      parseString(row.category) ??
      parseString(row.expense_category) ??
      parseString(row.type) ??
      null,
    vendor:
      parseString(row.vendor) ??
      parseString(row.payee) ??
      parseString(row.supplier) ??
      null,
    status: parseString(row.status),
    incurredOn:
      parseString(row.incurred_on) ??
      parseString(row.incurredOn) ??
      parseString(row.expense_date) ??
      parseString(row.recorded_at) ??
      null,
    dueOn:
      parseString(row.due_on) ??
      parseString(row.dueOn) ??
      parseString(row.due_date) ??
      null,
    paidOn:
      parseString(row.paid_on) ??
      parseString(row.paidOn) ??
      parseString(row.paid_at) ??
      null,
    amount: parseNumber(row.amount) ?? parseNumber(row.total),
    paymentMethod:
      parseString(row.payment_method) ??
      parseString(row.paymentMethod) ??
      parseString(row.method) ??
      null,
    notes: parseString(row.notes),
  };
}

function toPayout(row: Row): FinancePayout {
  const gross = parseNumber(row.gross) ?? parseNumber(row.total_gross);
  const fees = parseNumber(row.fees) ?? parseNumber(row.total_fees);
  const net =
    parseNumber(row.net) ??
    parseNumber(row.total_net) ??
    (gross !== null && fees !== null ? gross - fees : null);
  return {
    id: ensureId(row),
    provider:
      parseString(row.provider) ??
      parseString(row.processor) ??
      parseString(row.platform) ??
      null,
    reference:
      parseString(row.reference) ??
      parseString(row.payout_id) ??
      parseString(row.transfer_id) ??
      null,
    status: parseString(row.status),
    payoutDate:
      parseString(row.payout_date) ??
      parseString(row.payoutDate) ??
      parseString(row.arrival_date) ??
      null,
    gross,
    fees,
    net,
    transactionCount:
      parseCount(row.transaction_count) ??
      parseCount(row.transactions) ??
      parseCount(row.count) ??
      null,
  };
}

function sum(values: Array<number | null | undefined>): number {
  let total = 0;
  for (const value of values) {
    total += value ?? 0;
  }
  return total;
}

function isPaid(status: string | null): boolean {
  if (!status) return false;
  const normalized = status.toLowerCase();
  return (
    normalized.includes("paid") ||
    normalized.includes("settled") ||
    normalized.includes("complete")
  );
}

function isOpen(status: string | null): boolean {
  if (!status) return true;
  const normalized = status.toLowerCase();
  if (isPaid(status)) return false;
  if (normalized.includes("void") || normalized.includes("draft")) {
    return false;
  }
  return true;
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isPast(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

function isFuture(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() >= today.getTime();
}

function monthKey(value: string | null): string | null {
  const date = parseDate(value);
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function compareDateAsc(a: string | null, b: string | null) {
  const aValue = a ?? "";
  const bValue = b ?? "";
  return aValue.localeCompare(bValue);
}

function compareDateDesc(a: string | null, b: string | null) {
  const aValue = a ?? "";
  const bValue = b ?? "";
  return bValue.localeCompare(aValue);
}

export async function getFinanceInvoices(): Promise<FinanceInvoice[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client.from(TABLES.invoices).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load finance invoices", error);
    return [];
  }

  return data.map(row => toInvoice(row as Row)).sort((a, b) =>
    compareDateDesc(a.issuedOn, b.issuedOn),
  );
}

export async function getFinanceExpenses(): Promise<FinanceExpense[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client.from(TABLES.expenses).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load finance expenses", error);
    return [];
  }

  return data.map(row => toExpense(row as Row)).sort((a, b) =>
    compareDateDesc(a.incurredOn, b.incurredOn),
  );
}

export async function getFinancePayouts(): Promise<FinancePayout[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client.from(TABLES.payouts).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load finance payouts", error);
    return [];
  }

  return data.map(row => toPayout(row as Row)).sort((a, b) =>
    compareDateDesc(a.payoutDate, b.payoutDate),
  );
}

export function summarizeInvoices(
  invoices: FinanceInvoice[],
): FinanceInvoiceSummary {
  const total = sum(invoices.map(invoice => invoice.total));
  const collected = sum(
    invoices.map(invoice => (isPaid(invoice.status) ? invoice.total : 0)),
  );
  const outstanding = sum(
    invoices.map(invoice => {
      if (invoice.balanceDue !== null) {
        return invoice.balanceDue;
      }
      if (isPaid(invoice.status)) {
        return 0;
      }
      return (invoice.total ?? 0) - collectedShare(invoice);
    }),
  );
  const overdue = invoices.filter(invoice => {
    const dueDate = parseDate(invoice.dueOn);
    const balance = invoice.balanceDue ??
      (isPaid(invoice.status) ? 0 : invoice.total ?? 0);
    return balance > 0 && isPast(dueDate);
  }).length;
  const invoiceCount = invoices.length;
  const paidCount = invoices.filter(invoice => isPaid(invoice.status)).length;
  const openCount = invoices.filter(invoice => isOpen(invoice.status)).length;
  const averageInvoice = invoiceCount ? total / invoiceCount : 0;

  return {
    total,
    collected,
    outstanding,
    overdue,
    invoiceCount,
    paidCount,
    openCount,
    averageInvoice,
  };
}

function collectedShare(invoice: FinanceInvoice): number {
  if (invoice.total === null) {
    return 0;
  }
  if (invoice.balanceDue === null) {
    return isPaid(invoice.status) ? invoice.total : 0;
  }
  const balance = invoice.balanceDue;
  return Math.max(0, invoice.total - balance);
}

export function remainingInvoiceBalance(invoice: FinanceInvoice): number | null {
  if (invoice.balanceDue !== null) {
    return Math.max(0, invoice.balanceDue);
  }
  if (invoice.total === null) {
    return null;
  }
  if (isPaid(invoice.status)) {
    return 0;
  }
  const remaining = invoice.total - collectedShare(invoice);
  return remaining < 0 ? 0 : remaining;
}

export function summarizeExpenses(expenses: FinanceExpense[]): FinanceExpenseSummary {
  const total = sum(expenses.map(expense => expense.amount));
  const count = expenses.length;
  const upcomingCount = expenses.filter(expense => {
    const dueDate = parseDate(expense.dueOn);
    return expense.amount && expense.amount > 0 && isFuture(dueDate);
  }).length;
  const monthToDate = (() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return sum(
      expenses.map(expense => {
        const date = parseDate(expense.incurredOn);
        if (!date) return null;
        if (date.getFullYear() !== currentYear || date.getMonth() !== currentMonth) {
          return null;
        }
        return expense.amount;
      }),
    );
  })();

  return { total, count, upcomingCount, monthToDate };
}

export function summarizePayouts(payouts: FinancePayout[]): FinancePayoutSummary {
  const count = payouts.length;
  const gross = sum(payouts.map(payout => payout.gross));
  const fees = sum(payouts.map(payout => payout.fees));
  const net = sum(payouts.map(payout => payout.net));
  const nextPayout = (() => {
    const upcoming = payouts
      .filter(payout => isFuture(parseDate(payout.payoutDate)))
      .sort((a, b) => compareDateAsc(a.payoutDate, b.payoutDate));
    return upcoming[0] ?? null;
  })();

  return { count, gross, fees, net, nextPayout };
}

export function selectUpcomingReceivables(
  invoices: FinanceInvoice[],
  limit = 5,
): FinanceInvoice[] {
  return invoices
    .filter(invoice => {
      const balance = invoice.balanceDue ??
        (isPaid(invoice.status) ? 0 : invoice.total ?? 0);
      if (!balance || balance <= 0) {
        return false;
      }
      const dueDate = parseDate(invoice.dueOn);
      return !dueDate || !isPast(dueDate);
    })
    .sort((a, b) => compareDateAsc(a.dueOn, b.dueOn))
    .slice(0, limit);
}

export function selectOverdueInvoices(
  invoices: FinanceInvoice[],
  limit = 5,
): FinanceInvoice[] {
  return invoices
    .filter(invoice => {
      const balance = invoice.balanceDue ??
        (isPaid(invoice.status) ? 0 : invoice.total ?? 0);
      if (!balance || balance <= 0) {
        return false;
      }
      const dueDate = parseDate(invoice.dueOn);
      return !!dueDate && isPast(dueDate);
    })
    .sort((a, b) => compareDateAsc(a.dueOn, b.dueOn))
    .slice(0, limit);
}

export function groupExpensesByCategory(
  expenses: FinanceExpense[],
): ExpenseCategorySummary[] {
  const totals = new Map<string, { total: number; count: number }>();

  for (const expense of expenses) {
    const category = (expense.category ?? "Uncategorized").trim() || "Uncategorized";
    const amount = expense.amount ?? 0;
    if (!totals.has(category)) {
      totals.set(category, { total: 0, count: 0 });
    }
    const entry = totals.get(category)!;
    entry.total += amount;
    entry.count += 1;
  }

  return Array.from(totals.entries())
    .map(([category, value]) => ({ category, total: value.total, count: value.count }))
    .sort((a, b) => b.total - a.total);
}

export function buildCashflowTimeline(
  invoices: FinanceInvoice[],
  expenses: FinanceExpense[],
  months = 6,
): CashflowPoint[] {
  const ledger = new Map<string, { revenue: number; expenses: number }>();

  for (const invoice of invoices) {
    const key = monthKey(invoice.issuedOn);
    if (!key) continue;
    if (!ledger.has(key)) {
      ledger.set(key, { revenue: 0, expenses: 0 });
    }
    const entry = ledger.get(key)!;
    entry.revenue += invoice.total ?? 0;
  }

  for (const expense of expenses) {
    const key = monthKey(expense.incurredOn);
    if (!key) continue;
    if (!ledger.has(key)) {
      ledger.set(key, { revenue: 0, expenses: 0 });
    }
    const entry = ledger.get(key)!;
    entry.expenses += expense.amount ?? 0;
  }

  const sorted = Array.from(ledger.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-months);

  return sorted.map(([month, value]) => ({
    month,
    revenue: value.revenue,
    expenses: value.expenses,
    net: value.revenue - value.expenses,
  }));
}
