import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, FinalCTA, PageHero, SectionHead } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { PARTNERS } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/network")({
  head: () =>
    pageMeta(
      "Partner Network",
      "Connect your college, startup community or organisation with the Elite Forums entrepreneurship ecosystem.",
    ),
  component: () => (
    <>
      <PageHero
        eyebrow="Partner network"
        title={
          <>
            Different campuses.
            <br />
            <span className="text-brand">Shared ambition.</span>
          </>
        }
        intro="College E-Cells, startup communities, mentors and industry partners — stronger when connected."
      />
      <section className="section-space">
        <Container>
          <SectionHead eyebrow="Better together" title="Find your place in the network." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "College communities",
                "Build your E-Cell’s reach and connect students with meaningful entrepreneurial experiences.",
              ],
              [
                "Founders & mentors",
                "Help student builders navigate their next step through practical advice and honest conversations.",
              ],
              [
                "Industry partners",
                "Collaborate on programmes, share challenges and support emerging entrepreneurial talent.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="panel border border-border bg-surface p-8">
                <h3 className="text-2xl">{t}</h3>
                <p className="mt-4 reading-copy">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-2xl">Partner institutions</h2>
            {PARTNERS.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {PARTNERS.map((p) => (
                  <div key={p.name}>
                    <h3>{p.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {p.city} · {p.type}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">
                Confirmed partner institutions will be listed here.
              </p>
            )}
            <Button asChild variant="outline" className="mt-8">
              <Link to="/contact">Discuss a collaboration</Link>
            </Button>
          </div>
        </Container>
      </section>
      <FinalCTA />
    </>
  ),
});
