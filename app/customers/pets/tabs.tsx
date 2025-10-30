"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/customers/pets", label: "Profiles" },
  { href: "/customers/pets/health", label: "Health & Vaccines" },
  { href: "/customers/pets/alerts", label: "Care Alerts" },
];

export default function PetsTabs() {
  const pathname = usePathname();

  return (
    <nav className="tab-nav tab-nav-nested" aria-label="Pet subsections">
      {tabs.map(tab => {
        const active =
          pathname === tab.href ||
          (tab.href !== "/customers/pets" && pathname?.startsWith(tab.href));

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
