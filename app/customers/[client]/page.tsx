import { notFound } from "next/navigation";

import { clientProfiles, getClientProfile } from "../pets/data";

const vaccineStatusTone = {
  Complete: "status-active",
  Due: "status-onboarding",
  Expired: "status-leave",
} as const;

type VaccineStatusKey = keyof typeof vaccineStatusTone;

export function generateStaticParams() {
  return clientProfiles.map(client => ({ client: client.slug }));
}

export default function ClientProfilePage({
  params,
}: {
  params: { client: string };
}) {
  const client = getClientProfile(params.client);

  if (!client) {
    notFound();
  }

  const pinnedNotes = client.privateNotes.filter(note => note.pinned);
  const otherNotes = client.privateNotes.filter(note => !note.pinned);
  const totalPets = client.pets.length;
  const profileMetrics = [
    { label: "Total visits", value: client.stats.totalVisits },
    { label: "Average spend", value: client.stats.averageSpend },
    { label: "Lifetime value", value: client.stats.lifetimeValue },
    { label: "Visit cadence", value: client.stats.visitFrequency },
    { label: "Pets on file", value: totalPets },
    { label: "Member since", value: client.membershipSince },
  ];

  return (
    <div className="page-stack gap-large">
      <section className="profile-metrics-grid" aria-label={`At-a-glance stats for ${client.name}`}>
        {profileMetrics.map(metric => (
          <article key={metric.label} className="profile-metric-card">
            <span className="stat-label">{metric.label}</span>
            <strong className="stat-value">{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel client-profile-hero">
        <header className="profile-header">
          <div className="profile-heading">
            <h2>{client.name}</h2>
            <p className="profile-meta">Favorite groomer {client.favoriteGroomer}</p>
            <p className="row-secondary">{client.email}</p>
            <p className="row-secondary">{client.phone}</p>
            <p className="row-secondary">{client.address}</p>
          </div>
          <div className="profile-actions">
            <button type="button" className="action-button">
              Edit client info
            </button>
            <button type="button" className="action-button">
              Update contact details
            </button>
          </div>
        </header>

        <div className="profile-quick-actions" role="toolbar" aria-label={`Quick actions for ${client.name}`}>
          {client.quickActions.map(action => (
            <button key={action} type="button" className="quick-action-button">
              {action}
            </button>
          ))}
        </div>
      </section>

      <div className="profile-split-grid">
        <section className="panel message-thread" aria-label="Message history">
          <header className="section-header">
            <div>
              <h3>Message History</h3>
              <p>Review every touchpoint with {client.name} across SMS, email, and the client portal.</p>
            </div>
            <button type="button" className="action-button">
              Send new message
            </button>
          </header>
          <ul className="message-thread-list">
            {client.messageHistory.map(message => (
              <li
                key={message.id}
                className={`message-row ${message.author === "staff" ? "message-outgoing" : "message-incoming"}`}
              >
                <div className="message-meta">
                  <span>{message.channel}</span>
                  <span className="row-secondary">{message.timestamp}</span>
                </div>
                <p className="message-bubble">{message.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel staff-notes" aria-label="Private staff notes">
          <header className="section-header">
            <div>
              <h3>Private Staff Notes</h3>
              <p>Keep the team aligned with favorite pinned reminders and context for every visit.</p>
            </div>
            <button type="button" className="action-button">
              Add note
            </button>
          </header>
          <div className="staff-notes-grid">
            {pinnedNotes.map(note => (
              <article key={note.id} className="note-card note-pinned">
                <span className="note-label">Pinned</span>
                <h4>{note.category}</h4>
                <p>{note.content}</p>
                <footer>
                  <span>{note.author}</span>
                  <span className="row-secondary">{note.createdAt}</span>
                </footer>
              </article>
            ))}
            {otherNotes.map(note => (
              <article key={note.id} className="note-card">
                <h4>{note.category}</h4>
                <p>{note.content}</p>
                <footer>
                  <span>{note.author}</span>
                  <span className="row-secondary">{note.createdAt}</span>
                </footer>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="pet-card-grid">
        {client.pets.map(pet => {
          const shareTargets = Array.from(new Set(pet.gallery.flatMap(item => item.shareTargets)));

          return (
          <section key={pet.id} id={pet.id} className="panel pet-profile-card" aria-labelledby={`${pet.id}-heading`}>
            <header className="pet-profile-header">
              <div className="pet-profile-heading">
                <h3 id={`${pet.id}-heading`}>{pet.name}</h3>
                <p className="pet-profile-meta">
                  {pet.breed} • {pet.color} • {pet.plan}
                </p>
                <p className="row-secondary">Temperament: {pet.temperament}</p>
              </div>
              <div className="pet-actions">
                <button type="button" className="pill-button pill-active">
                  Rebook appointment
                </button>
                <button type="button" className="pill-button">
                  Add journal entry
                </button>
                <button type="button" className="pill-button">
                  Upload media
                </button>
              </div>
            </header>

            <p className="pet-rebook-summary">{pet.rebookSummary}</p>

            <div className="pet-meta-grid">
              <div className="pet-meta-card">
                <span className="roster-label">Last appointment</span>
                <strong>{pet.lastAppointment}</strong>
                <span className="row-secondary">{pet.lastVisit}</span>
              </div>
              <div className="pet-meta-card">
                <span className="roster-label">Next visit</span>
                <strong>{pet.nextVisit}</strong>
                <span className="row-secondary">Auto loads last visit playbook</span>
              </div>
              <div className="pet-meta-card">
                <span className="roster-label">Cadence</span>
                <strong>{pet.cadence}</strong>
                <span className="row-secondary">Status: {pet.status}</span>
              </div>
              <div className="pet-meta-card">
                <span className="roster-label">Favorite notes</span>
                <ul className="pet-note-chips">
                  {pet.favoriteNotes.map(note => (
                    <li key={note} className="pet-note-chip">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pet-detail-grid">
              <section className="journal-section" aria-label={`Smart Notes Journal for ${pet.name}`}>
                <header className="section-header">
                  <div>
                    <h4>Smart Notes Journal</h4>
                    <p>
                      A living history of {pet.name}&rsquo;s grooming journey with pinned highlights and attachments.
                    </p>
                  </div>
                  <button type="button" className="action-button">
                    Record update
                  </button>
                </header>

                <div className="journal-pinned">
                  <span className="note-label">Favorite note</span>
                  <p>{pet.smartNotes.pinned}</p>
                </div>

                <ul className="journal-entry-list">
                  {pet.smartNotes.entries.map(entry => (
                    <li key={entry.id} className="journal-entry">
                      <header>
                        <div>
                          <span className="journal-date">{entry.date}</span>
                          <p className="journal-service">{entry.service}</p>
                        </div>
                        <div className="journal-meta">
                          <span>{entry.stylist}</span>
                          <span className="row-secondary">Mood: {entry.mood}</span>
                        </div>
                      </header>
                      <p>{entry.note}</p>
                      {entry.attachments.length > 0 ? (
                        <ul className="journal-attachments">
                          {entry.attachments.map(attachment => (
                            <li key={attachment.label} className={`attachment-chip attachment-${attachment.type}`}>
                              {attachment.label}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>

              <aside className="vaccine-widget" aria-label={`Vaccine tracker for ${pet.name}`}>
                <header>
                  <h4>Vaccines</h4>
                  <button type="button" className="icon-button" aria-label="Upload vaccine record">
                    +
                  </button>
                </header>
                <ul>
                  {pet.vaccines.map(vaccine => (
                    <li key={`${pet.id}-${vaccine.label}`}>
                      <div>
                        <p className="vaccine-name">{vaccine.label}</p>
                        <span className="row-secondary">{vaccine.date}</span>
                      </div>
                      <span className={`status-pill ${vaccineStatusTone[vaccine.status as VaccineStatusKey]}`}>
                        {vaccine.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>

            <div className="pet-secondary-grid">
              <section className="pet-timeline-section" aria-label={`Timeline for ${pet.name}`}>
                <header className="section-header">
                  <div>
                    <h4>Pet Timeline</h4>
                    <p>Track milestones, care wins, and behavioral shifts in a visual timeline.</p>
                  </div>
                </header>
                <div className="pet-timeline-grid">
                  {pet.timeline.map(event => (
                    <article key={event.id} className="pet-timeline-card">
                      <header>
                        <span className="timeline-date">{event.date}</span>
                        <h5>{event.title}</h5>
                      </header>
                      <p>{event.summary}</p>
                      <div className="timeline-tags">
                        {event.tags.map(tag => (
                          <span key={tag} className="chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="pet-gallery-section" aria-label={`Gallery for ${pet.name}`}>
                <header className="section-header">
                  <div>
                    <h4>Pet Gallery &amp; Sharing</h4>
                    <p>Upload before-and-after shots, style references, and quick clips.</p>
                  </div>
                  <div className="share-actions">
                    {shareTargets.map(target => (
                      <button key={target} type="button" className="share-button">
                        Share to {target}
                      </button>
                    ))}
                  </div>
                </header>
                <div className="pet-gallery-grid">
                  {pet.gallery.map(item => (
                    <figure key={item.id} className="pet-gallery-item">
                      <div className="pet-gallery-thumb" style={{ backgroundImage: `url(${item.thumbnail})` }} />
                      <figcaption>
                        <strong>{item.caption}</strong>
                        <span className="row-secondary">{item.capturedAt}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            </div>
          </section>
          );
        })}
      </div>
    </div>
  );
}
