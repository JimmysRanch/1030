import { getCycleCounts } from "../data";

function formatDate(value: string | null | undefined, withYear = false) {
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
    year: withYear ? "numeric" : undefined,
    hour: "numeric",
    minute: "2-digit",
  });
}

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

export default async function CountsPage() {
  const counts = await getCycleCounts();

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2 className="panel-title">Cycle counts</h2>
          <p className="panel-subtitle">
            Scheduled and completed audits across inventory areas.
          </p>
        </div>
      </header>
      <div className="count-grid">
        {counts.length === 0 ? (
          <p className="appointments-empty">
            Schedule cycle counts in Supabase to manage audits here.
          </p>
        ) : (
          counts.map(count => (
            <article key={count.id} className="count-card">
              <header>
                <h3>{count.area}</h3>
                <p>Lead: {count.lead ?? "Unassigned"}</p>
              </header>
              <dl className="count-stats">
                <div>
                  <dt>Scheduled</dt>
                  <dd>{formatDate(count.scheduledFor, true)}</dd>
                </div>
                <div>
                  <dt>Completed</dt>
                  <dd>{formatDate(count.completedAt, true)}</dd>
                </div>
                <div>
                  <dt>Variance qty</dt>
                  <dd>{count.varianceCount}</dd>
                </div>
                <div>
                  <dt>Variance value</dt>
                  <dd>{formatCurrency(count.varianceValue)}</dd>
                </div>
              </dl>
              {count.notes ? <p className="count-notes">{count.notes}</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
