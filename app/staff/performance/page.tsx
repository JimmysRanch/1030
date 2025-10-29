import { getStaffPerformance, type StaffPerformanceRow } from "../data";

const ratingFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatRating(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }
  return ratingFormatter.format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return dateFormatter.format(date);
}

function goalProgress(goals: StaffPerformanceRow["goals"]) {
  if (!goals.length) {
    return 0;
  }
  const total = goals.reduce((sum, goal) => sum + (goal.progress ?? 0), 0);
  return Math.round(total / goals.length);
}

export default async function Page() {
  const performance = await getStaffPerformance();

  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Performance snapshots</h2>
            <p className="panel-subtitle">
              {performance.length
                ? `${performance.length} reviews`
                : "Connect Supabase reviews"}
            </p>
          </div>
        </header>
        <div className="performance-grid">
          {performance.length === 0 ? (
            <div className="performance-empty">
              Link your Supabase performance table to visualize ratings, goals, and
              recognition.
            </div>
          ) : (
            performance.map(item => <PerformanceCard key={item.id} item={item} />)
          )}
        </div>
      </section>
    </div>
  );
}

function PerformanceCard({ item }: { item: StaffPerformanceRow }) {
  const progress = goalProgress(item.goals);

  return (
    <article className="performance-card">
      <header className="performance-header">
        <div>
          <h3>{item.staffName}</h3>
          <p>Last review {formatDate(item.lastReviewAt)}</p>
        </div>
        <div className="performance-rating">
          <span className="rating-value">{formatRating(item.avgRating)}</span>
          <span className="rating-label">Avg rating</span>
        </div>
      </header>
      <div className="performance-body">
        <dl className="performance-stats">
          <div>
            <dt>Reviews</dt>
            <dd>{item.reviewCount}</dd>
          </div>
          <div>
            <dt>Goals progress</dt>
            <dd>{progress}%</dd>
          </div>
        </dl>
        <div className="progress-bar" aria-label="Goal progress">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="chip-list">
          {item.specialties.length ? (
            item.specialties.map(value => (
              <span key={value} className="chip">
                {value}
              </span>
            ))
          ) : (
            <span className="muted">No specialties listed</span>
          )}
        </div>
      </div>
      {item.accolades.length ? (
        <footer className="performance-footer">
          <h4>Recognition</h4>
          <ul>
            {item.accolades.map(entry => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </footer>
      ) : null}
    </article>
  );
}
