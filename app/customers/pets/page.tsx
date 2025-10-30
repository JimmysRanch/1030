import Link from "next/link";

import { clientProfiles } from "./data";

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "";
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

const totalClients = clientProfiles.length;
const totalPets = clientProfiles.reduce((count, client) => count + client.pets.length, 0);
const pinnedPetNotes = clientProfiles.reduce(
  (count, client) => count + client.pets.filter(pet => Boolean(pet.smartNotes.pinned)).length,
  0,
);
const autoRebookPets = clientProfiles
  .flatMap(client => client.pets)
  .filter(pet => pet.timeline.some(event => event.tags.includes("Auto Rebook"))).length;
const autoRebookRate = totalPets === 0 ? "0%" : `${Math.round((autoRebookPets / totalPets) * 100)}%`;

const summaryMetrics = [
  {
    label: "Total Clients",
    value: totalClients.toString(),
    description: "Active memberships across all plans",
    className: "metrics-total",
  },
  {
    label: "Pets on File",
    value: totalPets.toString(),
    description: "Companions with full grooming profiles",
    className: "metrics-active",
  },
  {
    label: "Pinned Pet Notes",
    value: pinnedPetNotes.toString(),
    description: "Favorite instructions surfaced for the team",
    className: "metrics-onboarding",
  },
  {
    label: "Auto-Rebook Ready",
    value: autoRebookRate,
    description: "Visits that preload last appointment details",
    className: "metrics-leave",
  },
];

const rosterFilters = [
  "Auto rebook ready",
  "Pinned notes",
  "Vaccines due",
  "Needs outreach",
];

const rosterActions = [
  "New Client",
  "Upload Vaccine",
  "Share Social Update",
];

export default function ClientsAndPetsPage() {
  return (
    <div className="page-stack gap-large">
      <section className="metrics-grid" aria-label="Client and pet summary metrics">
        {summaryMetrics.map(metric => (
          <article key={metric.label} className={`metrics-card ${metric.className ?? ""}`.trim()}>
            <span className="metrics-label">{metric.label}</span>
            <strong className="metrics-value">{metric.value}</strong>
            <p className="metrics-description">{metric.description}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Clients &amp; Pets</h2>
            <p className="panel-subtitle">
              View every client alongside their companions, favorite notes, and quick
              actions—mirroring the legacy presentation exactly.
            </p>
          </div>
          <div className="roster-header-actions">
            {rosterActions.map(action => (
              <button key={action} type="button" className="action-button">
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="filters-bar" role="search">
          <label className="search-field">
            <span>Search clients &amp; pets</span>
            <input
              type="search"
              placeholder="Search by client, pet, plan, or favorite note"
              aria-label="Search clients and pets"
            />
          </label>
          <div className="filters-inline">
            {rosterFilters.map(filter => (
              <button key={filter} type="button" className="filter-chip">
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="client-roster">
          {clientProfiles.map(client => {
            const latestMessage = client.messageHistory[0];
            const pinnedNotes = client.privateNotes.filter(note => note.pinned);

            return (
              <article key={client.id} className="client-roster-card">
                <header className="client-roster-header">
                  <div className="row-main">
                    <span className="avatar client-avatar" aria-hidden="true">
                      {getInitials(client.name)}
                    </span>
                    <div className="row-copy">
                      <Link href={`/customers/${client.slug}`} className="row-primary client-link">
                        {client.name}
                      </Link>
                      <span className="row-secondary">
                        {client.email} • {client.phone}
                      </span>
                    </div>
                  </div>
                  <div className="client-roster-stats">
                    <div className="client-stat">
                      <span>Total visits</span>
                      <strong>{client.stats.totalVisits}</strong>
                    </div>
                    <div className="client-stat">
                      <span>Avg spend</span>
                      <strong>{client.stats.averageSpend}</strong>
                    </div>
                    <div className="client-stat">
                      <span>Lifetime value</span>
                      <strong>{client.stats.lifetimeValue}</strong>
                    </div>
                    <div className="client-stat">
                      <span>Visit cadence</span>
                      <strong>{client.stats.visitFrequency}</strong>
                    </div>
                  </div>
                </header>

                <div className="client-roster-body">
                  <div className="client-quick-actions" role="toolbar" aria-label={`Quick actions for ${client.name}`}>
                    {client.quickActions.map(action => (
                      <button key={action} type="button" className="quick-action-button">
                        {action}
                      </button>
                    ))}
                  </div>
                  <p className="client-roster-meta">
                    Membership since {client.membershipSince} • Favorite groomer {client.favoriteGroomer} •
                    {" "}
                    {client.address}
                  </p>

                  <div className="table-wrap roster-table-wrap">
                    <table className="table roster-table">
                      <thead>
                        <tr>
                          <th scope="col">Pet</th>
                          <th scope="col">Plan</th>
                          <th scope="col">Smart notes</th>
                          <th scope="col">Last visit</th>
                          <th scope="col">Next visit</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {client.pets.map(pet => (
                          <tr key={pet.id}>
                            <td>
                              <div className="row-main">
                                <span className="avatar pet-avatar" aria-hidden="true">
                                  {getInitials(pet.name)}
                                </span>
                                <div className="row-copy">
                                  <Link
                                    href={`/customers/${client.slug}#${pet.id}`}
                                    className="row-primary pet-link"
                                  >
                                    {pet.name}
                                  </Link>
                                  <span className="row-secondary">
                                    {pet.breed} • {pet.color}
                                  </span>
                                  <span className="pet-temperament">{pet.temperament}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="row-copy">
                                <span className="row-primary">{pet.plan}</span>
                                <span className="row-secondary">{pet.cadence}</span>
                              </div>
                            </td>
                            <td>
                              <ul className="pet-note-chips">
                                {pet.favoriteNotes.map(note => (
                                  <li key={note} className="pet-note-chip">
                                    {note}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>
                              <div className="row-copy">
                                <span className="row-primary">{pet.lastVisit}</span>
                                <span className="row-secondary">{pet.lastAppointment}</span>
                              </div>
                            </td>
                            <td>
                              <div className="row-copy">
                                <span className="row-primary">{pet.nextVisit}</span>
                                <span className="row-secondary">Auto loads last visit playbook</span>
                              </div>
                            </td>
                            <td>
                              <div className="pet-row-actions">
                                <button type="button" className="pill-button pill-active">
                                  Rebook
                                </button>
                                <Link href={`/customers/${client.slug}#${pet.id}`} className="pill-button">
                                  View profile
                                </Link>
                              </div>
                              <span className={`status-pill ${pet.status === "Active" || pet.status === "Loyal" ? "status-active" : pet.status === "New" ? "status-onboarding" : "status-neutral"}`}>
                                {pet.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <footer className="client-roster-footer">
                    <div className="client-roster-message">
                      <span className="roster-label">Latest message</span>
                      {latestMessage ? (
                        <>
                          <p>{latestMessage.body}</p>
                          <span className="row-secondary">{latestMessage.timestamp}</span>
                        </>
                      ) : (
                        <p className="row-secondary">No recent conversations</p>
                      )}
                    </div>
                    <div className="client-roster-notes">
                      <span className="roster-label">Pinned staff notes</span>
                      {pinnedNotes.length > 0 ? (
                        <ul>
                          {pinnedNotes.map(note => (
                            <li key={note.id}>
                              <strong>{note.category}:</strong> {note.content}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="row-secondary">No pinned notes yet</p>
                      )}
                    </div>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
