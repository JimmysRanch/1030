import { getInventoryItems, type InventoryItem } from "../data";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
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
    year: "numeric",
  });
}

function statusTone(item: InventoryItem) {
  const status = (item.status ?? "").toLowerCase();
  if (status.includes("discontinued")) {
    return "status-leave";
  }
  if (status.includes("needs") || status.includes("low")) {
    return "status-onboarding";
  }
  return "status-active";
}

function available(item: InventoryItem) {
  return Math.max(0, item.onHand - item.reserved);
}

export default async function ProductsPage() {
  const items = await getInventoryItems();

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2 className="panel-title">Product catalog</h2>
          <p className="panel-subtitle">
            {items.length ? `${items.length} active SKUs` : "Connect Supabase to sync your catalog"}
          </p>
        </div>
      </header>
      <div className="table-wrap">
        <table className="table inventory-table">
          <thead>
            <tr>
              <th scope="col">SKU</th>
              <th scope="col">Product</th>
              <th scope="col">Category</th>
              <th scope="col">On hand</th>
              <th scope="col">Reserved</th>
              <th scope="col">Available</th>
              <th scope="col">Par</th>
              <th scope="col">Unit cost</th>
              <th scope="col">Unit price</th>
              <th scope="col">Supplier</th>
              <th scope="col">Last count</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={12} className="table-empty">
                  Products will appear here once Supabase inventory tables are populated.
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id}>
                  <td>{(item.sku ?? "").toUpperCase() || "—"}</td>
                  <td>
                    <div className="row-copy">
                      <span className="row-primary">{item.name}</span>
                      <span className="row-secondary">{item.supplier ?? "Supplier TBD"}</span>
                    </div>
                  </td>
                  <td>{item.category ?? "—"}</td>
                  <td>{item.onHand}</td>
                  <td>{item.reserved}</td>
                  <td>{available(item)}</td>
                  <td>{item.parLevel ?? item.reorderPoint ?? "—"}</td>
                  <td>{formatCurrency(item.unitCost)}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{item.supplier ?? "—"}</td>
                  <td>{formatDate(item.lastCountAt)}</td>
                  <td>
                    <span className={`status-pill ${statusTone(item)}`}>
                      {item.status ?? "Active"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
