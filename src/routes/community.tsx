import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { StudentForm } from "@/components/forms/Forms";
import { Rich, useContent } from "@/lib/content-context";

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
