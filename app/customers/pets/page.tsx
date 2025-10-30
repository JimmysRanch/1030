import {
  careHighlights,
  petProfiles,
  type PetProfile,
} from "./data";

const statusClassMap: Record<PetProfile["status"], string> = {
  Active: "status-active",
  Paused: "status-neutral",
  New: "status-onboarding",
  Loyal: "status-active",
};

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "";
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

const totalPets = petProfiles.length;
const activePets = petProfiles.filter(p => p.status === "Active" || p.status === "Loyal").length;
const newPets = petProfiles.filter(p => p.status === "New").length;
const alertsCount = petProfiles.filter(p => p.alerts.length > 0).length;

const summaryMetrics = [
  {
    label: "Total Pets",
    value: totalPets.toString(),
    description: "Profiles synced across all locations",
    className: "metrics-total",
  },
  {
    label: "Active & Loyal",
    value: activePets.toString(),
    description: "On a recurring grooming cadence",
    className: "metrics-active",
  },
  {
    label: "New This Month",
    value: newPets.toString(),
    description: "Recently onboarded companions",
    className: "metrics-onboarding",
  },
  {
    label: "Care Alerts",
    value: alertsCount.toString(),
    description: "Profiles with special handling notes",
    className: "metrics-leave",
  },
];

export default function PetsPage() {
  return (
    <div className="page-stack gap-large">
      <section className="metrics-grid" aria-label="Pet summary metrics">
        {summaryMetrics.map(metric => (
          <article
            key={metric.label}
            className={`metrics-card ${metric.className ?? ""}`.trim()}
          >
            <span className="metrics-label">{metric.label}</span>
            <strong className="metrics-value">{metric.value}</strong>
            <p className="metrics-description">{metric.description}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Pet Directory</h2>
            <p className="panel-subtitle">
              Reference every pet profile, plan cadence, and special care details in
              one unified table.
            </p>
          </div>
          <div className="pets-filter-actions">
            <button type="button" className="pill-button pill-active">
              All Species
            </button>
            <button type="button" className="pill-button">Dogs</button>
            <button type="button" className="pill-button">Cats</button>
            <button type="button" className="pill-button">Other</button>
          </div>
        </div>

        <div className="filters-bar" role="search">
          <label className="search-field">
            <span>Search pets</span>
            <input type="search" placeholder="Search by pet or owner" />
          </label>
          <div className="filters-inline">
            <button type="button" className="filter-chip filter-chip-active">
              Active plans
            </button>
            <button type="button" className="filter-chip">Care alerts</button>
            <button type="button" className="filter-chip">New this month</button>
            <button type="button" className="filter-chip">Paused</button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table pets-table">
            <thead>
              <tr>
                <th scope="col">Pet</th>
                <th scope="col">Owner</th>
                <th scope="col">Plan</th>
                <th scope="col">Last Visit</th>
                <th scope="col">Next Visit</th>
                <th scope="col">Temperament &amp; Alerts</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {petProfiles.map(profile => (
                <tr key={profile.id}>
                  <td>
                    <div className="row-main">
                      <span className="avatar pet-avatar" aria-hidden="true">
                        {getInitials(profile.name)}
                      </span>
                      <div className="row-copy">
                        <span className="row-primary">{profile.name}</span>
                        <span className="pet-subtitle">
                          {profile.species} • {profile.breed} • {profile.color}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="row-copy">
                      <span className="row-primary">{profile.owner}</span>
                      <span className="row-secondary">{profile.ownerEmail}</span>
                    </div>
                  </td>
                  <td>
                    <div className="row-copy">
                      <span className="row-primary">{profile.plan}</span>
                      <span className="row-secondary">{profile.cadence}</span>
                    </div>
                  </td>
                  <td>
                    <span className="row-primary">{profile.lastVisit}</span>
                  </td>
                  <td>
                    <span className="row-primary">{profile.nextVisit}</span>
                  </td>
                  <td>
                    <div className="pet-alerts">
                      <p className="pet-temperament">{profile.temperament}</p>
                      <ul>
                        {profile.alerts.map(alert => (
                          <li key={alert} className="pet-alert-chip">
                            {alert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${statusClassMap[profile.status]}`}
                    >
                      {profile.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Care Spotlights</h2>
            <p className="panel-subtitle">
              Capture nuanced grooming learnings and keep the whole team aligned on
              what worked best.
            </p>
          </div>
        </div>
        <div className="spotlight-grid">
          {careHighlights.map(highlight => (
            <article key={`${highlight.pet}-${highlight.tag}`} className="spotlight-card">
              <header>
                <span className={`spotlight-tag spotlight-${highlight.tag.toLowerCase()}`}>
                  {highlight.tag}
                </span>
                <span className="spotlight-time">{highlight.timestamp}</span>
              </header>
              <h3>
                {highlight.pet} <span>with {highlight.owner}</span>
              </h3>
              <p>{highlight.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
