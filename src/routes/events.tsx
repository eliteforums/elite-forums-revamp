import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events — Elite Forums" }, { name: "description", content: "Events at Elite Forums." }, { property: "og:title", content: "Events — Elite Forums" }, { property: "og:description", content: "Events at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="Events" intro="This page is coming soon." />,
});
