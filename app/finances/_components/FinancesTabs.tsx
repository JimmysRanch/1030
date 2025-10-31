"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TabConfig = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
};

const tabs: TabConfig[] = [
  { href: "/finances", label: "Dashboard", icon: "dashboard" },
  { href: "/finances/invoices", label: "Invoices", icon: "invoice" },
  { href: "/finances/expenses", label: "Expenses", icon: "expense" },
  { href: "/finances/payments", label: "Payments", icon: "payments" },
  { href: "/finances/payroll", label: "Payroll", icon: "payroll" },
  { href: "/finances/taxes", label: "Taxes", icon: "tax" },
  { href: "/finances/vendors", label: "Vendors", icon: "vendor" },
  { href: "/finances/purchase-orders", label: "Purchase Orders", icon: "purchaseOrder" },
];

const ICONS = {
  dashboard: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="tab-icon-svg">
      <path
        d="M3 4.5C3 3.67 3.67 3 4.5 3h3A1.5 1.5 0 0 1 9 4.5v3A1.5 1.5 0 0 1 7.5 9h-3A1.5 1.5 0 0 1 3 7.5v-3Zm7 0A1.5 1.5 0 0 1 11.5 3h4A1.5 1.5 0 0 1 17 4.5v2A1.5 1.5 0 0 1 15.5 8h-4A1.5 1.5 0 0 1 10 6.5v-2Zm0 7A1.5 1.5 0 0 1 11.5 10h3A1.5 1.5 0 0 1 16 11.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 10 14.5v-3Zm-7 0A1.5 1.5 0 0 1 4.5 10H7a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 7 17H4.5A1.5 1.5 0 0 1 3 15.5v-4Z"
        fill="currentColor"
      />
    </svg>
  ),
  invoice: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="tab-icon-svg">
      <path
        d="M6.5 3A1.5 1.5 0 0 0 5 4.5v11A1.5 1.5 0 0 0 6.5 17h7a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 13.5 3h-7Zm.5 3.75a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 7 6.75Zm0 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 7 12.75Z"
        fill="currentColor"
      />
    </svg>
  ),
  expense: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="tab-icon-svg">
      <path
        d="M10 3a7 7 0 1 0 7 7a7 7 0 0 0-7-7Zm.5 3.5a.5.5 0 0 0-1 0v.41a2.25 2.25 0 0 0-1.5 2.09c0 1.24 1.07 2 1.9 2.44c.73.38 1.1.66 1.1 1.07c0 .45-.41.89-1.25.89c-.53 0-1.03-.17-1.4-.48a.5.5 0 1 0-.62.78A2.96 2.96 0 0 0 9.5 14.5v.5a.5.5 0 0 0 1 0v-.52c1.18-.2 2-1.02 2-1.99c0-1.2-1.02-1.82-1.82-2.24c-.78-.4-1.18-.68-1.18-1.18c0-.47.4-.93 1.25-.93c.45 0 .9.13 1.25.37a.5.5 0 1 0 .6-.8a2.7 2.7 0 0 0-1.4-.51V6.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  payments: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="tab-icon-svg">
      <path
        d="M3.5 5A1.5 1.5 0 0 0 2 6.5v7A1.5 1.5 0 0 0 3.5 15h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 16.5 5h-13ZM3 7h14v2H3V7Zm4 4.75A.75.75 0 0 1 7.75 11h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 7 11.75Z"
        fill="currentColor"
      />
    </svg>
  ),
  payroll: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="tab-icon-svg">
      <path
        d="M6.5 5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Zm7 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5ZM3.5 12A1.5 1.5 0 0 0 2 13.5v.38c0 1.07.86 1.94 1.94 1.94h3.62a1.94 1.94 0 0 0 1.94-1.94V13.5A1.5 1.5 0 0 0 8 12H3.5Zm8 0a1.5 1.5 0 0 0-1.5 1.5v.38c0 1.07.87 1.94 1.94 1.94h3.62A1.94 1.94 0 0 0 17 13.88V13.5A1.5 1.5 0 0 0 15.5 12h-4Z"
        fill="currentColor"
      />
    </svg>
  ),
  tax: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="tab-icon-svg">
      <path
        d="M5 4a2 2 0 0 0-2 2v8.5A1.5 1.5 0 0 0 4.5 16h11A1.5 1.5 0 0 0 17 14.5V6a2 2 0 0 0-2-2H5Zm2.5 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1Zm0 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1ZM6 13.5A.5.5 0 0 1 6.5 13h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  vendor: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="tab-icon-svg">
      <path
        d="M4.25 3A2.25 2.25 0 0 0 2 5.25v2.5A2.25 2.25 0 0 0 4.25 10h11.5A2.25 2.25 0 0 0 18 7.75v-2.5A2.25 2.25 0 0 0 15.75 3H4.25Zm.5 8A1.75 1.75 0 0 0 3 12.75V15.5A1.5 1.5 0 0 0 4.5 17h3A1.5 1.5 0 0 0 9 15.5v-2.75A1.75 1.75 0 0 0 7.25 11h-2.5Zm7.5 0A1.75 1.75 0 0 0 9.5 12.75V15.5A1.5 1.5 0 0 0 11 17h4a1.5 1.5 0 0 0 1.5-1.5v-2.75A1.75 1.75 0 0 0 14.75 11h-2.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  purchaseOrder: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="tab-icon-svg">
      <path
        d="M6 3a1 1 0 0 0-1 1v12l4-2l4 2V4a1 1 0 0 0-1-1H6Zm2.5 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm0 3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Z"
        fill="currentColor"
      />
    </svg>
  ),
} as const;

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
          <span className="tab-icon" aria-hidden="true">
            {ICONS[tab.icon]}
          </span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}
