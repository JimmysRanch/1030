import StaffTabs from "./_components/StaffTabs";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="page staff-page">
      <StaffTabs />
      <div className="page-stack">{children}</div>
    </section>
  );
}
