import {
  buildCashflowTimeline,
  getFinanceExpenses,
  getFinanceInvoices,
  getFinancePayouts,
  groupExpensesByCategory,
  remainingInvoiceBalance,
  selectOverdueInvoices,
  selectUpcomingReceivables,
  summarizeExpenses,
  summarizeInvoices,
  summarizePayouts,
} from "./data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatMonthKey,
  formatNumber,
  formatStatus,
  invoiceStatusTone,
  payoutStatusTone,
} from "./format";

export default async function Page() {
  const [invoices, expenses, payouts] = await Promise.all([
    getFinanceInvoices(),
    getFinanceExpenses(),
    getFinancePayouts(),
  ]);

  const invoiceSummary = summarizeInvoices(invoices);
  const expenseSummary = summarizeExpenses(expenses);
  const payoutSummary = summarizePayouts(payouts);

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
      label: "Operating spend",
      value: formatCurrency(expenseSummary.monthToDate),
      accent: "metrics-expense",
      description: `${formatNumber(expenseSummary.count)} expenses tracked`,
    },
    {
      label: "Net payouts",
      value: formatCurrency(payoutSummary.net),
      accent: payoutSummary.net >= 0 ? "metrics-net-positive" : "metrics-net-negative",
      description: payoutSummary.nextPayout
        ? `Next payout ${formatDate(payoutSummary.nextPayout.payoutDate)}`
        : "No upcoming payouts",
    },
  ];

  const upcomingReceivables = selectUpcomingReceivables(invoices);
  const overdueInvoices = selectOverdueInvoices(invoices);
  const expenseBreakdown = groupExpensesByCategory(expenses).slice(0, 6);
  const cashflow = buildCashflowTimeline(invoices, expenses, 6);
  const recentPayouts = payouts.slice(0, 5);

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

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Cashflow snapshot</h2>
            <p className="panel-subtitle">
              Monthly revenue versus expenses based on Supabase invoices and expense
              entries.
            </p>
          </div>
        </header>
        {cashflow.length === 0 ? (
          <div className="panel-empty">Connect Supabase to see your cashflow history.</div>
        ) : (
          <ul className="finance-cashflow" aria-label="Cashflow timeline">
            {cashflow.map(point => (
              <li key={point.month} className="finance-cashflow-row">
                <span className="finance-cashflow-month">{formatMonthKey(point.month)}</span>
                <span className="finance-cashflow-revenue">{formatCurrency(point.revenue)}</span>
                <span className="finance-cashflow-expense">{formatCurrency(point.expenses)}</span>
                <span
                  className={`finance-cashflow-net ${point.net >= 0 ? "positive" : "negative"}`}
                >
                  {formatCurrency(point.net)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="finance-grid">
        <section className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Upcoming receivables</h2>
              <p className="panel-subtitle">
                Open invoices with remaining balance sorted by due date.
              </p>
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
              <h2 className="panel-title">Recent payouts</h2>
              <p className="panel-subtitle">
                Settlement activity from payment processors and marketplaces.
              </p>
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
                    <td colSpan={5} className="table-empty">
                      Connect Supabase to track payouts.
                    </td>
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
            <p className="panel-subtitle">
              Top spending categories across the current ledger.
            </p>
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
            <h2 className="panel-title">Overdue invoices</h2>
            <p className="panel-subtitle">
              Past-due balances that still require follow-up.
            </p>
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
