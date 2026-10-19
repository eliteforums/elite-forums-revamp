import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Lock,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resetFormConfig, saveFormConfig } from "@/lib/admin.functions";
import {
  FORM_IDS,
  FORM_META,
  QUESTION_TYPE_LABELS,
  allowedTypes,
  resolveForm,
  type FormConfig,
  type FormId,
  type FormOverrides,
  type FormSection,
  type Programme,
  type Question,
} from "@/lib/forms";
import { cn } from "@/lib/utils";
import { Card, FieldLabel, PanelHeader, Pill, Switch, errorMessage, fieldCls } from "./ui";

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const newKey = () => `q_${Math.random().toString(36).slice(2, 8)}`;
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

export function FormsPanel({
  saved,
  migrated,
  onSaved,
}: {
  saved: FormOverrides;
  migrated: boolean;
  onSaved: () => Promise<void>;
}) {
  const [formId, setFormId] = useState<FormId>("programme");
  const baseline = useMemo(() => resolveForm(formId, saved), [formId, saved]);
  const [draft, setDraft] = useState<FormConfig>(baseline);
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(baseline), [baseline]);
  const dirty = !same(draft, baseline);
  const meta = FORM_META[formId];

  function choose(next: FormId) {
    if (dirty && !window.confirm("Discard the unsaved changes to this form?")) return;
    setFormId(next);
  }

  async function save() {
    const blank = [
      ...draft.sections,
      ...(draft.endSections ?? []),
      ...(draft.programmes ?? []).flatMap((p) => p.sections),
    ]
      .flatMap((s) => s.questions)
      .find((q) => !q.label.trim());
    if (blank) return void toast.error("Every question needs a label.");
    const noOptions = [
      ...draft.sections,
      ...(draft.programmes ?? []).flatMap((p) => p.sections),
      ...(draft.endSections ?? []),
    ]
      .flatMap((s) => s.questions)
      .find(
        (q) => ["select", "radio", "multi"].includes(q.type) && !q.options?.filter(Boolean).length,
      );
    if (noOptions) return void toast.error(`Add options to “${noOptions.label}”.`);
    setSaving(true);
    try {
      await saveFormConfig({ data: { form: formId, config: draft } });
      await onSaved();
      toast.success(`${meta.label} saved. The live form updates within a minute.`);
    } catch (error) {
      toast.error(errorMessage(error, "Unable to save the form."));
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (
      !window.confirm(
        `Reset “${meta.label}” to the original questions? Your changes to it are lost.`,
      )
    )
      return;
    try {
      await resetFormConfig({ data: { form: formId } });
      await onSaved();
      toast.success("Form reset to its original questions.");
    } catch (error) {
      toast.error(errorMessage(error, "Unable to reset the form."));
    }
  }

  const sectionProps = { formId, migrated };
  return (
    <>
      <PanelHeader
        title="Forms"
        description="Edit every form on the website: questions, answer options, which are required, the order, and the messages people see. Built-in questions (marked with a lock) save to their own column and can be renamed, moved, made optional or hidden, but not deleted."
      />
      {!migrated && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p>
            Run{" "}
            <code className="rounded bg-muted px-1">
              supabase/migrations/0006_editable_forms.sql
            </code>{" "}
            in the Supabase SQL editor before adding questions, making built-in questions optional
            or hiding them, or adding programmes. Until then those answers cannot be saved.
          </p>
        </div>
      )}
      <div className="grid gap-8 xl:grid-cols-[15rem_minmax(0,1fr)]">
        <nav
          className="flex gap-1 overflow-x-auto xl:flex-col xl:overflow-visible"
          aria-label="Forms"
        >
          {FORM_IDS.map((id) => (
            <button
              key={id}
              onClick={() => choose(id)}
              className={cn(
                "flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                id === formId
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              {FORM_META[id].label}
              {saved[id] !== undefined && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric" title="Edited" />
              )}
            </button>
          ))}
        </nav>
        <div className="min-w-0 space-y-6 pb-24">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">{meta.label}</h2>
            {saved[formId] !== undefined && (
              <button
                onClick={() => void reset()}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-electric"
              >
                <RotateCcw className="h-3 w-3" /> Reset to original questions
              </button>
            )}
          </div>
          <Card className="space-y-5 p-5 sm:p-6">
            <h3 className="text-sm font-semibold">Button and confirmation</h3>
            <FieldLabel label="Submit button">
              <input
                className={fieldCls}
                value={draft.submitLabel}
                onChange={(e) => setDraft({ ...draft, submitLabel: e.target.value })}
              />
            </FieldLabel>
            <FieldLabel label="Confirmation title">
              <input
                className={fieldCls}
                value={draft.successTitle}
                onChange={(e) => setDraft({ ...draft, successTitle: e.target.value })}
              />
            </FieldLabel>
            <FieldLabel
              label="Confirmation message"
              hint={`Shown after a successful submission. Links: [text](/path).${
                formId === "programme" ? " {programme} becomes the programme's name." : ""
              }${formId === "event" ? " {event} becomes the event's title." : ""}`}
            >
              <textarea
                className={cn(fieldCls, "leading-6")}
                rows={4}
                value={draft.successBody}
                onChange={(e) => setDraft({ ...draft, successBody: e.target.value })}
              />
            </FieldLabel>
          </Card>
          {formId === "programme" ? (
            <>
              <SectionsEditor
                {...sectionProps}
                heading="Questions for every applicant"
                sections={draft.sections}
                onChange={(sections) => setDraft({ ...draft, sections })}
              />
              <ProgrammesEditor
                {...sectionProps}
                programmes={draft.programmes ?? []}
                onChange={(programmes) => setDraft({ ...draft, programmes })}
              />
              <SectionsEditor
                {...sectionProps}
                heading="Final questions (after the programme's own)"
                sections={draft.endSections ?? []}
                onChange={(endSections) => setDraft({ ...draft, endSections })}
              />
            </>
          ) : (
            <SectionsEditor
              {...sectionProps}
              heading="Questions"
              sections={draft.sections}
              onChange={(sections) => setDraft({ ...draft, sections })}
            />
          )}
        </div>
      </div>
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 lg:px-10">
            <p className="text-sm text-muted-foreground">Unsaved changes to {meta.label}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setDraft(baseline)}>
                Discard
              </Button>
              <Button variant="brand" size="sm" disabled={saving} onClick={() => void save()}>
                <Save /> {saving ? "Saving…" : "Save form"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProgrammesEditor({
  programmes,
  onChange,
  formId,
  migrated,
}: {
  programmes: Programme[];
  onChange: (programmes: Programme[]) => void;
  formId: FormId;
  migrated: boolean;
}) {
  const update = (index: number, next: Programme) =>
    onChange(programmes.map((p, i) => (i === index ? next : p)));
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold">Programmes</h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Applicants pick one of these, then answer its questions. The short code is used in links
        (/apply?program=code) and on the For Colleges programme cards.
      </p>
      <div className="mt-5 space-y-3">
        {programmes.map((programme, index) => (
          <details key={index} className="rounded-xl border border-border bg-background/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="min-w-0 truncate font-medium">
                {programme.label || "New programme"}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {programme.id}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <MoveButtons
                  index={index}
                  count={programmes.length}
                  onMove={(by) => onChange(moveItem(programmes, index, by))}
                />
                <IconButton
                  label="Remove programme"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Remove “${programme.label}”? Applications already received are kept.`,
                      )
                    )
                      onChange(programmes.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </span>
            </summary>
            <div className="space-y-5 border-t border-border p-4">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
                <FieldLabel label="Name">
                  <input
                    className={fieldCls}
                    value={programme.label}
                    onChange={(e) => update(index, { ...programme, label: e.target.value })}
                  />
                </FieldLabel>
                <FieldLabel label="Short code">
                  <input
                    className={fieldCls}
                    value={programme.id}
                    onChange={(e) => update(index, { ...programme, id: slugify(e.target.value) })}
                  />
                </FieldLabel>
              </div>
              <FieldLabel label="One-line description (shown on the choice card)">
                <input
                  className={fieldCls}
                  value={programme.blurb}
                  onChange={(e) => update(index, { ...programme, blurb: e.target.value })}
                />
              </FieldLabel>
              <SectionsEditor
                formId={formId}
                migrated={migrated}
                heading={`Questions only for ${programme.label || "this programme"}`}
                sections={programme.sections}
                onChange={(sections) => update(index, { ...programme, sections })}
                nested
              />
            </div>
          </details>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() =>
          onChange([
            ...programmes,
            {
              id: `programme-${programmes.length + 1}`,
              label: "",
              blurb: "",
              sections: [{ id: "about", title: "About your application", questions: [] }],
            },
          ])
        }
      >
        <Plus /> Add programme
      </Button>
    </Card>
  );
}

function moveItem<T>(list: T[], index: number, by: number): T[] {
  const next = [...list];
  const [item] = next.splice(index, 1);
  if (item !== undefined) next.splice(index + by, 0, item);
  return next;
}

function SectionsEditor({
  heading,
  sections,
  onChange,
  formId,
  migrated,
  nested = false,
}: {
  heading: string;
  sections: FormSection[];
  onChange: (sections: FormSection[]) => void;
  formId: FormId;
  migrated: boolean;
  nested?: boolean;
}) {
  const columns = FORM_META[formId].columns;
  const setSection = (index: number, next: FormSection) =>
    onChange(sections.map((s, i) => (i === index ? next : s)));
  const moveQuestion = (from: number, qIndex: number, to: number) => {
    const question = sections[from]?.questions[qIndex];
    if (!question) return;
    onChange(
      sections.map((s, i) =>
        i === from
          ? { ...s, questions: s.questions.filter((_, j) => j !== qIndex) }
          : i === to
            ? { ...s, questions: [...s.questions, question] }
            : s,
      ),
    );
  };

  const body = (
    <>
      <h3 className="text-sm font-semibold">{heading}</h3>
      <div className="mt-5 space-y-5">
        {sections.map((section, sIndex) => {
          const hasBuiltIn = section.questions.some((q) => q.key in columns);
          return (
            <div key={sIndex} className="rounded-xl border border-border p-4">
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <FieldLabel label="Section title (optional)">
                    <input
                      className={fieldCls}
                      value={section.title}
                      onChange={(e) => setSection(sIndex, { ...section, title: e.target.value })}
                    />
                  </FieldLabel>
                </div>
                <div className="flex shrink-0 items-center gap-1 pb-1">
                  <MoveButtons
                    index={sIndex}
                    count={sections.length}
                    onMove={(by) => onChange(moveItem(sections, sIndex, by))}
                  />
                  <IconButton
                    label={
                      hasBuiltIn
                        ? "Move the locked questions out before removing this section"
                        : "Remove section"
                    }
                    disabled={hasBuiltIn}
                    onClick={() => {
                      if (window.confirm(`Remove the section “${section.title || "untitled"}”?`))
                        onChange(sections.filter((_, i) => i !== sIndex));
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {section.questions.map((question, qIndex) => (
                  <QuestionEditor
                    key={`${question.key}-${qIndex}`}
                    question={question}
                    formId={formId}
                    migrated={migrated}
                    index={qIndex}
                    count={section.questions.length}
                    sections={sections}
                    sectionIndex={sIndex}
                    onChange={(next) =>
                      setSection(sIndex, {
                        ...section,
                        questions: section.questions.map((q, j) => (j === qIndex ? next : q)),
                      })
                    }
                    onMove={(by) =>
                      setSection(sIndex, {
                        ...section,
                        questions: moveItem(section.questions, qIndex, by),
                      })
                    }
                    onMoveToSection={(to) => moveQuestion(sIndex, qIndex, to)}
                    onDelete={() =>
                      setSection(sIndex, {
                        ...section,
                        questions: section.questions.filter((_, j) => j !== qIndex),
                      })
                    }
                  />
                ))}
                {section.questions.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border px-4 py-4 text-center text-xs text-muted-foreground">
                    No questions in this section yet.
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                disabled={!migrated && formId !== "programme"}
                title={!migrated && formId !== "programme" ? "Run migration 0006 first" : undefined}
                onClick={() =>
                  setSection(sIndex, {
                    ...section,
                    questions: [
                      ...section.questions,
                      { key: newKey(), label: "", type: "text", required: false },
                    ],
                  })
                }
              >
                <Plus /> Add question
              </Button>
            </div>
          );
        })}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3"
        onClick={() =>
          onChange([
            ...sections,
            { id: `section-${sections.length + 1}`, title: "", questions: [] },
          ])
        }
      >
        <Plus /> Add section
      </Button>
    </>
  );
  return nested ? <div>{body}</div> : <Card className="p-5 sm:p-6">{body}</Card>;
}

function QuestionEditor({
  question,
  formId,
  migrated,
  index,
  count,
  sections,
  sectionIndex,
  onChange,
  onMove,
  onMoveToSection,
  onDelete,
}: {
  question: Question;
  formId: FormId;
  migrated: boolean;
  index: number;
  count: number;
  sections: FormSection[];
  sectionIndex: number;
  onChange: (question: Question) => void;
  onMove: (by: number) => void;
  onMoveToSection: (to: number) => void;
  onDelete: () => void;
}) {
  const meta = FORM_META[formId];
  const builtIn = question.key in meta.columns;
  const locked = meta.locked.includes(question.key);
  // Before migration 0006 the database still requires these columns.
  const strict = builtIn && !migrated && formId !== "programme";
  const types = allowedTypes(formId, question.key);
  const set = <K extends keyof Question>(key: K, value: Question[K]) =>
    onChange({ ...question, [key]: value });
  const hasOptions = ["select", "radio", "multi"].includes(question.type);
  const label = question.label.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  return (
    <details
      open={!question.label}
      className={cn(
        "group rounded-lg border border-border bg-background/40",
        question.hidden && "opacity-60",
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm">
        <span className="flex min-w-0 items-center gap-2">
          {builtIn && (
            <Lock className="h-3 w-3 shrink-0 text-muted-foreground" aria-label="Built-in" />
          )}
          <span className="truncate">{label || "New question"}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="hidden text-[0.68rem] text-muted-foreground sm:inline">
            {QUESTION_TYPE_LABELS[question.type]}
          </span>
          {question.hidden ? (
            <Pill tone="draft">Hidden</Pill>
          ) : question.required ? (
            <Pill tone="live">Required</Pill>
          ) : (
            <Pill tone="closed">Optional</Pill>
          )}
          <MoveButtons index={index} count={count} onMove={onMove} />
          {!builtIn && (
            <IconButton
              label="Delete question"
              onClick={() => {
                if (window.confirm(`Delete “${label || "this question"}”?`)) onDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </IconButton>
          )}
        </span>
      </summary>
      <div className="space-y-4 border-t border-border p-3">
        <FieldLabel label="Question" hint="Links: [text](/path).">
          <textarea
            className={cn(fieldCls, "leading-6")}
            rows={2}
            value={question.label}
            onChange={(e) => set("label", e.target.value)}
          />
        </FieldLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label="Answer type">
            <select
              className={fieldCls}
              value={question.type}
              disabled={types.length < 2}
              onChange={(e) => set("type", e.target.value as Question["type"])}
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {QUESTION_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </FieldLabel>
          {sections.length > 1 && (
            <FieldLabel label="Section">
              <select
                className={fieldCls}
                value={sectionIndex}
                onChange={(e) => onMoveToSection(Number(e.target.value))}
              >
                {sections.map((section, i) => (
                  <option key={i} value={i}>
                    {section.title || `Section ${i + 1}`}
                  </option>
                ))}
              </select>
            </FieldLabel>
          )}
        </div>
        {hasOptions && (
          <FieldLabel label="Options" hint="One per line.">
            <textarea
              className={cn(fieldCls, "leading-6")}
              rows={Math.max(3, (question.options?.length ?? 0) + 1)}
              value={(question.options ?? []).join("\n")}
              onChange={(e) => set("options", e.target.value.split("\n"))}
            />
          </FieldLabel>
        )}
        {question.type !== "checkbox" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel label="Help text (optional)">
              <input
                className={fieldCls}
                value={question.hint ?? ""}
                onChange={(e) => set("hint", e.target.value)}
              />
            </FieldLabel>
            <FieldLabel label="Placeholder (optional)">
              <input
                className={fieldCls}
                value={question.placeholder ?? ""}
                onChange={(e) => set("placeholder", e.target.value)}
              />
            </FieldLabel>
          </div>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs">
          <label className="flex items-center gap-2">
            <Switch
              checked={question.required}
              label="Required"
              disabled={locked || (strict && question.required) || !!question.hidden}
              onChange={(on) => set("required", on)}
            />
            Required
            {(locked || strict) && <span className="text-muted-foreground">(always)</span>}
          </label>
          <label className="flex items-center gap-2">
            <Switch
              checked={!!question.half}
              label="Half width"
              onChange={(on) => set("half", on)}
            />
            Half width
          </label>
          {builtIn && !locked && (
            <label className="flex items-center gap-2">
              <Switch
                checked={!!question.hidden}
                label="Hide this question"
                disabled={strict}
                onChange={(on) =>
                  onChange({ ...question, hidden: on, ...(on ? { required: false } : {}) })
                }
              />
              Hide this question
            </label>
          )}
        </div>
        <p className="text-[0.68rem] text-muted-foreground">
          {builtIn
            ? `Built-in question · saved to the “${question.key}” column`
            : `Saved as ${question.key}`}
          {locked && " · every submission needs it, so it is always asked and required"}
        </p>
      </div>
    </details>
  );
}

function MoveButtons({
  index,
  count,
  onMove,
}: {
  index: number;
  count: number;
  onMove: (by: number) => void;
}) {
  return (
    <>
      <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
        <ArrowUp className="h-3.5 w-3.5" />
      </IconButton>
      <IconButton label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
        <ArrowDown className="h-3.5 w-3.5" />
      </IconButton>
    </>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30"
    >
      {children}
    </button>
  );
}
