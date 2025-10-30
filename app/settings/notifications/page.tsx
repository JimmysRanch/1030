import { notificationSettings } from "../data";

const channelLabels: Record<string, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push",
};

export default function NotificationsPage() {
  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Notification rules</h2>
            <p className="panel-subtitle">
              Choose how each workflow keeps the team and clients informed. All toggles reflect live
              delivery rules.
            </p>
          </div>
        </header>
        <div className="notification-grid">
          {notificationSettings.map(group => (
            <article key={group.group} className="notification-card">
              <header>
                <h3>{group.group}</h3>
                <p>{group.description}</p>
              </header>
              <dl>
                {Object.entries(group.channels).map(([channel, enabled]) => (
                  <div key={channel} className="notification-row">
                    <dt>{channelLabels[channel]}</dt>
                    <dd>
                      <span className={`settings-toggle ${enabled ? "on" : "off"}`} aria-label={`${channelLabels[channel]} ${enabled ? "enabled" : "disabled"}`}>
                        <span aria-hidden>{enabled ? "On" : "Off"}</span>
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <footer>
                <span className="settings-note">{group.rules}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Escalation contacts</h2>
            <p className="panel-subtitle">
              Critical alerts notify these people first. Update the list when roles shift.
            </p>
          </div>
        </header>
        <div className="escalation-list">
          <div>
            <span className="settings-label">Primary</span>
            <span className="settings-value">Jordan Dean</span>
            <span className="settings-note">Owner — receives SMS and push immediately</span>
          </div>
          <div>
            <span className="settings-label">Backup</span>
            <span className="settings-value">Casey Nguyen</span>
            <span className="settings-note">Assistant Manager — email within 5 minutes</span>
          </div>
          <div>
            <span className="settings-label">Finance</span>
            <span className="settings-value">Morgan Ellis</span>
            <span className="settings-note">Bookkeeper — email for payouts and disputes</span>
          </div>
        </div>
      </section>
    </div>
  );
}
