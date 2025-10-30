import { businessProfile } from "../data";

export default function BusinessPage() {
  const address = [
    businessProfile.location.addressLine1,
    businessProfile.location.addressLine2,
    `${businessProfile.location.city}, ${businessProfile.location.state} ${businessProfile.location.postalCode}`,
  ].filter(Boolean);

  return (
    <div className="stack gap-large">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Business identity</h2>
            <p className="panel-subtitle">
              These details appear on invoices, reminder emails, and the client booking portal.
            </p>
          </div>
        </header>
        <div className="settings-grid">
          <div className="settings-field">
            <span className="settings-label">Legal name</span>
            <span className="settings-value">{businessProfile.legalName}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Doing business as</span>
            <span className="settings-value">{businessProfile.doingBusinessAs}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Tagline</span>
            <span className="settings-note">{businessProfile.brandTagline}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Phone</span>
            <span className="settings-value">{businessProfile.phone}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Email</span>
            <span className="settings-value">{businessProfile.email}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Website</span>
            <span className="settings-value">{businessProfile.website}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Location & hours</h2>
            <p className="panel-subtitle">
              Keep address and operating hours accurate so online bookings stay aligned with staffing.
            </p>
          </div>
        </header>
        <div className="settings-location">
          <div className="settings-address">
            <span className="settings-label">Studio address</span>
            <address>
              {address.map(line => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>
          <div className="settings-hours">
            <span className="settings-label">Operating hours</span>
            <ul>
              {businessProfile.hours.map(slot => (
                <li key={slot.days}>
                  <span>{slot.days}</span>
                  <span>
                    {slot.open} – {slot.close}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="settings-emergency">
          <div>
            <span className="settings-label">Emergency contact</span>
            <span className="settings-value">{businessProfile.emergencyContact.name}</span>
            <span className="settings-note">{businessProfile.emergencyContact.role}</span>
          </div>
          <div>
            <span className="settings-label">Reach at</span>
            <span className="settings-value">{businessProfile.emergencyContact.phone}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <h2 className="panel-title">Client policies</h2>
            <p className="panel-subtitle">
              Policies are shown during booking and in every confirmation email to avoid surprises.
            </p>
          </div>
        </header>
        <ul className="policy-list">
          {businessProfile.policies.map(policy => (
            <li key={policy.label}>
              <h3>{policy.label}</h3>
              <p>{policy.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
