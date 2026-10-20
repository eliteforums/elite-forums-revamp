import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookMarked,
  Copy,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  Card,
  Drawer,
  Empty,
  FieldLabel,
  PanelHeader,
  Pill,
  Switch,
  fieldCls,
} from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  LESSON_KINDS,
  LESSON_KIND_LABELS,
  PROGRAM_KINDS,
  PROGRAM_KIND_LABELS,
  type LessonKind,
  type LmsLesson,
  type LmsModule,
  type LmsProgram,
  type ProgramKind,
} from "@/lib/lms";
import {
  deleteLmsRecord,
  duplicateLmsProgram,
  reorderLmsRecords,
  saveLmsRecord,
} from "@/lib/lms-admin.functions";
import { cn } from "@/lib/utils";
import { LESSON_ICONS, minutes } from "../bits";
import { confirmAction, slugify, useAction, type AdminData } from "./common";

function move<T extends { id: string }>(items: T[], id: string, delta: number) {
  const index = items.findIndex((item) => item.id === id);
  const target = index + delta;
  if (index < 0 || target < 0 || target >= items.length) return null;
  const next = [...items];
  [next[index], next[target]] = [next[target]!, next[index]!];
  return next.map((item) => item.id);
}

function OrderButtons({
  onUp,
  onDown,
}: {
  onUp: (() => void) | null;
  onDown: (() => void) | null;
}) {
  return (
    <div className="flex">
      <button
        aria-label="Move up"
        disabled={!onUp}
        onClick={onUp ?? undefined}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
      <button
        aria-label="Move down"
        disabled={!onDown}
        onClick={onDown ?? undefined}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ProgrammesPanel({ data }: { data: AdminData }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { run } = useAction();
  const programs = [...data.programs].sort((a, b) => a.position - b.position);
  const open = programs.find((p) => p.id === openId);

  if (open) return <ProgramEditor program={open} data={data} onBack={() => setOpenId(null)} />;

  return (
    <>
      <PanelHeader
        title="Programmes"
        description="Courses, cohort programmes and bootcamps. Build the curriculum once, then run it for as many cohorts as you like."
        actions={
          <Button variant="brand" onClick={() => setCreating(true)}>
            <Plus /> New programme
          </Button>
        }
      />
      {programs.length === 0 ? (
        <Empty title="No programmes yet">
          Create your first programme, then add modules and lessons to it.
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {programs.map((program, index) => {
            const lessons = data.lessons.filter((l) => l.program_id === program.id);
            const learners = data.enrollments.filter(
              (e) => e.program_id === program.id && e.status !== "dropped",
            ).length;
            const cohorts = data.cohorts.filter((c) => c.program_id === program.id).length;
            return (
              <Card key={program.id} className="flex flex-col overflow-hidden">
                <button
                  onClick={() => setOpenId(program.id)}
                  className="relative block h-28 overflow-hidden bg-brand-soft text-left"
                >
                  {program.cover_image ? (
                    <img src={program.cover_image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid-lines opacity-60" />
                  )}
                  <span className="absolute left-3 top-3">
                    <Pill tone={program.published ? "live" : "draft"}>
                      {program.published ? "Published" : "Draft"}
                    </Pill>
                  </span>
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-muted-foreground">
                    {PROGRAM_KIND_LABELS[program.kind]}
                  </p>
                  <button
                    onClick={() => setOpenId(program.id)}
                    className="mt-1 text-left font-display text-lg font-semibold hover:text-electric"
                  >
                    {program.title}
                  </button>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {program.summary}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {data.modules.filter((m) => m.program_id === program.id).length} modules ·{" "}
                    {lessons.length} lessons · {cohorts} cohorts · {learners} learners
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                    <OrderButtons
                      onUp={
                        index > 0
                          ? () =>
                              void run(() =>
                                reorderLmsRecords({
                                  data: { entity: "program", ids: move(programs, program.id, -1)! },
                                }),
                              )
                          : null
                      }
                      onDown={
                        index < programs.length - 1
                          ? () =>
                              void run(() =>
                                reorderLmsRecords({
                                  data: { entity: "program", ids: move(programs, program.id, 1)! },
                                }),
                              )
                          : null
                      }
                    />
                    <div className="flex gap-1">
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/lms/programs/$programId" params={{ programId: program.id }}>
                          <Eye /> Preview
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setOpenId(program.id)}>
                        <Pencil /> Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {creating && (
        <ProgramDrawer
          onClose={() => setCreating(false)}
          onSaved={(id) => {
            setCreating(false);
            setOpenId(id);
          }}
        />
      )}
    </>
  );
}

function ProgramDrawer({
  program,
  onClose,
  onSaved,
}: {
  program?: LmsProgram;
  onClose: () => void;
  onSaved: (id: string) => void;
}) {
  const [form, setForm] = useState({
    title: program?.title ?? "",
    slug: program?.slug ?? "",
    kind: (program?.kind ?? "cohort") as ProgramKind,
    summary: program?.summary ?? "",
    description: program?.description ?? "",
    cover_image: program?.cover_image ?? "",
    certificate_title: program?.certificate_title ?? "",
    published: program?.published ?? false,
  });
  const [slugEdited, setSlugEdited] = useState(Boolean(program));
  const { run, busy } = useAction();

  async function save() {
    const result = await run(
      () =>
        saveLmsRecord({
          data: {
            entity: "program",
            ...(program ? { id: program.id } : {}),
            data: { ...form, slug: form.slug || slugify(form.title) },
          },
        }),
      program ? "Programme saved." : "Programme created.",
    );
    if (result) onSaved(result.id);
  }

  return (
    <Drawer
      title={program ? "Programme details" : "New programme"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="brand" disabled={busy || !form.title.trim()} onClick={() => void save()}>
            {busy ? "Saving…" : program ? "Save" : "Create programme"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FieldLabel label="Title">
          <input
            className={fieldCls}
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
                ...(slugEdited ? {} : { slug: slugify(e.target.value) }),
              })
            }
          />
        </FieldLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label="Type">
            <select
              className={fieldCls}
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value as ProgramKind })}
            >
              {PROGRAM_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {PROGRAM_KIND_LABELS[kind]}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Short name" hint="Lowercase letters, numbers and hyphens.">
            <input
              className={fieldCls}
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                setForm({ ...form, slug: slugify(e.target.value) });
              }}
            />
          </FieldLabel>
        </div>
        <FieldLabel label="Summary" hint="One or two lines shown on programme cards.">
          <textarea
            className={cn(fieldCls, "min-h-20")}
            value={form.summary}
            maxLength={500}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </FieldLabel>
        <FieldLabel
          label="About this programme"
          hint='Shown on the About tab. "## " for headings, "- " for bullets, **bold**, [text](link).'
        >
          <textarea
            className={cn(fieldCls, "min-h-36")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </FieldLabel>
        <FieldLabel
          label="Cover image"
          action={
            <ImageUpload
              label="Upload"
              onUploaded={(url) => setForm((current) => ({ ...current, cover_image: url }))}
            />
          }
        >
          <input
            className={fieldCls}
            placeholder="https://"
            value={form.cover_image}
            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
          />
        </FieldLabel>
        <FieldLabel
          label="Certificate title"
          hint={
            'Default title for this programme\'s certificates, e.g. "Certificate of Completion".'
          }
        >
          <input
            className={fieldCls}
            value={form.certificate_title}
            onChange={(e) => setForm({ ...form, certificate_title: e.target.value })}
          />
        </FieldLabel>
        <label className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
          <span>
            <span className="block text-sm font-medium">Published</span>
            <span className="text-xs text-muted-foreground">
              Enrolled learners can only see published programmes.
            </span>
          </span>
          <Switch
            label="Published"
            checked={form.published}
            onChange={(published) => setForm({ ...form, published })}
          />
        </label>
      </div>
    </Drawer>
  );
}

function ProgramEditor({
  program,
  data,
  onBack,
}: {
  program: LmsProgram;
  data: AdminData;
  onBack: () => void;
}) {
  const [editingDetails, setEditingDetails] = useState(false);
  const [moduleDraft, setModuleDraft] = useState<Partial<LmsModule> | null>(null);
  const [lessonDraft, setLessonDraft] = useState<Partial<LmsLesson> | null>(null);
  const { run, busy } = useAction();
  const modules = data.modules
    .filter((m) => m.program_id === program.id)
    .sort((a, b) => a.position - b.position);
  const lessonsOf = (moduleId: string) =>
    data.lessons.filter((l) => l.module_id === moduleId).sort((a, b) => a.position - b.position);
  const lessonCount = data.lessons.filter((l) => l.program_id === program.id).length;

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All programmes
      </button>
      <PanelHeader
        title={program.title}
        description={`${PROGRAM_KIND_LABELS[program.kind]} · ${modules.length} modules · ${lessonCount} lessons`}
        actions={
          <>
            <Pill tone={program.published ? "live" : "draft"}>
              {program.published ? "Published" : "Draft"}
            </Pill>
            <Button asChild variant="ghost" size="sm">
              <Link to="/lms/programs/$programId" params={{ programId: program.id }}>
                <Eye /> Preview
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditingDetails(true)}>
              <Pencil /> Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() =>
                void run(
                  () =>
                    saveLmsRecord({
                      data: {
                        entity: "program",
                        id: program.id,
                        data: {
                          slug: program.slug,
                          title: program.title,
                          kind: program.kind,
                          summary: program.summary,
                          description: program.description,
                          cover_image: program.cover_image ?? "",
                          certificate_title: program.certificate_title ?? "",
                          published: !program.published,
                        },
                      },
                    }),
                  program.published ? "Unpublished." : "Published — enrolled learners can see it.",
                )
              }
            >
              {program.published ? "Unpublish" : "Publish"}
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        {modules.length === 0 && (
          <Empty title="No modules yet">
            Modules group lessons, like weeks or topics. Add the first one below.
          </Empty>
        )}
        {modules.map((module, moduleIndex) => {
          const lessons = lessonsOf(module.id);
          return (
            <Card key={module.id}>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Module {moduleIndex + 1}</p>
                  <h3 className="font-display text-base font-semibold">{module.title}</h3>
                  {module.summary && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{module.summary}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <OrderButtons
                    onUp={
                      moduleIndex > 0
                        ? () =>
                            void run(() =>
                              reorderLmsRecords({
                                data: { entity: "module", ids: move(modules, module.id, -1)! },
                              }),
                            )
                        : null
                    }
                    onDown={
                      moduleIndex < modules.length - 1
                        ? () =>
                            void run(() =>
                              reorderLmsRecords({
                                data: { entity: "module", ids: move(modules, module.id, 1)! },
                              }),
                            )
                        : null
                    }
                  />
                  <button
                    aria-label="Edit module"
                    onClick={() => setModuleDraft(module)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Delete module"
                    onClick={() => {
                      if (
                        confirmAction(
                          `Delete "${module.title}" and its ${lessons.length} lessons? Learners' progress on them is removed too.`,
                        )
                      )
                        void run(
                          () => deleteLmsRecord({ data: { entity: "module", id: module.id } }),
                          "Module deleted.",
                        );
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {lessons.map((lesson, lessonIndex) => {
                  const Icon = LESSON_ICONS[lesson.kind];
                  return (
                    <li key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                      <Icon className="h-4 w-4 shrink-0 text-electric" />
                      <button
                        onClick={() => setLessonDraft(lesson)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate text-sm font-medium hover:text-electric">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {LESSON_KIND_LABELS[lesson.kind]}
                          {lesson.duration_minutes ? ` · ${minutes(lesson.duration_minutes)}` : ""}
                          {!lesson.published && " · Draft"}
                        </p>
                      </button>
                      <OrderButtons
                        onUp={
                          lessonIndex > 0
                            ? () =>
                                void run(() =>
                                  reorderLmsRecords({
                                    data: { entity: "lesson", ids: move(lessons, lesson.id, -1)! },
                                  }),
                                )
                            : null
                        }
                        onDown={
                          lessonIndex < lessons.length - 1
                            ? () =>
                                void run(() =>
                                  reorderLmsRecords({
                                    data: { entity: "lesson", ids: move(lessons, lesson.id, 1)! },
                                  }),
                                )
                            : null
                        }
                      />
                      <button
                        aria-label="Delete lesson"
                        onClick={() => {
                          if (confirmAction(`Delete "${lesson.title}"?`))
                            void run(
                              () => deleteLmsRecord({ data: { entity: "lesson", id: lesson.id } }),
                              "Lesson deleted.",
                            );
                        }}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-border px-5 py-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setLessonDraft({
                      program_id: program.id,
                      module_id: module.id,
                      kind: "reading",
                    })
                  }
                >
                  <Plus /> Add lesson
                </Button>
              </div>
            </Card>
          );
        })}
        <Button variant="outline" onClick={() => setModuleDraft({ program_id: program.id })}>
          <BookMarked /> Add module
        </Button>
      </div>

      <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() =>
            void run(
              () => duplicateLmsProgram({ data: { id: program.id } }),
              "Copy created as a draft.",
            )
          }
        >
          <Copy /> Duplicate programme
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          disabled={busy}
          onClick={async () => {
            if (
              !confirmAction(
                `Delete "${program.title}"? Its cohorts, lessons, enrolments, progress and submissions are deleted. Certificates already issued stay valid.`,
              )
            )
              return;
            const done = await run(
              () => deleteLmsRecord({ data: { entity: "program", id: program.id } }),
              "Programme deleted.",
            );
            if (done) onBack();
          }}
        >
          <Trash2 /> Delete programme
        </Button>
      </div>

      {editingDetails && (
        <ProgramDrawer
          program={program}
          onClose={() => setEditingDetails(false)}
          onSaved={() => setEditingDetails(false)}
        />
      )}
      {moduleDraft && <ModuleDrawer draft={moduleDraft} onClose={() => setModuleDraft(null)} />}
      {lessonDraft && (
        <LessonDrawer draft={lessonDraft} modules={modules} onClose={() => setLessonDraft(null)} />
      )}
    </>
  );
}

function ModuleDrawer({ draft, onClose }: { draft: Partial<LmsModule>; onClose: () => void }) {
  const [title, setTitle] = useState(draft.title ?? "");
  const [summary, setSummary] = useState(draft.summary ?? "");
  const { run, busy } = useAction();
  return (
    <Drawer
      title={draft.id ? "Edit module" : "New module"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="brand"
            disabled={busy || !title.trim()}
            onClick={() =>
              void run(
                () =>
                  saveLmsRecord({
                    data: {
                      entity: "module",
                      ...(draft.id ? { id: draft.id } : {}),
                      data: { program_id: draft.program_id!, title, summary },
                    },
                  }),
                "Module saved.",
              ).then((ok) => ok && onClose())
            }
          >
            Save module
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FieldLabel label="Title" hint='e.g. "Week 1 — Finding a problem worth solving"'>
          <input className={fieldCls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </FieldLabel>
        <FieldLabel label="Summary (optional)">
          <textarea
            className={cn(fieldCls, "min-h-20")}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </FieldLabel>
      </div>
    </Drawer>
  );
}

function LessonDrawer({
  draft,
  modules,
  onClose,
}: {
  draft: Partial<LmsLesson>;
  modules: LmsModule[];
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: draft.title ?? "",
    kind: (draft.kind ?? "reading") as LessonKind,
    module_id: draft.module_id ?? modules[0]?.id ?? "",
    body: draft.body ?? "",
    video_url: draft.video_url ?? "",
    resource_url: draft.resource_url ?? "",
    resource_label: draft.resource_label ?? "",
    duration: draft.duration_minutes ? String(draft.duration_minutes) : "",
    published: draft.published ?? true,
  });
  const { run, busy } = useAction();
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [key]: e.target.value });
  const duration = form.duration.trim() ? Number(form.duration) : null;
  const validDuration =
    duration === null || (Number.isInteger(duration) && duration >= 0 && duration <= 1440);

  return (
    <Drawer
      title={draft.id ? "Edit lesson" : "New lesson"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="brand"
            disabled={busy || !form.title.trim() || !validDuration}
            onClick={() =>
              void run(
                () =>
                  saveLmsRecord({
                    data: {
                      entity: "lesson",
                      ...(draft.id ? { id: draft.id } : {}),
                      data: {
                        program_id: draft.program_id!,
                        module_id: form.module_id,
                        title: form.title,
                        kind: form.kind,
                        body: form.body,
                        video_url: form.video_url,
                        resource_url: form.resource_url,
                        resource_label: form.resource_label,
                        duration_minutes: duration,
                        published: form.published,
                      },
                    },
                  }),
                "Lesson saved.",
              ).then((ok) => ok && onClose())
            }
          >
            Save lesson
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FieldLabel label="Title">
          <input className={fieldCls} value={form.title} onChange={set("title")} />
        </FieldLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldLabel label="Type">
            <select className={fieldCls} value={form.kind} onChange={set("kind")}>
              {LESSON_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {LESSON_KIND_LABELS[kind]}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Minutes">
            <input
              className={fieldCls}
              inputMode="numeric"
              value={form.duration}
              onChange={set("duration")}
              placeholder="e.g. 20"
            />
          </FieldLabel>
          <FieldLabel label="Module">
            <select className={fieldCls} value={form.module_id} onChange={set("module_id")}>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </FieldLabel>
        </div>
        {(form.kind === "video" || form.video_url) && (
          <FieldLabel
            label="Video link"
            hint="YouTube, Vimeo, Loom or Google Drive links play inside the lesson."
          >
            <input
              className={fieldCls}
              placeholder="https://youtu.be/…"
              value={form.video_url}
              onChange={set("video_url")}
            />
          </FieldLabel>
        )}
        <FieldLabel
          label={form.kind === "live" ? "Class link" : "Resource link (optional)"}
          hint={
            form.kind === "live"
              ? "Zoom, Google Meet or Teams. Leave empty to use the cohort's class link."
              : "Slides, a template, a reading — anything learners should open."
          }
        >
          <input
            className={fieldCls}
            placeholder="https://"
            value={form.resource_url}
            onChange={set("resource_url")}
          />
        </FieldLabel>
        {form.kind !== "live" && form.resource_url && (
          <FieldLabel label="Button label">
            <input
              className={fieldCls}
              placeholder="Open the resource"
              value={form.resource_label}
              onChange={set("resource_label")}
            />
          </FieldLabel>
        )}
        <FieldLabel
          label={form.kind === "assignment" ? "Assignment brief" : "Lesson notes"}
          hint='"## " for headings, "- " for bullets, "1. " for steps, **bold**, [text](link).'
        >
          <textarea className={cn(fieldCls, "min-h-56")} value={form.body} onChange={set("body")} />
        </FieldLabel>
        {form.kind === "assignment" && (
          <p className="rounded-xl border border-border bg-surface px-4 py-3 text-xs leading-5 text-muted-foreground">
            Learners get a box to write their answer and share a link. Submissions arrive in
            Reviews, where you approve them or ask for changes.
          </p>
        )}
        <label className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
          <span>
            <span className="block text-sm font-medium">Published</span>
            <span className="text-xs text-muted-foreground">Drafts are hidden from learners.</span>
          </span>
          <Switch
            label="Published"
            checked={form.published}
            onChange={(published) => setForm({ ...form, published })}
          />
        </label>
      </div>
    </Drawer>
  );
}
