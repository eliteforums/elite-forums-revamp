import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/colleges")({
  head: () => ({ meta: [{ title: "For Colleges — Elite Forums" }, { name: "description", content: "For Colleges at Elite Forums." }, { property: "og:title", content: "For Colleges — Elite Forums" }, { property: "og:description", content: "For Colleges at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="For Colleges" intro="This page is coming soon." />,
});
