import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { StudentForm } from "@/components/forms/Forms";
import { Rich, useContent } from "@/lib/content-context";
import { itemText } from "@/lib/site-content";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Join the Community — Elite Forums" },
      {
        name: "description",
        content:
          "Join Elite Forums for founder learning, workshops, hackathons and a network of aspiring founders across India.",
      },
      { property: "og:title", content: "Join the Community — Elite Forums" },
      {
        property: "og:description",
        content: "A network of aspiring founders across colleges and cities.",
      },
      {
        name: "keywords",
        content:
          "startup community India, aspiring founders, student entrepreneurs, founder network",
      },
    ],
    links: [{ rel: "canonical", href: "https://eliteforums.in/community" }],
  }),
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
                <p className="display-xl text-4xl leading-none text-electric sm:text-5xl">
                  {itemText(stat, "title")}
                </p>
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
