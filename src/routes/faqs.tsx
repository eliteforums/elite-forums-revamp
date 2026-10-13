import { createFileRoute } from "@tanstack/react-router";
import { FaqSection } from "@/components/site/FaqSection";
import { PageHero } from "@/components/site/Blocks";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/faqs")({
  head: () =>
    pageMeta(
      "Frequently Asked Questions",
      "Answers about Elite Forums, its founder community, startup programmes, coworking membership, college partnerships, applications and events in India.",
      "/faqs",
    ),
  component: Faqs,
});

function Faqs() {
  return (
    <>
      <PageHero
        eyebrow="Frequently asked questions"
        title="Start with the answers."
        intro="A clear guide to the Elite Forums community, founder programmes, college partnerships and events."
      />
      <FaqSection />
    </>
  );
}
