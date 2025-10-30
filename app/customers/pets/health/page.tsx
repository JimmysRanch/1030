import { healthRecords } from "../data";

const statusTone: Record<string, string> = {
  Complete: "status-active",
  Due: "status-onboarding",
  Expired: "status-leave",
};

export default function PetsHealthPage() {
  return (
    <div className="page-stack gap-large">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Vaccination &amp; Wellness Log</h2>
            <p className="panel-subtitle">
              Keep medical compliance up-to-date with clear visibility into every
              vaccine, allergy, and vet note synced from Supabase.
            </p>
          </div>
        </div>

        <div className="health-grid">
          {healthRecords.map(record => (
            <article key={record.pet} className="health-card">
              <header className="health-header">
                <div>
                  <h3>{record.pet}</h3>
                  <p>Guardian: {record.owner}</p>
                </div>
                <span className="health-exam">Last exam {record.lastExam}</span>
              </header>

              <section className="health-section" aria-label="Vaccination status">
                <h4>Vaccinations</h4>
                <ul>
                  {record.vaccines.map(vaccine => (
                    <li key={vaccine.label}>
                      <div>
                        <p className="health-vaccine">{vaccine.label}</p>
                        <span className="health-date">{vaccine.date}</span>
                      </div>
                      {vaccine.notes ? (
                        <p className="health-notes">{vaccine.notes}</p>
                      ) : null}
                      <span className={`status-pill ${statusTone[vaccine.status]}`}>
                        {vaccine.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="health-section" aria-label="Allergies and vet info">
                <h4>Allergies</h4>
                <ul className="chip-list">
                  {record.allergies.map(item => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="health-vet">
                  <h4>Primary Vet</h4>
                  <p>{record.vet}</p>
                </div>
              </section>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
