import AppointmentsTabs from "./_components/AppointmentsTabs";

function formatHeaderDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const now = new Date();
  const formatted = formatHeaderDate(now);

  return (
    <section className="page appointments-page">
      <header className="page-header">
        <div>
          <h1>Appointments</h1>
          <p className="page-subtitle">
            Real-time control of the day’s book, waitlist, and service handoffs.
          </p>
        </div>
        <div className="page-header-meta" aria-live="polite">
          <span className="page-header-date">{formatted}</span>
          <span className="page-header-timezone">Clinic timezone: local device</span>
        </div>
      </header>
      <AppointmentsTabs />
      <div className="page-stack">{children}</div>
    </section>
  );
}
