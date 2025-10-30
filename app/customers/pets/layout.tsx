import type { ReactNode } from "react";
import PetsTabs from "./tabs";

export default function PetsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="page-stack gap-large">
      <PetsTabs />
      {children}
    </div>
  );
}
