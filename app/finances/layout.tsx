import FinancesTabs from "./_components/FinancesTabs";

export default function FinancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="page finances-page">
      <header className="page-header">
        <div>
          <h1>Finances</h1>
          <p className="page-subtitle">
            Monitor revenue, outstanding balances, payouts, and operating expenses —
            synced with Supabase in real time.
          </p>
        </div>
      </header>
      <FinancesTabs />
      <div className="page-stack">{children}</div>
    </section>
  );
}
