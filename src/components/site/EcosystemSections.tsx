import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, MoveUpRight, Network, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionHead } from "./Blocks";
import { LogoMark } from "./Logo";
import students from "@/assets/students.jpg";
import founder from "@/assets/founder.jpg";

export const STEPS = [
  [
    "Start with people",
    "Welcome anyone with the ambition to build — students, working professionals and first-time founders.",
  ],
  [
    "Build communities",
    "Grow active, inclusive communities across colleges and cities, where ideas find their people.",
  ],
  [
    "Create experiences",
    "Bring learning to life through workshops, hackathons, founder conversations and collaborative projects.",
  ],
  [
    "Scale across India",
    "Connect communities, mentors and industry partners so opportunity travels from Mumbai to the whole nation.",
  ],
];

export function EcosystemGrid() {
  return (
    <section className="section-space border-b border-border">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="The ecosystem"
            title={
              <>
                A world of <span className="text-brand">possibility.</span>
              </>
            }
          />
          <Button asChild variant="link">
            <Link to="/ecosystem">
              Explore the ecosystem <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <div className="grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="panel flex flex-col justify-between bg-paper p-7 text-ink">
            <LogoMark variant="ink" className="h-10 self-start" />
            <div>
              <p className="display-xl text-4xl">
                ELITE
                <br />
                FORUMS
              </p>
              <p className="mt-3 text-xs text-ink-muted">Ideas. People. Possibilities.</p>
            </div>
          </div>
          <div className="panel flex flex-col justify-between border border-border bg-surface p-7">
            <Network className="h-8 w-8 text-electric" />
            <div>
              <p className="text-3xl font-medium">
                From Mumbai.
                <br />
                To all of India.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                One network, built to make India a startup hub.
              </p>
            </div>
          </div>
          <div className="panel relative sm:col-span-2">
            <img
              src={students}
              alt="Team working together on a startup project"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="photo-shade absolute inset-0" />
            <div className="absolute bottom-7 left-7 right-7">
              <p className="eyebrow mb-3">The power of community</p>
              <p className="display-xl text-4xl">
                Build together.
                <br />
                Grow together.
              </p>
            </div>
          </div>
          <div className="panel bg-surface p-7">
            <p className="eyebrow text-electric">Our principles</p>
            <div className="mt-7 space-y-3">
              {["Innovation", "Collaboration", "Learning", "Entrepreneurship"].map((p) => (
                <p key={p} className="flex items-center gap-3 text-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                  {p}
                </p>
              ))}
            </div>
          </div>
          <Link to="/events" className="panel group relative">
            <img
              src={founder}
              alt="Founder sharing experience with the community"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="photo-shade absolute inset-0" />
            <div className="absolute bottom-7 left-7 right-7">
              <p className="eyebrow">Conversations that matter</p>
              <p className="display-xl mt-3 text-3xl">
                Founder
                <br />
                connect <ArrowUpRight className="inline h-6 w-6" />
              </p>
            </div>
          </Link>
          <Link
            to="/community"
            className="panel flex flex-col justify-between bg-brand p-7 text-ink sm:col-span-2"
          >
            <div className="flex justify-between">
              <p className="eyebrow">Your next chapter</p>
              <MoveUpRight className="h-8 w-8" />
            </div>
            <p className="display-xl max-w-md text-4xl">
              Your idea.
              <br />
              Your city.
              <br />
              Your next move.
            </p>
          </Link>
        </div>
      </Container>
    </section>
  );
}

export function Mission() {
  return (
    <section className="section-space border-b border-border">
      <Container>
        <p className="eyebrow text-electric">Mission</p>
        <h2 className="display-xl mt-7 max-w-5xl text-4xl sm:text-5xl md:text-6xl">
          Entrepreneurship should be a <span className="text-brand">community,</span> not a solo
          journey.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <p className="max-w-xl reading-copy">
            Great ideas exist everywhere — in classrooms, offices and living rooms. But turning them
            into something meaningful takes more than ambition. It takes people who believe in you,
            spaces to experiment, and the right opportunities at the right time.
          </p>
          <p className="max-w-xl reading-copy">
            Elite Forums exists to bring those pieces together for anyone who wants to become a
            founder. We began in Mumbai, India’s financial capital, with college communities at the
            heart of our work — and we’re scaling across the country with one vision: to make India
            a startup hub.
          </p>
        </div>
        <div className="mt-16 border-t border-border pt-8">
          <p className="eyebrow text-muted-foreground">How the ecosystem works</p>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <div key={t}>
              <p className="font-display text-3xl text-electric">0{i + 1}</p>
              <h3 className="mt-6 text-xl font-medium">{t}</h3>
              <p className="mt-3 text-sm reading-copy">{d}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const FOUNDER_BENEFITS = [
  "Meet ambitious builders and aspiring founders",
  "Learn through practical workshops",
  "Build at hackathons and collaborative events",
  "Get closer to founders and mentors",
  "Discover opportunities beyond your own circle",
];
const COLLEGE_BENEFITS = [
  "Strengthen your college’s E-Cell",
  "Connect students with the wider ecosystem",
  "Co-host workshops and hackathons",
  "Bring founder conversations to campus",
  "Support your next generation of student leaders",
];

export function JoinPaths() {
  return (
    <section className="section-space">
      <Container>
        <SectionHead
          eyebrow="Two ways to join"
          title={
            <>
              Find your path into
              <br />
              the <span className="text-brand">ecosystem.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              tag: "For aspiring founders",
              title: "Discover your entrepreneurial community.",
              items: FOUNDER_BENEFITS,
              to: "/community",
              label: "Explore the Community",
              icon: Sparkles,
            },
            {
              tag: "For colleges & E-Cells",
              title: "Build a stronger entrepreneurship culture on campus.",
              items: COLLEGE_BENEFITS,
              to: "/colleges",
              label: "Become a Partner",
              icon: Network,
            },
          ].map((path, i) => (
            <div
              key={path.to}
              className="panel flex flex-col border border-border bg-surface p-7 md:p-10"
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow text-electric">{path.tag}</p>
                <path.icon className="h-6 w-6 text-turquoise" />
              </div>
              <h3 className="mt-7 min-h-24 text-3xl font-medium">{path.title}</h3>
              <ul className="my-8 space-y-4">
                {path.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                variant={i === 0 ? "brand" : "outline"}
                className="mt-auto self-start"
              >
                <Link to={path.to}>
                  {path.label}
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
