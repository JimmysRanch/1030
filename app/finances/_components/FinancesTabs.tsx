"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/finances", label: "Overview" },
  { href: "/finances/invoices", label: "Invoices" },
  { href: "/finances/expenses", label: "Expenses" },
  { href: "/finances/payouts", label: "Payouts" },
];

function isActive(pathname: string, href: string) {
  if (href === "/finances") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function FinancesTabs() {
  const pathname = usePathname() ?? "/finances";

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
