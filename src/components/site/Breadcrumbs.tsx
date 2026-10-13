import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/metadata";

const LABELS: Record<string, string> = {
  apply: "Apply",
  colleges: "For Colleges",
  community: "Community",
  contact: "Contact",
  cookies: "Cookie Policy",
  "data-deletion": "Data Deletion",
  ecosystem: "Ecosystem",
  events: "Events",
  "innovation-lab": "Innovation Lab",
  network: "Partner Network",
  privacy: "Privacy Policy",
  refunds: "Refund Policy",
  resources: "Resources",
  terms: "Terms of Use",
};

/** `current` replaces the last crumb, for pages whose address is not a readable name. */
export function Breadcrumbs({ current }: { current?: string }) {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const items = segments.map((segment, index) => ({
    label:
      (index === segments.length - 1 && current) ||
      (LABELS[segment] ?? decodeURIComponent(segment).replace(/-/g, " ")),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: `${SITE_URL}${item.href}`,
      })),
    ],
  };

  return (
    <div className="absolute inset-x-0 top-24 z-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <li>
              <Link to="/" className="transition-colors hover:text-electric">
                Home
              </Link>
            </li>
            {items.map((item, index) => (
              <li key={item.href} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
                {index === items.length - 1 ? (
                  <span
                    aria-current="page"
                    className="max-w-[60vw] truncate text-foreground sm:max-w-md"
                  >
                    {item.label}
                  </span>
                ) : (
                  <a href={item.href} className="capitalize transition-colors hover:text-electric">
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </div>
    </div>
  );
}
