"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

export default function SettingsNav({ items }: { items: NavItem[] }) {
  const path = usePathname();
  return (
    <nav className="tab-nav" aria-label="Settings">
      {items.map(item => {
        const active =
          path === item.href ||
          (item.href !== "/settings" && (path?.startsWith(item.href + "/") ?? false));
        return (
          <Link key={item.href} href={item.href} className={`tab-link ${active ? "active" : ""}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
