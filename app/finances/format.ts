const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const preciseCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }
  return currencyFormatter.format(value);
}

export function formatCurrencyPrecise(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }
  return preciseCurrencyFormatter.format(value);
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }
  return numberFormatter.format(value);
}

export function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }
  return `${(value * 100).toFixed(0)}%`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return dateFormatter.format(date);
}

export function formatMonthKey(value: string) {
  const [year, month] = value.split("-");
  if (!year || !month) {
    return value;
  }
  const asDate = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1, 1);
  if (Number.isNaN(asDate.getTime())) {
    return value;
  }
  return monthFormatter.format(asDate);
}

export function formatStatus(value: string | null | undefined) {
  if (!value) {
    return "Unknown";
  }
  return value
    .toLowerCase()
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function invoiceStatusTone(value: string | null | undefined) {
  if (!value) {
    return "status-neutral";
  }
  const normalized = value.toLowerCase();
  if (normalized.includes("paid") || normalized.includes("settled")) {
    return "status-active";
  }
  if (normalized.includes("overdue") || normalized.includes("past due")) {
    return "status-leave";
  }
  if (normalized.includes("pending") || normalized.includes("partial")) {
    return "status-onboarding";
  }
  return "status-neutral";
}

export function expenseStatusTone(value: string | null | undefined) {
  if (!value) {
    return "status-neutral";
  }
  const normalized = value.toLowerCase();
  if (normalized.includes("paid")) {
    return "status-active";
  }
  if (normalized.includes("due")) {
    return "status-onboarding";
  }
  if (normalized.includes("overdue")) {
    return "status-leave";
  }
  return "status-neutral";
}

export function payoutStatusTone(value: string | null | undefined) {
  if (!value) {
    return "status-neutral";
  }
  const normalized = value.toLowerCase();
  if (normalized.includes("paid") || normalized.includes("completed")) {
    return "status-active";
  }
  if (normalized.includes("pending") || normalized.includes("in transit")) {
    return "status-onboarding";
  }
  if (normalized.includes("failed") || normalized.includes("requires")) {
    return "status-leave";
  }
  return "status-neutral";
}
