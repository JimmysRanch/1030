import { ReactNode } from "react";
import SettingsNav from "./nav";

const navItems = [
  { href: "/settings", label: "Account" },
  { href: "/settings/business", label: "Business" },
  { href: "/settings/services", label: "Services" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/integrations", label: "Integrations" },
  { href: "/settings/billing", label: "Billing" },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">
            Configure Scruffy Butts 21, keep your team in sync, and control who can see what.
          </p>
        </div>
        <div className="page-header-meta">
          <span className="page-header-date">Last reviewed Oct 27, 2025</span>
          <span className="page-header-timezone">Pacific Time (PT)</span>
        </div>
      </header>
      <SettingsNav items={navItems} />
      <div className="page-stack">{children}</div>
    </div>
  );
}

export const settingsNav = navItems;
