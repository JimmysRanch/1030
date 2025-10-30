import {
  getFinanceExpenses,
  groupExpensesByCategory,
  summarizeExpenses,
} from "../data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatNumber,
  formatStatus,
  expenseStatusTone,
} from "../format";

function vendorLabel(vendor: string | null) {
  return vendor ?? "—";
}

export default async function Page() {
  const expenses = await getFinanceExpenses();
  const summary = summarizeExpenses(expenses);
  const categories = groupExpensesByCategory(expenses);

  const metrics = [
    {
      label: "Total spend",
      value: formatCurrency(summary.total),
      accent: "metrics-expense",
      description: `${formatNumber(summary.count)} expenses recorded`,
    },
    {
      label: "Month to date",
      value: formatCurrency(summary.monthToDate),
      accent: "metrics-total",
      description: "Current month's expenses",
    },
    {
      label: "Upcoming",
      value: formatNumber(summary.upcomingCount),
      accent: "metrics-outstanding",
      description: "Scheduled or due soon",
    },
    {
      label: "Average expense",
      value: formatCurrencyPrecise(
        summary.count > 0 ? summary.total / summary.count : null,
      ),
      accent: "metrics-net-positive",
      description: summary.count > 0 ? "Across all categories" : "—",
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

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Expense ledger</h2>
            <p className="panel-subtitle">
              Track operating costs, supplies, rent, and other transactions.
            </p>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Vendor</th>
                <th scope="col">Status</th>
                <th scope="col">Incurred</th>
                <th scope="col">Due</th>
                <th scope="col">Amount</th>
                <th scope="col">Payment</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-empty">
                    Connect Supabase to load your expense ledger.
                  </td>
                </tr>
              ) : (
                expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.category ?? "Uncategorized"}</td>
                    <td>{vendorLabel(expense.vendor)}</td>
                    <td>
                      <span className={`status-pill ${expenseStatusTone(expense.status)}`}>
                        {formatStatus(expense.status)}
                      </span>
                    </td>
                    <td>{formatDate(expense.incurredOn)}</td>
                    <td>{formatDate(expense.dueOn)}</td>
                    <td>{formatCurrencyPrecise(expense.amount)}</td>
                    <td>{expense.paymentMethod ?? "—"}</td>
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
            <h2 className="panel-title">Top categories</h2>
            <p className="panel-subtitle">Where your budget is going this year.</p>
          </div>
        </header>
        {categories.length === 0 ? (
          <div className="panel-empty">No expenses categorized yet.</div>
        ) : (
          <ul className="finance-breakdown" aria-label="Expense categories">
            {categories.map(category => (
              <li key={category.category} className="finance-breakdown-row">
                <div className="finance-breakdown-main">
                  <span className="finance-breakdown-category">{category.category}</span>
                  <span className="finance-breakdown-count">
                    {formatNumber(category.count)} {category.count === 1 ? "entry" : "entries"}
                  </span>
                </div>
                <span className="finance-breakdown-amount">
                  {formatCurrencyPrecise(category.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
