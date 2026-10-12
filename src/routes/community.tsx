import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community — Elite Forums" }, { name: "description", content: "Community at Elite Forums." }, { property: "og:title", content: "Community — Elite Forums" }, { property: "og:description", content: "Community at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="Community" intro="This page is coming soon." />,
});
