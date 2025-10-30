import type { ReactNode } from "react";

export default function PetsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="page-stack gap-large">{children}</div>;
}
