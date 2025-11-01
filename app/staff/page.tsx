import Link from "next/link";
import { getStaffRoster, type StaffRosterMember } from "./data";

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

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

export default async function Page() {
  const { staff, summary } = await getStaffRoster();

  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Staff</h2>
            {summary.total ? (
              <p className="panel-subtitle">{`${summary.total} team members`}</p>
            ) : null}
          </div>
          <div className="panel-actions">
            <Link href="/staff/new" className="button button-primary">
              Add staff member
            </Link>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Team member</th>
                <th scope="col">Role</th>
                <th scope="col">Contact</th>
                <th scope="col">Hired</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="table-empty">
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
        <Link href={`/staff/${member.id}`} className="row-link">
          <span className="row-primary">{member.name}</span>
        </Link>
      </td>
      <td>{member.role ?? "—"}</td>
      <td>
        <div className="row-copy">
          <span className="row-primary">{member.email ?? "—"}</span>
          <span className="row-secondary">{member.phone ?? "—"}</span>
        </div>
      </td>
      <td>{formatLongDate(member.startDate)}</td>
    </tr>
  );
}
