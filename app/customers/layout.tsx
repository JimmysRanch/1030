import type { ReactNode } from "react";

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
      <div className="page-stack gap-large">{children}</div>
    </section>
  );
}
