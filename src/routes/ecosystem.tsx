import { createFileRoute } from "@tanstack/react-router";
import { FinalCTA, PageHero } from "@/components/site/Blocks";
import { EcosystemGrid, JoinPaths, Mission } from "@/components/site/EcosystemSections";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/ecosystem")({
  head: () =>
    pageMeta(
      "The Ecosystem",
      "Explore a connected ecosystem of aspiring founders, college E-Cells, mentors and industry partners across India.",
      "/ecosystem",
    ),
  component: () => (
    <>
      <PageHero
        eyebrow="The ecosystem"
        title={
          <>
            Connected people.
            <br />
            <span className="text-brand">Bigger possibilities.</span>
          </>
        }
        intro="A shared space for aspiring founders, college communities, mentors and partners to learn, build and grow together."
      />
      <EcosystemGrid />
      <Mission />
      <JoinPaths />
      <FinalCTA />
    </>
  ),
});
