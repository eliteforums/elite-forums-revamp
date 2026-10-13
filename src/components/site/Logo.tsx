import { cn } from "@/lib/utils";

/** Elite Forums mark: three rising, connected parallelograms. */
export function LogoMark({ className, mono }: { className?: string; mono?: "ink" | "light" | undefined }) {
  const fill = mono === "ink" ? "var(--ink)" : mono === "light" ? "var(--foreground)" : "url(#ef-grad)";
  return (
    <svg viewBox="0 0 64 48" className={cn("h-8 w-auto", className)} aria-hidden="true">
      <defs>
        <linearGradient id="ef-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="52%" stopColor="var(--turquoise)" />
          <stop offset="100%" stopColor="var(--electric)" />
        </linearGradient>
      </defs>
      <path d="M2 46 L16 30 L16 14 L2 30 Z" fill={fill} />
      <path d="M20 46 L34 30 L34 2 L20 18 Z" fill={fill} opacity={mono ? 1 : 0.92} />
      <path d="M38 46 L62 20 L62 4 L38 30 Z" fill={fill} />
    </svg>
  );
}

export function Logo({ className, mono }: { className?: string; mono?: "ink" | "light" | undefined }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded bg-paper"><LogoMark mono="ink" className="h-5" /></span>
      <span className="font-display text-lg font-bold">Elite<span className={mono === "ink" ? "text-ink" : "text-electric"}>Forums</span></span>
    </span>
  );
}
