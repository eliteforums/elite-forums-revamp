import { createFileRoute } from "@tanstack/react-router";
import { FinalCTA, PageHero } from "@/components/site/Blocks";
import { EcosystemGrid, JoinPaths, Mission } from "@/components/site/EcosystemSections";
import { pageMeta } from "@/lib/metadata";
import { Rich, useContent } from "@/lib/content-context";

export const Route = createFileRoute("/ecosystem")({
  head: () =>
    pageMeta(
      "The Ecosystem",
      "Explore a connected ecosystem of aspiring founders, college E-Cells, mentors and industry partners across India.",
      "/ecosystem",
    ),
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
      <EcosystemGrid />
      <Mission />
      <JoinPaths />
      <FinalCTA />
    </>
  );
}
