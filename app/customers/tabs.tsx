"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/customers", label: "Client Roster" },
  { href: "/customers/pets", label: "Pets" },
];

export default function CustomersTabs() {
  const pathname = usePathname();

  return (
    <nav className="tab-nav" aria-label="Client sections">
      {tabs.map(tab => {
        const active =
          pathname === tab.href ||
          (tab.href !== "/customers" && pathname?.startsWith(tab.href));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tab-link ${active ? "active" : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
