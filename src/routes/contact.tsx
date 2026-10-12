import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Elite Forums" }, { name: "description", content: "Contact at Elite Forums." }, { property: "og:title", content: "Contact — Elite Forums" }, { property: "og:description", content: "Contact at Elite Forums." }] }),
  component: () => <PageHero eyebrow="Elite Forums" title="Contact" intro="This page is coming soon." />,
});
