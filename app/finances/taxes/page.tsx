import {
  getFinanceTaxFilings,
  selectDueSoonFilings,
  summarizeTaxFilings,
} from "../data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatNumber,
  formatStatus,
  taxStatusTone,
} from "../format";

const filingFilters = ["All", "Due soon", "Filed", "Past due"];

export default async function Page() {
  const filings = await getFinanceTaxFilings();
  const summary = summarizeTaxFilings(filings);
  const dueSoon = selectDueSoonFilings(filings, 30);

  const metrics = [
    {
      label: "Tax due",
      value: formatCurrency(summary.totalDue),
      accent: "metrics-total",
      description: `${formatNumber(summary.dueSoonCount)} filings in the next month`,
    },
    {
      label: "Filed",
      value: formatNumber(summary.filedCount),
      accent: "metrics-active",
      description: "Completed submissions this year",
    },
    {
      label: "Past due",
      value: formatNumber(summary.pastDueCount),
      accent: "metrics-leave",
      description: "Filings requiring immediate attention",
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

      <section className="panel finance-spotlight">
        <div className="finance-spotlight-body">
          <h2>Upcoming filings</h2>
          {dueSoon.length === 0 ? (
            <p>No tax filings due within the next 30 days.</p>
          ) : (
            <ul className="finance-spotlight-list" aria-label="Upcoming tax filings">
              {dueSoon.map(filing => (
                <li key={filing.id}>
                  <div>
                    <strong>{filing.title}</strong>
                    <span>{filing.jurisdiction}</span>
                  </div>
                  <div>
                    <span>{formatDate(filing.dueOn)}</span>
                    <span>{formatCurrencyPrecise(filing.amountDue)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="finance-spotlight-actions">
          <a className="button button-primary" href="/finances/taxes">
            Prepare filing
          </a>
          <a className="button button-ghost" href="/finances/taxes">
            Export tax report
          </a>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Tax filing tracker</h2>
            <p className="panel-subtitle">All sales, payroll, and federal tax obligations.</p>
          </div>
          <div className="finance-filter-chips">
            {filingFilters.map(filter => (
              <span key={filter} className={`chip ${filter === "All" ? "chip-active" : ""}`}>
                {filter}
              </span>
            ))}
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Filing</th>
                <th scope="col">Jurisdiction</th>
                <th scope="col">Form</th>
                <th scope="col">Period</th>
                <th scope="col">Due</th>
                <th scope="col">Amount</th>
                <th scope="col">Submitted</th>
                <th scope="col">Status</th>
                <th scope="col">Confirmation</th>
              </tr>
            </thead>
            <tbody>
              {filings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-empty">Connect Supabase tax data to populate this table.</td>
                </tr>
              ) : (
                filings.map(filing => (
                  <tr key={filing.id}>
                    <td>{filing.title}</td>
                    <td>{filing.jurisdiction}</td>
                    <td>{filing.form}</td>
                    <td>{filing.period}</td>
                    <td>{formatDate(filing.dueOn)}</td>
                    <td>{formatCurrencyPrecise(filing.amountDue)}</td>
                    <td>{formatDate(filing.submittedOn)}</td>
                    <td>
                      <span className={`status-pill ${taxStatusTone(filing.status)}`}>
                        {formatStatus(filing.status)}
                      </span>
                    </td>
                    <td>{filing.confirmation ?? "—"}</td>
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
