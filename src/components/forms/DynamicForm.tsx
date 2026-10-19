import { useMemo, useRef, useState } from "react";
import { Markdown, Inline } from "@/components/site/Markdown";
import { useFormConfig } from "@/lib/content-context";
import { formSchema, formSections, readForm, type FormId, type Question } from "@/lib/forms";
import { flatten } from "@/lib/schemas";
import { submitForm } from "@/lib/submissions.functions";
import { currentAttribution } from "@/lib/utm";
import { cn } from "@/lib/utils";
import { Field, Honeypot, SubmitRow, Success, inputCls } from "./kit";

const INPUT_TYPES: Partial<Record<Question["type"], string>> = {
  email: "email",
  url: "url",
  tel: "tel",
  date: "date",
  number: "text",
};
const AUTOCOMPLETE: Record<string, string> = {
  full_name: "name",
  name: "name",
  email: "email",
  phone: "tel",
  city: "address-level2",
};

/** Pick the option a page asks to preselect, matching loosely so renamed options still work. */
function matchOption(options: string[] | undefined, wanted?: string) {
  if (!wanted || !options) return "";
  const w = wanted.toLowerCase().replace(/[_-]/g, " ");
  return (
    options.find((o) => o.toLowerCase() === w) ??
    options.find((o) => o.toLowerCase().includes(w.split(" ").pop() ?? w)) ??
    ""
  );
}

function QuestionField({
  q,
  error,
  defaultValue,
}: {
  q: Question;
  error?: string | undefined;
  defaultValue?: string | undefined;
}) {
  const common = {
    id: q.key,
    name: q.key,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${q.key}-error` : undefined,
  };
  const span = q.half ? undefined : "md:col-span-2";
  const errorText = error && (
    <p id={`${q.key}-error`} className="mt-2 text-xs text-destructive" role="alert">
      {error}
    </p>
  );

  if (q.type === "checkbox")
    return (
      <div className="md:col-span-2">
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            {...common}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--electric)]"
          />
          <span>
            <Inline text={q.label} />
            {!q.required && <span className="ml-1 text-xs">(optional)</span>}
          </span>
        </label>
        {errorText}
      </div>
    );

  if (q.type === "multi" || q.type === "radio")
    return (
      <fieldset className={span ?? ""}>
        <legend className="flex w-full items-baseline justify-between text-sm font-medium">
          <span>{q.label}</span>
          {!q.required && (
            <span className="text-xs font-normal text-muted-foreground">Optional</span>
          )}
        </legend>
        {q.hint && <p className="mt-1 text-xs text-muted-foreground">{q.hint}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {(q.options ?? []).map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type={q.type === "multi" ? "checkbox" : "radio"}
                name={q.key}
                value={option}
                defaultChecked={defaultValue === option}
                className="peer sr-only"
                aria-invalid={!!error}
              />
              <span className="inline-block rounded-full border border-input px-4 py-2 text-sm transition-colors peer-checked:border-electric peer-checked:bg-electric peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                {option}
              </span>
            </label>
          ))}
        </div>
        {errorText}
      </fieldset>
    );

  return (
    <Field
      label={q.label}
      name={q.key}
      error={error}
      hint={q.hint}
      optional={!q.required}
      {...(span ? { className: span } : {})}
    >
      {q.type === "textarea" ? (
        <textarea rows={4} className={inputCls} placeholder={q.placeholder} {...common} />
      ) : q.type === "select" ? (
        <select className={inputCls} defaultValue={defaultValue ?? ""} {...common}>
          <option value="" disabled={q.required}>
            {q.placeholder || "Choose one"}
          </option>
          {(q.options ?? []).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={INPUT_TYPES[q.type] ?? "text"}
          inputMode={q.type === "number" ? "decimal" : undefined}
          className={inputCls}
          placeholder={q.placeholder}
          defaultValue={defaultValue}
          autoComplete={AUTOCOMPLETE[q.key]}
          {...common}
        />
      )}
    </Field>
  );
}

/**
 * Renders any website form from its settings in the admin console and sends it
 * to the server, which validates against the same settings.
 */
export function DynamicForm({
  form,
  defaults = {},
  defaultProgramme,
  eventSlug,
  vars = {},
}: {
  form: FormId;
  defaults?: Record<string, string>;
  defaultProgramme?: string | undefined;
  eventSlug?: string;
  vars?: Record<string, string>;
}) {
  const config = useFormConfig(form);
  const programmes = config.programmes ?? [];
  const [programme, setProgramme] = useState(
    programmes.find((p) => p.id === defaultProgramme)?.id ?? "",
  );
  const sections = useMemo(
    () => formSections(config, programmes.length ? programme || "__none__" : undefined),
    [config, programme, programmes.length],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const lock = useRef(false);
  const fill = (text: string) =>
    text.replace(/\{(\w+)\}/g, (_, key: string) =>
      key === "programme"
        ? (programmes.find((p) => p.id === programme)?.label ?? "programme")
        : (vars[key] ?? ""),
    );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current) return;
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    if (programmes.length && !programme) {
      setErrors({ program: "Choose the program you are applying for" });
      formEl.querySelector<HTMLElement>("[name=program]")?.focus();
      return;
    }
    const values = readForm(fd, config, programme || undefined);
    const parsed = formSchema(config, programme || undefined).safeParse(values);
    if (!parsed.success) {
      setErrors(flatten(parsed.error));
      setState("idle");
      requestAnimationFrame(() =>
        formEl.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(),
      );
      return;
    }
    setErrors({});
    lock.current = true;
    setState("loading");
    try {
      const res = await submitForm({
        data: {
          form,
          values: parsed.data,
          ...(programme ? { programme } : {}),
          ...(eventSlug ? { event_slug: eventSlug } : {}),
          hp: String(fd.get("_hp") ?? ""),
          utm: currentAttribution(),
        },
      });
      if (res.ok) setState("success");
      else {
        setState("error");
        setMessage(res.error);
        if (res.errors) setErrors(res.errors);
      }
    } catch {
      setState("error");
      setMessage("We couldn't reach the server. Check your connection and try again.");
    } finally {
      lock.current = false;
    }
  }

  if (state === "success")
    return (
      <Success title={fill(config.successTitle)}>
        <Markdown text={fill(config.successBody)} className="text-ink/80 [&_a]:text-ink" />
      </Success>
    );

  const titled = sections.filter((section) => section.title).length > 1;
  const errorCount = Object.keys(errors).length;
  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-10">
      <Honeypot name="_hp" />
      {programmes.length > 0 && (
        <fieldset>
          <legend className="text-sm font-medium">Which program are you applying for?</legend>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {programmes.map((p) => (
              <label key={p.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="program"
                  value={p.id}
                  checked={programme === p.id}
                  onChange={() => {
                    setProgramme(p.id);
                    setErrors({});
                  }}
                  className="peer sr-only"
                  aria-invalid={!!errors["program"]}
                />
                <span className="block h-full rounded-2xl border border-input p-5 transition-colors peer-checked:border-electric peer-checked:bg-electric/10 peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                  <span className="block text-base font-medium">{p.label}</span>
                  <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                    {p.blurb}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {errors["program"] && (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {errors["program"]}
            </p>
          )}
          {!programme && (
            <p className="mt-6 rounded-2xl border border-dashed border-border px-5 py-6 text-sm text-muted-foreground">
              Choose a program above to see its questions.
            </p>
          )}
        </fieldset>
      )}
      {(!programmes.length || programme) &&
        sections.map((section, i) => {
          const visible = section.questions.filter((question) => !question.hidden);
          if (!visible.length) return null;
          return (
            <section
              key={`${programme}-${section.id}-${i}`}
              className={cn(section.title && titled && "border-t border-border pt-10")}
            >
              {section.title && (
                <>
                  {titled && <p className="eyebrow text-electric">Section {i + 1}</p>}
                  <h3 className="mt-3 text-2xl font-medium">{section.title}</h3>
                </>
              )}
              <div className={cn("grid gap-5 md:grid-cols-2", section.title && "mt-7")}>
                {visible.map((question) => (
                  <QuestionField
                    key={question.key}
                    q={question}
                    error={errors[question.key]}
                    defaultValue={
                      question.options
                        ? matchOption(question.options, defaults[question.key])
                        : defaults[question.key]
                    }
                  />
                ))}
              </div>
            </section>
          );
        })}
      {errorCount > 0 && state !== "error" && (
        <p className="text-sm text-destructive" role="alert">
          Some answers are missing or need fixing — they are marked above.
        </p>
      )}
      {(!programmes.length || programme) && (
        <SubmitRow state={state} message={message} label={config.submitLabel} />
      )}
    </form>
  );
}
