"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/staff", label: "Roster" },
  { href: "/staff/schedule", label: "Scheduling" },
  { href: "/staff/payroll", label: "Payroll" },
  { href: "/staff/performance", label: "Performance" },
  { href: "/staff/onboarding", label: "Onboarding" },
];

function isActive(pathname: string, href: string) {
  if (href === "/staff") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function StaffTabs() {
  const pathname = usePathname() ?? "/staff";

  return (
    <div className="tab-nav">
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
