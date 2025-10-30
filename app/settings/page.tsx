import { accountProfile, loginSecurity } from "./data";

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : shortDate.format(date);
}

export default function Page() {
  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Account owner</h2>
            <p className="panel-subtitle">
              Everything in Scruffy Butts 21 is tied to this profile. Update contact details and
              language preferences to keep notifications accurate.
            </p>
          </div>
          <span className="status-pill status-active">Owner</span>
        </header>
        <div className="settings-grid">
          <div className="settings-field">
            <span className="settings-label">Name</span>
            <span className="settings-value">{accountProfile.owner}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Role</span>
            <span className="settings-value">{accountProfile.role}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Email</span>
            <span className="settings-value">{accountProfile.email}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Phone</span>
            <span className="settings-value">{accountProfile.phone}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Timezone</span>
            <span className="settings-value">{accountProfile.timezone}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Languages</span>
            <span className="settings-value">{accountProfile.languages.join(", ")}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Created</span>
            <span className="settings-value">{formatDate(accountProfile.createdAt)}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Password updated</span>
            <span className="settings-value">{formatDate(accountProfile.lastPasswordChange)}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Security</h2>
            <p className="panel-subtitle">
              Login methods enforced across the team. Review them before inviting new employees.
            </p>
          </div>
        </header>
        <div className="settings-table settings-table-three">
          <div className="settings-table-head">
            <span>Method</span>
            <span>Status</span>
            <span>Last updated</span>
          </div>
          {loginSecurity.loginMethods.map(item => (
            <div key={item.method} className="settings-table-row">
              <div>
                <span className="settings-value">{item.method}</span>
              </div>
              <div>
                <span className="settings-note">{item.status}</span>
              </div>
              <div>
                <span className="settings-value">{formatDate(item.lastUpdated)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="settings-policies">
          {loginSecurity.securityPolicies.map(policy => (
            <div key={policy.label} className="settings-policy">
              <span className="settings-label">{policy.label}</span>
              <span className="settings-note">{policy.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Active sessions</h2>
            <p className="panel-subtitle">
              Signed-in devices currently trusted with access to appointments, payments, and staff
              data.
            </p>
          </div>
        </header>
        <div className="session-grid">
          {loginSecurity.sessions.map(session => (
            <article key={`${session.device}-${session.ip}`} className="session-card">
              <header className="session-header">
                <div>
                  <h3 className="session-title">{session.device}</h3>
                  <p className="session-subtitle">{session.system}</p>
                </div>
                <span
                  className={`status-pill ${session.trusted ? "status-active" : "status-neutral"}`}
                >
                  {session.trusted ? "Trusted" : "Review"}
                </span>
              </header>
              <dl className="session-meta">
                <div>
                  <dt>Location</dt>
                  <dd>{session.location}</dd>
                </div>
                <div>
                  <dt>Last active</dt>
                  <dd>{session.lastActive}</dd>
                </div>
                <div>
                  <dt>IP address</dt>
                  <dd>{session.ip}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
