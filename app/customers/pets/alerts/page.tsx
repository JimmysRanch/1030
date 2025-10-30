import { careAlerts } from "../data";

const severityTone: Record<string, string> = {
  High: "spotlight-health",
  Medium: "spotlight-training",
  Low: "spotlight-spa",
};

export default function PetsAlertsPage() {
  return (
    <div className="page-stack gap-large">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Care Alerts</h2>
            <p className="panel-subtitle">
              Flagged handling notes that require extra attention before and after
              each visit. Coordinate with the team so nothing slips through.
            </p>
          </div>
        </div>

        <div className="alerts-grid">
          {careAlerts.map(alert => (
            <article key={`${alert.pet}-${alert.added}`} className="alert-card">
              <header>
                <div>
                  <h3>{alert.pet}</h3>
                  <p>Guardian: {alert.owner}</p>
                </div>
                <span className={`alert-severity ${severityTone[alert.severity]}`}>
                  {alert.severity} priority
                </span>
              </header>
              <p className="alert-body">{alert.alert}</p>
              <footer>
                <span>{alert.added}</span>
                <span>{alert.followUp}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
