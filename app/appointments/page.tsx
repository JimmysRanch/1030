import {
  getAppointments,
  getWaitlist,
  summarizeAppointments,
  summarizeWaitlist,
  type Appointment,
  type WaitlistEntry,
} from "./data";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

function formatCurrency(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }
  return currencyFormatter.format(value);
}

function formatTime(value: string | null) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return timeFormatter.format(date);
}

function formatTimeRange(start: string | null, end: string | null) {
  const startText = formatTime(start);
  const endText = end ? formatTime(end) : "TBD";
  if (!start || startText === "—") {
    return end ? `Ends ${endText}` : "Time TBD";
  }
  return `${startText} – ${endText}`;
}

function formatDay(value: string | null) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return dayFormatter.format(date);
}

function statusTone(status: string | null) {
  if (!status) {
    return "status-neutral";
  }
  const normalized = status.toLowerCase();
  if (normalized.includes("check-in") || normalized.includes("in service")) {
    return "status-active";
  }
  if (normalized.includes("complete") || normalized.includes("checkout")) {
    return "status-onboarding";
  }
  if (normalized.includes("cancel") || normalized.includes("no-show")) {
    return "status-leave";
  }
  return "status-neutral";
}

function bucketAppointments(appointments: Appointment[]) {
  const arrivals: Appointment[] = [];
  const inService: Appointment[] = [];
  const completed: Appointment[] = [];

  for (const appt of appointments) {
    const status = (appt.status ?? "").toLowerCase();
    if (status.includes("complete") || status.includes("checkout")) {
      completed.push(appt);
      continue;
    }
    if (status.includes("check-in") || status.includes("in service")) {
      inService.push(appt);
      continue;
    }
    arrivals.push(appt);
  }

  return { arrivals, inService, completed };
}

function servicesLabel(services: string[], fallback: string | null) {
  if (services.length) {
    return services.slice(0, 3).join(" · ");
  }
  return fallback ?? "Service TBD";
}

function waitlistStatusTone(entry: WaitlistEntry) {
  const status = (entry.status ?? "").toLowerCase();
  if (status.includes("ready") || status.includes("confirm")) {
    return "status-active";
  }
  if (status.includes("hold") || status.includes("snooze")) {
    return "status-onboarding";
  }
  return "status-neutral";
}

function formatLead(entry: WaitlistEntry) {
  if (!entry.createdAt || !entry.preferredStart) {
    return "—";
  }
  const created = new Date(entry.createdAt);
  const preferred = new Date(entry.preferredStart);
  if (Number.isNaN(created.getTime()) || Number.isNaN(preferred.getTime())) {
    return "—";
  }
  const diff = preferred.getTime() - created.getTime();
  if (diff <= 0) {
    return "0 min";
  }
  const minutes = Math.round(diff / (1000 * 60));
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.round(minutes / 60);
  return `${hours} hr`;
}

export default async function Page() {
  const [appointments, waitlist] = await Promise.all([
    getAppointments(),
    getWaitlist(),
  ]);

  const summary = summarizeAppointments(appointments);
  const waitlistSummary = summarizeWaitlist(waitlist);
  const buckets = bucketAppointments(appointments);
  const timeline = appointments.slice(0, 12);
  const waitlistPreview = waitlist.slice(0, 3);

  const metrics = [
    {
      label: "Scheduled today",
      value: summary.scheduledToday,
      accent: "metrics-active",
      description: "Appointments with start time today",
    },
    {
      label: "Checked in",
      value: summary.checkedIn,
      accent: "metrics-total",
      description: "Currently in service",
    },
    {
      label: "Completed",
      value: summary.completed,
      accent: "metrics-onboarding",
      description: "Finished and ready for checkout",
    },
    {
      label: "Projected revenue",
      value: formatCurrency(summary.projectedRevenue),
      accent: "metrics-leave",
      description: "Sum of invoice totals",
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
            <h2 className="panel-title">Today&apos;s timeline</h2>
            <p className="panel-subtitle">
              {timeline.length
                ? `${timeline.length} appointments sorted by start time`
                : "Connect Supabase to see the schedule"}
            </p>
          </div>
        </header>
        <div className="timeline-list">
          {timeline.length === 0 ? (
            <div className="timeline-empty">No appointments scheduled yet.</div>
          ) : (
            timeline.map(item => (
              <article key={item.id} className="timeline-row">
                <div className="timeline-time">
                  <span>{formatTime(item.start)}</span>
                  <span>{formatDay(item.start)}</span>
                </div>
                <div className="timeline-body">
                  <div className="timeline-primary">
                    <span className="timeline-client">{item.clientName}</span>
                    {item.petName ? (
                      <span className="timeline-pet">for {item.petName}</span>
                    ) : null}
                  </div>
                  <div className="timeline-services">
                    {servicesLabel(item.services, item.serviceSummary)}
                  </div>
                  <div className="timeline-meta">
                    <span>{item.staff ?? "Staff TBD"}</span>
                    <span>{item.room ?? "Room TBD"}</span>
                    <span>{formatTimeRange(item.start, item.end)}</span>
                  </div>
                </div>
                <div className="timeline-status">
                  <span className={`status-pill ${statusTone(item.status)}`}>
                    {item.status ?? "Scheduled"}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Station board</h2>
            <p className="panel-subtitle">
              Track arrivals, active services, and completed checkouts.
            </p>
          </div>
        </header>
        <div className="appointments-board">
          <div className="appointments-column">
            <header className="appointments-column-header">
              <h3>Arrivals</h3>
              <span>{buckets.arrivals.length}</span>
            </header>
            <div className="appointments-column-body">
              {buckets.arrivals.length === 0 ? (
                <p className="appointments-empty">No arrivals waiting.</p>
              ) : (
                buckets.arrivals.map(item => (
                  <article key={item.id} className="appointment-card">
                    <div className="appointment-header">
                      <span className="appointment-client">{item.clientName}</span>
                      {item.petName ? (
                        <span className="appointment-pet">{item.petName}</span>
                      ) : null}
                    </div>
                    <div className="appointment-meta">
                      <span>{servicesLabel(item.services, item.serviceSummary)}</span>
                      <span>{item.staff ?? "Staff TBD"}</span>
                    </div>
                    <div className="appointment-time">
                      {formatTimeRange(item.start, item.end)}
                    </div>
                    <div className="appointment-status">
                      <span className={`status-pill ${statusTone(item.status)}`}>
                        {item.status ?? "Scheduled"}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="appointments-column">
            <header className="appointments-column-header">
              <h3>In service</h3>
              <span>{buckets.inService.length}</span>
            </header>
            <div className="appointments-column-body">
              {buckets.inService.length === 0 ? (
                <p className="appointments-empty">No guests in progress.</p>
              ) : (
                buckets.inService.map(item => (
                  <article key={item.id} className="appointment-card">
                    <div className="appointment-header">
                      <span className="appointment-client">{item.clientName}</span>
                      {item.petName ? (
                        <span className="appointment-pet">{item.petName}</span>
                      ) : null}
                    </div>
                    <div className="appointment-meta">
                      <span>{servicesLabel(item.services, item.serviceSummary)}</span>
                      <span>{item.staff ?? "Staff TBD"}</span>
                    </div>
                    <div className="appointment-time">
                      {formatTimeRange(item.start, item.end)}
                    </div>
                    <div className="appointment-status">
                      <span className={`status-pill ${statusTone(item.status)}`}>
                        {item.status ?? "In service"}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="appointments-column">
            <header className="appointments-column-header">
              <h3>Complete</h3>
              <span>{buckets.completed.length}</span>
            </header>
            <div className="appointments-column-body">
              {buckets.completed.length === 0 ? (
                <p className="appointments-empty">No recent checkouts.</p>
              ) : (
                buckets.completed.map(item => (
                  <article key={item.id} className="appointment-card">
                    <div className="appointment-header">
                      <span className="appointment-client">{item.clientName}</span>
                      {item.petName ? (
                        <span className="appointment-pet">{item.petName}</span>
                      ) : null}
                    </div>
                    <div className="appointment-meta">
                      <span>{servicesLabel(item.services, item.serviceSummary)}</span>
                      <span>{formatCurrency(item.totalDue)}</span>
                    </div>
                    <div className="appointment-time">
                      Checkout {formatTime(item.checkOutAt)}
                    </div>
                    <div className="appointment-status">
                      <span className={`status-pill ${statusTone(item.status)}`}>
                        {item.status ?? "Complete"}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Waitlist preview</h2>
            <p className="panel-subtitle">
              {waitlistSummary.total
                ? `${waitlistSummary.total} guests in queue · ${waitlistSummary.urgent} urgent`
                : "No waitlist entries"}
            </p>
          </div>
        </header>
        <div className="waitlist-preview">
          {waitlistPreview.length === 0 ? (
            <p className="appointments-empty">Waitlist entries will appear here.</p>
          ) : (
            waitlistPreview.map(entry => (
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
                  <span>{entry.channel ?? "Channel TBD"}</span>
                  <span>{formatDay(entry.preferredStart)}</span>
                </div>
                <footer className="waitlist-footer">
                  <span>Lead time: {formatLead(entry)}</span>
                  {entry.priority ? <span>Priority: {entry.priority}</span> : null}
                </footer>
                {entry.notes ? <p className="waitlist-notes">{entry.notes}</p> : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
