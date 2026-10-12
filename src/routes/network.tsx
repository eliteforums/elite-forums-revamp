import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/network")({
  head: () => ({ meta: [{ title: "Partner Network — Elite Forums" }, { name: "description", content: "Partner Network at Elite Forums." }, { property: "og:title", content: "Partner Network — Elite Forums" }, { property: "og:description", content: "Partner Network at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="Partner Network" intro="This page is coming soon." />,
});
