import { getInventoryVendors } from "../data";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

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
  });
}

function formatRating(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }
  return value.toFixed(1);
}

export default async function VendorsPage() {
  const vendors = await getInventoryVendors();

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2 className="panel-title">Vendors</h2>
          <p className="panel-subtitle">
            Preferred suppliers, lead times, and contact information.
          </p>
        </div>
      </header>
      <div className="vendor-grid">
        {vendors.length === 0 ? (
          <p className="appointments-empty">
            Vendor profiles will appear here once Supabase is connected.
          </p>
        ) : (
          vendors.map(vendor => (
            <article key={vendor.id} className="vendor-card">
              <header className="vendor-header">
                <div>
                  <h3>{vendor.name}</h3>
                  <p>{vendor.categories.join(" · ") || "Product categories TBD"}</p>
                </div>
                <div className="vendor-rating">
                  <span className="rating-value">{formatRating(vendor.rating)}</span>
                  <span className="rating-label">Rating</span>
                </div>
              </header>
              <dl className="vendor-stats">
                <div>
                  <dt>Lead time</dt>
                  <dd>
                    {vendor.leadTimeDays !== null && vendor.leadTimeDays !== undefined
                      ? `${numberFormatter.format(vendor.leadTimeDays)} days`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt>Minimum order</dt>
                  <dd>{formatCurrency(vendor.minOrder)}</dd>
                </div>
                <div>
                  <dt>Last order</dt>
                  <dd>{formatDate(vendor.lastOrderAt)}</dd>
                </div>
                <div>
                  <dt>Payment terms</dt>
                  <dd>{vendor.paymentTerms ?? "—"}</dd>
                </div>
              </dl>
              <footer className="vendor-footer">
                <div className="vendor-contact">
                  <span>{vendor.contact ?? "Contact TBD"}</span>
                  <span>{vendor.phone ?? "Phone TBD"}</span>
                  <span>{vendor.email ?? "Email TBD"}</span>
                </div>
              </footer>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
