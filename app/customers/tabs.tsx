"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/customers", label: "Overview" },
  { href: "/customers/pets", label: "Clients & Pets" },
];

export default function CustomersTabs() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="tab-nav" aria-label="Client sections">
      {tabs.map(tab => {
        let active = false;

        if (tab.href === "/customers") {
          active = pathname === tab.href;
        } else if (tab.href === "/customers/pets") {
          const clientProfilePath = /^\/customers\/[^/]+$/;
          active =
            pathname === tab.href ||
            pathname.startsWith(`${tab.href}/`) ||
            clientProfilePath.test(pathname);
        } else {
          active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        }

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
