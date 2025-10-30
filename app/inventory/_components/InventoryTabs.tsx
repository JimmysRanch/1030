"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/inventory", label: "Overview" },
  { href: "/inventory/products", label: "Products" },
  { href: "/inventory/purchase-orders", label: "Purchase orders" },
  { href: "/inventory/vendors", label: "Vendors" },
  { href: "/inventory/adjustments", label: "Adjustments" },
  { href: "/inventory/counts", label: "Counts" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/inventory") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function InventoryTabs() {
  const pathname = usePathname() ?? "/inventory";

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
