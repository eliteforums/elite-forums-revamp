import { createFileRoute } from "@tanstack/react-router";
import { FinalCTA, PageHero } from "@/components/site/Blocks";
import { EcosystemGrid, JoinPaths, Mission } from "@/components/site/EcosystemSections";
import { Rich, useContent } from "@/lib/content-context";

import { contentMeta } from "@/lib/seo";
export const Route = createFileRoute("/ecosystem")({
  head: ({ matches }) => contentMeta(matches, "ecosystem"),
  component: EcosystemPage,
});

function EcosystemPage() {
  const c = useContent("ecosystem");
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      {c.on("grid") && <EcosystemGrid />}
      {c.on("mission") && <Mission />}
      {c.on("join") && <JoinPaths />}
      {c.on("cta") && <FinalCTA />}
    </>
  );
}
