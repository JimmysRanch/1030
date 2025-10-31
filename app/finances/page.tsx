import {
  buildCashflowTimeline,
  getFinanceExpenses,
  getFinancePayments,
  getFinancePayrollRuns,
  getFinancePayouts,
  getFinanceTaxFilings,
  getFinanceVendors,
  selectOverdueExpenses,
  summarizeExpenses,
  summarizePayments,
  summarizePayroll,
  summarizePayouts,
  summarizeTaxFilings,
  summarizeVendors,
  type CashflowPoint,
} from "./data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatMonthKey,
  formatNumber,
} from "./format";

type PercentChange = {
  label: string;
  trend: "up" | "down" | "flat";
};

type KpiMetric = {
  title: string;
  value: string;
  change: PercentChange;
  tone: "positive" | "negative";
  variant?: "money-in" | "money-out" | "money-left";
};

type ChartGeometry = {
  viewBox: string;
  width: number;
  height: number;
  revenuePath: string;
  expensesPath: string;
  netPath: string;
  zeroLine: number;
};

type QuickActionCard = {
  title: string;
  hint: string;
  value: string;
  href: string;
  action: string;
  valueTone?: "brand" | "warning" | "muted";
  caption?: string;
};

function calculatePercentChange(current: number, previous: number): PercentChange {
  const safeCurrent = Number.isFinite(current) ? current : 0;
  const safePrevious = Number.isFinite(previous) ? previous : 0;

  if (safePrevious === 0) {
    if (safeCurrent === 0) {
      return { label: "0.0% vs previous month", trend: "flat" };
    }
    const trend = safeCurrent > 0 ? "up" : "down";
    const magnitude = 100;
    const prefix = trend === "down" ? "-" : "+";
    return { label: `${prefix}${magnitude.toFixed(1)}% vs previous month`, trend };
  }

  const change = ((safeCurrent - safePrevious) / Math.abs(safePrevious)) * 100;
  const trend = change === 0 ? "flat" : change > 0 ? "up" : "down";
  const formatted = `${change >= 0 ? "+" : ""}${change.toFixed(1)}% vs previous month`;
  return { label: formatted, trend };
}

function createChartGeometry(points: CashflowPoint[]): ChartGeometry {
  const width = 720;
  const height = 260;
  const padding = { top: 28, right: 36, bottom: 40, left: 48 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  if (!points.length) {
    const zero = padding.top + innerHeight;
    return {
      viewBox: `0 0 ${width} ${height}`,
      width,
      height,
      revenuePath: "",
      expensesPath: "",
      netPath: "",
      zeroLine: zero,
    };
  }

  const values = points.flatMap(point => [point.revenue ?? 0, point.expenses ?? 0, point.net ?? 0]);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  const step = points.length > 1 ? innerWidth / (points.length - 1) : 0;

  const mapX = (index: number) => padding.left + step * index;
  const mapY = (value: number | null | undefined) => {
    const resolved = Number.isFinite(value) ? (value as number) : 0;
    const normalized = (resolved - minValue) / range;
    return padding.top + innerHeight - normalized * innerHeight;
  };

  const buildPath = (key: "revenue" | "expenses" | "net") =>
    points
      .map((point, index) => {
        const command = index === 0 ? "M" : "L";
        return `${command}${mapX(index)} ${mapY(point[key])}`;
      })
      .join(" ");

  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    revenuePath: buildPath("revenue"),
    expensesPath: buildPath("expenses"),
    netPath: buildPath("net"),
    zeroLine: mapY(0),
  };
}

export default async function Page() {
  const [expenses, payouts, payments, payrollRuns, taxFilings, vendors] = await Promise.all([
    getFinanceExpenses(),
    getFinancePayouts(),
    getFinancePayments(),
    getFinancePayrollRuns(),
    getFinanceTaxFilings(),
    getFinanceVendors(),
  ]);

  const expenseSummary = summarizeExpenses(expenses);
  const payoutSummary = summarizePayouts(payouts);
  const paymentSummary = summarizePayments(payments);
  const payrollSummary = summarizePayroll(payrollRuns);
  const taxSummary = summarizeTaxFilings(taxFilings);
  const vendorSummary = summarizeVendors(vendors);
  const overdueExpenses = selectOverdueExpenses(expenses);
  const overdueBalance = overdueExpenses.reduce((total, expense) => {
    return total + (expense.amount ?? 0);
  }, 0);

  const cashflow = buildCashflowTimeline(payments, expenses, 6);
  const currentPeriod = cashflow[cashflow.length - 1] ?? { revenue: 0, expenses: 0, net: 0 };
  const previousPeriod = cashflow[cashflow.length - 2] ?? null;

  const moneyInChange = calculatePercentChange(currentPeriod.revenue ?? 0, previousPeriod?.revenue ?? 0);
  const moneyOutChange = calculatePercentChange(currentPeriod.expenses ?? 0, previousPeriod?.expenses ?? 0);
  const moneyLeftChange = calculatePercentChange(currentPeriod.net ?? 0, previousPeriod?.net ?? 0);

  const kpis: KpiMetric[] = [
    {
      title: "Money In (This Month)",
      value: formatCurrencyPrecise(currentPeriod.revenue ?? 0),
      change: moneyInChange,
      tone: "positive",
      variant: "money-in",
    },
    {
      title: "Money Out (This Month)",
      value: formatCurrencyPrecise(currentPeriod.expenses ?? 0),
      change: moneyOutChange,
      tone: "negative",
      variant: "money-out",
    },
    {
      title: "What's Left (This Month)",
      value: formatCurrencyPrecise(currentPeriod.net ?? 0),
      change: moneyLeftChange,
      tone: (currentPeriod.net ?? 0) >= 0 ? "positive" : "negative",
      variant: "money-left",
    },
  ];

  const nextPayoutDate = payoutSummary.nextPayout?.payoutDate
    ? `Next payout · ${formatDate(payoutSummary.nextPayout.payoutDate)}`
    : "Next payout";
  const nextPayoutAmount = payoutSummary.nextPayout
    ? `${formatCurrencyPrecise(payoutSummary.nextPayout.net ?? payoutSummary.nextPayout.gross ?? 0)} expected`
    : null;
  const nextPayroll = payrollSummary.upcomingRun;

  const quickActions: QuickActionCard[] = [
    {
      title: "Bills",
      hint: `${formatNumber(overdueExpenses.length)} overdue`,
      value: formatCurrency(overdueBalance),
      valueTone: overdueExpenses.length > 0 ? "warning" : "muted",
      caption:
        expenseSummary.upcomingCount > 0
          ? `${formatNumber(expenseSummary.upcomingCount)} upcoming`
          : undefined,
      href: "/finances/expenses",
      action: "Review Bills",
    },
    {
      title: "Payments",
      hint: nextPayoutDate,
      value: formatCurrency(paymentSummary.settledVolume),
      caption: nextPayoutAmount ?? undefined,
      href: "/finances/payments",
      action: "View Ledger",
    },
    {
      title: "Taxes",
      hint: "QTD collected",
      value: formatCurrency(taxSummary.totalDue),
      href: "/finances/taxes",
      action: "Open Taxes",
    },
    {
      title: "Payroll",
      hint: "Next run",
      value: nextPayroll ? formatDate(nextPayroll.payDate ?? nextPayroll.processedOn) : "Not scheduled",
      valueTone: nextPayroll ? undefined : "brand",
      caption: nextPayroll
        ? `${formatNumber(nextPayroll.teamMembers)} team members • ${formatCurrency(nextPayroll.net ?? 0)}`
        : undefined,
      href: "/finances/payroll",
      action: "Open Payroll",
    },
    {
      title: "Vendors",
      hint: `${formatNumber(vendorSummary.activeVendors)} active`,
      value: formatCurrency(vendorSummary.openBalance),
      href: "/finances/vendors",
      action: "Manage",
    },
    {
      title: "Fees",
      hint: "MTD processor fees",
      value: formatCurrency(payoutSummary.fees),
      href: "/finances/payments",
      action: "Review",
    },
  ];

  const banner = overdueExpenses.length
    ? {
        variant: "warning" as const,
        icon: "⚠️",
        title: `Follow up on ${formatNumber(overdueExpenses.length)} overdue bill${
          overdueExpenses.length === 1 ? "" : "s"
        }`,
        message: `There is ${formatCurrencyPrecise(
          overdueBalance,
        )} awaiting payment. Schedule payments or mark bills as paid to clear this alert.`,
      }
    : {
        variant: "success" as const,
        icon: "✅",
        title: "No active alerts",
        message: "All financial tasks are up to date.",
      };

  const chart = createChartGeometry(cashflow);

  return (
    <div className="finance-page stack gap-large">
      <section className="finance-kpi-grid">
        {kpis.map(metric => (
          <article
            key={metric.title}
            className={`finance-kpi-card tone-${metric.tone}${
              metric.variant ? ` variant-${metric.variant}` : ""
            }`}
          >
            <header className="finance-kpi-header">
              <h2>{metric.title}</h2>
              <span aria-hidden="true" className={`trend-icon ${metric.change.trend}`}>
                {metric.change.trend === "down" ? "▼" : metric.change.trend === "up" ? "▲" : "■"}
              </span>
            </header>
            <div className="finance-kpi-value">{metric.value}</div>
            <p className={`finance-kpi-change trend-${metric.change.trend}`}>{metric.change.label}</p>
          </article>
        ))}
      </section>

      <section className={`finance-banner finance-banner-${banner.variant}`}>
        <div className="finance-banner-icon" aria-hidden="true">
          {banner.icon}
        </div>
        <div className="finance-banner-body">
          <h2>{banner.title}</h2>
          <p>{banner.message}</p>
        </div>
      </section>

      <section className="finance-overview-panel">
        <header className="finance-overview-header">
          <div>
            <h2>Monthly Overview</h2>
            <p>Revenue, expenses, and profit trends for the last six months.</p>
          </div>
          <div className="finance-overview-legend">
            <span className="legend-item revenue">
              <span aria-hidden="true" /> Revenue
            </span>
            <span className="legend-item expenses">
              <span aria-hidden="true" /> Expenses
            </span>
            <span className="legend-item net">
              <span aria-hidden="true" /> Profit
            </span>
          </div>
        </header>
        <div className="finance-chart">
          {cashflow.length === 0 ? (
            <div className="finance-chart-empty">Connect Supabase to see your financial performance.</div>
          ) : (
            <svg
              className="finance-chart-svg"
              viewBox={chart.viewBox}
              role="img"
              aria-label="Monthly revenue, expense, and profit chart"
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(73, 163, 255, 0.4)" />
                  <stop offset="100%" stopColor="rgba(73, 163, 255, 0.05)" />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255, 91, 91, 0.4)" />
                  <stop offset="100%" stopColor="rgba(255, 91, 91, 0.05)" />
                </linearGradient>
              </defs>
              <line
                className="finance-chart-baseline"
                x1={48}
                x2={chart.width - 36}
                y1={chart.zeroLine}
                y2={chart.zeroLine}
              />
              <path className="finance-chart-line revenue" d={chart.revenuePath} />
              <path className="finance-chart-line expenses" d={chart.expensesPath} />
              <path className="finance-chart-line net" d={chart.netPath} />
            </svg>
          )}
        </div>
        {cashflow.length > 0 ? (
          <div className="finance-chart-months">
            {cashflow.map(point => (
              <span key={point.month}>{formatMonthKey(point.month)}</span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="finance-actions">
        <header>
          <h2>Quick Actions</h2>
        </header>
        <div className="finance-actions-grid">
          {quickActions.map(card => (
            <a key={card.title} className="finance-action-card" href={card.href}>
              <div className="finance-action-header">
                <span className="finance-action-title">{card.title}</span>
                <span className="finance-action-hint">{card.hint}</span>
              </div>
              <div className={`finance-action-value ${card.valueTone ?? ""}`}>{card.value}</div>
              {card.caption ? <p className="finance-action-caption">{card.caption}</p> : null}
              <span className="finance-action-button">{card.action}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
