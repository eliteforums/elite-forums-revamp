import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useContent } from "@/lib/content-context";
import { Logo } from "./Logo";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/innovation-lab", label: "Innovation Lab" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/colleges", label: "For Colleges" },
  { to: "/events", label: "Events" },
  { to: "/community", label: "Community" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const c = useContent("global");
  const labels = c.list("nav.labels");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled((current) => {
        const next = window.scrollY > 12;
        return current === next ? current : next;
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-5 md:px-8">
        <Link to="/" aria-label="Elite Forums home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-electric" }}
            >
              {labels[i] || n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex">
            <Link to="/colleges">{c.t("header.partner")}</Link>
          </Button>
          <Button asChild variant="brand" size="sm" className="hidden h-9 px-4 sm:inline-flex">
            <Link to="/community">{c.t("header.join")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-border px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
          aria-label="Mobile"
        >
          {NAV.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block min-h-14 border-b border-border py-4 font-display text-2xl font-medium uppercase"
            >
              {labels[i] || n.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant="brand" size="lg">
              <Link to="/community" onClick={() => setOpen(false)}>
                {c.t("header.mobileJoin")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/colleges" onClick={() => setOpen(false)}>
                {c.t("header.mobilePartner")}
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
