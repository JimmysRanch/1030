import { integrations } from "../data";

export default function IntegrationsPage() {
  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Connected apps</h2>
            <p className="panel-subtitle">
              Manage how Scruffy Butts 21 shares data with finance, marketing, and automation tools.
            </p>
          </div>
        </header>
        <div className="integration-list">
          {integrations.map(integration => (
            <article key={integration.name} className="integration-card">
              <div className="integration-meta">
                <h3>{integration.name}</h3>
                <span className={`integration-status integration-status-${integration.status.toLowerCase()}`}>
                  {integration.status}
                </span>
              </div>
              <p>{integration.description}</p>
              <footer>
                <span className="settings-note">Connected {integration.connectedOn}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">API access</h2>
            <p className="panel-subtitle">
              Use the service account token for server-to-server automations. Rotate the secret every 90
              days.
            </p>
          </div>
        </header>
        <div className="api-keys">
          <div>
            <span className="settings-label">Project ID</span>
            <span className="settings-value">scruffy-butts-21</span>
          </div>
          <div>
            <span className="settings-label">Service role key</span>
            <span className="api-secret">sk_live_52d4e0ac-ff57-4d68-9a26-bb41cf48a913</span>
            <span className="settings-note">Visible to owners only</span>
          </div>
          <div>
            <span className="settings-label">Webhook signing secret</span>
            <span className="api-secret">whsec_8c397d65b7d54beba9137a12cf8a7d43</span>
          </div>
        </div>
      </section>
    </div>
  );
}
