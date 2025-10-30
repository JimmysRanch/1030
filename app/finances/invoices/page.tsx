import {
  getFinanceInvoices,
  remainingInvoiceBalance,
  summarizeInvoices,
} from "../data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatNumber,
  formatStatus,
  invoiceStatusTone,
} from "../format";

function servicesLabel(services: string[], fallback: string | null) {
  if (services.length > 0) {
    return services.slice(0, 3).join(" · ");
  }
  return fallback ?? "—";
}

export default async function Page() {
  const invoices = await getFinanceInvoices();
  const summary = summarizeInvoices(invoices);

  const metrics = [
    {
      label: "Total invoiced",
      value: formatCurrency(summary.total),
      accent: "metrics-total",
      description: `${formatNumber(summary.invoiceCount)} invoices`,
    },
    {
      label: "Collected",
      value: formatCurrency(summary.collected),
      accent: "metrics-active",
      description: `${formatNumber(summary.paidCount)} paid`,
    },
    {
      label: "Outstanding",
      value: formatCurrency(summary.outstanding),
      accent: "metrics-outstanding",
      description: `${formatNumber(summary.overdue)} overdue`,
    },
    {
      label: "Average invoice",
      value: formatCurrencyPrecise(summary.averageInvoice ?? null),
      accent: "metrics-expense",
      description: `${formatNumber(summary.openCount)} open`,
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
            <h2 className="panel-title">Invoice ledger</h2>
            <p className="panel-subtitle">
              Full detail for every invoice synced from Supabase.
            </p>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Invoice</th>
                <th scope="col">Client</th>
                <th scope="col">Services</th>
                <th scope="col">Issued</th>
                <th scope="col">Due</th>
                <th scope="col">Total</th>
                <th scope="col">Balance</th>
                <th scope="col">Status</th>
                <th scope="col">Payment</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-empty">
                    Connect Supabase to populate your invoice ledger.
                  </td>
                </tr>
              ) : (
                invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber ?? "Invoice"}</td>
                    <td>{invoice.clientName ?? "Unknown client"}</td>
                    <td>{servicesLabel(invoice.services, invoice.petName)}</td>
                    <td>{formatDate(invoice.issuedOn)}</td>
                    <td>{formatDate(invoice.dueOn)}</td>
                    <td>{formatCurrencyPrecise(invoice.total)}</td>
                    <td>{formatCurrencyPrecise(remainingInvoiceBalance(invoice))}</td>
                    <td>
                      <span className={`status-pill ${invoiceStatusTone(invoice.status)}`}>
                        {formatStatus(invoice.status)}
                      </span>
                    </td>
                    <td>{invoice.paymentMethod ?? "—"}</td>
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
