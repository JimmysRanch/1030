import {
  getFinancePayments,
  getFinancePayouts,
  summarizePayments,
  summarizePayouts,
} from "../data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatNumber,
  formatStatus,
  paymentStatusTone,
  payoutStatusTone,
} from "../format";

const paymentFilters = ["All", "Settled", "Pending", "Failed"];

export default async function Page() {
  const [payments, payouts] = await Promise.all([getFinancePayments(), getFinancePayouts()]);
  const paymentSummary = summarizePayments(payments);
  const payoutSummary = summarizePayouts(payouts);

  const settledCount = payments.filter(payment => {
    const status = payment.status ? payment.status.toLowerCase() : "";
    return status.includes("settled") || status.includes("paid") || status.includes("completed");
  }).length;

  const pendingCount = payments.filter(payment => {
    const status = payment.status ? payment.status.toLowerCase() : "";
    return (
      status.includes("pending") ||
      status.includes("processing") ||
      status.includes("awaiting") ||
      status.includes("in transit")
    );
  }).length;

  const metrics = [
    {
      label: "Total volume",
      value: formatCurrency(paymentSummary.totalVolume),
      accent: "metrics-total",
      description: `${formatNumber(payments.length)} payments captured`,
    },
    {
      label: "Settled",
      value: formatCurrency(paymentSummary.settledVolume),
      accent: "metrics-active",
      description: `${formatNumber(settledCount)} settled`,
    },
    {
      label: "Pending",
      value: formatCurrency(paymentSummary.pendingVolume),
      accent: "metrics-onboarding",
      description: `${formatNumber(pendingCount)} in flight`,
    },
    {
      label: "Failures",
      value: formatNumber(paymentSummary.failedCount),
      accent: "metrics-leave",
      description: "Payments requiring follow-up",
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
          <h2>Processor payouts</h2>
          <p>
            {payoutSummary.nextPayout
              ? `Next payout of ${formatCurrencyPrecise(payoutSummary.nextPayout.net ?? payoutSummary.nextPayout.gross)} expected ${formatDate(payoutSummary.nextPayout.payoutDate)}.`
              : "Connect Supabase to track incoming settlement activity."}
          </p>
          <ul className="finance-spotlight-stats">
            <li>
              <span className="finance-spotlight-label">Gross</span>
              <span className="finance-spotlight-value">{formatCurrency(payoutSummary.gross)}</span>
            </li>
            <li>
              <span className="finance-spotlight-label">Fees</span>
              <span className="finance-spotlight-value">{formatCurrencyPrecise(payoutSummary.fees)}</span>
            </li>
            <li>
              <span className="finance-spotlight-label">Net</span>
              <span className="finance-spotlight-value">{formatCurrency(payoutSummary.net)}</span>
            </li>
          </ul>
        </div>
        <div className="finance-spotlight-actions">
          <a className="button button-primary" href="/finances/payments">
            Download payout report
          </a>
          <a className="button button-ghost" href="/finances/payments">
            Configure deposits
          </a>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Payment ledger</h2>
            <p className="panel-subtitle">Individual customer payments across channels.</p>
          </div>
          <div className="finance-filter-chips">
            {paymentFilters.map(filter => (
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
                <th scope="col">Reference</th>
                <th scope="col">Customer</th>
                <th scope="col">Channel</th>
                <th scope="col">Method</th>
                <th scope="col">Initiated</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Memo</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-empty">Collect payments to see activity here.</td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.reference ?? "—"}</td>
                    <td>{payment.customer ?? "—"}</td>
                    <td>{payment.channel ?? "—"}</td>
                    <td>{payment.method ?? "—"}</td>
                    <td>{formatDate(payment.settledOn ?? payment.initiatedOn)}</td>
                    <td>{formatCurrencyPrecise(payment.amount)}</td>
                    <td>
                      <span className={`status-pill ${paymentStatusTone(payment.status)}`}>
                        {formatStatus(payment.status)}
                      </span>
                    </td>
                    <td>{payment.memo ?? "—"}</td>
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
            <h2 className="panel-title">Payout schedule</h2>
            <p className="panel-subtitle">Settlement batches from payment processors.</p>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Payout</th>
                <th scope="col">Provider</th>
                <th scope="col">Date</th>
                <th scope="col">Gross</th>
                <th scope="col">Fees</th>
                <th scope="col">Net</th>
                <th scope="col">Transactions</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-empty">Connect Supabase to track payouts.</td>
                </tr>
              ) : (
                payouts.map(payout => (
                  <tr key={payout.id}>
                    <td>{payout.reference ?? "Payout"}</td>
                    <td>{payout.provider ?? "—"}</td>
                    <td>{formatDate(payout.payoutDate)}</td>
                    <td>{formatCurrencyPrecise(payout.gross)}</td>
                    <td>{formatCurrencyPrecise(payout.fees)}</td>
                    <td>{formatCurrencyPrecise(payout.net ?? payout.gross)}</td>
                    <td>{formatNumber(payout.transactionCount)}</td>
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
  );
}
