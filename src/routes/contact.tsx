import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { ContactForm } from "@/components/forms/Forms";
import { Rich, useContent } from "@/lib/content-context";
import { itemText } from "@/lib/site-content";

import { contentMeta } from "@/lib/seo";
import { ContactDetails, SocialLinks } from "@/components/site/Socials";
export const Route = createFileRoute("/contact")({
  head: ({ matches }) => contentMeta(matches, "contact"),
  component: ContactPage,
});

function ContactPage() {
  const c = useContent("contact");
  const global = useContent("global");
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      <section className="section-space">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHead eyebrow={c.t("side.eyebrow")} title={c.t("side.title")} />
            <p className="mt-6 reading-copy">{c.t("side.intro")}</p>
            <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-lg">{global.t("contact.heading")}</h3>
              <ContactDetails className="mt-5" />
              <SocialLinks className="mt-6" />
            </div>
            <div className="mt-10 space-y-6">
              {c.items("topics").map((topic, i) => (
                <div key={i} className="border-t border-border pt-5">
                  <h3 className="text-lg">{itemText(topic, "title")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{itemText(topic, "body")}</p>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
