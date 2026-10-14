import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Cpu, Rocket } from "lucide-react";
import { Container, FinalCTA, PageHero, SectionHead } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/site/CountUp";
import { pageMeta } from "@/lib/metadata";
import { Rich, resolveImage, useContent } from "@/lib/content-context";
import { itemText } from "@/lib/site-content";

export const Route = createFileRoute("/innovation-lab")({
  head: () =>
    pageMeta(
      "Startup Innovation Lab",
      "See how the Elite Forums Innovation Lab helps turn community ideas into technology, working products and new ventures.",
      "/innovation-lab",
    ),
  component: InnovationLab,
});

const TRACK_ICONS = [Cpu, Rocket];

function InnovationLab() {
  const c = useContent("lab");
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      >
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="brand" size="lg">
            <Link to="/contact">
              {c.t("hero.primary")} <ArrowUpRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/community">{c.t("hero.secondary")}</Link>
          </Button>
        </div>
      </PageHero>
      <section className="border-b border-border bg-surface/40 py-12 md:py-16">
        <Container>
          <SectionHead eyebrow={c.t("stats.eyebrow")} title={c.t("stats.title")} />
          <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-3">
            {c.items("stats.items").map((stat, i) => (
              <div
                key={i}
                className="panel flex min-h-36 flex-col justify-between border border-border bg-background p-6 md:min-h-40"
              >
                <CountUp value={itemText(stat, "title")} index={i} />
                <p className="mt-8 max-w-xs text-sm font-medium leading-6 text-foreground">
                  {itemText(stat, "body")}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="section-space border-b border-border">
        <Container>
          <SectionHead
            eyebrow={c.t("tracks.eyebrow")}
            title={<Rich text={c.t("tracks.title")} />}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {c.items("tracks").map((track, i) => {
              const Icon = TRACK_ICONS[i % TRACK_ICONS.length] ?? Cpu;
              return (
                <div key={i} className="panel border border-border bg-surface p-7 md:p-10">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow text-electric">{itemText(track, "tag")}</p>
                    <Icon className="h-6 w-6 text-turquoise" />
                  </div>
                  <h3 className="mt-7 text-3xl font-medium">{itemText(track, "title")}</h3>
                  <p className="mt-5 reading-copy">{itemText(track, "body")}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
      <section className="section-space border-b border-border bg-surface/40">
        <Container>
          <SectionHead
            eyebrow={c.t("technologies.eyebrow")}
            title={<Rich text={c.t("technologies.title")} />}
          />
          <p className="mt-6 max-w-2xl reading-copy">{c.t("technologies.intro")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            {c.list("technologies").map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-electric/30 bg-background px-4 py-2 text-sm text-foreground"
              >
                {technology}
              </span>
            ))}
          </div>
        </Container>
      </section>
      <section className="section-space">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <img
            src={resolveImage(c.t("stages.image"), "hackathon")}
            alt="Builders working on a project together"
            className="panel aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          <div>
            <SectionHead
              eyebrow={c.t("stages.eyebrow")}
              title={<Rich text={c.t("stages.title")} />}
            />
            <div className="mt-10 space-y-8">
              {c.items("stages").map((stage, i) => (
                <div key={i} className="flex gap-6 border-t border-border pt-6">
                  <p className="font-display text-3xl text-electric">0{i + 1}</p>
                  <div>
                    <h3 className="text-xl font-medium">{itemText(stage, "title")}</h3>
                    <p className="mt-2 text-sm reading-copy">{itemText(stage, "body")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <FinalCTA title={c.t("cta.title")} />
    </>
  );
}
