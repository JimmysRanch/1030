const metrics = [
  {
    label: "Appointments Today",
    value: "0",
    description: "0 appointments on the books",
    accentClass: "metrics-total",
  },
  {
    label: "This Week",
    value: "0",
    description: "Total scheduled appointments",
    chart: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    label: "Booked Today",
    value: "0%",
    description: "Of available slots filled",
    accentClass: "metrics-onboarding",
  },
  {
    label: "Active Clients",
    value: "0",
    description: "0 new this week",
    streak: Array(12).fill(0),
    accentClass: "metrics-active",
  },
  {
    label: "Monthly Revenue",
    value: "$0",
    description: "$0 from new clients",
    accentClass: "metrics-total",
  },
  {
    label: "Avg. Ticket",
    value: "$0",
    description: "30 day trailing average",
    accentClass: "metrics-leave",
  },
];

const messages = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    initials: "SJ",
    title: "Rocky's appointment reschedule?",
    body: "Can we move Rocky's grooming appointment to next Tuesday?",
    time: "2h ago",
  },
  {
    id: "mike-chan",
    name: "Mike Chan",
    initials: "MC",
    title: "Thanks for the great service!",
    body: "Wanted to say thanks – Bailey looks amazing after yesterday's visit.",
    time: "1d ago",
  },
];

export default function Page() {
  return (
    <section className="page dashboard">
      <div className="dashboard-stack">
        <div className="dashboard-metrics metrics-grid">
          {metrics.map(metric => {
            const chart = metric.chart ?? [];
            const streak = metric.streak ?? [];
            const hasChart = chart.length > 0;
            const hasStreak = streak.length > 0;

            return (
              <article
                key={metric.label}
                className={`metrics-card ${metric.accentClass ?? ""}`}
              >
                <span className="metrics-label">{metric.label}</span>
                <div className="metrics-figure">
                  <span className="metrics-value">{metric.value}</span>
                  {hasChart ? (
                    <svg className="metric-chart" viewBox="0 0 120 44" role="img" aria-label="Weekly appointment trend">
                      <polyline
                        className="metric-chart-line"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        points={chart
                          .map((point, index) => {
                            const x = (120 / Math.max(chart.length - 1, 1)) * index;
                            const y = 40 - point * 4;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                      />
                      {chart.map((point, index) => {
                        const x = (120 / Math.max(chart.length - 1, 1)) * index;
                        const y = 40 - point * 4;
                        return (
                          <circle
                            key={index}
                            className="metric-chart-dot"
                            cx={x}
                            cy={y}
                            r={2.8}
                          />
                        );
                      })}
                    </svg>
                  ) : null}
                  {hasStreak ? (
                    <div className="metric-streak" aria-hidden="true">
                      {streak.map((value, index) => (
                        <span
                          key={index}
                          className={`metric-streak-bar metric-streak-bar-${value > 0 ? "full" : "empty"}`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
                <p className="metrics-description">{metric.description}</p>
              </article>
            );
          })}
        </div>

        <div className="dashboard-panels">
          <section className="panel messages-panel">
            <header className="panel-header">
              <div>
                <h2 className="panel-title">Messages</h2>
                <p className="panel-subtitle">Latest check-ins from pet parents</p>
              </div>
              <button className="ghost-button" type="button">
                View Inbox
              </button>
            </header>
            <ul className="message-list">
              {messages.map(message => (
                <li key={message.id} className="message-item">
                  <div className="message-avatar" aria-hidden="true">
                    {message.initials}
                  </div>
                  <div className="message-copy">
                    <div className="message-header">
                      <span className="message-name">{message.name}</span>
                      <span className="message-time">{message.time}</span>
                    </div>
                    <div className="message-title">{message.title}</div>
                    <p className="message-snippet">{message.body}</p>
                  </div>
                </li>
              ))}
              {messages.length === 0 ? (
                <li className="message-empty">You&rsquo;re all caught up! 🎉</li>
              ) : null}
            </ul>
          </section>

          <section className="panel workload-panel">
            <header className="panel-header">
              <div>
                <h2 className="panel-title">Groomer Workload</h2>
                <p className="panel-subtitle">Monitor who&rsquo;s on the floor today</p>
              </div>
            </header>
            <div className="empty-state">
              <div className="empty-ring" aria-hidden="true">
                <span className="empty-ring-inner" />
              </div>
              <p>No active groomers</p>
              <span className="empty-subcopy">Check back once shifts are assigned.</span>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
