import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { AmbassadorForm } from "@/components/forms/Forms";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/campus-ambassadors")({
  head: () =>
    pageMeta(
      "Campus Ambassadors",
      "Apply to represent Elite Forums on your campus and help build a community of student entrepreneurs.",
    ),
  component: () => (
    <>
      <PageHero
        eyebrow="Campus ambassadors"
        title={
          <>
            Be the spark
            <br />
            on <span className="text-brand">your campus.</span>
          </>
        }
        intro="Bring people together, champion student ideas and help your campus connect with the wider entrepreneurship ecosystem."
      />
      <section className="section-space">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              [
                "Lead a community",
                "Connect interested students, welcome new members and work with your E-Cell.",
              ],
              [
                "Create momentum",
                "Help coordinate campus conversations, workshops and collaborative experiences.",
              ],
              [
                "Grow your network",
                "Work alongside student leaders from other campuses and meet builders beyond your college.",
              ],
            ].map(([t, d], i) => (
              <div key={t}>
                <p className="text-electric">0{i + 1}</p>
                <h2 className="mt-5 text-2xl">{t}</h2>
                <p className="mt-3 reading-copy">{d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="section-space border-t border-border">
        <Container className="max-w-3xl">
          <SectionHead eyebrow="Your next move" title="Apply to lead." />
          <p className="mb-10 mt-5 text-muted-foreground">
            Tell us about your campus, your experience and what you’d like to build.
          </p>
          <AmbassadorForm />
        </Container>
      </section>
    </>
  ),
});
