import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/campus-ambassadors")({
  head: () => ({ meta: [{ title: "Campus Ambassadors — Elite Forums" }, { name: "description", content: "Campus Ambassadors at Elite Forums." }, { property: "og:title", content: "Campus Ambassadors — Elite Forums" }, { property: "og:description", content: "Campus Ambassadors at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="Campus Ambassadors" intro="This page is coming soon." />,
});
