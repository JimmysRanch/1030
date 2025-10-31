import {
  getFinanceVendors,
  summarizeVendors,
} from "../data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatNumber,
  formatStatus,
  vendorStatusTone,
} from "../format";

const vendorFilters = ["All", "Active", "Pending", "On hold"];

export default async function Page() {
  const vendors = await getFinanceVendors();
  const summary = summarizeVendors(vendors);

  const metrics = [
    {
      label: "Active vendors",
      value: formatNumber(summary.activeVendors),
      accent: "metrics-active",
      description: "Vendors ready to receive purchase orders",
    },
    {
      label: "On hold",
      value: formatNumber(summary.onHoldVendors),
      accent: "metrics-onboarding",
      description: "Pending onboarding or action",
    },
    {
      label: "YTD spend",
      value: formatCurrency(summary.totalSpendYtd),
      accent: "metrics-total",
      description: "Across all connected vendors",
    },
    {
      label: "Open balance",
      value: formatCurrency(summary.openBalance),
      accent: "metrics-outstanding",
      description: "Invoices still unpaid",
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
          <h2>Vendor engagement</h2>
          <p>
            Keep vendors happy with on-time payments and clear communication. Track spend, balances, and primary contacts in one
            place.
          </p>
          <ul className="finance-spotlight-stats">
            <li>
              <span className="finance-spotlight-label">Spend YTD</span>
              <span className="finance-spotlight-value">{formatCurrency(summary.totalSpendYtd)}</span>
            </li>
            <li>
              <span className="finance-spotlight-label">Open balance</span>
              <span className="finance-spotlight-value">{formatCurrency(summary.openBalance)}</span>
            </li>
          </ul>
        </div>
        <div className="finance-spotlight-actions">
          <a className="button button-primary" href="/finances/vendors">
            Add vendor
          </a>
          <a className="button button-ghost" href="/finances/vendors">
            Download vendor list
          </a>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Vendor directory</h2>
            <p className="panel-subtitle">Contacts, payment terms, and open balances.</p>
          </div>
          <div className="finance-filter-chips">
            {vendorFilters.map(filter => (
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
                <th scope="col">Vendor</th>
                <th scope="col">Category</th>
                <th scope="col">Contacts</th>
                <th scope="col">Terms</th>
                <th scope="col">Last invoice</th>
                <th scope="col">Spend YTD</th>
                <th scope="col">Open balance</th>
                <th scope="col">Status</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-empty">Add vendors to start tracking spend.</td>
                </tr>
              ) : (
                vendors.map(vendor => (
                  <tr key={vendor.id}>
                    <td>{vendor.name}</td>
                    <td>{vendor.category}</td>
                    <td>
                      <ul className="finance-contact-list">
                        {vendor.contacts.map(contact => (
                          <li key={`${vendor.id}-${contact.email}`}>
                            <span>{contact.name}</span>
                            <span>{contact.email}</span>
                            {contact.phone ? <span>{contact.phone}</span> : null}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{vendor.paymentTerms}</td>
                    <td>{formatDate(vendor.lastInvoiceOn)}</td>
                    <td>{formatCurrencyPrecise(vendor.spendYtd)}</td>
                    <td>{formatCurrencyPrecise(vendor.openBalance)}</td>
                    <td>
                      <span className={`status-pill ${vendorStatusTone(vendor.status)}`}>
                        {formatStatus(vendor.status)}
                      </span>
                    </td>
                    <td>{vendor.notes ?? "—"}</td>
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
