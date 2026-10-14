import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { CountUp } from "@/components/site/CountUp";
import { StudentForm } from "@/components/forms/Forms";
import { Rich, useContent } from "@/lib/content-context";
import { pageMeta } from "@/lib/metadata";
import { itemText } from "@/lib/site-content";

export const Route = createFileRoute("/community")({
  head: () =>
    pageMeta(
      "Startup Community for Students and Founders",
      "Join Elite Forums to learn with aspiring founders, take part in workshops and hackathons, and connect with student entrepreneurs across India.",
      "/community",
    ),
  component: Community,
});

function Community() {
  const c = useContent("community");
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      <section className="border-b border-border bg-surface/40 py-12 md:py-16">
        <Container>
          <SectionHead eyebrow={c.t("stats.eyebrow")} title={c.t("stats.title")} />
          <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="pb-24">
        <Container className="max-w-3xl">
          <SectionHead eyebrow={c.t("form.eyebrow")} title={c.t("form.title")} />
          <div className="mt-10">
            <StudentForm />
          </div>
        </Container>
      </section>
    </>
  );
}
