import { cn } from "@/lib/utils";

/** Elite Forums mark, cut from the supplied brand logo. White by default, black with `mono="ink"`. */
export function LogoMark({
  className,
  mono,
}: {
  className?: string;
  mono?: "ink" | "light" | undefined;
}) {
  return (
    <img
      src={mono === "ink" ? "/elite-forums-mark-black.png" : "/elite-forums-mark-white.png"}
      alt=""
      aria-hidden="true"
      width={300}
      height={260}
      decoding="async"
      className={cn("h-8 w-auto", className)}
    />
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
      <LogoMark mono={mono} className="h-9" />
      <span className="font-display text-lg font-extrabold uppercase tracking-wide">
        Elite Forums
      </span>
    </span>
  );
}
