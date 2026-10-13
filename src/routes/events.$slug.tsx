import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Container, PageHero, SampleBadge } from "@/components/site/Blocks";
import { EventRegisterForm } from "@/components/forms/Forms";
import { Button } from "@/components/ui/button";
import { EVENTS } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = EVENTS.find((e) => e.slug === params.slug);
    if (!event) throw notFound();
    return event;
  },
  head: ({ loaderData }) => pageMeta(loaderData?.title ?? "Event unavailable", loaderData?.summary ?? "Explore entrepreneurship events at Elite Forums."),
  component: EventDetail,
});

function EventDetail() {
  const event = Route.useLoaderData();
  return <><PageHero eyebrow={event.type} title={event.title} intro={event.summary}>{event.sample && <SampleBadge />}</PageHero><section className="section-space"><Container className="grid items-start gap-12 lg:grid-cols-[1.6fr_1fr]"><div><img src={event.image} alt={event.title} className="panel aspect-[16/10] w-full object-cover" /><div className="mt-10 grid gap-6 sm:grid-cols-2">{[["Date", new Date(event.date + "T12:00:00").toLocaleDateString("en-IN", { dateStyle: "long" })], ["Location", event.location], ["Who can join", event.eligibility], ["Organised by", event.organizer]].map(([t, d]) => <div key={t}><p className="eyebrow text-electric">{t}</p><p className="mt-3 text-muted-foreground">{d}</p></div>)}</div><h2 className="mt-12 text-3xl">The agenda</h2><ul className="mt-6 divide-y divide-border">{event.agenda.map((a) => <li key={a.time + a.item} className="grid grid-cols-[90px_1fr] gap-4 py-5"><span className="text-sm text-electric">{a.time}</span><span>{a.item}</span></li>)}</ul></div><aside className="border-t border-border pt-8"><h2 className="text-3xl">{event.sample ? "A preview of what’s possible." : "Join the experience."}</h2>{event.sample ? <><p className="mt-5 reading-copy">This is a sample event concept, not a confirmed programme. Registration will open when dates and details are announced.</p><Button asChild variant="brand" className="mt-7"><Link to="/community">Join the Community</Link></Button></> : <div className="mt-7"><EventRegisterForm slug={event.slug} title={event.title} /></div>}<Button asChild variant="link" className="mt-6 px-0"><Link to="/events">Back to all events</Link></Button></aside></Container></section></>;
}