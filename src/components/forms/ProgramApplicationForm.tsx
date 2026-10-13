import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ACKNOWLEDGEMENTS,
  COMMON_SECTIONS,
  PROGRAMS,
  PROGRAM_SECTIONS,
  applicationValues,
  programApplicationSchema,
  programLabel,
  type ProgramId,
  type Question,
  type Section,
} from "@/lib/program-application";
import { submitProgramApplication } from "@/lib/submissions.functions";
import { Field, Honeypot, SubmitRow, Success, inputCls, useFormSubmit } from "./kit";

const INPUT_TYPES = { email: "email", url: "url", tel: "tel", date: "date" } as const;

function QuestionField({ q, error }: { q: Question; error?: string | undefined }) {
  const common = {
    id: q.key,
    name: q.key,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${q.key}-error` : undefined,
  };
  const span = q.half ? undefined : "md:col-span-2";

  if (q.type === "multi")
    return (
      <fieldset className="md:col-span-2">
        <legend className="text-sm font-medium">{q.label}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {q.options!.map((option) => (
            <label key={option} className="cursor-pointer">
              <input type="checkbox" name={q.key} value={option} className="peer sr-only" />
              <span className="inline-block rounded-full border border-input px-4 py-2 text-sm transition-colors peer-checked:border-electric peer-checked:bg-electric peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                {option}
              </span>
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );

  return (
    <Field
      label={q.label}
      name={q.key}
      error={error}
      hint={q.hint}
      optional={!!q.optional}
      {...(span ? { className: span } : {})}
    >
      {q.type === "textarea" ? (
        <textarea rows={3} className={inputCls} placeholder={q.placeholder} {...common} />
      ) : q.type === "select" ? (
        <select className={inputCls} defaultValue="" {...common}>
          <option value="" disabled={!q.optional}>
            Choose one
          </option>
          {q.options!.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={INPUT_TYPES[q.type as keyof typeof INPUT_TYPES] ?? "text"}
          className={inputCls}
          placeholder={q.placeholder}
          autoComplete={
            q.key === "full_name"
              ? "name"
              : q.key === "email"
                ? "email"
                : q.key === "phone"
                  ? "tel"
                  : undefined
          }
          {...common}
        />
      )}
    </Field>
  );
}

function Sections({
  sections,
  errors,
  startAt,
}: {
  sections: Section[];
  errors: Record<string, string>;
  startAt: number;
}) {
  return (
    <>
      {sections.map((section, i) => (
        <section key={section.title} className="border-t border-border pt-10">
          <p className="eyebrow text-electric">Section {startAt + i}</p>
          <h3 className="mt-3 text-2xl font-medium">{section.title}</h3>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {section.questions.map((q) => (
              <QuestionField key={q.key} q={q} error={errors[q.key]} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export function ProgramApplicationForm({
  defaultProgram,
}: {
  defaultProgram?: ProgramId | undefined;
}) {
  const [program, setProgram] = useState<ProgramId | "">(defaultProgram ?? "");
  const f = useFormSubmit(programApplicationSchema, submitProgramApplication, applicationValues);
  const e = f.errors;
  const programError = e["program"];

  if (f.state === "success")
    return (
      <Success title="Application received.">
        <p>
          Thanks for applying to the {programLabel(program)}. Our team reviews every application and
          will contact you about the next step — an interview, or a facility visit for coworking
          members.
        </p>
        <Button asChild variant="ink" className="mt-6">
          <Link to="/events">See upcoming events</Link>
        </Button>
      </Success>
    );

  return (
    <form onSubmit={f.onSubmit} noValidate className="relative space-y-10">
      <Honeypot />
      <fieldset>
        <legend className="text-sm font-medium">Which program are you applying for?</legend>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {PROGRAMS.map((p) => (
            <label key={p.id} className="cursor-pointer">
              <input
                type="radio"
                name="program"
                value={p.id}
                checked={program === p.id}
                onChange={() => setProgram(p.id)}
                className="peer sr-only"
                aria-invalid={!!programError}
              />
              <span
                className={cn(
                  "block h-full rounded-2xl border border-input p-5 transition-colors",
                  "peer-checked:border-electric peer-checked:bg-electric/10 peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                )}
              >
                <span className="block text-base font-medium">{p.label}</span>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                  {p.blurb}
                </span>
              </span>
            </label>
          ))}
        </div>
        {programError && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {programError}
          </p>
        )}
      </fieldset>

      <Sections sections={COMMON_SECTIONS} errors={e} startAt={1} />

      {program ? (
        // Keyed so switching programme starts its questions from a clean slate.
        <div key={program} className="space-y-10">
          <div className="rounded-2xl border border-electric/30 bg-electric/5 px-5 py-4 text-sm">
            The next sections are specific to the <b>{programLabel(program)}</b>.
          </div>
          <Sections
            sections={PROGRAM_SECTIONS[program]}
            errors={e}
            startAt={COMMON_SECTIONS.length + 1}
          />
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-5 py-6 text-sm text-muted-foreground">
          Choose a program above to see its questions.
        </p>
      )}

      <section className="border-t border-border pt-10">
        <h3 className="text-2xl font-medium">Acknowledgements</h3>
        <div className="mt-6 space-y-4">
          {ACKNOWLEDGEMENTS.map((a) => (
            <div key={a.key}>
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name={a.key}
                  className="mt-0.5 h-4 w-4 accent-[var(--electric)]"
                  aria-invalid={!!e[a.key]}
                />
                <span>{a.label}</span>
              </label>
              {e[a.key] && (
                <p className="mt-1 text-xs text-destructive" role="alert">
                  {e[a.key]}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Read the{" "}
          <Link to="/privacy" className="text-foreground underline underline-offset-2">
            privacy policy
          </Link>
          ,{" "}
          <Link to="/terms" className="text-foreground underline underline-offset-2">
            terms of service
          </Link>{" "}
          and{" "}
          <Link to="/refunds" className="text-foreground underline underline-offset-2">
            refund policy
          </Link>
          . We never ask for banking details, passwords or identity documents on this form.
        </p>
      </section>

      {Object.keys(e).length > 0 && (
        <p className="text-sm text-destructive" role="alert">
          Some answers are missing or need fixing — they are marked above.
        </p>
      )}
      <SubmitRow state={f.state} message={f.message} label="Submit Application" />
    </form>
  );
}
