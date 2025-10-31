import {
  buildCashflowTimeline,
  getFinanceExpenses,
  getFinanceInvoices,
  getFinancePayments,
  getFinancePayrollRuns,
  getFinancePayouts,
  getFinancePurchaseOrders,
  getFinanceTaxFilings,
  getFinanceVendors,
  groupExpensesByCategory,
  remainingInvoiceBalance,
  selectDueSoonFilings,
  selectOpenPurchaseOrders,
  selectOverdueInvoices,
  selectUpcomingReceivables,
  summarizeExpenses,
  summarizeInvoices,
  summarizePayments,
  summarizePayroll,
  summarizePayouts,
  summarizePurchaseOrders,
  summarizeTaxFilings,
  summarizeVendors,
} from "./data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatMonthKey,
  formatNumber,
  formatStatus,
  invoiceStatusTone,
  paymentStatusTone,
  payoutStatusTone,
  taxStatusTone,
  vendorStatusTone,
  purchaseOrderStatusTone,
} from "./format";

const quickActions = [
  {
    title: "Create invoice",
    description: "Bill pet parents for grooming, boarding, or daycare services.",
    href: "/finances/invoices",
  },
  {
    title: "Record expense",
    description: "Log rent, utilities, and vendor spend for month-to-date tracking.",
    href: "/finances/expenses",
  },
  {
    title: "Log customer payment",
    description: "Capture cash, card, or ACH payments collected on-site.",
    href: "/finances/payments",
  },
  {
    title: "Schedule payroll",
    description: "Review hours and send the next payroll run for your team.",
    href: "/finances/payroll",
  },
];

function compareByDateDesc(
  left: string | null | undefined,
  right: string | null | undefined,
) {
  const leftDate = left ? new Date(left).getTime() : 0;
  const rightDate = right ? new Date(right).getTime() : 0;
  return rightDate - leftDate;
}

function sumBalance(values: Array<number | null | undefined>) {
  return values.reduce<number>((total, value) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return total + value;
    }
    return total;
  }, 0);
}

export default async function Page() {
  const [
    invoices,
    expenses,
    payouts,
    payments,
    payrollRuns,
    taxFilings,
    vendors,
    purchaseOrders,
  ] = await Promise.all([
    getFinanceInvoices(),
    getFinanceExpenses(),
    getFinancePayouts(),
    getFinancePayments(),
    getFinancePayrollRuns(),
    getFinanceTaxFilings(),
    getFinanceVendors(),
    getFinancePurchaseOrders(),
  ]);

  const invoiceSummary = summarizeInvoices(invoices);
  const expenseSummary = summarizeExpenses(expenses);
  const payoutSummary = summarizePayouts(payouts);
  const paymentSummary = summarizePayments(payments);
  const payrollSummary = summarizePayroll(payrollRuns);
  const taxSummary = summarizeTaxFilings(taxFilings);
  const vendorSummary = summarizeVendors(vendors);
  const purchaseOrderSummary = summarizePurchaseOrders(purchaseOrders);

  const upcomingReceivables = selectUpcomingReceivables(invoices).slice(0, 5);
  const overdueInvoices = selectOverdueInvoices(invoices);
  const overdueTotal = sumBalance(overdueInvoices.map(remainingInvoiceBalance));
  const expenseBreakdown = groupExpensesByCategory(expenses).slice(0, 6);
  const cashflow = buildCashflowTimeline(invoices, expenses, 6);
  const recentPayouts = payouts.slice(0, 4);
  const recentPayments = payments
    .slice()
    .sort((a, b) => compareByDateDesc(a.settledOn ?? a.initiatedOn, b.settledOn ?? b.initiatedOn))
    .slice(0, 5);
  const dueSoonFilings = selectDueSoonFilings(taxFilings, 21);
  const openPurchaseOrders = selectOpenPurchaseOrders(purchaseOrders).slice(0, 4);
  const topVendors = vendors
    .slice()
    .sort((a, b) => b.spendYtd - a.spendYtd)
    .slice(0, 5);

  const metrics = [
    {
      label: "Collected to date",
      value: formatCurrency(invoiceSummary.collected),
      accent: "metrics-total",
      description: `${formatNumber(invoiceSummary.paidCount)} paid invoices`,
    },
    {
      label: "Outstanding",
      value: formatCurrency(invoiceSummary.outstanding),
      accent: "metrics-outstanding",
      description: `${formatNumber(invoiceSummary.overdue)} overdue`,
    },
    {
      label: "Settled payments",
      value: formatCurrency(paymentSummary.settledVolume),
      accent: "metrics-active",
      description: `${formatNumber(recentPayments.length)} recent`,
    },
    {
      label: "Operating spend",
      value: formatCurrency(expenseSummary.monthToDate),
      accent: "metrics-expense",
      description: `${formatNumber(expenseSummary.count)} expenses tracked`,
    },
    {
      label: "Upcoming payroll",
      value: formatCurrency(payrollSummary.upcomingRun?.net ?? 0),
      accent: "metrics-onboarding",
      description: payrollSummary.upcomingRun
        ? `${formatNumber(payrollSummary.upcomingRun.teamMembers)} teammates get paid ${formatDate(
            payrollSummary.upcomingRun.payDate,
          )}`
        : "No runs scheduled",
    },
    {
      label: "Tax due",
      value: formatCurrency(taxSummary.totalDue),
      accent: "metrics-leave",
      description: `${formatNumber(taxSummary.dueSoonCount)} filings in the next 3 weeks`,
    },
  ];

  return (
    <div className="stack gap-large">
      <section className="metrics-grid">
        {metrics.map(metric => (
          <article key={metric.label} className={`metrics-card ${metric.accent}`}>
            <header className="metrics-label">{metric.label}</header>
            <div className="metrics-value">{metric.value}</div>
            <p className="metrics-description">{metric.description}</p>
          </article>
        ))}
      </section>

      <section className="panel finance-alert">
        <div className="finance-alert-icon" aria-hidden="true">
          <span>⚠️</span>
        </div>
        <div className="finance-alert-body">
          <h2>
            {overdueInvoices.length > 0
              ? `Follow up on ${formatNumber(overdueInvoices.length)} overdue invoice${
                  overdueInvoices.length === 1 ? "" : "s"
                }`
              : "All invoices are current"}
          </h2>
          <p>
            {overdueInvoices.length > 0
              ? `There is ${formatCurrencyPrecise(overdueTotal)} in past-due balance dating back to March. Send reminders or apply credits to close them out.`
              : "Great work! Your accounts receivable ledger is fully reconciled."}
          </p>
          <div className="finance-alert-actions">
            <a className="button button-primary" href="/finances/invoices">
              Review invoices
            </a>
            <a className="button button-ghost" href="/finances/payments">
              Export aging report
            </a>
          </div>
        </div>
      </section>

      <div className="finance-overview-grid">
        <section className="panel finance-cashflow-panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Cashflow snapshot</h2>
              <p className="panel-subtitle">
                Monthly revenue versus expenses across the last six periods.
              </p>
            </div>
            <div className="finance-cashflow-meta">
              <span>
                Net change {formatCurrencyPrecise(cashflow.reduce((total, point) => total + point.net, 0))}
              </span>
            </div>
          </header>
          {cashflow.length === 0 ? (
            <div className="panel-empty">Connect Supabase to see your cashflow history.</div>
          ) : (
            <ul className="finance-cashflow" aria-label="Cashflow timeline">
              {cashflow.map(point => {
                const revenue = point.revenue ?? 0;
                const expensesTotal = point.expenses ?? 0;
                const net = point.net ?? 0;
                const revenueBar = Math.min(100, Math.round((revenue / Math.max(revenue, expensesTotal, 1)) * 100));
                const expenseBar = Math.min(100, Math.round((expensesTotal / Math.max(revenue, expensesTotal, 1)) * 100));

                return (
                  <li key={point.month} className="finance-cashflow-row">
                    <span className="finance-cashflow-month">{formatMonthKey(point.month)}</span>
                    <div className="finance-cashflow-bars" aria-hidden="true">
                      <span className="finance-cashflow-bar revenue" style={{ width: `${revenueBar}%` }} />
                      <span className="finance-cashflow-bar expense" style={{ width: `${expenseBar}%` }} />
                    </div>
                    <span className="finance-cashflow-revenue">{formatCurrencyPrecise(revenue)}</span>
                    <span className="finance-cashflow-expense">{formatCurrencyPrecise(expensesTotal)}</span>
                    <span className={`finance-cashflow-net ${net >= 0 ? "positive" : "negative"}`}>
                      {formatCurrencyPrecise(net)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Quick actions</h2>
              <p className="panel-subtitle">Jump into common finance workflows.</p>
            </div>
          </header>
          <div className="quick-actions-grid">
            {quickActions.map(action => (
              <a key={action.title} className="quick-action-card" href={action.href}>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="finance-columns">
        <section className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Upcoming receivables</h2>
              <p className="panel-subtitle">Open invoices ordered by due date.</p>
            </div>
          </header>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Invoice</th>
                  <th scope="col">Client</th>
                  <th scope="col">Due</th>
                  <th scope="col">Balance</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingReceivables.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="table-empty">
                      No outstanding receivables.
                    </td>
                  </tr>
                ) : (
                  upcomingReceivables.map(invoice => (
                    <tr key={invoice.id}>
                      <td>{invoice.invoiceNumber ?? "Invoice"}</td>
                      <td>{invoice.clientName ?? "Unknown client"}</td>
                      <td>{formatDate(invoice.dueOn)}</td>
                      <td>{formatCurrencyPrecise(remainingInvoiceBalance(invoice))}</td>
                      <td>
                        <span className={`status-pill ${invoiceStatusTone(invoice.status)}`}>
                          {formatStatus(invoice.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Tax deadlines</h2>
              <p className="panel-subtitle">Filings approaching in the next 21 days.</p>
            </div>
          </header>
          {dueSoonFilings.length === 0 ? (
            <div className="panel-empty">No upcoming tax filings.</div>
          ) : (
            <ul className="finance-deadlines" aria-label="Upcoming tax filings">
              {dueSoonFilings.map(filing => (
                <li key={filing.id} className="finance-deadline-row">
                  <div>
                    <span className="finance-deadline-title">{filing.title}</span>
                    <p className="finance-deadline-meta">
                      {filing.jurisdiction} • {filing.form} • {filing.period}
                    </p>
                  </div>
                  <div className="finance-deadline-right">
                    <span className="finance-deadline-date">{formatDate(filing.dueOn)}</span>
                    <span className={`status-pill ${taxStatusTone(filing.status)}`}>
                      {formatStatus(filing.status)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Open purchase orders</h2>
              <p className="panel-subtitle">Orders awaiting fulfillment or approval.</p>
            </div>
            <div className="finance-purchase-summary">
              <span>{formatNumber(purchaseOrderSummary.openOrders)} open</span>
              <span>{formatCurrency(purchaseOrderSummary.totalCommitted)} committed</span>
            </div>
          </header>
          {openPurchaseOrders.length === 0 ? (
            <div className="panel-empty">No open purchase orders.</div>
          ) : (
            <ul className="finance-purchase-orders" aria-label="Open purchase orders">
              {openPurchaseOrders.map(order => (
                <li key={order.id} className="finance-purchase-row">
                  <div className="finance-purchase-main">
                    <span className="finance-purchase-id">{order.id}</span>
                    <span className="finance-purchase-vendor">{order.vendor}</span>
                    <p className="finance-purchase-items">{order.items.join(", ")}</p>
                  </div>
                  <div className="finance-purchase-meta">
                    <span className="finance-purchase-amount">{formatCurrencyPrecise(order.total)}</span>
                    <span className="finance-purchase-expected">Expected {formatDate(order.expectedOn)}</span>
                    <span className={`status-pill ${purchaseOrderStatusTone(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="finance-columns">
        <section className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Recent payments</h2>
              <p className="panel-subtitle">Customer payments captured across channels.</p>
            </div>
          </header>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Channel</th>
                  <th scope="col">Processed</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-empty">
                      Collect payments to see activity here.
                    </td>
                  </tr>
                ) : (
                  recentPayments.map(payment => (
                    <tr key={payment.id}>
                      <td>{payment.reference ?? "—"}</td>
                      <td>{payment.customer ?? "—"}</td>
                      <td>{payment.channel ?? "—"}</td>
                      <td>{formatDate(payment.settledOn ?? payment.initiatedOn)}</td>
                      <td>{formatCurrencyPrecise(payment.amount)}</td>
                      <td>
                        <span className={`status-pill ${paymentStatusTone(payment.status)}`}>
                          {formatStatus(payment.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Processor payouts</h2>
              <p className="panel-subtitle">Upcoming settlements from payment providers.</p>
            </div>
          </header>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Payout</th>
                  <th scope="col">Provider</th>
                  <th scope="col">Date</th>
                  <th scope="col">Net</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="table-empty">Connect Supabase to track payouts.</td>
                  </tr>
                ) : (
                  recentPayouts.map(payout => (
                    <tr key={payout.id}>
                      <td>{payout.reference ?? "Payout"}</td>
                      <td>{payout.provider ?? "—"}</td>
                      <td>{formatDate(payout.payoutDate)}</td>
                      <td>{formatCurrencyPrecise(payout.net ?? payout.gross)}</td>
                      <td>
                        <span className={`status-pill ${payoutStatusTone(payout.status)}`}>
                          {formatStatus(payout.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Expense breakdown</h2>
            <p className="panel-subtitle">Top categories based on year-to-date spend.</p>
          </div>
        </header>
        {expenseBreakdown.length === 0 ? (
          <div className="panel-empty">No expenses recorded yet.</div>
        ) : (
          <ul className="finance-breakdown" aria-label="Expense breakdown">
            {expenseBreakdown.map(entry => (
              <li key={entry.category} className="finance-breakdown-row">
                <div className="finance-breakdown-main">
                  <span className="finance-breakdown-category">{entry.category}</span>
                  <span className="finance-breakdown-count">
                    {formatNumber(entry.count)} {entry.count === 1 ? "expense" : "expenses"}
                  </span>
                </div>
                <span className="finance-breakdown-amount">
                  {formatCurrencyPrecise(entry.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Vendor overview</h2>
            <p className="panel-subtitle">Active relationships and open balances.</p>
          </div>
          <div className="finance-vendor-meta">
            <span>{formatNumber(vendorSummary.activeVendors)} active vendors</span>
            <span>{formatCurrency(vendorSummary.openBalance)} open balance</span>
          </div>
        </header>
        {topVendors.length === 0 ? (
          <div className="panel-empty">No vendors connected yet.</div>
        ) : (
          <ul className="finance-vendors" aria-label="Vendors">
            {topVendors.map(vendor => (
              <li key={vendor.id} className="finance-vendor-row">
                <div className="finance-vendor-main">
                  <span className="finance-vendor-name">{vendor.name}</span>
                  <span className="finance-vendor-category">{vendor.category}</span>
                </div>
                <div className="finance-vendor-meta">
                  <span>{formatCurrencyPrecise(vendor.spendYtd)} YTD</span>
                  <span>{formatCurrencyPrecise(vendor.openBalance)} open</span>
                  <span className={`status-pill ${vendorStatusTone(vendor.status)}`}>
                    {formatStatus(vendor.status)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Overdue invoices</h2>
            <p className="panel-subtitle">Past-due balances that still require follow-up.</p>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Invoice</th>
                <th scope="col">Client</th>
                <th scope="col">Due date</th>
                <th scope="col">Outstanding</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {overdueInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-empty">
                    No overdue invoices — great job!
                  </td>
                </tr>
              ) : (
                overdueInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber ?? "Invoice"}</td>
                    <td>{invoice.clientName ?? "Unknown client"}</td>
                    <td>{formatDate(invoice.dueOn)}</td>
                    <td>{formatCurrencyPrecise(remainingInvoiceBalance(invoice))}</td>
                    <td>
                      <span className={`status-pill ${invoiceStatusTone(invoice.status)}`}>
                        {formatStatus(invoice.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
