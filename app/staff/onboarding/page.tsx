import { getStaffOnboarding, type StaffOnboardingRow } from "../data";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

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

function statusTone(status: string | null) {
  if (!status) {
    return "status-onboarding";
  }
  const normalized = status.toLowerCase();
  if (normalized.includes("complete") || normalized.includes("active")) {
    return "status-active";
  }
  if (normalized.includes("hold") || normalized.includes("paused")) {
    return "status-leave";
  }
  return "status-onboarding";
}

function progressPercent(checklist: StaffOnboardingRow["checklist"]) {
  if (!checklist.length) {
    return 0;
  }
  const completed = checklist.filter(item => item.completed).length;
  return Math.round((completed / checklist.length) * 100);
}

export default async function Page() {
  const onboarding = await getStaffOnboarding();

  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Onboarding checklists</h2>
            <p className="panel-subtitle">
              {onboarding.length
                ? `${onboarding.length} team members`
                : "No onboarding data"}
            </p>
          </div>
        </header>
        <div className="onboarding-grid">
          {onboarding.length === 0 ? (
            <div className="onboarding-empty">
              Connect Supabase onboarding tables to track new hire progress.
            </div>
          ) : (
            onboarding.map(entry => <OnboardingCard key={entry.id} entry={entry} />)
          )}
        </div>
      </section>
    </div>
  );
}

function OnboardingCard({ entry }: { entry: StaffOnboardingRow }) {
  const progress = progressPercent(entry.checklist);

  return (
    <article className="onboarding-card">
      <header className="onboarding-header">
        <div>
          <h3>{entry.staffName}</h3>
          <p>Start {formatDate(entry.startDate)}</p>
        </div>
        <span className={`status-pill ${statusTone(entry.status)}`}>
          {entry.status ? entry.status : "Onboarding"}
        </span>
      </header>
      <div className="progress-bar" aria-label="Checklist progress">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="onboarding-meta">
        <span>{progress}% complete</span>
        <span>Mentor: {entry.mentor ?? "TBD"}</span>
      </div>
      <ul className="checklist">
        {entry.checklist.length === 0 ? (
          <li className="muted">Checklist items will appear here</li>
        ) : (
          entry.checklist.map(item => (
            <li key={item.label} className={item.completed ? "done" : undefined}>
              <span className="check" aria-hidden>
                {item.completed ? "✓" : "○"}
              </span>
              <span>{item.label}</span>
            </li>
          ))
        )}
      </ul>
      {entry.notes ? <p className="onboarding-notes">{entry.notes}</p> : null}
    </article>
  );
}
