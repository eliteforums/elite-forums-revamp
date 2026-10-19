import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, FinalCTA } from "@/components/site/Blocks";
import { EcosystemGrid, JoinPaths, Mission } from "@/components/site/EcosystemSections";
import { Rich, resolveImage, useContent } from "@/lib/content-context";
import { itemText } from "@/lib/site-content";
import { FaqSection } from "@/components/site/FaqSection";

import { contentMeta } from "@/lib/seo";
export const Route = createFileRoute("/")({
  head: ({ matches }) => contentMeta(matches, "home"),
  component: Home,
});

function Home() {
  const c = useContent("home");
  return (
    <>
      <section className="relative overflow-hidden border-b border-border pb-12 pt-36 md:pb-16 md:pt-44">
        <img
          src={resolveImage(c.t("hero.image"), "students")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15"
        />
        <div className="photo-shade absolute inset-0" />
        <div className="canvas-grid pointer-events-none absolute inset-0 opacity-20" />
        <Container className="relative">
          <p className="eyebrow animate-rise text-electric">{c.t("hero.eyebrow")}</p>
          <h1 className="display-xl animate-rise mt-7 max-w-5xl break-words text-[clamp(2.125rem,9vw,2.5rem)] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            <Rich text={c.t("hero.title")} breakClassName="hidden sm:block" />
          </h1>
          <p className="animate-rise mt-8 max-w-xl text-base leading-7 text-muted-foreground">
            {c.t("hero.intro")}
          </p>
          <div className="animate-rise mt-9 flex flex-wrap gap-4">
            <Button asChild variant="brand" size="lg">
              <Link to="/community">
                {c.t("hero.primary")} <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/colleges">{c.t("hero.secondary")}</Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center gap-3 text-xs text-muted-foreground">
            <ArrowDown className="h-4 w-4 text-electric" />
            <span>{c.t("hero.scroll")}</span>
          </div>
        </Container>
      </section>
      {c.on("pillars") && (
        <section className="border-b border-border py-8">
          <Container className="grid gap-8 sm:grid-cols-3">
            {c.items("pillars").map((pillar, i) => (
              <div key={i} className="sm:border-r sm:border-border sm:last:border-0">
                <p className="text-xl font-medium">{itemText(pillar, "title")}</p>
                <p className="mt-2 text-xs text-muted-foreground">{itemText(pillar, "body")}</p>
              </div>
            ))}
          </Container>
        </section>
      )}
      {c.on("grid") && <EcosystemGrid />}
      {c.on("mission") && <Mission />}
      {c.on("join") && <JoinPaths />}
      {c.on("faqs") && <FaqSection preview />}
      {c.on("cta") && <FinalCTA />}
    </>
  );
}
