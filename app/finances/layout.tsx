import FinancesTabs from "./_components/FinancesTabs";

export default function FinancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="page finances-page">
      <FinancesTabs />
      <div className="page-stack">{children}</div>
    </section>
  );
}
