import { getStaffSchedule, type StaffShift } from "../data";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
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
  return dateFormatter.format(date);
}

function formatTimeRange(start: string | null, end: string | null) {
  if (!start && !end) {
    return "—";
  }
  if (!start) {
    return `Ends ${formatTime(end)}`;
  }
  if (!end) {
    return `${formatTime(start)} – TBD`;
  }
  return `${formatTime(start)} – ${formatTime(end)}`;
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

function statusTone(status: string | null) {
  if (!status) {
    return "status-neutral";
  }
  const normalized = status.toLowerCase();
  if (normalized.includes("pending") || normalized.includes("open")) {
    return "status-onboarding";
  }
  if (normalized.includes("cancel")) {
    return "status-leave";
  }
  if (normalized.includes("confirmed") || normalized.includes("scheduled")) {
    return "status-active";
  }
  return "status-neutral";
}

function groupByDate(shifts: StaffShift[]) {
  return shifts.reduce<Record<string, StaffShift[]>>((acc, shift) => {
    const key = shift.start ? new Date(shift.start).toISOString().slice(0, 10) : "unscheduled";
    acc[key] = acc[key] ? [...acc[key], shift] : [shift];
    return acc;
  }, {});
}

function formatGroupLabel(key: string) {
  if (key === "unscheduled") {
    return "Unscheduled";
  }
  const date = new Date(key);
  if (Number.isNaN(date.getTime())) {
    return key;
  }
  return dateFormatter.format(date);
}

export default async function Page() {
  const shifts = await getStaffSchedule();
  const grouped = groupByDate(shifts);
  const totals = computeTotals(shifts);

  return (
    <div className="stack gap-large">
      <section className="metrics-grid">
        <article className="metrics-card metrics-active">
          <header className="metrics-label">Scheduled this week</header>
          <div className="metrics-value">{totals.scheduledThisWeek}</div>
          <p className="metrics-description">Total confirmed shifts</p>
        </article>
        <article className="metrics-card metrics-total">
          <header className="metrics-label">Hours scheduled</header>
          <div className="metrics-value">{totals.hoursScheduled}</div>
          <p className="metrics-description">Based on shift duration</p>
        </article>
        <article className="metrics-card metrics-onboarding">
          <header className="metrics-label">Open shifts</header>
          <div className="metrics-value">{totals.openShifts}</div>
          <p className="metrics-description">Needing assignment</p>
        </article>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Upcoming schedule</h2>
            <p className="panel-subtitle">
              {shifts.length ? `${shifts.length} total shifts` : "No shifts scheduled"}
            </p>
          </div>
        </header>
        <div className="schedule-grid">
          {Object.keys(grouped).length === 0 ? (
            <div className="schedule-empty">
              Connect Supabase to populate the staff schedule.
            </div>
          ) : (
            Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, dayShifts]) => (
                <div key={key} className="schedule-column">
                  <div className="schedule-date">{formatGroupLabel(key)}</div>
                  <ul className="shift-list">
                    {dayShifts.map(shift => (
                      <li key={shift.id} className="shift-card">
                        <div className="shift-header">
                          <span className="shift-name">{shift.staffName}</span>
                          <span className={`status-pill ${statusTone(shift.status)}`}>
                            {shift.status ? shift.status : "Scheduled"}
                          </span>
                        </div>
                        <div className="shift-meta">
                          <span>{shift.role ?? "Role TBD"}</span>
                          <span>{shift.location ?? "No location"}</span>
                        </div>
                        <div className="shift-time">
                          {formatDate(shift.start)} · {formatTimeRange(shift.start, shift.end)}
                        </div>
                        <div className="shift-footer">
                          <span>{shift.service ?? "General shift"}</span>
                          <span>
                            {shift.clients === null || shift.clients === undefined
                              ? "Clients TBD"
                              : `${shift.clients} client${shift.clients === 1 ? "" : "s"}`}
                          </span>
                        </div>
                        {shift.notes ? (
                          <p className="shift-notes">{shift.notes}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}

function computeTotals(shifts: StaffShift[]) {
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);

  let scheduledThisWeek = 0;
  let openShifts = 0;
  let hoursScheduled = 0;

  for (const shift of shifts) {
    const start = shift.start ? new Date(shift.start) : null;
    const end = shift.end ? new Date(shift.end) : null;
    const status = shift.status?.toLowerCase() ?? "";

    if (!status || status.includes("open") || status.includes("unassigned")) {
      openShifts += 1;
    }

    if (start && start >= now && start <= weekEnd) {
      scheduledThisWeek += 1;
    }

    if (start && end) {
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (!Number.isNaN(diff) && diff > 0) {
        hoursScheduled += diff;
      }
    }
  }

  return {
    scheduledThisWeek,
    openShifts,
    hoursScheduled: hoursScheduled.toFixed(1),
  };
}
