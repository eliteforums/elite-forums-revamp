import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { contentMeta } from "@/lib/seo";

export const Route = createFileRoute("/cookies")({
  head: ({ matches }) => contentMeta(matches, "cookies"),
  component: Cookies,
});

function Cookies() {
  return <LegalPage page="cookies" />;
}
