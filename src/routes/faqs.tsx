import { createFileRoute } from "@tanstack/react-router";
import { FaqSection } from "@/components/site/FaqSection";
import { PageHero } from "@/components/site/Blocks";

import { contentMeta } from "@/lib/seo";
import { Rich, useContent } from "@/lib/content-context";
export const Route = createFileRoute("/faqs")({
  head: ({ matches }) => contentMeta(matches, "faqs"),
  component: Faqs,
});

function Faqs() {
  const c = useContent("faqs");
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      <FaqSection />
    </>
  );
}
