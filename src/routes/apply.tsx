import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Container, PageHero, SectionHead } from "@/components/site/Blocks";
import { ProgramApplicationForm } from "@/components/forms/ProgramApplicationForm";
import { pageMeta } from "@/lib/metadata";

const STEPS = [
  ["Application form", "Common questions, followed by the section for your program."],
  ["Internal review", "We assess fit, support requirements, eligibility and readiness."],
  [
    "Interview or facility visit",
    "Cohort and incubation applicants are interviewed; coworking applicants get a tour or onboarding call.",
  ],
  [
    "Offer and onboarding",
    "We confirm scope, fees, duration, house rules and payment terms before admission.",
  ],
];

export const Route = createFileRoute("/apply")({
  validateSearch: z.object({
    program: z.enum(["cohort", "incubation", "coworking"]).optional().catch(undefined),
  }),
  head: () =>
    pageMeta(
      "Apply to a Program",
      "Apply to the Elite Forums Startup Cohort Program, Startup Incubation Program or Coworking Space Membership.",
      "/apply",
    ),
  component: Apply,
});

function Apply() {
  const { program } = Route.useSearch();
  return (
    <>
      <PageHero
        eyebrow="Program admissions"
        title={
          <>
            Apply to build
            <br />
            <span className="text-brand">with Elite Forums.</span>
          </>
        }
        intro="One application for the Startup Cohort Program, the Startup Incubation Program and Coworking Space Membership. Choose your program and answer the questions that apply to it."
      />
      <section className="section-space border-b border-border">
        <Container>
          <SectionHead eyebrow="How admission works" title="Four steps." />
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
      <section className="py-16 md:py-24">
        <Container className="max-w-4xl">
          <SectionHead eyebrow="Application" title="Your application" />
          <div className="mt-10">
            <ProgramApplicationForm defaultProgram={program} />
          </div>
        </Container>
      </section>
    </>
  );
}
