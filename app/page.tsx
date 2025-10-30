import {
  getAppointments,
  getWaitlist,
  summarizeAppointments,
  summarizeWaitlist,
  type Appointment,
  type WaitlistEntry,
} from "./appointments/data";
import {
  getStaffRoster,
  getStaffSchedule,
  type StaffShift,
} from "./staff/data";

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});
const headerDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});
const timezoneFormatter = new Intl.DateTimeFormat("en-US", {
  timeZoneName: "short",
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

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
  return dateFormatter.format(date);
}

function servicesLabel(services: string[], fallback: string | null) {
  if (services.length) {
    return services.slice(0, 3).join(" · ");
  }
  return fallback ?? "Service TBD";
}

function appointmentStatusTone(status: string | null) {
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

function shiftStatusTone(status: string | null) {
  if (!status) {
    return "status-neutral";
  }
  const normalized = status.toLowerCase();
  if (normalized.includes("active") || normalized.includes("on shift")) {
    return "status-active";
  }
  if (normalized.includes("break") || normalized.includes("wrap")) {
    return "status-onboarding";
  }
  if (normalized.includes("cancel") || normalized.includes("leave")) {
    return "status-leave";
  }
  return "status-neutral";
}

function isSameDay(date: Date | null, reference: Date) {
  if (!date) {
    return false;
  }
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

function parseDate(value: string | null) {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function nextAppointments(appointments: Appointment[], now: Date) {
  const todays = appointments.filter(appt =>
    isSameDay(parseDate(appt.start), now)
  );
  if (todays.length) {
    return todays.slice(0, 6);
  }
  return appointments.slice(0, 6);
}

function todaysShifts(schedule: StaffShift[], now: Date) {
  return schedule.filter(shift => isSameDay(parseDate(shift.start), now));
}

export default async function Page() {
  const now = new Date();

  const [{ appointments, summary: appointmentSummary }, waitlistData, roster, schedule] =
    await Promise.all([
      getAppointments().then(data => ({
        appointments: data,
        summary: summarizeAppointments(data),
      })),
      getWaitlist().then(data => ({
        waitlist: data,
        summary: summarizeWaitlist(data),
      })),
      getStaffRoster(),
      getStaffSchedule(),
    ]);

  const waitlistSummary = waitlistData.summary;
  const waitlist = waitlistData.waitlist;
  const appointmentMetrics = appointmentSummary;

  const schedulePreview = nextAppointments(appointments, now);
  const waitlistPreview = waitlist.slice(0, 3);
  const shiftsToday = todaysShifts(schedule, now);

  const headerDate = headerDateFormatter.format(now);
  const headerTime = timeFormatter.format(now);
  const timeZoneName =
    timezoneFormatter
      .formatToParts(now)
      .find(part => part.type === "timeZoneName")?.value ?? "Local";

  const metrics = [
    {
      label: "Appointments today",
      value: formatNumber(appointmentMetrics.scheduledToday),
      description: "Bookings starting today",
      accent: "metrics-active",
    },
    {
      label: "In progress",
      value: formatNumber(appointmentMetrics.checkedIn),
      description: "Checked in or in service",
      accent: "metrics-total",
    },
    {
      label: "Waitlist",
      value: formatNumber(waitlistSummary.total),
      description: `${formatNumber(waitlistSummary.urgent)} marked urgent`,
      accent: "metrics-onboarding",
    },
    {
      label: "Projected revenue",
      value: formatCurrency(appointmentMetrics.projectedRevenue),
      description: "Sum of invoice totals",
      accent: "metrics-leave",
    },
  ];

  const staffChips = [
    { label: "Team", value: roster.summary.total },
    { label: "Active", value: roster.summary.active },
    { label: "On leave", value: roster.summary.onLeave },
    { label: "Onboarding", value: roster.summary.onboarding },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Live overview of appointments, waitlist health, and team coverage.
          </p>
        </div>
        <div className="page-header-meta">
          <span className="page-header-date">{headerDate}</span>
          <span className="page-header-timezone">
            Updated {headerTime} · {timeZoneName}
          </span>
        </div>
      </header>

      <div className="page-stack">
        <section className="metrics-grid">
          {metrics.map(metric => (
            <article key={metric.label} className={`metrics-card ${metric.accent}`}>
              <header className="metrics-label">{metric.label}</header>
              <div className="metrics-value">{metric.value}</div>
              <p className="metrics-description">{metric.description}</p>
            </article>
          ))}
        </section>

        <div className="dashboard-grid">
          <section className="panel">
            <header className="panel-header">
              <div>
                <h2 className="panel-title">Today&apos;s schedule</h2>
                <p className="panel-subtitle">
                  {schedulePreview.length
                    ? `${schedulePreview.length} upcoming appointments`
                    : "Connect Supabase to see the schedule"}
                </p>
              </div>
            </header>
            <div className="timeline-list">
              {schedulePreview.length === 0 ? (
                <div className="timeline-empty">No appointments scheduled yet.</div>
              ) : (
                schedulePreview.map(item => (
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
                      <span className={`status-pill ${appointmentStatusTone(item.status)}`}>
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
                <h2 className="panel-title">Waitlist spotlight</h2>
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

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Team coverage</h2>
              <p className="panel-subtitle">
                {shiftsToday.length
                  ? `${shiftsToday.length} shifts scheduled today`
                  : "No scheduled shifts"}
              </p>
            </div>
          </header>

          <div className="chip-list">
            {staffChips.map(chip => (
              <span key={chip.label} className="chip">
                {chip.label}: {formatNumber(chip.value)}
              </span>
            ))}
          </div>

          <div className="schedule-grid team-coverage-grid">
            <div className="schedule-column">
              <header className="schedule-date">{headerDate}</header>
              <ul className="shift-list">
                {shiftsToday.length === 0 ? (
                  <li className="schedule-empty">
                    Connect Supabase to see who&apos;s on the schedule.
                  </li>
                ) : (
                  shiftsToday.map(shift => (
                    <li key={shift.id} className="shift-card">
                      <div className="shift-header">
                        <div>
                          <div className="shift-name">{shift.staffName}</div>
                          <div className="shift-meta">
                            {shift.role ? <span>{shift.role}</span> : null}
                            {shift.location ? <span>{shift.location}</span> : null}
                          </div>
                        </div>
                        <span className={`status-pill ${shiftStatusTone(shift.status)}`}>
                          {shift.status ?? "Scheduled"}
                        </span>
                      </div>
                      <div className="shift-time">{formatTimeRange(shift.start, shift.end)}</div>
                      <div className="shift-footer">
                        <span>{shift.service ?? "Service mix"}</span>
                        {shift.clients !== null && shift.clients !== undefined ? (
                          <span>
                            {shift.clients === 1
                              ? "1 client"
                              : `${shift.clients ?? 0} clients`}
                          </span>
                        ) : null}
                      </div>
                      {shift.notes ? (
                        <p className="shift-notes">{shift.notes}</p>
                      ) : null}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
