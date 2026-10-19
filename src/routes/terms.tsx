import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { contentMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: ({ matches }) => contentMeta(matches, "terms"),
  component: Terms,
});

function Terms() {
  return <LegalPage page="terms" />;
}
