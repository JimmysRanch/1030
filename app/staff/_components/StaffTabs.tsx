"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/staff", label: "Staff" },
  { href: "/staff/schedule", label: "Scheduling" },
  { href: "/staff/payroll", label: "Payroll" },
  { href: "/staff/performance", label: "Performance" },
];

const nestedStaffRoutes = ["/staff/schedule", "/staff/payroll", "/staff/performance"];

function isActive(pathname: string, href: string) {
  if (href === "/staff") {
    if (pathname === href) {
      return true;
    }

    if (!pathname.startsWith("/staff")) {
      return false;
    }

    return !nestedStaffRoutes.some(route => pathname.startsWith(route));
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
