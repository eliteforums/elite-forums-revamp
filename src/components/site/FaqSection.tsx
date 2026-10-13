import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionHead } from "./Blocks";
import { FAQS } from "@/lib/faqs";

export function FaqSection({ preview = false }: { preview?: boolean }) {
  const faqs = preview ? FAQS.slice(0, 5) : FAQS;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="section-space border-y border-border bg-surface/40">
      <Container className="max-w-5xl">
        <SectionHead
          eyebrow="Answers for founders"
          title={preview ? "Frequently asked questions." : "Clear answers before you begin."}
        />
        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium marker:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="text-2xl font-normal text-electric transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl reading-copy">{faq.answer}</p>
            </details>
          ))}
        </div>
        {preview && (
          <Link
            to="/faqs"
            className="mt-8 inline-flex items-center gap-2 text-sm text-electric hover:underline"
          >
            View all FAQs <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Container>
    </section>
  );
}
