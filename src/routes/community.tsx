import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { StudentForm } from "@/components/forms/Forms";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Join the Community — Elite Forums" },
      { name: "description", content: "Join Elite Forums for founder learning, workshops, hackathons and a network of student builders." },
      { property: "og:title", content: "Join the Community — Elite Forums" },
      { property: "og:description", content: "A network of student builders across campuses." },
    ],
  }),
  component: Community,
});

function Community() {
  return (
    <>
      <PageHero eyebrow="Community" title="Join students who build." intro="Get early access to events, founder sessions and resources picked for student entrepreneurs." />
      <section className="pb-24">
        <Container className="max-w-3xl">
          <SectionHead eyebrow="Register" title="Your details" />
          <div className="mt-10"><StudentForm /></div>
        </Container>
      </section>
    </>
  );
}
