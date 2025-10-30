const rosterMetrics = [
  {
    label: "Total Clients",
    value: "268",
    description: "Including active grooming plans and walk-ins",
    className: "metrics-total",
  },
  {
    label: "Membership Plans",
    value: "142",
    description: "Clients on recurring services",
    className: "metrics-active",
  },
  {
    label: "New This Month",
    value: "18",
    description: "New client profiles created in April",
    className: "metrics-onboarding",
  },
  {
    label: "At-Risk",
    value: "9",
    description: "Clients overdue by 60+ days",
    className: "metrics-leave",
  },
];

const clientHighlights = [
  {
    title: "Recently Added",
    client: "Kendrick & Poppy",
    note: "Scheduled deluxe grooming with spa add-ons",
    time: "Added 2h ago",
  },
  {
    title: "Membership Renewal",
    client: "Aliyah & Nori",
    note: "Auto-renewal processed for VIP bath plan",
    time: "Renewed yesterday",
  },
  {
    title: "Follow-up Needed",
    client: "Noah & Pepper",
    note: "Payment failed—retry before next visit",
    time: "Flagged 3d ago",
  },
];

export default function Page() {
  return (
    <div className="page-stack gap-large">
      <section className="metrics-grid" aria-label="Client metrics overview">
        {rosterMetrics.map(metric => (
          <article
            key={metric.label}
            className={`metrics-card ${metric.className ?? ""}`.trim()}
          >
            <span className="metrics-label">{metric.label}</span>
            <strong className="metrics-value">{metric.value}</strong>
            <p className="metrics-description">{metric.description}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Account Health</h2>
            <p className="panel-subtitle">
              Review the latest client activity so you can stay proactive with
              outreach and retention.
            </p>
          </div>
        </div>
        <div className="client-highlights">
          {clientHighlights.map(item => (
            <article key={item.client} className="client-highlight">
              <header>
                <p className="client-highlight-title">{item.title}</p>
                <span className="client-highlight-time">{item.time}</span>
              </header>
              <h3>{item.client}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
