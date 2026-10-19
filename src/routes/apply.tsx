import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { ProgramApplicationForm } from "@/components/forms/ProgramApplicationForm";
import { Rich, useContent } from "@/lib/content-context";
import { itemText } from "@/lib/site-content";

import { contentMeta } from "@/lib/seo";
export const Route = createFileRoute("/apply")({
  validateSearch: z.object({
    program: z.enum(["cohort", "incubation", "coworking"]).optional().catch(undefined),
  }),
  head: ({ matches }) => contentMeta(matches, "apply"),
  component: Apply,
});

function Apply() {
  const c = useContent("apply");
  const { program } = Route.useSearch();
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      {c.on("steps") && (
        <section className="section-space border-b border-border">
          <Container>
            <SectionHead eyebrow={c.t("steps.eyebrow")} title={c.t("steps.title")} />
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {c.items("steps").map((step, i) => (
                <div key={i}>
                  <p className="font-display text-3xl text-electric">0{i + 1}</p>
                  <h3 className="mt-6 text-xl font-medium">{itemText(step, "title")}</h3>
                  <p className="mt-3 text-sm reading-copy">{itemText(step, "body")}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
      <section className="py-16 md:py-24">
        <Container className="max-w-4xl">
          <SectionHead eyebrow={c.t("form.eyebrow")} title={c.t("form.title")} />
          <div className="mt-10">
            <ProgramApplicationForm defaultProgram={program} />
          </div>
        </Container>
      </section>
    </>
  );
}
