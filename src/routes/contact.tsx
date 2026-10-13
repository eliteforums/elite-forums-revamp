import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { ContactForm } from "@/components/forms/Forms";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageMeta(
      "Contact",
      "Get in touch about college partnerships, student enquiries, events, mentorship and collaboration with Elite Forums.",
    ),
  component: () => (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Good things start
            <br />
            with a <span className="text-brand">conversation.</span>
          </>
        }
        intro="A campus collaboration, a founder session, or an idea we should hear — we’d love to connect."
      />
      <section className="section-space">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHead eyebrow="Get in touch" title="Let’s talk." />
            <p className="mt-6 reading-copy">
              Tell us what you have in mind and the team will reply by email.
            </p>
            <div className="mt-10 space-y-6">
              {[
                ["Colleges & E-Cells", "Partnerships, campus programmes and community support."],
                ["Founders & mentors", "Share your experience with the next generation."],
                ["Students & partners", "Events, opportunities and ideas for collaboration."],
              ].map(([t, d]) => (
                <div key={t} className="border-t border-border pt-5">
                  <h3 className="text-lg">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  ),
});
