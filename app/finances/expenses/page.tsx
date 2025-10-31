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

const expenseFilters = ["All", "Due soon", "Paid", "Recurring"];

export default async function Page() {
  const expenses = await getFinanceExpenses();
  const summary = summarizeExpenses(expenses);
  const categories = groupExpensesByCategory(expenses);

  const metrics = [
    {
      label: "Total spend",
      value: formatCurrency(summary.total),
      accent: "metrics-total",
      description: `${formatNumber(summary.count)} expenses tracked`,
    },
    {
      label: "Month to date",
      value: formatCurrency(summary.monthToDate),
      accent: "metrics-expense",
      description: "Current period activity",
    },
    {
      label: "Upcoming",
      value: formatNumber(summary.upcomingCount),
      accent: "metrics-onboarding",
      description: "Payments due soon",
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
            <h2 className="panel-title">Category breakdown</h2>
            <p className="panel-subtitle">Where your operating spend is concentrated.</p>
          </div>
        </header>
        {categories.length === 0 ? (
          <div className="panel-empty">No expenses recorded yet.</div>
        ) : (
          <div className="expense-category-grid">
            {categories.map(category => (
              <article key={category.category} className="expense-category-card">
                <header>
                  <h3>{category.category}</h3>
                  <span>{formatNumber(category.count)} line item{category.count === 1 ? "" : "s"}</span>
                </header>
                <div className="expense-category-amount">{formatCurrencyPrecise(category.total)}</div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Expense ledger</h2>
            <p className="panel-subtitle">Detailed vendor activity from Supabase.</p>
          </div>
          <div className="finance-filter-chips">
            {expenseFilters.map(chip => (
              <span key={chip} className={`chip ${chip === "All" ? "chip-active" : ""}`}>
                {chip}
              </span>
            ))}
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Vendor</th>
                <th scope="col">Category</th>
                <th scope="col">Incurred</th>
                <th scope="col">Due</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Payment</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-empty">
                    Connect Supabase to sync your expense ledger.
                  </td>
                </tr>
              ) : (
                expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.vendor ?? "—"}</td>
                    <td>{expense.category ?? "Uncategorized"}</td>
                    <td>{formatDate(expense.incurredOn)}</td>
                    <td>{formatDate(expense.dueOn)}</td>
                    <td>{formatCurrencyPrecise(expense.amount)}</td>
                    <td>
                      <span className={`status-pill ${expenseStatusTone(expense.status)}`}>
                        {formatStatus(expense.status)}
                      </span>
                    </td>
                    <td>{expense.paymentMethod ?? "—"}</td>
                    <td>{expense.notes ?? "—"}</td>
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
