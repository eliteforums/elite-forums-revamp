import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const COLS = [
  {
    title: "Explore",
    links: [
      { to: "/about", label: "About" },
      { to: "/ecosystem", label: "Ecosystem" },
      { to: "/events", label: "Events" },
      { to: "/resources", label: "Resources" },
      { to: "/network", label: "Partner Network" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { to: "/community", label: "Join the Community" },
      { to: "/colleges", label: "Partner Your College" },
      { to: "/campus-ambassadors", label: "Campus Ambassadors" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-muted-foreground">
            Building the next generation of entrepreneurial communities.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="eyebrow text-muted-foreground">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-foreground/80 transition-colors hover:text-electric">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-border px-5 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
        <span>© {new Date().getFullYear()} Elite Forums. All rights reserved.</span>
        <span className="eyebrow">Where ambition meets opportunity</span>
      </div>
    </footer>
  );
}
