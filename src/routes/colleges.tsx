import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { CollegeForm } from "@/components/forms/Forms";

export const Route = createFileRoute("/colleges")({
  head: () => ({
    meta: [
      { title: "For Colleges — Elite Forums" },
      { name: "description", content: "Partner your college or E-Cell with Elite Forums for workshops, hackathons and founder sessions." },
      { property: "og:title", content: "For Colleges — Elite Forums" },
      { property: "og:description", content: "Partner your college or E-Cell with Elite Forums." },
    ],
  }),
  component: Colleges,
});

const OFFER = [
  ["Workshops", "Hands-on sessions on startup fundamentals, run on your campus."],
  ["Hackathons", "Co-hosted build weekends with problem briefs and mentors."],
  ["Founder sessions", "Conversations with early-stage founders, online or in person."],
  ["E-Cell support", "Formats and playbooks to help your student community grow."],
];

function Colleges() {
  return (
    <>
      <PageHero eyebrow="For colleges & E-Cells" title="Bring founders to your campus." intro="We partner with institutions to run entrepreneurship programmes that students actually show up for." />
      <section className="py-12">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {OFFER.map(([t, d]) => (
              <div key={t} className="panel border border-border p-8">
                <h3 className="display-xl text-2xl">{t}</h3>
                <p className="mt-3 text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <SectionHead eyebrow="Apply" title="Partner your college" />
          <div className="mt-10"><CollegeForm /></div>
        </Container>
      </section>
    </>
  );
}
