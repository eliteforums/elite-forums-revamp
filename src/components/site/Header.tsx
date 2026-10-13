import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/colleges", label: "For Colleges" },
  { to: "/events", label: "Events" },
  { to: "/community", label: "Community" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link to="/" aria-label="Elite Forums home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-electric" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex">
            <Link to="/colleges">Partner College</Link>
          </Button>
          <Button asChild variant="brand" size="sm" className="hidden h-9 px-4 sm:inline-flex">
            <Link to="/community">Join Community</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border px-5 pb-6 pt-2 lg:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border py-4 font-display text-2xl font-medium uppercase"
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant="brand" size="lg">
              <Link to="/community" onClick={() => setOpen(false)}>
                Join the Community
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/colleges" onClick={() => setOpen(false)}>
                Partner Your College
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
