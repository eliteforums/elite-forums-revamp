import { Pencil, Pin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Card,
  Drawer,
  Empty,
  FieldLabel,
  PanelHeader,
  Switch,
  fieldCls,
} from "@/components/admin/ui";
import { Markdown } from "@/components/site/Markdown";
import { Button } from "@/components/ui/button";
import { formatDate, type LmsAnnouncement } from "@/lib/lms";
import { deleteLmsRecord, saveLmsRecord } from "@/lib/lms-admin.functions";
import { cn } from "@/lib/utils";
import {
  TargetSelect,
  confirmAction,
  splitTarget,
  useAction,
  useLookups,
  type AdminData,
} from "./common";

export function AnnouncementsPanel({ data }: { data: AdminData }) {
  const look = useLookups(data);
  const [draft, setDraft] = useState<Partial<LmsAnnouncement> | null>(null);
  const { run } = useAction();
  const audience = (a: LmsAnnouncement) =>
    a.cohort_id
      ? `${look.programs.get(a.program_id ?? "")?.title ?? ""} · ${look.cohorts.get(a.cohort_id)?.name ?? ""}`
      : a.program_id
        ? (look.programs.get(a.program_id)?.title ?? "Programme")
        : "Everyone";

  return (
    <>
      <PanelHeader
        title="Announcements"
        description="Updates shown on learners' home pages and inside their programme. Send one to everyone, a programme or a single cohort."
        actions={
          <Button variant="brand" onClick={() => setDraft({})}>
            <Plus /> New announcement
          </Button>
        }
      />
      {data.announcements.length === 0 ? (
        <Empty title="No announcements yet" />
      ) : (
        <div className="space-y-3">
          {data.announcements.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium">
                    {a.pinned && <Pin className="h-4 w-4 shrink-0 text-electric" />}
                    {a.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {audience(a)} · {formatDate(a.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    aria-label="Edit"
                    onClick={() => setDraft(a)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Delete"
                    onClick={() => {
                      if (confirmAction(`Delete "${a.title}"?`))
                        void run(
                          () => deleteLmsRecord({ data: { entity: "announcement", id: a.id } }),
                          "Announcement deleted.",
                        );
                    }}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {a.body && <Markdown text={a.body} className="mt-3 text-sm" />}
            </Card>
          ))}
        </div>
      )}
      {draft && <AnnouncementDrawer draft={draft} data={data} onClose={() => setDraft(null)} />}
    </>
  );
}

function AnnouncementDrawer({
  draft,
  data,
  onClose,
}: {
  draft: Partial<LmsAnnouncement>;
  data: AdminData;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(draft.title ?? "");
  const [body, setBody] = useState(draft.body ?? "");
  const [pinned, setPinned] = useState(draft.pinned ?? false);
  const [target, setTarget] = useState(
    draft.cohort_id ? `${draft.program_id}:${draft.cohort_id}` : (draft.program_id ?? ""),
  );
  const { run, busy } = useAction();
  const { programId, cohortId } = splitTarget(target);

  return (
    <Drawer
      title={draft.id ? "Edit announcement" : "New announcement"}
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
                      entity: "announcement",
                      ...(draft.id ? { id: draft.id } : {}),
                      data: { title, body, pinned, program_id: programId, cohort_id: cohortId },
                    },
                  }),
                draft.id ? "Announcement saved." : "Announcement posted.",
              ).then((ok) => ok && onClose())
            }
          >
            {draft.id ? "Save" : "Post"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FieldLabel label="Who sees it">
          <TargetSelect
            programs={data.programs}
            cohorts={data.cohorts}
            value={target}
            onChange={setTarget}
            emptyLabel="Everyone on the platform"
          />
        </FieldLabel>
        <FieldLabel label="Title">
          <input className={fieldCls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </FieldLabel>
        <FieldLabel label="Message" hint='"- " for bullets, **bold**, [text](link).'>
          <textarea
            className={cn(fieldCls, "min-h-40")}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </FieldLabel>
        <label className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
          <span className="text-sm font-medium">Pin to the top</span>
          <Switch label="Pinned" checked={pinned} onChange={setPinned} />
        </label>
      </div>
    </Drawer>
  );
}
