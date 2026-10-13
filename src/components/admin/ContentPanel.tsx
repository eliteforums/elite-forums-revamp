import { ArrowDown, ArrowUp, ExternalLink, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveSiteContent } from "@/lib/admin.functions";
import {
  CONTENT_PAGES,
  isValidValue,
  type ContentValue,
  type FieldDef,
  type Item,
} from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { Card, FieldLabel, PanelHeader, errorMessage, fieldCls } from "./ui";

type Draft = Record<string, ContentValue>;
type Saved = Record<string, Record<string, unknown>>;

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Blank lines are only meaningful while typing; drop them before comparing or saving. */
function tidy(def: FieldDef, value: ContentValue): ContentValue {
  if (def.type === "lines") return (value as string[]).map((line) => line.trim()).filter(Boolean);
  if (def.type === "items")
    return (value as Item[]).map((item) =>
      Object.fromEntries(
        Object.entries(item).map(([key, v]) => [
          key,
          Array.isArray(v) ? v.map((line) => line.trim()).filter(Boolean) : v,
        ]),
      ),
    );
  return value;
}

function initialDraft(pageId: string, saved: Saved): Draft {
  const page = CONTENT_PAGES.find((p) => p.id === pageId);
  const draft: Draft = {};
  for (const section of page?.sections ?? [])
    for (const [key, def] of Object.entries(section.fields)) {
      const stored = saved[pageId]?.[key];
      draft[key] = (
        stored !== undefined && isValidValue(def, stored) ? stored : def.default
      ) as ContentValue;
    }
  return draft;
}

export function ContentPanel({ saved, onSaved }: { saved: Saved; onSaved: () => Promise<void> }) {
  const [pageId, setPageId] = useState(CONTENT_PAGES[0]!.id);
  const page = CONTENT_PAGES.find((p) => p.id === pageId)!;
  const baseline = useMemo(() => initialDraft(pageId, saved), [pageId, saved]);
  const [draft, setDraft] = useState<Draft>(baseline);
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(baseline), [baseline]);

  const fields = useMemo(
    () => Object.assign({}, ...page.sections.map((s) => s.fields)) as Record<string, FieldDef>,
    [page],
  );
  const dirty = Object.entries(fields).some(
    ([key, def]) => !same(tidy(def, draft[key]!), tidy(def, baseline[key]!)),
  );
  const set = (key: string, value: ContentValue) => setDraft((d) => ({ ...d, [key]: value }));

  function choosePage(next: string) {
    if (dirty && !window.confirm("Discard the unsaved changes on this page?")) return;
    setPageId(next);
  }

  async function save() {
    setSaving(true);
    try {
      // Only fields that differ from the built-in default are stored.
      const value: Draft = {};
      for (const [key, def] of Object.entries(fields)) {
        const cleaned = tidy(def, draft[key]!);
        if (!same(cleaned, def.default)) value[key] = cleaned;
      }
      await saveSiteContent({ data: { key: pageId, value } });
      await onSaved();
      toast.success(`${page.label} saved. The site updates within a minute.`);
    } catch (error) {
      toast.error(errorMessage(error, "Unable to save this page."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PanelHeader
        title="Site content"
        description="Edit the words and photos on every page. Pick a page, change what you need and save — no code or JSON."
      />
      <div className="grid gap-8 xl:grid-cols-[15rem_minmax(0,1fr)]">
        <nav
          className="flex gap-1 overflow-x-auto xl:flex-col xl:overflow-visible"
          aria-label="Pages"
        >
          {CONTENT_PAGES.map((p) => {
            const edited = Object.keys(saved[p.id] ?? {}).length > 0;
            return (
              <button
                key={p.id}
                onClick={() => choosePage(p.id)}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  p.id === pageId
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                {p.label}
                {edited && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric" title="Edited" />
                )}
              </button>
            );
          })}
        </nav>
        <div className="min-w-0 space-y-6 pb-24">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">{page.label}</h2>
            {page.path && (
              <a
                href={page.path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-electric hover:underline"
              >
                Open page <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          {page.sections.map((section) => (
            <Card key={section.title} className="p-5 sm:p-6">
              <h3 className="mb-5 text-sm font-semibold text-foreground">{section.title}</h3>
              <div className="space-y-6">
                {Object.entries(section.fields).map(([key, def]) => (
                  <FieldEditor
                    key={`${pageId}.${key}`}
                    def={def}
                    value={draft[key] ?? def.default}
                    onChange={(value) => set(key, value)}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 lg:px-10">
            <p className="text-sm text-muted-foreground">Unsaved changes on {page.label}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setDraft(baseline)}>
                Discard
              </Button>
              <Button variant="brand" size="sm" disabled={saving} onClick={() => void save()}>
                <Save /> {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-electric"
    >
      <RotateCcw className="h-3 w-3" /> Reset to default
    </button>
  );
}

function FieldEditor({
  def,
  value,
  onChange,
}: {
  def: FieldDef;
  value: ContentValue;
  onChange: (value: ContentValue) => void;
}) {
  const changed = !same(tidy(def, value), def.default);
  const reset = changed ? <ResetButton onClick={() => onChange(def.default)} /> : undefined;

  if (def.type === "items")
    return <ItemsEditor def={def} value={value as Item[]} onChange={onChange} reset={reset} />;

  if (def.type === "lines") {
    const list = value as string[];
    return (
      <FieldLabel label={def.label} hint={def.hint} action={reset}>
        <textarea
          className={cn(fieldCls, "leading-6")}
          rows={Math.max(3, list.length + 1)}
          value={list.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
        />
      </FieldLabel>
    );
  }

  const text = value as string;
  return (
    <FieldLabel label={def.label} hint={def.hint} action={reset}>
      {def.type === "text" || def.type === "image" ? (
        <input
          className={fieldCls}
          value={text}
          placeholder={def.type === "image" ? "https://…" : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <textarea
          className={cn(fieldCls, "leading-6")}
          rows={def.type === "rich" ? Math.max(2, text.split("\n").length) : 4}
          value={text}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {def.type === "image" && /^https?:\/\//.test(text) && (
        <img src={text} alt="" className="mt-2 h-28 rounded-lg border border-border object-cover" />
      )}
    </FieldLabel>
  );
}

function ItemsEditor({
  def,
  value,
  onChange,
  reset,
}: {
  def: Extract<FieldDef, { type: "items" }>;
  value: Item[];
  onChange: (value: ContentValue) => void;
  reset: React.ReactNode;
}) {
  const update = (index: number, key: string, next: string | string[]) =>
    onChange(value.map((item, i) => (i === index ? { ...item, [key]: next } : item)));
  const move = (index: number, by: number) => {
    const next = [...value];
    const [moved] = next.splice(index, 1);
    if (moved) next.splice(index + by, 0, moved);
    onChange(next);
  };
  const blank = (): Item =>
    Object.fromEntries(
      Object.entries(def.fields).map(([key, field]) => [
        key,
        field.type === "lines" ? [] : field.type === "select" ? (field.options?.[0] ?? "") : "",
      ]),
    );
  const firstKey = Object.keys(def.fields)[0] ?? "title";
  const nameKey = "title" in def.fields ? "title" : "name" in def.fields ? "name" : firstKey;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-foreground/90">{def.label}</span>
        {reset}
      </div>
      {def.hint && <p className="text-xs leading-5 text-muted-foreground">{def.hint}</p>}
      {value.map((item, index) => {
        const heading = String(item[nameKey] ?? "") || `${def.itemName} ${index + 1}`;
        return (
          <details
            key={index}
            open={value.length <= 2}
            className="group rounded-xl border border-border bg-background/40"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="min-w-0 truncate">
                <span className="mr-2 text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {heading}
              </span>
              <span className="flex shrink-0 items-center gap-1">
                {!def.fixed && (
                  <>
                    <IconButton
                      label="Move up"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton
                      label="Move down"
                      disabled={index === value.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton
                      label={`Remove ${def.itemName.toLowerCase()}`}
                      onClick={() => {
                        if (window.confirm(`Remove “${heading}”?`))
                          onChange(value.filter((_, i) => i !== index));
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconButton>
                  </>
                )}
                <span className="ml-1 text-xs text-muted-foreground group-open:hidden">Edit</span>
                <span className="ml-1 hidden text-xs text-muted-foreground group-open:inline">
                  Close
                </span>
              </span>
            </summary>
            <div className="space-y-4 border-t border-border px-4 py-4">
              {Object.entries(def.fields).map(([key, field]) => {
                const current = item[key];
                return (
                  <FieldLabel key={key} label={field.label}>
                    {field.type === "lines" ? (
                      <textarea
                        className={cn(fieldCls, "leading-6")}
                        rows={Math.max(3, (Array.isArray(current) ? current.length : 0) + 1)}
                        value={Array.isArray(current) ? current.join("\n") : ""}
                        onChange={(e) => update(index, key, e.target.value.split("\n"))}
                      />
                    ) : field.type === "select" ? (
                      <select
                        className={fieldCls}
                        value={typeof current === "string" ? current : ""}
                        onChange={(e) => update(index, key, e.target.value)}
                      >
                        {field.options?.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        className={cn(fieldCls, "leading-6")}
                        rows={3}
                        value={typeof current === "string" ? current : ""}
                        onChange={(e) => update(index, key, e.target.value)}
                      />
                    ) : (
                      <input
                        className={fieldCls}
                        value={typeof current === "string" ? current : ""}
                        onChange={(e) => update(index, key, e.target.value)}
                      />
                    )}
                  </FieldLabel>
                );
              })}
            </div>
          </details>
        );
      })}
      {!def.fixed && (
        <Button variant="outline" size="sm" onClick={() => onChange([...value, blank()])}>
          <Plus /> Add {def.itemName.toLowerCase()}
        </Button>
      )}
    </div>
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
