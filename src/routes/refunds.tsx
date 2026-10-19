import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { contentMeta } from "@/lib/seo";

export const Route = createFileRoute("/refunds")({
  head: ({ matches }) => contentMeta(matches, "refunds"),
  component: Refunds,
});

function Refunds() {
  return <LegalPage page="refunds" />;
}
