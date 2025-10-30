import {
  buildCategorySummary,
  getInventoryItems,
  getPurchaseOrders,
  getStockAdjustments,
  summarizeInventory,
  type InventoryItem,
  type PurchaseOrder,
  type StockAdjustment,
} from "./data";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }
  return currencyFormatter.format(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function availableQuantity(item: InventoryItem) {
  return Math.max(0, item.onHand - item.reserved);
}

function reorderVariance(item: InventoryItem) {
  const par = item.parLevel ?? item.reorderPoint;
  if (par === null || par === undefined) {
    return null;
  }
  const available = availableQuantity(item);
  return available / par;
}

function isBelowPar(item: InventoryItem) {
  const par = item.parLevel ?? item.reorderPoint;
  if (par === null || par === undefined) {
    return false;
  }
  return availableQuantity(item) < par;
}

function pendingOrders(orders: PurchaseOrder[]) {
  return orders.filter(order => {
    const status = order.status.toLowerCase();
    return !status.includes("received") && !status.includes("cancel");
  });
}

function statusTone(status: string | null | undefined) {
  if (!status) {
    return "status-neutral";
  }
  const normalized = status.toLowerCase();
  if (normalized.includes("received") || normalized.includes("complete")) {
    return "status-active";
  }
  if (normalized.includes("transit") || normalized.includes("partial")) {
    return "status-onboarding";
  }
  if (normalized.includes("cancel")) {
    return "status-leave";
  }
  if (normalized.includes("reorder") || normalized.includes("low")) {
    return "status-onboarding";
  }
  return "status-neutral";
}

function adjustmentTone(adjustment: StockAdjustment) {
  if (adjustment.quantity === 0) {
    return "status-neutral";
  }
  return adjustment.quantity > 0 ? "status-active" : "status-leave";
}

export default async function Page() {
  const [items, purchaseOrders, adjustments] = await Promise.all([
    getInventoryItems(),
    getPurchaseOrders(),
    getStockAdjustments(),
  ]);

  const summary = summarizeInventory(items, purchaseOrders, adjustments);
  const categories = buildCategorySummary(items);
  const lowStock = items
    .filter(isBelowPar)
    .sort((a, b) => (a.parLevel ?? a.reorderPoint ?? 0) - (b.parLevel ?? b.reorderPoint ?? 0))
    .slice(0, 6);
  const openOrders = pendingOrders(purchaseOrders).slice(0, 4);
  const recentAdjustments = adjustments.slice(0, 5);

  const metrics = [
    {
      label: "On-hand value",
      value: formatCurrency(summary.onHandValue),
      accent: "metrics-total",
      description: "Available stock × last cost",
    },
    {
      label: "SKUs below par",
      value: summary.belowPar,
      accent: "metrics-leave",
      description: "Available quantity under par level",
    },
    {
      label: "Open purchase orders",
      value: summary.pendingPurchaseOrders,
      accent: "metrics-onboarding",
      description: formatCurrency(summary.pendingPurchaseValue),
    },
    {
      label: "Adjustments this month",
      value: summary.adjustmentsThisMonth,
      accent: "metrics-active",
      description: "Cycle counts, shrink, and usage",
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
            <h2 className="panel-title">Low stock alerts</h2>
            <p className="panel-subtitle">
              {lowStock.length
                ? `${lowStock.length} SKUs require reorder`
                : "All tracked SKUs are within par levels"}
            </p>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table inventory-table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Available</th>
                <th scope="col">Par level</th>
                <th scope="col">Variance</th>
                <th scope="col">Supplier</th>
                <th scope="col">Last count</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    No products are currently under par. Connect Supabase to see live alerts.
                  </td>
                </tr>
              ) : (
                lowStock.map(item => {
                  const available = availableQuantity(item);
                  const par = item.parLevel ?? item.reorderPoint ?? 0;
                  const variance = reorderVariance(item);
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="row-main">
                          <div className="row-copy">
                            <span className="row-primary">{item.name}</span>
                            <span className="row-secondary">
                              {(item.sku ?? "").toUpperCase()} · {item.category ?? "Uncategorized"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{available}</td>
                      <td>{par || "—"}</td>
                      <td>
                        {variance === null ? (
                          <span className="muted">—</span>
                        ) : (
                          <div className="inventory-variance">
                            <span>{percentFormatter.format(Math.min(variance, 1))}</span>
                            <div className="inventory-variance-bar">
                              <div
                                className="inventory-variance-fill"
                                style={{ width: `${Math.min(variance, 1) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                      <td>{item.supplier ?? "—"}</td>
                      <td>{formatDate(item.lastCountAt)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Category breakdown</h2>
            <p className="panel-subtitle">
              Inventory value split by product line, highlighting low-stock areas.
            </p>
          </div>
        </header>
        <div className="category-grid">
          {categories.length === 0 ? (
            <p className="appointments-empty">
              Add products to Supabase to see category performance.
            </p>
          ) : (
            categories.map(category => (
              <article key={category.category} className="category-card">
                <header>
                  <h3>{category.category}</h3>
                  <p>{category.onHand} units on hand</p>
                </header>
                <div className="category-value">{formatCurrency(category.value)}</div>
                <footer>
                  <span>
                    {category.belowPar} SKU{category.belowPar === 1 ? "" : "s"} below par
                  </span>
                </footer>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Open purchase orders</h2>
            <p className="panel-subtitle">
              Track inbound shipments and replenishment timelines.
            </p>
          </div>
        </header>
        <div className="purchase-grid">
          {openOrders.length === 0 ? (
            <p className="appointments-empty">
              No purchase orders are currently in flight.
            </p>
          ) : (
            openOrders.map(order => (
              <article key={order.id} className="purchase-card">
                <header className="purchase-card-header">
                  <div>
                    <h3>{order.reference}</h3>
                    <p>{order.vendor}</p>
                  </div>
                  <span className={`status-pill ${statusTone(order.status)}`}>
                    {order.status}
                  </span>
                </header>
                <dl className="purchase-stats">
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatDate(order.submittedAt)}</dd>
                  </div>
                  <div>
                    <dt>Expected</dt>
                    <dd>{formatDate(order.expectedAt)}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{formatCurrency(order.totalCost)}</dd>
                  </div>
                </dl>
                <ul className="purchase-lines">
                  {order.lineItems.slice(0, 4).map(line => (
                    <li key={`${order.id}-${line.sku}`}>
                      <span>{line.name}</span>
                      <span>{line.quantity} @ {formatCurrency(line.unitCost)}</span>
                    </li>
                  ))}
                  {order.lineItems.length > 4 ? (
                    <li className="muted">+ {order.lineItems.length - 4} more items</li>
                  ) : null}
                </ul>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Recent adjustments</h2>
            <p className="panel-subtitle">
              Usage, shrink, and variance activity synced from cycle counts.
            </p>
          </div>
        </header>
        <ul className="adjustment-list">
          {recentAdjustments.length === 0 ? (
            <li className="appointments-empty">
              Inventory adjustments will appear here as Supabase data syncs.
            </li>
          ) : (
            recentAdjustments.map(adjustment => (
              <li key={adjustment.id}>
                <div className="adjustment-row">
                  <div className="adjustment-copy">
                    <span className="adjustment-item">{adjustment.itemName}</span>
                    <span className="adjustment-meta">
                      {(adjustment.sku ?? "").toUpperCase()} · {adjustment.reason ?? "No reason logged"}
                    </span>
                  </div>
                  <div className="adjustment-quantity">
                    <span className={`status-pill ${adjustmentTone(adjustment)}`}>
                      {adjustment.quantity > 0 ? `+${adjustment.quantity}` : adjustment.quantity}
                    </span>
                  </div>
                  <div className="adjustment-details">
                    <span>{adjustment.performedBy ?? "Team"}</span>
                    <span>{formatDate(adjustment.performedAt)}</span>
                  </div>
                </div>
                {adjustment.notes ? (
                  <p className="adjustment-notes">{adjustment.notes}</p>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
