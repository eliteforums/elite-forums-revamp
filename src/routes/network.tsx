import { createFileRoute } from "@tanstack/react-router";
import { Container, FinalCTA, PageHero, SectionHead } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { Rich, useContent } from "@/lib/content-context";
import { itemText } from "@/lib/site-content";

import { contentMeta } from "@/lib/seo";
import { SmartLink } from "@/components/site/SmartLink";
export const Route = createFileRoute("/network")({
  head: ({ matches }) => contentMeta(matches, "network"),
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
          {c.on("groups") && (
            <>
              <SectionHead eyebrow={c.t("groups.eyebrow")} title={c.t("groups.title")} />
              <div className="mt-12 mb-16 grid gap-6 md:grid-cols-3">
                {c.items("groups").map((group, i) => (
                  <div key={i} className="panel border border-border bg-surface p-8">
                    <h3 className="text-2xl">{itemText(group, "title")}</h3>
                    <p className="mt-4 reading-copy">{itemText(group, "body")}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {c.on("partners") && (
            <div className="border-t border-border pt-10 first:border-0 first:pt-0">
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
                <SmartLink href={c.t("partners.ctaLink")}>{c.t("partners.cta")}</SmartLink>
              </Button>
            </div>
          )}
        </Container>
      </section>
      {c.on("cta") && <FinalCTA />}
    </>
  );
}
