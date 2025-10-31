import FinancesTabs from "./_components/FinancesTabs";

export default function FinancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="page finances-page">
      <header className="finances-header">
        <div className="finances-heading">
          <span className="finances-eyebrow">Financial center</span>
          <h1>Finances</h1>
          <p className="page-subtitle">
            Stay on top of receivables, outgoing spend, payroll, taxes, and vendor partnerships
            with live data synced from Supabase.
          </p>
        </div>
        <div className="finances-actions">
          <button type="button" className="button button-ghost">
            Download reports
          </button>
          <button type="button" className="button button-primary">
            Record transaction
          </button>
        </div>
      </header>
      <FinancesTabs />
      <div className="page-stack">{children}</div>
    </section>
  );
}
