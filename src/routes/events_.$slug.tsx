import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Users, Building2 } from "lucide-react";
import { Container, SampleBadge } from "@/components/site/Blocks";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { EventDescription, descriptionLead } from "@/components/site/EventDescription";
import { EventRegisterForm } from "@/components/forms/Forms";
import { JsonLd } from "@/components/site/JsonLd";
import { Button } from "@/components/ui/button";
import { getPublicEvents } from "@/lib/admin.functions";
import { absoluteUrl, pageMeta, SITE_URL } from "@/lib/metadata";
import { eventStatus } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events_/$slug")({
  loader: async ({ params }) => {
    const event = (await getPublicEvents()).find((e) => e.slug === params.slug);
    if (!event) throw notFound();
    return event;
  },
  head: ({ loaderData }) =>
    pageMeta(
      loaderData?.title ?? "Event unavailable",
      loaderData
        ? descriptionLead(loaderData.summary, loaderData.title)
        : "Explore entrepreneurship events at Elite Forums.",
      loaderData ? `/events/${loaderData.slug}` : "/events",
      loaderData
        ? { image: loaderData.image, imageAlt: `${loaderData.title} event poster` }
        : {},
    ),
  component: EventDetail,
});

function EventDetail() {
  const event = Route.useLoaderData();
  const status = eventStatus(event);
  const ended = status === "Already completed";
  const registrationUrl = event.registration_url?.trim();
  const date = new Date(event.date + "T12:00:00");
  const place = [event.location, event.city]
    .filter((part, i, all) => part && all.indexOf(part) === i)
    .join(", ");
  const facts = [
    {
      icon: CalendarDays,
      label: "Date",
      value: date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
    {
      icon: MapPin,
      label: "Format & location",
      value: [event.format, place].filter(Boolean).join(" · "),
    },
    { icon: Users, label: "Who can join", value: event.eligibility },
    { icon: Building2, label: "Organised by", value: event.organizer },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface/30 pb-12 pt-36 md:pb-16 md:pt-44">
        <Breadcrumbs current={event.title} />
        {event.format === "In-person" && (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Event",
              name: event.title,
              description: event.summary,
              image: [absoluteUrl(event.image)],
              url: `${SITE_URL}/events/${event.slug}`,
              startDate: event.date,
              eventStatus: ended
                ? "https://schema.org/EventCompleted"
                : "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: [event.location, event.city].filter(Boolean).join(", "),
                address: {
                  "@type": "PostalAddress",
                  ...(event.city ? { addressLocality: event.city } : {}),
                  addressCountry: "IN",
                },
              },
              organizer: { "@id": `${SITE_URL}/#organization` },
            }}
          />
        )}
        <Container className="relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="eyebrow text-electric">{event.type}</p>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                ended
                  ? "border-border bg-muted text-muted-foreground"
                  : "border-electric/40 bg-electric/10 text-electric",
              )}
            >
              {ended ? "Event completed" : status}
            </span>
            {event.sample && <SampleBadge />}
          </div>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.55fr)] md:gap-12">
            <div className="min-w-0">
              <h1 className="animate-rise max-w-4xl break-words text-balance font-display text-[clamp(2.125rem,9vw,2.5rem)] font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>
              <p className="animate-rise mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                {descriptionLead(event.summary, event.title)}
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border bg-muted/40 p-3 md:p-4">
              <img
                src={event.image}
                alt={`${event.title} poster`}
                className="mx-auto aspect-[4/5] max-h-[34rem] w-full rounded-2xl object-contain"
                decoding="async"
              />
            </div>
          </div>
          <dl className="animate-rise mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="min-w-0 bg-background p-5 md:p-6">
                <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="h-4 w-4 text-electric" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-2 break-words text-sm font-medium leading-6">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
      <section className="py-12 md:py-20">
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)] lg:gap-16">
          <aside className="space-y-6 lg:sticky lg:top-28 lg:order-2">
            <div className="rounded-3xl border border-border bg-surface p-6 md:p-7">
              {registrationUrl ? (
                <Button asChild variant="brand" size="lg" className="w-full">
                  <a href={registrationUrl}>
                    Register for this event <ArrowUpRight />
                  </a>
                </Button>
              ) : event.sample ? (
                <>
                  <h2 className="font-display text-2xl font-medium">
                    A preview of what’s possible.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    This is a sample event concept, not a confirmed programme. Registration will
                    open when dates and details are announced.
                  </p>
                  <Button asChild variant="brand" className="mt-6 w-full">
                    <Link to="/community">Join the Community</Link>
                  </Button>
                </>
              ) : ended ? (
                <>
                  <h2 className="font-display text-2xl font-medium">This event has taken place.</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Registration is closed. See what’s coming up next, or join the community to hear
                    about new events first.
                  </p>
                  <Button asChild variant="brand" className="mt-6 w-full">
                    <Link to="/events">
                      See upcoming events <ArrowUpRight />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="mt-3 w-full">
                    <Link to="/community">Join the Community</Link>
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-medium">Reserve your spot.</h2>
                  <p className="mb-6 mt-3 text-sm leading-6 text-muted-foreground">
                    Joining details are emailed to you before the event.
                  </p>
                  <EventRegisterForm slug={event.slug} title={event.title} />
                </>
              )}
            </div>
          </aside>
          <div className="min-w-0 lg:order-1">
            <h2 className="eyebrow mb-7 text-electric">About this event</h2>
            <EventDescription text={event.summary} title={event.title} />
            {event.agenda.length > 0 && (
              <>
                <h2 className="mt-14 border-t border-border pt-8 font-display text-xl font-medium md:text-2xl">
                  Agenda
                </h2>
                <ol className="mt-6 space-y-3">
                  {event.agenda.map((a) => (
                    <li
                      key={a.time + a.item}
                      className="grid gap-2 rounded-2xl border border-border bg-surface px-5 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-5 md:px-6"
                    >
                      <span className="text-sm font-medium text-electric">{a.time}</span>
                      <span className="min-w-0 text-sm leading-6">{a.item}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            <Button asChild variant="link" className="mt-12 px-0">
              <Link to="/events">
                <ArrowLeft /> Back to all events
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
