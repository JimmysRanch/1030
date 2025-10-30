import { getStockAdjustments } from "../data";

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusTone(quantity: number) {
  if (quantity > 0) {
    return "status-active";
  }
  if (quantity < 0) {
    return "status-leave";
  }
  return "status-neutral";
}

export default async function AdjustmentsPage() {
  const adjustments = await getStockAdjustments();

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2 className="panel-title">Inventory adjustments</h2>
          <p className="panel-subtitle">
            Shrink, usage, and manual corrections synced from Supabase.
          </p>
        </div>
      </header>
      <div className="table-wrap">
        <table className="table inventory-table">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">SKU</th>
              <th scope="col">Type</th>
              <th scope="col">Quantity</th>
              <th scope="col">Reason</th>
              <th scope="col">Performed by</th>
              <th scope="col">Performed at</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty">
                  Adjustments from Supabase will display here when available.
                </td>
              </tr>
            ) : (
              adjustments.map(adjustment => (
                <tr key={adjustment.id}>
                  <td className="row-primary">{adjustment.itemName}</td>
                  <td>{(adjustment.sku ?? "").toUpperCase() || "—"}</td>
                  <td>{adjustment.type}</td>
                  <td>
                    <span className={`status-pill ${statusTone(adjustment.quantity)}`}>
                      {adjustment.quantity > 0 ? `+${adjustment.quantity}` : adjustment.quantity}
                    </span>
                  </td>
                  <td>{adjustment.reason ?? "—"}</td>
                  <td>{adjustment.performedBy ?? "—"}</td>
                  <td>{formatDate(adjustment.performedAt)}</td>
                  <td>{adjustment.notes ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
