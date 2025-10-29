import {
  getWaitlist,
  summarizeWaitlist,
  type WaitlistEntry,
} from "../data";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return timeFormatter.format(date);
}

function waitlistStatusTone(entry: WaitlistEntry) {
  const status = (entry.status ?? "").toLowerCase();
  if (status.includes("ready") || status.includes("confirm")) {
    return "status-active";
  }
  if (status.includes("hold") || status.includes("snooze")) {
    return "status-onboarding";
  }
  if (status.includes("cancel")) {
    return "status-leave";
  }
  return "status-neutral";
}

function formatPriority(value: string | null) {
  if (!value) {
    return "Standard";
  }
  return value.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

function categorize(entries: WaitlistEntry[]) {
  const urgent: WaitlistEntry[] = [];
  const standard: WaitlistEntry[] = [];
  const low: WaitlistEntry[] = [];

  for (const entry of entries) {
    const priority = (entry.priority ?? "").toLowerCase();
    if (priority.includes("urgent") || priority.includes("vip")) {
      urgent.push(entry);
      continue;
    }
    if (priority.includes("low")) {
      low.push(entry);
      continue;
    }
    standard.push(entry);
  }

  return { urgent, standard, low };
}

export default async function Page() {
  const entries = await getWaitlist();
  const summary = summarizeWaitlist(entries);
  const groups = categorize(entries);

  const metrics = [
    {
      label: "Total waitlist",
      value: summary.total,
      accent: "metrics-total",
      description: "Guests waiting for placement",
    },
    {
      label: "Urgent",
      value: summary.urgent,
      accent: "metrics-active",
      description: "Priority VIP or medical",
    },
    {
      label: "Avg lead",
      value: summary.averageLeadMinutes ? `${summary.averageLeadMinutes} min` : "—",
      accent: "metrics-onboarding",
      description: "Time between request and desired slot",
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
            <h2 className="panel-title">Prioritized waitlist</h2>
            <p className="panel-subtitle">
              {summary.total
                ? `${summary.total} guests queued · ${summary.urgent} urgent`
                : "No waitlist entries"}
            </p>
          </div>
        </header>
        <div className="waitlist-groups">
          {renderGroup("Urgent", groups.urgent)}
          {renderGroup("Standard", groups.standard)}
          {renderGroup("Low", groups.low)}
        </div>
      </section>
    </div>
  );
}

function renderGroup(label: string, entries: WaitlistEntry[]) {
  return (
    <div className="waitlist-group">
      <header className="waitlist-group-header">
        <h3>{label}</h3>
        <span>{entries.length}</span>
      </header>
      <div className="waitlist-grid">
        {entries.length === 0 ? (
          <p className="appointments-empty">No entries.</p>
        ) : (
          entries.map(entry => (
            <article key={entry.id} className="waitlist-card">
              <header className="waitlist-header">
                <div>
                  <h3>{entry.clientName}</h3>
                  {entry.petName ? <p>{entry.petName}</p> : null}
                </div>
                <span className={`status-pill ${waitlistStatusTone(entry)}`}>
                  {entry.status ?? "Requested"}
                </span>
              </header>
              <div className="waitlist-meta">
                <span>{entry.service ?? "Service TBD"}</span>
                <span>{formatPriority(entry.priority)}</span>
                <span>{entry.channel ?? "Channel TBD"}</span>
              </div>
              <footer className="waitlist-footer">
                <span>Preferred: {formatDate(entry.preferredStart)}</span>
                <span>Requested: {formatDate(entry.createdAt)}</span>
              </footer>
              {entry.notes ? <p className="waitlist-notes">{entry.notes}</p> : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
