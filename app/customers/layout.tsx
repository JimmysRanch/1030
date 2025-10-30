import type { ReactNode } from "react";
import CustomersTabs from "./tabs";

export const metadata = {
  title: "Clients",
};

export default function CustomersLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Clients</h1>
          <p className="page-subtitle">
            Manage your entire client roster, track their pets, and stay on top of
            every detail without leaving the dashboard.
          </p>
        </div>
        <div className="page-header-meta">
          <span className="page-header-date">Updated April 2, 2025</span>
          <span className="page-header-timezone">Mountain View HQ</span>
        </div>
      </header>
      <CustomersTabs />
      <div className="page-stack gap-large">{children}</div>
    </section>
  );
}
