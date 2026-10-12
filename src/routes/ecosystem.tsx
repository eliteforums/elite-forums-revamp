import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({ meta: [{ title: "Ecosystem — Elite Forums" }, { name: "description", content: "Ecosystem at Elite Forums." }, { property: "og:title", content: "Ecosystem — Elite Forums" }, { property: "og:description", content: "Ecosystem at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="Ecosystem" intro="This page is coming soon." />,
});
