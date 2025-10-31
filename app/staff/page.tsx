import { getStaffRoster, type StaffRosterMember } from "./data";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
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

function formatLongDate(value: string | null) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return longDateFormatter.format(date);
}

function formatUtilization(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }
  if (value > 1) {
    return `${value.toFixed(0)}%`;
  }
  return `${(value * 100).toFixed(0)}%`;
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function statusTone(status: string | null) {
  if (!status) {
    return "status-neutral";
  }
  const normalized = status.toLowerCase();
  if (normalized.includes("active")) {
    return "status-active";
  }
  if (normalized.includes("leave") || normalized.includes("inactive")) {
    return "status-leave";
  }
  if (normalized.includes("training") || normalized.includes("onboarding")) {
    return "status-onboarding";
  }
  return "status-neutral";
}

function formatStatus(status: string | null) {
  return status ? status.replace(/\b\w/g, char => char.toUpperCase()) : "Unknown";
}

export default async function Page() {
  const { staff, summary } = await getStaffRoster();

  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Staff</h2>
            <p className="panel-subtitle">
              {summary.total ? `${summary.total} team members` : "No team members"}
            </p>
          </div>
          <div className="panel-actions">
            <button type="button" className="button button-primary">
              Add staff member
            </button>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Team member</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Specialties</th>
                <th scope="col">Clients</th>
                <th scope="col">Utilization</th>
                <th scope="col">Contact</th>
                <th scope="col">Next shift</th>
                <th scope="col">Hired</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-empty">
                    Connect Supabase to see your staff roster.
                  </td>
                </tr>
              ) : (
                staff.map(member => <RosterRow key={member.id} member={member} />)
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function RosterRow({ member }: { member: StaffRosterMember }) {
  return (
    <tr>
      <td>
        <div className="row-main">
          <div className="avatar" aria-hidden>{getInitials(member.name)}</div>
          <div className="row-copy">
            <span className="row-primary">{member.name}</span>
            <span className="row-secondary">
              {member.location ? `Based in ${member.location}` : "Location TBD"}
            </span>
          </div>
        </div>
      </td>
      <td>{member.role ?? "—"}</td>
      <td>
        <span className={`status-pill ${statusTone(member.status)}`}>
          {formatStatus(member.status)}
        </span>
      </td>
      <td>
        <div className="chip-list">
          {member.specialties.length === 0 ? (
            <span className="muted">—</span>
          ) : (
            member.specialties.map(item => (
              <span key={item} className="chip">
                {item}
              </span>
            ))
          )}
        </div>
      </td>
      <td>{member.clientsCount ?? "—"}</td>
      <td>{formatUtilization(member.utilization)}</td>
      <td>
        <div className="row-copy">
          <span className="row-primary">{member.email ?? "—"}</span>
          <span className="row-secondary">{member.phone ?? "—"}</span>
        </div>
      </td>
      <td>{formatDate(member.nextShiftAt)}</td>
      <td>{formatLongDate(member.startDate)}</td>
    </tr>
  );
}
