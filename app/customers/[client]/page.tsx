import Link from "next/link";
import { notFound } from "next/navigation";

import { clientProfiles, getClientProfile } from "../pets/data";

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "";
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

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

  return (
    <div className="page-stack gap-large">
      <section className="panel client-profile-hero">
        <header className="profile-header">
          <div className="row-main">
            <span className="avatar client-avatar" aria-hidden="true">
              {getInitials(client.name)}
            </span>
            <div className="profile-heading">
              <h2>{client.name}</h2>
              <p className="profile-meta">
                Member since {client.membershipSince} • Favorite groomer {client.favoriteGroomer}
              </p>
              <p className="row-secondary">
                {client.email} • {client.phone} • {client.address}
              </p>
            </div>
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
          <button type="button" className="quick-action-button">
            Share pet update
          </button>
        </div>

        <div className="profile-stats-grid" role="list">
          <div className="profile-stat-card" role="listitem">
            <span className="stat-label">Total visits</span>
            <strong className="stat-value">{client.stats.totalVisits}</strong>
          </div>
          <div className="profile-stat-card" role="listitem">
            <span className="stat-label">Average spend</span>
            <strong className="stat-value">{client.stats.averageSpend}</strong>
          </div>
          <div className="profile-stat-card" role="listitem">
            <span className="stat-label">Lifetime value</span>
            <strong className="stat-value">{client.stats.lifetimeValue}</strong>
          </div>
          <div className="profile-stat-card" role="listitem">
            <span className="stat-label">Visit cadence</span>
            <strong className="stat-value">{client.stats.visitFrequency}</strong>
          </div>
          <div className="profile-stat-card" role="listitem">
            <span className="stat-label">Pets on file</span>
            <strong className="stat-value">{totalPets}</strong>
          </div>
          <div className="profile-stat-card" role="listitem">
            <span className="stat-label">Social channels</span>
            <strong className="stat-value">{client.socialChannels.join(", ")}</strong>
          </div>
        </div>
      </section>

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

      {client.pets.map(pet => {
        const shareTargets = Array.from(new Set(pet.gallery.flatMap(item => item.shareTargets)));

        return (
          <section key={pet.id} id={pet.id} className="panel pet-profile-card" aria-labelledby={`${pet.id}-heading`}>
            <header className="pet-profile-header">
              <div className="row-main">
                <span className="avatar pet-avatar" aria-hidden="true">
                  {getInitials(pet.name)}
                </span>
                <div className="pet-profile-heading">
                  <h3 id={`${pet.id}-heading`}>{pet.name}</h3>
                  <p className="pet-profile-meta">
                    {pet.breed} • {pet.color} • {pet.plan}
                  </p>
                  <p className="row-secondary">Temperament: {pet.temperament}</p>
                </div>
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
                <button type="button" className="pill-button">
                  Share update
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

            <section className="journal-section" aria-label={`Smart Notes Journal for ${pet.name}`}>
              <header className="section-header">
                <div>
                  <h4>Smart Notes Journal</h4>
                  <p>
                    A living history of {pet.name}&rsquo;s grooming journey with pinned highlights, attachments, and
                    stylist voice memos.
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

            <section className="vaccine-section" aria-label={`Vaccine tracker for ${pet.name}`}>
              <header className="section-header">
                <div>
                  <h4>Vaccine Tracker</h4>
                  <p>Upload new documents and keep expiration alerts synced for your team and the client.</p>
                </div>
                <button type="button" className="action-button">
                  Upload vaccine record
                </button>
              </header>
              <ul className="vaccine-list">
                {pet.vaccines.map(vaccine => (
                  <li key={`${pet.id}-${vaccine.label}`}>
                    <div>
                      <p className="vaccine-name">{vaccine.label}</p>
                      <span className="row-secondary">{vaccine.date}</span>
                      {vaccine.notes ? <p className="vaccine-notes">{vaccine.notes}</p> : null}
                    </div>
                    <span className={`status-pill ${vaccineStatusTone[vaccine.status as VaccineStatusKey]}`}>
                      {vaccine.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pet-timeline-section" aria-label={`Timeline for ${pet.name}`}>
              <header className="section-header">
                <div>
                  <h4>Pet Timeline</h4>
                  <p>Track milestones, care wins, and behavioral shifts in a visual timeline.</p>
                </div>
                <Link href={`/customers/${client.slug}`} className="action-button">
                  Back to client overview
                </Link>
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
                  <p>Upload before-and-after shots, style references, and quick clips for social-ready stories.</p>
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
          </section>
        );
      })}
    </div>
  );
}
