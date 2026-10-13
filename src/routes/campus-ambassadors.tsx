import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { AmbassadorForm } from "@/components/forms/Forms";
import { pageMeta } from "@/lib/metadata";
import { Rich, useContent } from "@/lib/content-context";
import { itemText } from "@/lib/site-content";

export const Route = createFileRoute("/campus-ambassadors")({
  head: () =>
    pageMeta(
      "Campus Ambassador Program for Students",
      "Represent Elite Forums on your campus, connect student entrepreneurs and help grow a practical entrepreneurship community.",
      "/campus-ambassadors",
    ),
  component: AmbassadorsPage,
});

function AmbassadorsPage() {
  const c = useContent("ambassadors");
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      <section className="section-space">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {c.items("roles").map((role, i) => (
              <div key={i}>
                <p className="text-electric">0{i + 1}</p>
                <h2 className="mt-5 text-2xl">{itemText(role, "title")}</h2>
                <p className="mt-3 reading-copy">{itemText(role, "body")}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="section-space border-t border-border">
        <Container className="max-w-3xl">
          <SectionHead eyebrow={c.t("form.eyebrow")} title={c.t("form.title")} />
          <p className="mb-10 mt-5 text-muted-foreground">{c.t("form.intro")}</p>
          <AmbassadorForm />
        </Container>
      </section>
    </>
  );
}
