import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Building2, FlaskConical, Rocket } from "lucide-react";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { CollegeForm } from "@/components/forms/Forms";

export const Route = createFileRoute("/colleges")({
  head: () => ({
    meta: [
      { title: "For Colleges — Elite Forums" },
      {
        name: "description",
        content:
          "Explore Elite Forums Startup Cohort, Incubation and Coworking Space programmes for founders, teams and college innovation communities.",
      },
      { property: "og:title", content: "For Colleges — Elite Forums" },
      { property: "og:description", content: "Partner your college or E-Cell with Elite Forums." },
      {
        name: "keywords",
        content:
          "college E-Cell partnerships India, campus entrepreneurship, college startup programs",
      },
    ],
    links: [{ rel: "canonical", href: "https://eliteforums.in/colleges" }],
  }),
  component: Colleges,
});

const OFFER = [
  ["Workshops", "Hands-on sessions on startup fundamentals, run on your campus."],
  ["Hackathons", "Co-hosted build weekends with problem briefs and mentors."],
  ["Founder sessions", "Conversations with early-stage founders, online or in person."],
  ["E-Cell support", "Formats and playbooks to help your student community grow."],
];

const PROGRAMMES = [
  {
    icon: Rocket,
    eyebrow: "For founders building from zero",
    title: "Startup Cohort Program",
    intro:
      "A structured 90-day journey for selected founders and startup teams who want practical support from idea validation to a stronger launch-ready foundation.",
    benefits: [
      "Guaranteed incubation support for 90 days",
      "Mentorship from startup and domain experts",
      "Startup connect ecosystem and founder's connect",
      "Product development and research guidance",
      "Pitch deck preparation and investor readiness",
      "Guidance on fundraising and government grants",
      "Access to the Elite Forums Innovation Lab and its IT team for the full cohort",
      "Weekend office-space access for focused building and collaboration",
      "Guidance on market research, customer discovery and product building",
      "Additional founder learning, connections and programme opportunities",
    ],
  },
  {
    icon: FlaskConical,
    eyebrow: "For startups ready to accelerate",
    title: "Incubation Program",
    intro:
      "Everything included in the Startup Cohort experience, with a focused incubation environment for founders who want consistent access to people, space and execution support.",
    benefits: [
      "Guaranteed incubation support for 90 days",
      "All core Startup Cohort Program benefits",
      "Latest updates about relevant startup events",
      "Regular founder's connect opportunities",
      "Co-working space access at the incubation centre",
      "Mentorship from our experts whenever the founder team is present",
      "Discounted rates on services such as desk space and conference rooms",
      "Special IT project-development pricing, advertised at up to 4x cheaper than typical market cost",
      "Practical support through the Elite Forums Innovation Lab team",
    ],
  },
  {
    icon: Building2,
    eyebrow: "For two founders or a startup team",
    title: "Coworking Space Membership",
    intro:
      "A professional, founder-friendly workspace with the practical facilities teams need to work consistently and stay connected to the startup ecosystem.",
    benefits: [
      "Desk access for up to two founders or a startup team",
      "Discounts on conference-room bookings",
      "Wi-Fi access for the team",
      "Dedicated charging ports",
      "Pantry access",
      "Professional working environment",
      "Air-conditioned, temperature-controlled space",
      "Quick-commerce options available within approximately 7 minutes",
      "Guidance from startup mentors or the Elite Forums Innovation Lab team",
    ],
  },
];

function Colleges() {
  return (
    <>
      <PageHero
        eyebrow="For colleges & E-Cells"
        title="Bring founders to your campus."
        intro="We partner with institutions to run entrepreneurship programmes that students actually show up for."
      />
      <section className="py-12">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {OFFER.map(([t, d]) => (
              <div key={t} className="panel border border-border p-8">
                <h3 className="display-xl text-2xl">{t}</h3>
                <p className="mt-3 text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="section-space border-y border-border bg-surface/40">
        <Container>
          <SectionHead
            eyebrow="Founder facilities"
            title={
              <>
                Three ways to
                <br />
                <span className="text-brand">build further.</span>
              </>
            }
          />
          <p className="mt-6 max-w-2xl reading-copy">
            Choose the facility that fits your stage. Every programme is designed to bring founders
            closer to mentorship, execution support, workspace and the wider startup ecosystem.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PROGRAMMES.map(({ icon: Icon, eyebrow, title, intro, benefits }) => (
              <article
                key={title}
                className="panel flex flex-col border border-border bg-background p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon className="h-9 w-9 text-electric" aria-hidden="true" />
                  <span className="eyebrow rounded-full border border-electric/30 px-3 py-1 text-electric">
                    INR 5,000 + taxes*
                  </span>
                </div>
                <p className="eyebrow mt-10 text-muted-foreground">{eyebrow}</p>
                <h2 className="display-xl mt-3 text-3xl">{title}</h2>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">{intro}</p>
                <ul className="mt-7 space-y-3 border-t border-border pt-6">
                  {benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#programme-enquiry"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-electric hover:text-foreground"
                >
                  Enquire about this programme <ArrowUpRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            *Programme charges are INR 5,000 plus applicable taxes per the applicable programme
            terms. Final inclusions, duration, availability, taxes, cancellation terms and
            onboarding requirements will be confirmed before enrolment.
          </p>
        </Container>
      </section>
      <section className="py-16 md:py-24">
        <Container className="max-w-3xl" id="programme-enquiry">
          <SectionHead eyebrow="Apply" title="Partner your college" />
          <div className="mt-10">
            <CollegeForm />
          </div>
        </Container>
      </section>
    </>
  );
}
