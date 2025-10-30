import { getPurchaseOrders } from "../data";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
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
    year: "numeric",
  });
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("received") || normalized.includes("complete")) {
    return "status-active";
  }
  if (normalized.includes("cancel")) {
    return "status-leave";
  }
  if (normalized.includes("transit") || normalized.includes("partial")) {
    return "status-onboarding";
  }
  return "status-neutral";
}

export default async function PurchaseOrdersPage() {
  const orders = await getPurchaseOrders();

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2 className="panel-title">Purchase orders</h2>
          <p className="panel-subtitle">
            {orders.length
              ? `${orders.length} purchase orders synced from Supabase`
              : "Create orders in Supabase to see them here"}
          </p>
        </div>
      </header>
      <div className="table-wrap">
        <table className="table inventory-table">
          <thead>
            <tr>
              <th scope="col">Reference</th>
              <th scope="col">Vendor</th>
              <th scope="col">Submitted</th>
              <th scope="col">Expected</th>
              <th scope="col">Received</th>
              <th scope="col">Status</th>
              <th scope="col">Lines</th>
              <th scope="col">Total cost</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty">
                  Once purchase orders exist in Supabase they will stream into this table.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td className="row-primary">{order.reference}</td>
                  <td>
                    <div className="row-copy">
                      <span className="row-primary">{order.vendor}</span>
                      <span className="row-secondary">{order.lineItems.length} items</span>
                    </div>
                  </td>
                  <td>{formatDate(order.submittedAt)}</td>
                  <td>{formatDate(order.expectedAt)}</td>
                  <td>{formatDate(order.receivedAt)}</td>
                  <td>
                    <span className={`status-pill ${statusTone(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.lineItems.length}</td>
                  <td>{formatCurrency(order.totalCost)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
