"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Dashboard" },
  { href: "/appointments", label: "Appointments" },
  { href: "/messages", label: "Messages" },
  { href: "/customers", label: "Clients" },
  { href: "/staff", label: "Staff" },
  { href: "/pos", label: "POS" },
  { href: "/inventory", label: "Inventory" },
  { href: "/finances", label: "Finances" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const path = usePathname() || "/";
  return (
    <header className="top-nav">
      <nav className="primary-nav" aria-label="Primary">
        {items.map(it => (
          <Link
            key={it.href}
            href={it.href}
            className={`nav-link ${path === it.href ? "active" : ""}`}
          >
            {it.label}
          </Link>
        ))}
      </nav>
      <div className="top-actions">
        <div className="user-pill">
          <div className="user-copy">
            <span className="user-name">Jordan Dean</span>
            <span className="user-role">Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
