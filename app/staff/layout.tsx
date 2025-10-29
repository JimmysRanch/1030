import StaffTabs from "./_components/StaffTabs";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="page staff-page">
      <header className="page-header">
        <div>
          <h1>Staff</h1>
          <p className="page-subtitle">
            Manage team roster, scheduling, payroll, performance, and onboarding —
            all powered by Supabase.
          </p>
        </div>
      </header>
      <StaffTabs />
      <div className="page-stack">{children}</div>
    </section>
  );
}
