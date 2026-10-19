import { ArrowUpRight, Check, MoveUpRight, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionHead } from "./Blocks";
import { LogoMark } from "./Logo";
import { SmartLink } from "./SmartLink";
import { CardIcon } from "./CardIcon";
import { Rich, resolveImage, useContent } from "@/lib/content-context";
import { itemLines, itemText } from "@/lib/site-content";

export function EcosystemGrid() {
  const c = useContent("sections");
  return (
    <section className="section-space border-b border-border">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow={c.t("grid.eyebrow")} title={<Rich text={c.t("grid.title")} />} />
          <Button asChild variant="link">
            <SmartLink href={c.t("grid.linkTo")}>
              {c.t("grid.link")} <ArrowUpRight />
            </SmartLink>
          </Button>
        </div>
        <div className="grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="panel flex flex-col justify-between bg-paper p-7 text-ink">
            <LogoMark variant="ink" className="h-10 self-start" />
            <div>
              <p className="display-xl text-4xl">
                ELITE
                <br />
                FORUMS
              </p>
              <p className="mt-3 text-xs text-ink-muted">{c.t("grid.brand.tagline")}</p>
            </div>
          </div>
          <div className="panel flex flex-col justify-between border border-border bg-surface p-7">
            <Network className="h-8 w-8 text-electric" />
            <div>
              <p className="text-3xl font-medium">
                <Rich text={c.t("grid.network.title")} />
              </p>
              <p className="mt-3 text-xs text-muted-foreground">{c.t("grid.network.body")}</p>
            </div>
          </div>
          <div className="panel relative sm:col-span-2">
            <img
              src={resolveImage(c.t("grid.community.image"), "students")}
              alt="Team working together on a startup project"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="photo-shade absolute inset-0" />
            <div className="absolute bottom-7 left-7 right-7">
              <p className="eyebrow mb-3">{c.t("grid.community.eyebrow")}</p>
              <p className="display-xl text-4xl">
                <Rich text={c.t("grid.community.title")} />
              </p>
            </div>
          </div>
          <div className="panel bg-surface p-7">
            <p className="eyebrow text-electric">{c.t("grid.principles.eyebrow")}</p>
            <div className="mt-7 space-y-3">
              {c.list("grid.principles.items").map((p) => (
                <p key={p} className="flex items-center gap-3 text-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                  {p}
                </p>
              ))}
            </div>
          </div>
          <SmartLink href={c.t("grid.founder.link")} className="panel group relative">
            <img
              src={resolveImage(c.t("grid.founder.image"), "founder")}
              alt="Founder sharing experience with the community"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="photo-shade absolute inset-0" />
            <div className="absolute bottom-7 left-7 right-7">
              <p className="eyebrow">{c.t("grid.founder.eyebrow")}</p>
              <p className="display-xl mt-3 text-3xl">
                <Rich text={c.t("grid.founder.title")} />{" "}
                <ArrowUpRight className="inline h-6 w-6" />
              </p>
            </div>
          </SmartLink>
          <SmartLink
            href={c.t("grid.next.link")}
            className="panel flex flex-col justify-between bg-brand p-7 text-ink sm:col-span-2"
          >
            <div className="flex justify-between">
              <p className="eyebrow">{c.t("grid.next.eyebrow")}</p>
              <MoveUpRight className="h-8 w-8" />
            </div>
            <p className="display-xl max-w-md text-4xl">
              <Rich text={c.t("grid.next.title")} />
            </p>
          </SmartLink>
        </div>
      </Container>
    </section>
  );
}

export function Mission() {
  const c = useContent("sections");
  return (
    <section className="section-space border-b border-border">
      <Container>
        <p className="eyebrow text-electric">{c.t("mission.eyebrow")}</p>
        <h2 className="display-xl mt-7 max-w-5xl text-4xl sm:text-5xl md:text-6xl">
          <Rich text={c.t("mission.title")} />
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <p className="max-w-xl reading-copy">{c.t("mission.p1")}</p>
          <p className="max-w-xl reading-copy">{c.t("mission.p2")}</p>
        </div>
        <div className="mt-16 border-t border-border pt-8">
          <p className="eyebrow text-muted-foreground">{c.t("mission.steps.eyebrow")}</p>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {c.items("mission.steps").map((step, i) => (
            <div key={i}>
              <p className="font-display text-3xl text-electric">0{i + 1}</p>
              <h3 className="mt-6 text-xl font-medium">{itemText(step, "title")}</h3>
              <p className="mt-3 text-sm reading-copy">{itemText(step, "body")}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function JoinPaths() {
  const c = useContent("sections");
  const paths = c.items("join.paths");
  return (
    <section className="section-space">
      <Container>
        <SectionHead eyebrow={c.t("join.eyebrow")} title={<Rich text={c.t("join.title")} />} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {paths
            .map((copy, i) => ({ copy }))
            .map((path, i) => (
              <div
                key={i}
                className="panel flex flex-col border border-border bg-surface p-7 md:p-10"
              >
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-electric">{itemText(path.copy, "tag")}</p>
                  <CardIcon name={itemText(path.copy, "icon")} className="h-6 w-6 text-turquoise" />
                </div>
                <h3 className="mt-7 min-h-24 text-3xl font-medium">
                  {itemText(path.copy, "title")}
                </h3>
                <ul className="my-8 space-y-4">
                  {itemLines(path.copy, "benefits").map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  variant={i === 0 ? "brand" : "outline"}
                  className="mt-auto self-start"
                >
                  <SmartLink href={itemText(path.copy, "link") || "/community"}>
                    {itemText(path.copy, "label")}
                    <ArrowUpRight />
                  </SmartLink>
                </Button>
              </div>
            ))}
        </div>
      </Container>
    </section>
  );
}
