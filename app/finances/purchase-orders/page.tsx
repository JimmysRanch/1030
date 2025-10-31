import {
  getFinancePurchaseOrders,
  summarizePurchaseOrders,
} from "../data";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatNumber,
  formatStatus,
  purchaseOrderStatusTone,
} from "../format";

const purchaseFilters = ["All", "Awaiting receipt", "Approved", "Draft", "Received"];

export default async function Page() {
  const orders = await getFinancePurchaseOrders();
  const summary = summarizePurchaseOrders(orders);

  const metrics = [
    {
      label: "Open orders",
      value: formatNumber(summary.openOrders),
      accent: "metrics-onboarding",
      description: `${formatNumber(summary.awaitingReceipt)} awaiting receipt`,
    },
    {
      label: "Committed spend",
      value: formatCurrency(summary.totalCommitted),
      accent: "metrics-total",
      description: "Total value of purchase orders",
    },
    {
      label: "Received",
      value: formatNumber(summary.receivedOrders),
      accent: "metrics-active",
      description: "Orders fulfilled this quarter",
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
          <h2>Receiving queue</h2>
          <p>
            Keep your inventory up to date by marking items as received and closing out fulfilled purchase orders.
          </p>
        </div>
        <div className="finance-spotlight-actions">
          <a className="button button-primary" href="/finances/purchase-orders">
            Create purchase order
          </a>
          <a className="button button-ghost" href="/finances/purchase-orders">
            Print receiving list
          </a>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Purchase order ledger</h2>
            <p className="panel-subtitle">Track approvals, expected arrivals, and remaining balances.</p>
          </div>
          <div className="finance-filter-chips">
            {purchaseFilters.map(filter => (
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
                <th scope="col">PO</th>
                <th scope="col">Vendor</th>
                <th scope="col">Issued</th>
                <th scope="col">Expected</th>
                <th scope="col">Items</th>
                <th scope="col">Subtotal</th>
                <th scope="col">Tax</th>
                <th scope="col">Shipping</th>
                <th scope="col">Total</th>
                <th scope="col">Balance</th>
                <th scope="col">Status</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="table-empty">No purchase orders yet.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.vendor}</td>
                    <td>{formatDate(order.issuedOn)}</td>
                    <td>{formatDate(order.expectedOn)}</td>
                    <td>{order.items.join(", ")}</td>
                    <td>{formatCurrencyPrecise(order.subtotal)}</td>
                    <td>{formatCurrencyPrecise(order.tax)}</td>
                    <td>{formatCurrencyPrecise(order.shipping)}</td>
                    <td>{formatCurrencyPrecise(order.total)}</td>
                    <td>{formatCurrencyPrecise(order.balanceDue)}</td>
                    <td>
                      <span className={`status-pill ${purchaseOrderStatusTone(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td>{order.memo ?? "—"}</td>
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
