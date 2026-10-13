import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, FinalCTA, PageHero, SectionHead } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/metadata";
import { Rich, useContent } from "@/lib/content-context";
import { itemText } from "@/lib/site-content";

export const Route = createFileRoute("/network")({
  head: () =>
    pageMeta(
      "Partner Network",
      "Connect your college, startup community or organisation with the Elite Forums entrepreneurship ecosystem.",
      "/network",
    ),
  component: NetworkPage,
});

function NetworkPage() {
  const c = useContent("network");
  const partners = c.items("partners").filter((partner) => itemText(partner, "name"));
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      <section className="section-space">
        <Container>
          <SectionHead eyebrow={c.t("groups.eyebrow")} title={c.t("groups.title")} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {c.items("groups").map((group, i) => (
              <div key={i} className="panel border border-border bg-surface p-8">
                <h3 className="text-2xl">{itemText(group, "title")}</h3>
                <p className="mt-4 reading-copy">{itemText(group, "body")}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-2xl">{c.t("partners.title")}</h2>
            {partners.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {partners.map((partner, i) => (
                  <div key={i}>
                    <h3>{itemText(partner, "name")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {[itemText(partner, "city"), itemText(partner, "type")]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">{c.t("partners.empty")}</p>
            )}
            <Button asChild variant="outline" className="mt-8">
              <Link to="/contact">{c.t("partners.cta")}</Link>
            </Button>
          </div>
        </Container>
      </section>
      <FinalCTA />
    </>
  );
}
