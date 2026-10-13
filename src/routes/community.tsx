import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { StudentForm } from "@/components/forms/Forms";

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
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Join people who build."
        intro="Get early access to events, founder sessions and resources for aspiring founders — whether you’re a student, a working professional or building your first startup."
      />
      <section className="pb-24">
        <Container className="max-w-3xl">
          <SectionHead eyebrow="Register" title="Your details" />
          <div className="mt-10">
            <StudentForm />
          </div>
        </Container>
      </section>
    </>
  );
}
