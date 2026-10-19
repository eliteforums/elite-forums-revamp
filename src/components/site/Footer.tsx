import { useContent } from "@/lib/content-context";
import { Logo } from "./Logo";
import { SmartLink } from "./SmartLink";
import { itemText } from "@/lib/site-content";

const COLUMNS = [
  { id: "explore", name: "Column 1" },
  { id: "involved", name: "Column 2" },
  { id: "legal", name: "Column 3" },
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
        {COLUMNS.map((col) => {
          const links = c
            .items("footer.links")
            .filter((item) => itemText(item, "column") === col.name)
            .map((item) => ({ label: itemText(item, "label"), link: itemText(item, "link") }))
            .filter((item) => item.label && item.link);
          if (!links.length) return null;
          return (
            <div key={col.id}>
              <p className="eyebrow text-muted-foreground">{c.t(`footer.${col.id}.title`)}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.label + l.link}>
                    <SmartLink
                      href={l.link}
                      className="text-sm text-foreground/80 transition-colors hover:text-electric"
                    >
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
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
