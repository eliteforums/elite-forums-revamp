import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Elite Forums" }, { name: "description", content: "About at Elite Forums." }, { property: "og:title", content: "About — Elite Forums" }, { property: "og:description", content: "About at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="About" intro="This page is coming soon." />,
});
