import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, FinalCTA, PageHero, SampleBadge, SectionHead } from "@/components/site/Blocks";
import { ARTICLES, EVENTS, isUpcoming } from "@/lib/content";
import students from "@/assets/students.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elite Forums — Where student founders begin" },
      { name: "description", content: "A community connecting college students, E-Cells and founders through workshops, hackathons and founder conversations." },
      { property: "og:title", content: "Elite Forums — Where student founders begin" },
      { property: "og:description", content: "Workshops, hackathons and founder conversations for college students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PILLARS = [
  { n: "01", t: "Learn", d: "Practical workshops on problem discovery, validation and building." },
  { n: "02", t: "Build", d: "Hackathons and build weekends with interdisciplinary student teams." },
  { n: "03", t: "Connect", d: "Founder conversations and a network of student entrepreneurs across campuses." },
];

function Index() {
  const upcoming = EVENTS.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  return (
    <>
      <PageHero
        eyebrow="Student entrepreneurship community"
        title={<>Where student <span className="text-gradient-brand">founders</span> begin.</>}
        intro="Elite Forums brings college students, E-Cells and founders together to learn, build and grow startup ideas."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="brand" size="lg"><Link to="/community">Join the Community</Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/colleges">Partner Your College</Link></Button>
        </div>
      </PageHero>

      <section className="py-16 md:py-24">
        <Container>
          <SectionHead eyebrow="What we do" title="Three ways in." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.n} className="panel border border-border p-8">
                <p className="font-display text-sm text-electric">{p.n}</p>
                <h3 className="display-xl mt-6 text-3xl">{p.t}</h3>
                <p className="mt-4 text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <img src={students} alt="Students collaborating on a project" className="panel aspect-[4/3] w-full object-cover" loading="lazy" />
          <div>
            <SectionHead eyebrow="Upcoming" title="Events" />
            <ul className="mt-8 divide-y divide-border">
              {upcoming.map((e) => (
                <li key={e.slug} className="py-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>· {e.type} · {e.format}</span>
                    {e.sample && <SampleBadge />}
                  </div>
                  <p className="mt-2 font-display text-lg">{e.title}</p>
                </li>
              ))}
            </ul>
            <Link to="/events" className="mt-6 inline-flex items-center gap-1 text-sm text-electric">All events <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <SectionHead eyebrow="Resources" title="Read, then build." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ARTICLES.map((a) => (
              <article key={a.slug} className="group">
                <img src={a.image} alt="" className="panel aspect-[16/10] w-full object-cover" loading="lazy" />
                <p className="mt-4 text-xs text-muted-foreground">{a.category} · {a.readTime}</p>
                <h3 className="mt-2 font-display text-lg">{a.title}</h3>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
