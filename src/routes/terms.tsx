import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms — Elite Forums" }, { name: "description", content: "Terms at Elite Forums." }, { property: "og:title", content: "Terms — Elite Forums" }, { property: "og:description", content: "Terms at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="Terms" intro="This page is coming soon." />,
});
