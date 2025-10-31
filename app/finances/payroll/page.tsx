import {
  getFinancePayrollRuns,
  summarizePayroll,
} from "../data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatNumber,
  formatStatus,
  payrollStatusTone,
} from "../format";

export default async function Page() {
  const runs = await getFinancePayrollRuns();
  const summary = summarizePayroll(runs);
  const upcoming = summary.upcomingRun;

  const metrics = [
    {
      label: "Total gross",
      value: formatCurrency(summary.totalGross),
      accent: "metrics-total",
      description: `${formatNumber(runs.length)} payroll runs`,
    },
    {
      label: "Total net",
      value: formatCurrency(summary.totalNet),
      accent: "metrics-active",
      description: "After taxes & benefits",
    },
    {
      label: "Team size",
      value: formatNumber(summary.employeeCount),
      accent: "metrics-onboarding",
      description: "Employees paid this quarter",
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
          <h2>Next payroll run</h2>
          {upcoming ? (
            <>
              <p>
                {formatNumber(upcoming.teamMembers)} teammates are scheduled for payment on {formatDate(upcoming.payDate)}.
                Review time sheets and reimbursements before processing.
              </p>
              <ul className="finance-spotlight-stats">
                <li>
                  <span className="finance-spotlight-label">Gross</span>
                  <span className="finance-spotlight-value">{formatCurrency(upcoming.gross)}</span>
                </li>
                <li>
                  <span className="finance-spotlight-label">Taxes</span>
                  <span className="finance-spotlight-value">{formatCurrencyPrecise(upcoming.taxes)}</span>
                </li>
                <li>
                  <span className="finance-spotlight-label">Net</span>
                  <span className="finance-spotlight-value">{formatCurrency(upcoming.net)}</span>
                </li>
              </ul>
            </>
          ) : (
            <p>No upcoming payroll runs on the schedule. Add a run to keep everyone paid on time.</p>
          )}
        </div>
        <div className="finance-spotlight-actions">
          <a className="button button-primary" href="/finances/payroll">
            Review payroll draft
          </a>
          <a className="button button-ghost" href="/finances/payroll">
            Export paystubs
          </a>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Payroll history</h2>
            <p className="panel-subtitle">Historical payroll runs with gross, taxes, and net totals.</p>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Period</th>
                <th scope="col">Processed</th>
                <th scope="col">Pay date</th>
                <th scope="col">Team</th>
                <th scope="col">Gross</th>
                <th scope="col">Taxes</th>
                <th scope="col">Benefits</th>
                <th scope="col">Net</th>
                <th scope="col">Status</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="table-empty">Connect Supabase payroll to populate this view.</td>
                </tr>
              ) : (
                runs.map(run => (
                  <tr key={run.id}>
                    <td>{run.period}</td>
                    <td>{formatDate(run.processedOn)}</td>
                    <td>{formatDate(run.payDate)}</td>
                    <td>{formatNumber(run.teamMembers)}</td>
                    <td>{formatCurrency(run.gross)}</td>
                    <td>{formatCurrencyPrecise(run.taxes)}</td>
                    <td>{formatCurrencyPrecise(run.benefits)}</td>
                    <td>{formatCurrency(run.net)}</td>
                    <td>
                      <span className={`status-pill ${payrollStatusTone(run.status)}`}>
                        {formatStatus(run.status)}
                      </span>
                    </td>
                    <td>{run.notes ?? "—"}</td>
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
