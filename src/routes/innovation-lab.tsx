import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Cpu, Rocket } from "lucide-react";
import { Container, FinalCTA, PageHero, SectionHead } from "@/components/site/Blocks";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/metadata";
import hackathon from "@/assets/hackathon.jpg";

export const Route = createFileRoute("/innovation-lab")({
  head: () =>
    pageMeta(
      "Innovation Laboratory",
      "The Elite Forums Innovation Laboratory is where we build technology and startups — turning ideas from the community into working products and new ventures.",
    ),
  component: InnovationLab,
});

const TRACKS = [
  {
    icon: Cpu,
    tag: "Technology",
    title: "We build technology.",
    body: "Ideas become prototypes and prototypes become products. The lab is where builders get hands-on and ship real technology.",
  },
  {
    icon: Rocket,
    tag: "Startups",
    title: "We build startups.",
    body: "Strong ideas and committed teams are shaped into ventures — from the first problem statement to a company that can stand on its own.",
  },
];

const STAGES = [
  ["Explore", "Start from a real problem worth solving and the people who have it."],
  ["Prototype", "Build a working version quickly and put it in front of users."],
  ["Launch", "Turn what works into a product, a team and a startup."],
];

function InnovationLab() {
  return (
    <>
      <PageHero
        eyebrow="Innovation Laboratory"
        title={
          <>
            Here we build
            <br />
            <span className="text-brand">technology and startups.</span>
          </>
        }
        intro="The Innovation Laboratory is the building arm of Elite Forums — where ideas from the community become working technology and new ventures."
      >
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="brand" size="lg">
            <Link to="/contact">
              Build with us <ArrowUpRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/community">Join the Community</Link>
          </Button>
        </div>
      </PageHero>
      <section className="section-space border-b border-border">
        <Container>
          <SectionHead eyebrow="What we build" title="Two things. Done properly." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {TRACKS.map((t) => (
              <div key={t.tag} className="panel border border-border bg-surface p-7 md:p-10">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-electric">{t.tag}</p>
                  <t.icon className="h-6 w-6 text-turquoise" />
                </div>
                <h3 className="mt-7 text-3xl font-medium">{t.title}</h3>
                <p className="mt-5 reading-copy">{t.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="section-space">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <img
            src={hackathon}
            alt="Builders working on a project together"
            className="panel aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          <div>
            <SectionHead eyebrow="How the lab works" title="From idea to venture." />
            <div className="mt-10 space-y-8">
              {STAGES.map(([t, d], i) => (
                <div key={t} className="flex gap-6 border-t border-border pt-6">
                  <p className="font-display text-3xl text-electric">0{i + 1}</p>
                  <div>
                    <h3 className="text-xl font-medium">{t}</h3>
                    <p className="mt-2 text-sm reading-copy">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <FinalCTA title="Have something worth building? Bring it to the lab." />
    </>
  );
}
