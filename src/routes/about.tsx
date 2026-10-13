import { createFileRoute } from "@tanstack/react-router";
import { Container, FinalCTA, PageHero, SectionHead } from "@/components/site/Blocks";
import { JoinPaths, Mission } from "@/components/site/EcosystemSections";
import { pageMeta } from "@/lib/metadata";
import students from "@/assets/students.jpg";

export const Route = createFileRoute("/about")({
  head: () =>
    pageMeta(
      "About",
      "Our vision is to make India a startup hub — connecting aspiring founders, colleges and mentors, starting from Mumbai.",
    ),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Elite Forums"
        title={
          <>
            Built for the
            <br />
            <span className="text-brand">next generation.</span>
          </>
        }
        intro="Building India’s next generation of founders — from Mumbai to the whole nation."
      />
      <section className="section-space">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <img
            src={students}
            alt="Community members collaborating around a table"
            className="panel aspect-[4/3] w-full object-cover"
          />
          <div>
            <SectionHead eyebrow="Our story" title="Ambition needs a community." />
            <p className="mt-7 reading-copy">
              Elite Forums brings together aspiring founders, students, E-Cells, mentors and startup
              communities around a simple belief: anyone who wants to become a founder should have
              the people and opportunities to do it.
            </p>
            <p className="mt-5 reading-copy">
              We started in Mumbai, India’s financial capital. Students are a major part of what we
              do — we work with multiple colleges to build active entrepreneurship communities — and
              we’re scaling city by city with a bigger vision: to make India a startup hub.
            </p>
          </div>
        </Container>
      </section>
      <Mission />
      <JoinPaths />
      <FinalCTA />
    </>
  );
}
