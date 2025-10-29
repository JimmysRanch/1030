"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Dashboard" },
  { href: "/appointments", label: "Appointments" },
  { href: "/customers", label: "Clients" },
  { href: "/staff", label: "Staff" },
  { href: "/pos", label: "POS" },
  { href: "/inventory", label: "Inventory" },
  { href: "/finances", label: "Finances" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" }
];

export default function Nav() {
  const path = usePathname() || "/";
  return (
    <nav className="nav">
      <div className="logo">1030</div>
      <div className="group">Main</div>
      {items.map(it => (
        <Link key={it.href} href={it.href} className={`link ${path===it.href ? "active":""}`}>
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
