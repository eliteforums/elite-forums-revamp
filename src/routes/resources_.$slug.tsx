import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Container, PageHero, SampleBadge } from "@/components/site/Blocks";
import { JsonLd } from "@/components/site/JsonLd";
import { Button } from "@/components/ui/button";
import { articlesFrom } from "@/lib/content";
import { getSiteContent } from "@/lib/content.functions";
import { useContent } from "@/lib/content-context";
import { absoluteUrl, pageMeta, SITE_URL } from "@/lib/metadata";

export const Route = createFileRoute("/resources_/$slug")({
  loader: async ({ params }) => {
    const article = articlesFrom((await getSiteContent()).content).find(
      (a) => a.slug === params.slug,
    );
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) =>
    pageMeta(
      loaderData?.title ?? "Resource unavailable",
      loaderData?.excerpt ?? "Read resources for aspiring founders at Elite Forums.",
      loaderData ? `/resources/${loaderData.slug}` : "/resources",
      {
        type: "article",
        ...(loaderData
          ? { image: loaderData.image, imageAlt: loaderData.title, noIndex: loaderData.sample }
          : {}),
      },
    ),
  component: ArticleDetail,
});

function ArticleDetail() {
  const article = Route.useLoaderData();
  const c = useContent("resources");
  return (
    <>
      {!article.sample && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "@id": `${SITE_URL}/resources/${article.slug}#article`,
                headline: article.title,
                description: article.excerpt,
                image: [absoluteUrl(article.image)],
                articleSection: article.category,
                inLanguage: "en-IN",
                mainEntityOfPage: `${SITE_URL}/resources/${article.slug}`,
                author: { "@id": `${SITE_URL}/#organization` },
                publisher: { "@id": `${SITE_URL}/#organization` },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Resources",
                    item: `${SITE_URL}/resources`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: article.title,
                    item: `${SITE_URL}/resources/${article.slug}`,
                  },
                ],
              },
            ],
          }}
        />
      )}
      <PageHero
        eyebrow={`${article.category} · ${article.readTime} read`}
        title={article.title}
        intro={article.excerpt}
      >
        {article.sample && <SampleBadge />}
      </PageHero>
      <article className="section-space">
        <Container className="max-w-4xl">
          <img
            src={article.image}
            alt={article.title}
            className="panel mb-12 aspect-[16/9] w-full object-cover"
          />
          <div className="mx-auto max-w-2xl space-y-7">
            {article.body.map((p, i) => (
              <p key={i} className="reading-copy text-lg">
                {p}
              </p>
            ))}
            <div className="border-t border-border pt-8">
              <Button asChild variant="outline">
                <Link to="/resources">{c.t("article.back")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
