import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero } from "@/components/site/Blocks";
import { ContactForm } from "@/components/forms/Forms";

import { contentMeta } from "@/lib/seo";
import { Rich, useContent } from "@/lib/content-context";
import { Markdown } from "@/components/site/Markdown";
export const Route = createFileRoute("/data-deletion")({
  head: ({ matches }) => contentMeta(matches, "dataDeletion"),
  component: DataDeletion,
});

function DataDeletion() {
  const c = useContent("dataDeletion");
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      <section className="section-space">
        <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reading-copy">
            <h2 className="text-2xl text-foreground">{c.t("steps.title")}</h2>
            <ol className="mt-5 list-decimal space-y-4 pl-5">
              {c.list("steps").map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Markdown text={c.t("note")} className="mt-6 text-sm text-muted-foreground" />
          </div>
          <ContactForm defaultTopic="data_deletion" />
        </Container>
      </section>
    </>
  );
}
