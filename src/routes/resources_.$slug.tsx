import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Container, PageHero, SampleBadge } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { ARTICLES } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/resources_/$slug")({
  loader: ({ params }) => {
    const article = ARTICLES.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) =>
    pageMeta(
      loaderData?.title ?? "Resource unavailable",
      loaderData?.excerpt ?? "Read resources for aspiring founders at Elite Forums.",
      loaderData ? `/resources/${loaderData.slug}` : "/resources",
    ),
  component: ArticleDetail,
});

function ArticleDetail() {
  const article = Route.useLoaderData();
  return (
    <>
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
                <Link to="/resources">Back to resources</Link>
              </Button>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
