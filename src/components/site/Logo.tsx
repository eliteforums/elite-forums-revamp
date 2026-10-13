import { cn } from "@/lib/utils";
import horizontalInk from "@/assets/logo-horizontal-ink.png";
import horizontalLight from "@/assets/logo-horizontal-light.png";
import lockupInk from "@/assets/logo-lockup-ink.png";
import lockupLight from "@/assets/logo-lockup-light.png";
import markInk from "@/assets/logo-mark-ink.png";
import markLight from "@/assets/logo-mark-light.png";

export type LogoVariant = "light" | "ink";

const MARKS: Record<LogoVariant, string> = { light: markLight, ink: markInk };
const LOCKUPS: Record<LogoVariant, string> = { light: lockupLight, ink: lockupInk };
const HORIZONTALS: Record<LogoVariant, string> = { light: horizontalLight, ink: horizontalInk };

/** The Elite Forums hexagon mark on its own. */
export function LogoMark({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  return (
    <img
      src={MARKS[variant]}
      alt=""
      aria-hidden="true"
      className={cn("h-8 w-auto select-none", className)}
    />
  );
}

/** Mark above the wordmark, matching the supplied stacked lockup. */
export function LogoLockup({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  return (
    <img
      src={LOCKUPS[variant]}
      alt="Elite Forums"
      className={cn("h-20 w-auto select-none", className)}
    />
  );
}

/** Mark beside the wordmark, for the header and footer rows. */
export function Logo({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  return (
    <img
      src={HORIZONTALS[variant]}
      alt="Elite Forums"
      className={cn("h-8 w-auto select-none", className)}
    />
  );
}
