import { getFinancePayouts, summarizePayouts } from "../data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatNumber,
  formatStatus,
  payoutStatusTone,
} from "../format";

function payoutLabel(reference: string | null, provider: string | null) {
  if (reference) {
    return reference;
  }
  if (provider) {
    return `${provider} payout`;
  }
  return "Payout";
}

export default async function Page() {
  const payouts = await getFinancePayouts();
  const summary = summarizePayouts(payouts);

  const metrics = [
    {
      label: "Net received",
      value: formatCurrency(summary.net),
      accent: "metrics-total",
      description: `${formatNumber(summary.count)} payouts`,
    },
    {
      label: "Gross volume",
      value: formatCurrency(summary.gross),
      accent: "metrics-active",
      description: "Before processor fees",
    },
    {
      label: "Fees",
      value: formatCurrency(summary.fees),
      accent: "metrics-expense",
      description: "Processor deductions",
    },
    {
      label: "Average net",
      value: formatCurrencyPrecise(
        summary.count > 0 ? summary.net / summary.count : null,
      ),
      accent: "metrics-net-positive",
      description: summary.nextPayout
        ? `Next: ${formatDate(summary.nextPayout.payoutDate)}`
        : "No upcoming payouts",
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
            <h2 className="panel-title">Payout history</h2>
            <p className="panel-subtitle">
              Settlement deposits across Stripe, Square, and other providers.
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
                  <td colSpan={8} className="table-empty">
                    Connect Supabase to sync your payouts.
                  </td>
                </tr>
              ) : (
                payouts.map(payout => (
                  <tr key={payout.id}>
                    <td>{payoutLabel(payout.reference, payout.provider)}</td>
                    <td>{payout.provider ?? "—"}</td>
                    <td>{formatDate(payout.payoutDate)}</td>
                    <td>{formatCurrencyPrecise(payout.gross)}</td>
                    <td>{formatCurrencyPrecise(payout.fees)}</td>
                    <td>{formatCurrencyPrecise(payout.net)}</td>
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
