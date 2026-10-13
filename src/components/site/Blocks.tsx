import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function Container({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className={cn("mx-auto max-w-7xl px-5 md:px-8", className)}>
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border pb-16 pt-36 md:pb-20 md:pt-44">
      <Container className="relative">
        <p className="eyebrow animate-rise text-electric">{eyebrow}</p>
        <h1 className="display-xl animate-rise mt-6 max-w-5xl text-[2.5rem] sm:text-6xl md:text-7xl lg:text-[5rem]">
          {title}
        </h1>
        {intro && (
          <p className="animate-rise mt-8 max-w-2xl text-lg text-muted-foreground">{intro}</p>
        )}
        {children && <div className="animate-rise mt-10">{children}</div>}
      </Container>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-4xl", className)}>
      <p className="eyebrow text-electric">{eyebrow}</p>
      <h2 className="display-xl mt-4 text-4xl md:text-6xl">{title}</h2>
    </div>
  );
}

export function FinalCTA({
  title = "The next entrepreneurial community could start with you.",
}: {
  title?: string;
}) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="panel bg-brand px-6 py-16 text-ink md:px-14 md:py-20">
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
          <div className="relative">
            <p className="eyebrow mb-6">Make your next move</p>
            <h2 className="display-xl max-w-4xl text-4xl sm:text-5xl md:text-6xl">{title}</h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="ink" size="lg">
                <Link to="/community">
                  Join the Community <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="ghostInk" size="lg">
                <Link to="/colleges">Partner Your College</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-current/30 px-2.5 py-1 text-[0.65rem] font-medium uppercase opacity-80",
        className,
      )}
    >
      Sample content
    </span>
  );
}
