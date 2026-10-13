import { createFileRoute } from "@tanstack/react-router";
import { FinalCTA, PageHero } from "@/components/site/Blocks";
import { EcosystemGrid, JoinPaths, Mission } from "@/components/site/EcosystemSections";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/ecosystem")({
  head: () => pageMeta("The Ecosystem", "Explore a connected ecosystem of college E-Cells, student builders, founders, mentors and industry partners."),
  component: () => <><PageHero eyebrow="The ecosystem" title={<>Connected people.<br /><span className="text-brand">Bigger possibilities.</span></>} intro="A shared space for college communities, ambitious students, founders and mentors to learn, build and grow together." /><EcosystemGrid /><Mission /><JoinPaths /><FinalCTA /></>,
});
