type Metric = {
  label: string;
  value: string;
  description: string;
  accentClass?: string;
  chart?: number[];
  streak?: number[];
  progress?: number;
};

const metrics: Metric[] = [
  {
    label: "Appointments Today",
    value: "18",
    description: "12 completed · 6 upcoming",
    accentClass: "metrics-total",
    chart: [6, 9, 12, 18, 15, 20, 18],
  },
  {
    label: "This Week",
    value: "74",
    description: "Up 12% vs. last week",
    chart: [42, 48, 51, 63, 58, 69, 74],
  },
  {
    label: "Booked Today",
    value: "86%",
    description: "Of available slots filled",
    accentClass: "metrics-onboarding",
    progress: 86,
  },
  {
    label: "Active Clients",
    value: "312",
    description: "14 new this week",
    streak: [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    accentClass: "metrics-active",
  },
  {
    label: "Monthly Revenue",
    value: "$42.6k",
    description: "$6.2k from new clients",
    accentClass: "metrics-total",
    chart: [24, 27, 31, 33, 37, 39, 42],
  },
  {
    label: "Avg. Ticket",
    value: "$73",
    description: "30 day trailing average",
    accentClass: "metrics-leave",
    progress: 72,
  },
];

type Message = {
  id: string;
  name: string;
  initials: string;
  title: string;
  body: string;
  time: string;
};

type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  time: string;
  detail?: string;
};

const messages: Message[] = [
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
  {
    id: "tina-hernandez",
    name: "Tina Hernandez",
    initials: "TH",
    title: "Add blueberry facial for Momo",
    body: "Could we add the blueberry facial to Momo's bath this afternoon?",
    time: "1d ago",
  },
  {
    id: "oliver-wells",
    name: "Oliver Wells",
    initials: "OW",
    title: "Question about loyalty points",
    body: "How many more points do we need before Max qualifies for a free groom?",
    time: "3d ago",
  },
];

const recentActivity: ActivityItem[] = [
  {
    id: "activity-1",
    actor: "Lauren Patel",
    action: "checked in Peanut for Full Groom",
    detail: "Assigned to Jamie",
    time: "5m ago",
  },
  {
    id: "activity-2",
    actor: "Jamie Lee",
    action: "completed Charlie's haircut",
    detail: "Rated 5 stars",
    time: "26m ago",
  },
  {
    id: "activity-3",
    actor: "Jess Reed",
    action: "added PupScouts daycare add-on",
    detail: "For Daisy",
    time: "1h ago",
  },
  {
    id: "activity-4",
    actor: "Lauren Patel",
    action: "scheduled follow-up for Luna",
    detail: "Next visit on Apr 11",
    time: "2h ago",
  },
  {
    id: "activity-5",
    actor: "Courtney Bell",
    action: "refunded nail trim add-on",
    detail: "Invoice #8831",
    time: "Yesterday",
  },
];

type Groomer = {
  id: string;
  name: string;
  initials: string;
  role: string;
  status: "active" | "neutral" | "leave" | "onboarding";
  statusLabel: string;
  shift: string;
  pets: number;
  capacity: number;
  specialties: string[];
};

const groomers: Groomer[] = [
  {
    id: "jamie-lee",
    name: "Jamie Lee",
    initials: "JL",
    role: "Senior Groomer",
    status: "active",
    statusLabel: "On schedule",
    shift: "Shift: 8:00a – 4:00p",
    pets: 6,
    capacity: 8,
    specialties: ["Doodles", "Hand stripping"],
  },
  {
    id: "taylor-ng",
    name: "Taylor Ng",
    initials: "TN",
    role: "Groomer",
    status: "active",
    statusLabel: "Currently bathing Scout",
    shift: "Shift: 9:30a – 5:30p",
    pets: 5,
    capacity: 7,
    specialties: ["Small breeds", "Color touch-ups"],
  },
  {
    id: "lauren-patel",
    name: "Lauren Patel",
    initials: "LP",
    role: "Stylist",
    status: "neutral",
    statusLabel: "Prep for Peanut",
    shift: "Shift: 10:00a – 6:00p",
    pets: 4,
    capacity: 6,
    specialties: ["Poodles", "Show cuts"],
  },
  {
    id: "bryce-miller",
    name: "Bryce Miller",
    initials: "BM",
    role: "Bather",
    status: "onboarding",
    statusLabel: "Shadowing Jess",
    shift: "Shift: 11:00a – 7:00p",
    pets: 2,
    capacity: 5,
    specialties: ["Bath & brush", "Teeth cleaning"],
  },
];

export default function Page() {
  return (
    <section className="page dashboard">
      <div className="dashboard-stack">
        <div className="dashboard-metrics metrics-grid">
          {metrics.map((metric, index) => {
            const chart = metric.chart ?? [];
            const streak = metric.streak ?? [];
            const hasChart = chart.length > 0;
            const hasStreak = streak.length > 0;
            const hasProgress = typeof metric.progress === "number";
            const progressValue = Math.max(0, Math.min(metric.progress ?? 0, 100));
            const gradientId = `metric-chart-gradient-${index}`;

            return (
              <article
                key={metric.label}
                className={`metrics-card ${metric.accentClass ?? ""}`}
              >
                <span className="metrics-label">{metric.label}</span>
                <div className="metrics-figure">
                  <span className="metrics-value">{metric.value}</span>
                  {hasChart ? (
                    <svg
                      className="metric-chart"
                      viewBox="0 0 120 44"
                      role="img"
                      aria-label="Weekly appointment trend"
                    >
                      <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgba(78,161,255,0.95)" />
                          <stop offset="100%" stopColor="rgba(126,233,255,0.4)" />
                        </linearGradient>
                      </defs>
                      <polyline
                        className="metric-chart-line"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke={`url(#${gradientId})`}
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
                            fill={`url(#${gradientId})`}
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
                  {hasProgress ? (
                    <div className="metric-progress" aria-hidden="true">
                      <span className="metric-progress-track">
                        <span style={{ width: `${progressValue}%` }} />
                      </span>
                    </div>
                  ) : null}
                </div>
                <p className="metrics-description">{metric.description}</p>
              </article>
            );
          })}
        </div>

        <div className="dashboard-panels-grid">
          <div className="dashboard-column">
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

            <section className="panel activity-panel">
              <header className="panel-header">
                <div>
                  <h2 className="panel-title">Recent Activity</h2>
                  <p className="panel-subtitle">Latest activity by staff members</p>
                </div>
              </header>
              {recentActivity.length === 0 ? (
                <div className="empty-state activity-empty">
                  <div className="empty-ring" aria-hidden="true">
                    <span className="empty-ring-inner" />
                  </div>
                  <p>No recent activity</p>
                  <span className="empty-subcopy">There&rsquo;s no recent activity to display.</span>
                </div>
              ) : (
                <ul className="activity-list">
                  {recentActivity.map(item => (
                    <li key={item.id} className="activity-item">
                      <div className="activity-copy">
                        <span className="activity-actor">{item.actor}</span>
                        <span className="activity-action">{item.action}</span>
                        {item.detail ? <span className="activity-detail">{item.detail}</span> : null}
                      </div>
                      <span className="activity-time">{item.time}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="dashboard-column">
            <section className="panel workload-panel">
              <header className="panel-header">
                <div>
                  <h2 className="panel-title">Groomer Workload</h2>
                  <p className="panel-subtitle">Monitor who&rsquo;s on the floor today</p>
                </div>
                <button className="ghost-button" type="button">
                  Manage Schedule
                </button>
              </header>
              {groomers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-ring" aria-hidden="true">
                    <span className="empty-ring-inner" />
                  </div>
                  <p>No active groomers</p>
                  <span className="empty-subcopy">Check back once shifts are assigned.</span>
                </div>
              ) : (
                <ul className="workload-list">
                  {groomers.map(groomer => {
                    const load = Math.max(
                      0,
                      Math.min(Math.round((groomer.pets / groomer.capacity) * 100), 100),
                    );

                    return (
                      <li key={groomer.id} className="workload-item">
                        <div className="workload-main">
                          <div className="workload-avatar" aria-hidden="true">
                            {groomer.initials}
                          </div>
                          <div className="workload-copy">
                            <span className="workload-name">{groomer.name}</span>
                            <span className="workload-role">{groomer.role}</span>
                          </div>
                        </div>
                        <div className="workload-meta">
                          <span className={`status-pill status-${groomer.status}`}>
                            {groomer.statusLabel}
                          </span>
                          <span className="workload-shift">{groomer.shift}</span>
                        </div>
                        <div className="workload-progress">
                          <div className="workload-progress-track">
                            <span style={{ width: `${load}%` }} />
                          </div>
                          <span className="workload-count">{groomer.pets} / {groomer.capacity} pets</span>
                        </div>
                        <div className="workload-specialties">
                          {groomer.specialties.map(specialty => (
                            <span key={specialty} className="chip">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
