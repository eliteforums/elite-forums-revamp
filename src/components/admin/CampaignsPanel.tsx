import { useMemo, useState } from "react";
import { resolveForm, type FormOverrides } from "@/lib/forms";
import { CONTENT_PAGES } from "@/lib/site-content";
import { buildUtmUrl, campaignSlug } from "@/lib/utm";
import { cn } from "@/lib/utils";
import type { AdminEvent } from "./EventsPanel";
import { CHANNELS, CopyButton, ShareLinks } from "./marketing";
import { FORMS, formLabel, rowUtm, type Row } from "./submissions";
import { Card, Empty, FieldLabel, PanelHeader, fieldCls } from "./ui";

type Target = { path: string; label: string; campaign: string; group: string };

const CUSTOM = "__custom__";

export function CampaignsPanel({
  events,
  submissions,
  forms,
}: {
  events: AdminEvent[];
  submissions: Record<string, Row[]>;
  forms: FormOverrides;
}) {
  const programmes = useMemo(() => resolveForm("programme", forms).programmes ?? [], [forms]);
  const targets = useMemo<Target[]>(
    () => [
      ...[...events]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((event) => ({
          path: `/events/${event.slug}`,
          label: event.title,
          campaign: `event-${event.slug}`.slice(0, 60),
          group: "Events",
        })),
      ...programmes.map((program) => ({
        path: `/apply?program=${program.id}`,
        label: `Apply — ${program.label}`,
        campaign: `programme-${program.id}`,
        group: "Programme applications",
      })),
      ...CONTENT_PAGES.filter((page) => page.path).map((page) => ({
        path: page.path!,
        label: page.label,
        campaign: campaignSlug(page.label),
        group: "Pages",
      })),
    ],
    [events, programmes],
  );
  const [targetPath, setTargetPath] = useState(targets[0]?.path ?? "/");
  const target = targets.find((t) => t.path === targetPath) ?? targets[0];
  const [channel, setChannel] = useState<string>(CHANNELS[0].source);
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const preset = CHANNELS.find((c) => c.source === channel);
  const tags = {
    utm_source: channel === CUSTOM ? source : (preset?.source ?? ""),
    utm_medium: channel === CUSTOM ? medium : (preset?.medium ?? ""),
    utm_campaign: campaign || target?.campaign || "",
    utm_content: content,
  };
  const link = target ? buildUtmUrl(target.path, tags) : "";

  return (
    <>
      <PanelHeader
        title="Campaigns"
        description="Create tracked (UTM) links for events, programme applications and any page, and see which campaigns bring in registrations and applications."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="p-5 sm:p-6">
          <h2 className="font-display font-semibold">Link builder</h2>
          <div className="mt-5 space-y-4">
            <FieldLabel label="Link to">
              <select
                className={fieldCls}
                value={target?.path}
                onChange={(e) => {
                  setTargetPath(e.target.value);
                  setCampaign("");
                }}
              >
                {["Events", "Programme applications", "Pages"].map((group) => (
                  <optgroup key={group} label={group}>
                    {targets
                      .filter((t) => t.group === group)
                      .map((t) => (
                        <option key={t.path} value={t.path}>
                          {t.label}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Where you'll share it">
              <select
                className={fieldCls}
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              >
                {CHANNELS.map((c) => (
                  <option key={c.source} value={c.source}>
                    {c.label}
                  </option>
                ))}
                <option value={CUSTOM}>Something else…</option>
              </select>
            </FieldLabel>
            {channel === CUSTOM && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldLabel label="Source (utm_source)">
                  <input
                    className={fieldCls}
                    value={source}
                    placeholder="e.g. vjti-ecell"
                    onChange={(e) => setSource(campaignSlug(e.target.value))}
                  />
                </FieldLabel>
                <FieldLabel label="Medium (utm_medium)">
                  <input
                    className={fieldCls}
                    value={medium}
                    placeholder="e.g. referral"
                    onChange={(e) => setMedium(campaignSlug(e.target.value))}
                  />
                </FieldLabel>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldLabel label="Campaign (utm_campaign)">
                <input
                  className={fieldCls}
                  value={campaign}
                  placeholder={target?.campaign}
                  onChange={(e) => setCampaign(campaignSlug(e.target.value))}
                />
              </FieldLabel>
              <FieldLabel label="Variant (utm_content, optional)">
                <input
                  className={fieldCls}
                  value={content}
                  placeholder="e.g. story-1, poster-a"
                  onChange={(e) => setContent(campaignSlug(e.target.value))}
                />
              </FieldLabel>
            </div>
            <div className="rounded-xl border border-electric/30 bg-electric/5 p-4">
              <p className="text-xs text-muted-foreground">Your tracked link</p>
              <p className="mt-2 break-all font-mono text-sm">{link}</p>
              <div className="mt-3">
                <CopyButton value={link} label="Copy link" />
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="font-display font-semibold">Quick links for every channel</h2>
          <p className="mb-4 mt-1 text-xs text-muted-foreground">
            For “{target?.label}”, campaign “{tags.utm_campaign}”.
          </p>
          {target && <ShareLinks path={target.path} campaign={tags.utm_campaign} />}
        </Card>
      </div>
      <Performance submissions={submissions} />
    </>
  );
}

function Performance({ submissions }: { submissions: Record<string, Row[]> }) {
  const [by, setBy] = useState<"campaign" | "source">("campaign");
  const rows = useMemo(() => {
    const groups = new Map<string, { total: number; forms: Record<string, number> }>();
    for (const form of FORMS)
      for (const row of submissions[form.table] ?? []) {
        const utm = rowUtm(row);
        const key =
          (by === "campaign"
            ? utm["utm_campaign"]
            : [utm["utm_source"], utm["utm_medium"]].filter(Boolean).join(" / ")) ||
          (utm["referrer"] ? "Other websites" : "Direct / untracked");
        const group = groups.get(key) ?? { total: 0, forms: {} };
        group.total += 1;
        group.forms[form.table] = (group.forms[form.table] ?? 0) + 1;
        groups.set(key, group);
      }
    return [...groups.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [submissions, by]);
  const tracked = rows.some(([key]) => !key.startsWith("Direct") && key !== "Other websites");

  return (
    <Card className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="font-display font-semibold">Results</h2>
        <div className="flex gap-1 rounded-lg border border-border p-1 text-xs">
          {(["campaign", "source"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setBy(option)}
              className={cn(
                "rounded-md px-3 py-1.5 capitalize",
                by === option
                  ? "bg-electric text-ink"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              By {option}
            </button>
          ))}
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="p-5">
          <Empty title="No submissions yet." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">
                  {by === "campaign" ? "Campaign" : "Source / medium"}
                </th>
                {FORMS.map((form) => (
                  <th key={form.table} className="px-3 py-3 text-right font-medium">
                    {formLabel(form.table).split(" ")[0]}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([key, group]) => (
                <tr key={key} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{key}</td>
                  {FORMS.map((form) => (
                    <td
                      key={form.table}
                      className="px-3 py-3 text-right tabular-nums text-muted-foreground"
                    >
                      {group.forms[form.table] ?? "–"}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{group.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!tracked && rows.length > 0 && (
        <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Submissions start carrying campaign data once migration 0005 has been run and people
          arrive through tracked links.
        </p>
      )}
    </Card>
  );
}
