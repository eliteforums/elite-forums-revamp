import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, FinalCTA } from "@/components/site/Blocks";
import { EcosystemGrid, JoinPaths, Mission } from "@/components/site/EcosystemSections";
import { pageMeta } from "@/lib/metadata";
import students from "@/assets/students.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta(
      "Elite Forums | Where student ambition meets opportunity",
      "Elite Forums connects college E-Cells, aspiring founders and student communities through entrepreneurship, collaboration and meaningful experiences.",
    ),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border pb-12 pt-36 md:pb-16 md:pt-44">
        <img
          src={students}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15"
        />
        <div className="photo-shade absolute inset-0" />
        <div className="canvas-grid pointer-events-none absolute inset-0 opacity-20" />
        <Container className="relative">
          <p className="eyebrow animate-rise text-electric">The entrepreneurship ecosystem</p>
          <h1 className="display-xl animate-rise mt-7 max-w-5xl text-[2.5rem] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Where <span className="text-brand">student</span>
            <br className="hidden sm:block" /> ambition meets
            <br className="hidden sm:block" /> <span className="text-brand">opportunity.</span>
          </h1>
          <p className="animate-rise mt-8 max-w-xl text-base leading-7 text-muted-foreground">
            Elite Forums connects college E-Cells, aspiring founders, and student communities to
            create meaningful opportunities for entrepreneurship, collaboration, and growth.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap gap-4">
            <Button asChild variant="brand" size="lg">
              <Link to="/community">
                Join the Community <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/colleges">Partner Your College</Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center gap-3 text-xs text-muted-foreground">
            <ArrowDown className="h-4 w-4 text-electric" />
            <span>Ideas start here.</span>
          </div>
        </Container>
      </section>
      <section className="border-b border-border py-8">
        <Container className="grid gap-8 sm:grid-cols-3">
          {[
            ["Colleges & E-Cells", "Where communities take shape"],
            ["Student builders", "Where ambition finds its people"],
            ["Founders & mentors", "Where experience opens doors"],
          ].map(([t, d]) => (
            <div key={t} className="sm:border-r sm:border-border sm:last:border-0">
              <p className="text-xl font-medium">{t}</p>
              <p className="mt-2 text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </Container>
      </section>
      <EcosystemGrid />
      <Mission />
      <JoinPaths />
      <FinalCTA />
    </>
  );
}
