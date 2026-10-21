import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CardIcon } from "@/components/site/CardIcon";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { CollegeForm } from "@/components/forms/Forms";
import { Rich, useContent } from "@/lib/content-context";
import { itemLines, itemText } from "@/lib/site-content";

import { contentMeta } from "@/lib/seo";
export const Route = createFileRoute("/colleges")({
  head: ({ matches }) => contentMeta(matches, "colleges"),
  component: Colleges,
});

function Colleges() {
  const c = useContent("colleges");
  const offers = c.items("offer");
  const programmes = c.items("programmes");
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      {c.on("programmes") && (
        <section className="section-space border-y border-border bg-surface/40">
          <Container>
            <SectionHead
              eyebrow={c.t("programmes.eyebrow")}
              title={<Rich text={c.t("programmes.title")} />}
            />
            <p className="mt-6 max-w-2xl reading-copy">{c.t("programmes.intro")}</p>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {programmes.map((copy, i) => {
                const id = itemText(copy, "programme");
                return (
                  <article
                    key={`${id}-${i}`}
                    className="panel flex flex-col border border-border bg-background p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <CardIcon name={itemText(copy, "icon")} className="h-9 w-9 text-electric" />
                      {(itemText(copy, "price") || c.t("programmes.price")) && (
                        <span className="eyebrow rounded-full border border-electric/30 px-3 py-1 text-electric">
                          {itemText(copy, "price") || c.t("programmes.price")}
                        </span>
                      )}
                    </div>
                    <p className="eyebrow mt-10 text-muted-foreground">
                      {itemText(copy, "eyebrow")}
                    </p>
                    <h2 className="display-xl mt-3 text-3xl">{itemText(copy, "title")}</h2>
                    <p className="mt-5 text-sm leading-7 text-muted-foreground">
                      {itemText(copy, "intro")}
                    </p>
                    <ul className="mt-7 space-y-3 border-t border-border pt-6">
                      {itemLines(copy, "benefits").map((benefit, benefitIndex) => (
                        <li
                          key={benefit}
                          className={`flex gap-3 text-sm leading-6 ${
                            id === "incubation" && benefitIndex === 0
                              ? "rounded-md border border-electric/30 bg-electric/5 px-3 py-2 font-medium text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/apply"
                      search={id ? { program: id } : {}}
                      className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-electric hover:text-foreground"
                    >
                      {c.t("programmes.link")} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </article>
                );
              })}
            </div>
            <p className="mt-8 text-xs text-muted-foreground">{c.t("programmes.footnote")}</p>
          </Container>
        </section>
      )}
      {c.on("offer") && (
        <section className="py-12">
          <Container>
            <div className="grid gap-4 md:grid-cols-2">
              {offers.map((offer, i) => (
                <div
                  key={i}
                  className={`panel border border-border p-8${
                    i === offers.length - 1 && offers.length % 2 === 1
                      ? " md:col-span-2 md:mx-auto md:w-1/2"
                      : ""
                  }`}
                >
                  <h3 className="display-xl text-2xl">{itemText(offer, "title")}</h3>
                  <p className="mt-3 text-muted-foreground">{itemText(offer, "body")}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
      {c.on("form") && (
        <section className="py-16 md:py-24">
          <Container className="max-w-3xl" id="programme-enquiry">
            <SectionHead eyebrow={c.t("form.eyebrow")} title={c.t("form.title")} />
            <div className="mt-10">
              <CollegeForm />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
