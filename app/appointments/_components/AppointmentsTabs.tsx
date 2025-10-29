"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/appointments", label: "Schedule" },
  { href: "/appointments/waitlist", label: "Waitlist" },
];

function isActive(pathname: string, href: string) {
  if (href === "/appointments") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppointmentsTabs() {
  const pathname = usePathname() ?? "/appointments";

  return (
    <div className="tab-nav appointments-tabs">
      {tabs.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`tab-link ${isActive(pathname, tab.href) ? "active" : ""}`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
