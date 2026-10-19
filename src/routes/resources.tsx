import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Container, PageHero, SampleBadge } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { articlesFrom } from "@/lib/content";
import { Rich, useContent } from "@/lib/content-context";
import { Route as RootRoute } from "./__root";

import { contentMeta } from "@/lib/seo";
export const Route = createFileRoute("/resources")({
  head: ({ matches }) => contentMeta(matches, "resources"),
  component: Resources,
});

function Resources() {
  const c = useContent("resources");
  const all = articlesFrom(RootRoute.useLoaderData());
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const articles = all.filter(
    (a) =>
      (category === "All" || a.category === category) &&
      `${a.title} ${a.excerpt}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      <section className="section-space">
        <Container>
          <div className="mb-12 flex flex-wrap justify-between gap-5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Resource category">
              {["All", ...new Set(all.map((a) => a.category))].map((c) => (
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
            <label className="flex w-full min-w-0 items-center gap-3 rounded-lg border border-input px-4 sm:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                aria-label="Search resources"
                placeholder="Search resources"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none sm:w-48 sm:flex-none sm:text-sm"
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
                      loading="lazy"
                      decoding="async"
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
            <p className="py-16 text-center text-muted-foreground">{c.t("list.empty")}</p>
          )}
        </Container>
      </section>
    </>
  );
}
