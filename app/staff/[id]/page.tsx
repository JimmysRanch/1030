import Link from "next/link";
import { notFound } from "next/navigation";

import { getStaffMember, type StaffRosterMember } from "../data";

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatShortDate(value: string | null) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return shortDateFormatter.format(date);
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

function formatStatus(status: string | null) {
  return status ? status.replace(/\b\w/g, char => char.toUpperCase()) : "Unknown";
}

function buildSubtitle(member: StaffRosterMember) {
  const parts = [member.role ?? "Role not set"];
  if (member.location) {
    parts.push(member.location);
  }
  return parts.join(" • ");
}

export default async function StaffMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const member = await getStaffMember(params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">{member.name}</h2>
            <p className="panel-subtitle">{buildSubtitle(member)}</p>
          </div>
          <div className="panel-actions">
            <Link href="/staff" className="button button-ghost">
              Back to staff
            </Link>
          </div>
        </header>

        <div className="profile-grid">
          <div className="profile-card">
            <h3>Contact</h3>
            <dl className="profile-list">
              <div className="profile-item">
                <dt>Email</dt>
                <dd>{member.email ?? "—"}</dd>
              </div>
              <div className="profile-item">
                <dt>Phone</dt>
                <dd>{member.phone ?? "—"}</dd>
              </div>
              <div className="profile-item">
                <dt>Location</dt>
                <dd>{member.location ?? "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="profile-card">
            <h3>Status &amp; timeline</h3>
            <dl className="profile-list">
              <div className="profile-item">
                <dt>Status</dt>
                <dd>{formatStatus(member.status)}</dd>
              </div>
              <div className="profile-item">
                <dt>Hired</dt>
                <dd>{formatLongDate(member.startDate)}</dd>
              </div>
              <div className="profile-item">
                <dt>Last shift</dt>
                <dd>{formatShortDate(member.lastShiftAt)}</dd>
              </div>
              <div className="profile-item">
                <dt>Next shift</dt>
                <dd>{formatShortDate(member.nextShiftAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="profile-card">
            <h3>Specialties</h3>
            {member.specialties.length === 0 ? (
              <p className="muted">No specialties on file.</p>
            ) : (
              <div className="chip-list">
                {member.specialties.map(item => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="profile-card">
            <h3>Certifications</h3>
            {member.certifications.length === 0 ? (
              <p className="muted">No certifications recorded.</p>
            ) : (
              <dl className="profile-list">
                {member.certifications.map(certification => (
                  <div key={certification.name} className="profile-item">
                    <dt>{certification.name}</dt>
                    <dd>
                      <span>{formatStatus(certification.status)}</span>
                      <span className="profile-meta">
                        Expires {formatLongDate(certification.expiresOn)}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
