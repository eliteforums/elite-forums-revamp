import { cn } from "@/lib/utils";

/** Elite Forums mark: connected hexagonal lines from the supplied brand logo. */
export function LogoMark({
  className,
  mono,
}: {
  className?: string;
  mono?: "ink" | "light" | undefined;
}) {
  const stroke =
    mono === "ink" ? "var(--ink)" : mono === "light" ? "var(--foreground)" : "url(#ef-grad)";
  return (
    <svg viewBox="0 0 64 64" className={cn("h-8 w-auto", className)} aria-hidden="true">
      <defs>
        <linearGradient id="ef-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="52%" stopColor="var(--turquoise)" />
          <stop offset="100%" stopColor="var(--electric)" />
        </linearGradient>
      </defs>
      <path d="M18 5h28l12 21-12 21H18L6 26Z" fill="none" stroke={stroke} strokeWidth="5" />
      <path d="M25 17h14l7 12-7 12H25l-7-12Z" fill="none" stroke={stroke} strokeWidth="5" />
      <path d="M18 5 30 26 18 47M46 5 34 26l12 21" fill="none" stroke={stroke} strokeWidth="5" />
    </svg>
  );
}

export function Logo({
  className,
  mono,
}: {
  className?: string;
  mono?: "ink" | "light" | undefined;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded bg-paper">
        <LogoMark mono="ink" className="h-5" />
      </span>
      <span className="font-display text-lg font-bold">
        Elite<span className={mono === "ink" ? "text-ink" : "text-electric"}>Forums</span>
      </span>
    </span>
  );
}
