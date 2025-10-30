import InventoryTabs from "./_components/InventoryTabs";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const today = dateFormatter.format(new Date());

  return (
    <section className="page inventory-page">
      <header className="page-header">
        <div>
          <h1>Inventory</h1>
          <p className="page-subtitle">
            Track stock levels, purchase activity, vendor performance, and cycle
            counts without relying on the legacy backend.
          </p>
        </div>
        <div className="page-header-meta">
          <span className="page-header-date">{today}</span>
          <span className="page-header-timezone">Pacific Time</span>
        </div>
      </header>
      <InventoryTabs />
      <div className="page-stack">{children}</div>
    </section>
  );
}
