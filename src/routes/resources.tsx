import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Container, PageHero, SampleBadge } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { ARTICLES } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/resources")({
  head: () =>
    pageMeta(
      "Resources",
      "Practical guides, founder insights and stories for aspiring founders, students and campus E-Cell leaders.",
    ),
  component: Resources,
});

function Resources() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const articles = ARTICLES.filter(
    (a) =>
      (category === "All" || a.category === category) &&
      `${a.title} ${a.excerpt}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHero
        eyebrow="Ideas worth sharing"
        title={
          <>
            Read. Learn.
            <br />
            <span className="text-brand">Make your move.</span>
          </>
        }
        intro="Practical perspectives for your first idea, your next build, or the community you’re creating."
      />
      <section className="section-space">
        <Container>
          <div className="mb-12 flex flex-wrap justify-between gap-5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Resource category">
              {["All", ...new Set(ARTICLES.map((a) => a.category))].map((c) => (
                <Button
                  key={c}
                  variant={category === c ? "brand" : "outline"}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                >
                  {c}
                </Button>
              ))}
            </div>
            <label className="flex items-center gap-3 rounded-lg border border-input px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                aria-label="Search resources"
                placeholder="Search resources"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 bg-transparent py-3 text-sm outline-none"
              />
            </label>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <article key={a.slug}>
                <Link to="/resources/$slug" params={{ slug: a.slug }} className="group block">
                  <div className="panel">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="text-electric">{a.category}</span>
                    <span>{a.readTime} read</span>
                    {a.sample && <SampleBadge />}
                  </div>
                  <h2 className="mt-4 text-2xl">{a.title}</h2>
                  <p className="mt-4 text-sm reading-copy">{a.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm text-electric">
                    Read article <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
          {articles.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">
              No resources match your search.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
