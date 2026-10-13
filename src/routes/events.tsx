import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { Container, FinalCTA, PageHero, SampleBadge } from "@/components/site/Blocks";
import { IlluxusEvents } from "@/components/site/IlluxusEvents";
import { Button } from "@/components/ui/button";
import { isUpcoming } from "@/lib/content";
import { getPublicEvents } from "@/lib/admin.functions";
import { pageMeta } from "@/lib/metadata";
import { Rich, useContent } from "@/lib/content-context";

export const Route = createFileRoute("/events")({
  loader: () => getPublicEvents(),
  head: () =>
    pageMeta(
      "Events",
      "Explore workshops, hackathons and founder conversations for aspiring founders at Elite Forums.",
      "/events",
    ),
  component: Events,
});

function Events() {
  const c = useContent("events");
  const managedEvents = Route.useLoaderData();
  const [type, setType] = useState("All");
  const [period, setPeriod] = useState("All dates");
  const events = managedEvents
    .filter(
      (e) =>
        (type === "All" || e.type === type) &&
        (period === "All dates" || (period === "Upcoming" ? isUpcoming(e) : !isUpcoming(e))),
    )
    .sort((a, b) => {
      const aUpcoming = isUpcoming(a);
      const bUpcoming = isUpcoming(b);
      if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
      return aUpcoming ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });
  return (
    <>
      <PageHero
        eyebrow={c.t("hero.eyebrow")}
        title={<Rich text={c.t("hero.title")} />}
        intro={c.t("hero.intro")}
      />
      <section className="section-space border-b border-border">
        <Container>
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow text-electric">{c.t("calendar.eyebrow")}</p>
            <h2 className="display-xl mt-4 text-4xl md:text-5xl">{c.t("calendar.title")}</h2>
            <p className="mt-5 reading-copy">{c.t("calendar.intro")}</p>
          </div>
          <div className="panel border border-border bg-surface p-4 md:p-8">
            <IlluxusEvents />
          </div>
        </Container>
      </section>
      <section className="section-space">
        <Container>
          <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Event type">
              {["All", "Workshop", "Hackathon", "Founder Connect"].map((t) => (
                <Button
                  key={t}
                  variant={type === t ? "brand" : "outline"}
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                >
                  {t}
                </Button>
              ))}
            </div>
            <select
              aria-label="Event dates"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-input bg-background px-4 py-3 text-sm"
            >
              <option>All dates</option>
              <option>Upcoming</option>
              <option>Past</option>
            </select>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <article key={e.slug} className="panel flex flex-col border border-border bg-surface">
                <Link
                  to="/events/$slug"
                  params={{ slug: e.slug }}
                  className="group block overflow-hidden bg-black/5"
                >
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="eyebrow text-electric">{e.type}</p>
                    {e.sample && <SampleBadge />}
                  </div>
                  <h2 className="mt-5 text-2xl">
                    <Link to="/events/$slug" params={{ slug: e.slug }}>
                      {e.title}
                    </Link>
                  </h2>
                  <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(e.date + "T12:00:00").toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {e.format} · {e.location}
                    </p>
                  </div>
                  <Button asChild variant="link" className="mt-6 self-start px-0">
                    <Link to="/events/$slug" params={{ slug: e.slug }}>
                      Explore event <ArrowUpRight />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
          {events.length === 0 && (
            <div className="border-y border-border py-16 text-center">
              <h2 className="text-2xl">{c.t("list.empty")}</h2>
              <Button
                variant="link"
                className="mt-4"
                onClick={() => {
                  setType("All");
                  setPeriod("All dates");
                }}
              >
                View all events
              </Button>
            </div>
          )}
        </Container>
      </section>
      <FinalCTA />
    </>
  );
}
