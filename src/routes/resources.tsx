import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [{ title: "Resources — Elite Forums" }, { name: "description", content: "Resources at Elite Forums." }, { property: "og:title", content: "Resources — Elite Forums" }, { property: "og:description", content: "Resources at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="Resources" intro="This page is coming soon." />,
});
