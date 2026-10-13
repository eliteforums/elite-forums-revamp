import { Link } from "@tanstack/react-router";
import { useContent } from "@/lib/content-context";
import { Logo } from "./Logo";

const COLS = [
  {
    id: "explore",
    title: "Explore",
    links: [
      { to: "/innovation-lab", label: "Innovation Lab" },
      { to: "/ecosystem", label: "Ecosystem" },
      { to: "/events", label: "Events" },
      { to: "/resources", label: "Resources" },
      { to: "/faqs", label: "FAQs" },
      { to: "/network", label: "Partner Network" },
    ],
  },
  {
    id: "involved",
    title: "Get involved",
    links: [
      { to: "/community", label: "Join the Community" },
      { to: "/apply", label: "Apply to a Program" },
      { to: "/colleges", label: "Partner Your College" },
      { to: "/campus-ambassadors", label: "Campus Ambassadors" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
      { to: "/refunds", label: "Refund policy" },
      { to: "/cookies", label: "Cookie policy" },
      { to: "/data-deletion", label: "Delete my data" },
    ],
  },
] as const;

export function Footer() {
  const c = useContent("global");
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-muted-foreground">{c.t("footer.tagline")}</p>
        </div>
        {COLS.map((col) => (
          <div key={col.id}>
            <p className="eyebrow text-muted-foreground">
              {c.t(`footer.${col.id}.title`) || col.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l, i) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-foreground/80 transition-colors hover:text-electric"
                  >
                    {c.list(`footer.${col.id}.links`)[i] || l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-border px-5 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
        <span>
          © {new Date().getFullYear()} {c.t("footer.copyright")}
        </span>
        <span className="eyebrow">{c.t("footer.strapline")}</span>
      </div>
    </footer>
  );
}
