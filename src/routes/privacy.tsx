import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { contentMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: ({ matches }) => contentMeta(matches, "privacy"),
  component: Privacy,
});

function Privacy() {
  return <LegalPage page="privacy" />;
}
