import { Rich, useContent } from "@/lib/content-context";
import { Container, PageHero } from "./Blocks";
import { Markdown } from "./Markdown";

/** A policy page whose words are all edited in the admin console. */
export function LegalPage({ page }: { page: string }) {
  const c = useContent(page);
  const notice = c.t("notice").trim();
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      <section className="section-space">
        <Container className="max-w-4xl">
          {c.t("updated") && <p className="eyebrow text-electric">{c.t("updated")}</p>}
          {notice && (
            <div className="mt-6 rounded-2xl border border-electric/30 bg-electric/5 p-5 text-sm leading-6 text-muted-foreground">
              {notice}
            </div>
          )}
          <Markdown text={c.t("body")} className="mt-10 [&>h2]:mt-4" />
        </Container>
      </section>
    </>
  );
}
