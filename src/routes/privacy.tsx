import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Elite Forums" },
      { name: "description", content: "Privacy at Elite Forums." },
      { property: "og:title", content: "Privacy — Elite Forums" },
      { property: "og:description", content: "Privacy at Elite Forums." },
    ],
  }),
  component: () => (
    <PageHero eyebrow="Elite Forums" title="Privacy" intro="This page is coming soon." />
  ),
});
