import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Building2, FlaskConical, Rocket } from "lucide-react";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { CollegeForm } from "@/components/forms/Forms";
import { Rich, useContent } from "@/lib/content-context";
import { pageMeta } from "@/lib/metadata";
import { itemLines, itemText } from "@/lib/site-content";

export const Route = createFileRoute("/colleges")({
  head: () =>
    pageMeta(
      "Startup Programs for Colleges and E-Cells",
      "Explore incubation-centre setup and operations, founder sessions, mentoring and entrepreneurship programmes for colleges and student startup teams in India.",
      "/colleges",
    ),
  component: Colleges,
});

const PROGRAMMES = [
  { icon: Rocket, id: "cohort" },
  { icon: FlaskConical, id: "incubation" },
  { icon: Building2, id: "coworking" },
] as const;

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
      <section className="section-space border-y border-border bg-surface/40">
        <Container>
          <SectionHead
            eyebrow={c.t("programmes.eyebrow")}
            title={<Rich text={c.t("programmes.title")} />}
          />
          <p className="mt-6 max-w-2xl reading-copy">{c.t("programmes.intro")}</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PROGRAMMES.map(({ icon: Icon, id }, i) => ({
              Icon,
              id,
              copy: programmes[i] ?? {},
            })).map(({ Icon, id, copy }) => (
              <article
                key={id}
                className="panel flex flex-col border border-border bg-background p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon className="h-9 w-9 text-electric" aria-hidden="true" />
                  <span className="eyebrow rounded-full border border-electric/30 px-3 py-1 text-electric">
                    {itemText(copy, "price") ||
                      (id === "coworking" ? "Monthly options" : "INR 5,000 + taxes*")}
                  </span>
                </div>
                <p className="eyebrow mt-10 text-muted-foreground">{itemText(copy, "eyebrow")}</p>
                <h2 className="display-xl mt-3 text-3xl">{itemText(copy, "title")}</h2>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  {itemText(copy, "intro")}
                </p>
                <ul className="mt-7 space-y-3 border-t border-border pt-6">
                  {itemLines(copy, "benefits").map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/apply"
                  search={{ program: id }}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-electric hover:text-foreground"
                >
                  {c.t("programmes.link")} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted-foreground">{c.t("programmes.footnote")}</p>
        </Container>
      </section>
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
      <section className="py-16 md:py-24">
        <Container className="max-w-3xl" id="programme-enquiry">
          <SectionHead eyebrow={c.t("form.eyebrow")} title={c.t("form.title")} />
          <div className="mt-10">
            <CollegeForm />
          </div>
        </Container>
      </section>
    </>
  );
}
