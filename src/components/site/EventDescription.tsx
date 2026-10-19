import { Check, Clock } from "lucide-react";
import { Fragment, type ReactNode } from "react";

/**
 * Event descriptions are typed as plain text in the admin console. The page
 * gives them structure using only explicit, predictable conventions:
 *
 * - a blank line separates paragraphs;
 * - a line that starts with an emoji, or with "## ", is a section heading;
 * - lines starting with "-", "•" or "*" are bullet points, and three or more
 *   one-line paragraphs in a row are shown as a list;
 * - a block whose first line starts with a time ("10:30 AM …") is a schedule row;
 * - a block made only of "Label: value" lines is a details table;
 * - in a section whose heading mentions speakers, mentors, judges or hosts, a
 *   short line on its own starts a person card ("Session: …" lines become tags);
 * - **double asterisks** make text bold, and links are clickable.
 */

type Line = string;
type Block =
  | { kind: "paragraph"; lines: Line[] }
  | { kind: "list"; items: Line[] }
  | { kind: "schedule"; rows: { time: string; detail: Line[] }[] }
  | { kind: "details"; rows: { label: string; value: string }[] }
  | { kind: "person"; name: string; role: Line[]; bio: Line[]; tags: string[] };
type Section = { heading?: { icon?: string; text: string }; blocks: Block[] };

const EMOJI_START = /^(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)\s*/u;
const BULLET = /^(?:[-•*]|✅|✔️?|→)\s+/u;
const TIME = /^\d{1,2}(?::\d{2})?\s?(?:AM|PM|am|pm)\b/;
const LABELLED = /^([A-Z][^:]{1,32}):\s+(.+)$/;
const PEOPLE_HEADING = /speaker|mentor|judge|host|panel|guest/i;
const ENDS_SENTENCE = /[.!?,;:]$/;

const chunks = (text: string): Line[][] =>
  text
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((chunk) =>
      chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0);

function headingOf(lines: Line[]): Section["heading"] | undefined {
  if (lines.length !== 1) return undefined;
  const line = lines[0]!;
  if (line.startsWith("## ")) return { text: line.slice(3).trim() };
  const emoji = line.match(EMOJI_START);
  if (emoji && line.length <= 70) return { icon: emoji[1]!, text: line.slice(emoji[0].length) };
  return undefined;
}

const isShortName = (line: Line) =>
  line.length <= 40 && !ENDS_SENTENCE.test(line) && !line.includes(": ");

function blocksFor(raw: Line[][], heading?: string): Block[] {
  const people = heading ? PEOPLE_HEADING.test(heading) : false;
  const blocks: Block[] = [];
  let run: Line[] = [];
  // One-line paragraphs only become a list straight after a heading or after a
  // line that introduces one ("…you can explore:"), never mid-way through prose.
  let listContext = Boolean(heading);
  let runIsList = false;
  const flushRun = () => {
    if (runIsList && run.length >= 3) blocks.push({ kind: "list", items: run });
    else for (const line of run) blocks.push({ kind: "paragraph", lines: [line] });
    run = [];
    listContext = false;
  };

  for (const lines of raw) {
    const last = blocks[blocks.length - 1];
    if (people && isShortName(lines[0]!)) {
      flushRun();
      const [name, ...rest] = lines;
      blocks.push({ kind: "person", name: name!, role: rest, bio: [], tags: [] });
      continue;
    }
    if (people && last?.kind === "person" && run.length === 0) {
      if (lines.length === 1 && /^session:\s*/i.test(lines[0]!))
        last.tags.push(lines[0]!.replace(/^session:\s*/i, ""));
      else last.bio.push(...lines);
      continue;
    }
    if (lines.every((line) => BULLET.test(line))) {
      flushRun();
      blocks.push({ kind: "list", items: lines.map((line) => line.replace(BULLET, "")) });
      continue;
    }
    if (TIME.test(lines[0]!)) {
      flushRun();
      const row = { time: lines[0]!, detail: lines.slice(1) };
      if (last?.kind === "schedule") last.rows.push(row);
      else blocks.push({ kind: "schedule", rows: [row] });
      continue;
    }
    if (lines.length >= 2 && lines.every((line) => LABELLED.test(line))) {
      flushRun();
      blocks.push({
        kind: "details",
        rows: lines.map((line) => {
          const [, label, value] = line.match(LABELLED)!;
          return { label: label!, value: value! };
        }),
      });
      continue;
    }
    const line = lines[0]!;
    // A run of "Label: text" items ends at the first line that is not one.
    const breaksLabelledRun =
      run.length >= 2 && run.every((item) => LABELLED.test(item)) && !LABELLED.test(line);
    if (lines.length === 1 && line.length <= 180 && !line.endsWith(":") && !breaksLabelledRun) {
      if (run.length === 0) runIsList = listContext;
      run.push(line);
      continue;
    }
    flushRun();
    blocks.push({ kind: "paragraph", lines });
    listContext = lines[lines.length - 1]!.endsWith(":");
  }
  flushRun();
  return blocks;
}

export function parseDescription(text: string): Section[] {
  const sections: { heading?: Section["heading"]; raw: Line[][] }[] = [{ raw: [] }];
  for (const lines of chunks(text)) {
    const heading = headingOf(lines);
    if (heading) sections.push({ heading, raw: [] });
    else sections[sections.length - 1]!.raw.push(lines);
  }
  return sections
    .map(({ heading, raw }) => ({
      ...(heading ? { heading } : {}),
      blocks: blocksFor(raw, heading?.text),
    }))
    .filter((section) => section.heading || section.blocks.length);
}

/** The opening paragraph, for the page header and search-engine description. */
export function descriptionLead(text: string, title: string): string {
  const lead =
    chunks(text)
      .map((lines) => lines.join(" "))
      .find(
        (paragraph) =>
          paragraph.length > 60 &&
          !EMOJI_START.test(paragraph) &&
          !title.toLowerCase().startsWith(paragraph.toLowerCase()),
      ) ?? text.trim();
  return lead.length > 260 ? `${lead.slice(0, 257).replace(/\s+\S*$/, "")}…` : lead;
}

/** **bold**, [text](link) and bare links. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
          return (
            <strong key={i} className="font-medium text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        const href = link ? link[2]! : /^https?:\/\//.test(part) ? part : null;
        if (href)
          return (
            <a
              key={i}
              href={href}
              target={href.startsWith("/") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="break-words text-electric underline-offset-4 hover:underline"
            >
              {link ? link[1] : part}
            </a>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** A "Label: text" line reads better with its label emphasised. */
function Labelled({ text }: { text: string }) {
  const match = text.match(LABELLED);
  if (!match) return <Inline text={text} />;
  return (
    <>
      <span className="font-medium text-foreground">{match[1]}:</span> <Inline text={match[2]!} />
    </>
  );
}

const joined = (lines: Line[]): ReactNode =>
  lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      <Labelled text={line} />
    </Fragment>
  ));

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "paragraph":
      return <p className="text-base leading-8 text-muted-foreground">{joined(block.lines)}</p>;
    case "list":
      return (
        <ul className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-base leading-7 text-muted-foreground">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric/15">
                <Check className="h-3 w-3 text-electric" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <Labelled text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "schedule":
      return (
        <ol className="overflow-hidden rounded-2xl border border-border">
          {block.rows.map((row, i) => (
            <li
              key={i}
              className="grid gap-1 border-b border-border bg-surface/60 px-5 py-4 last:border-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-electric">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {row.time}
              </span>
              <span className="text-sm leading-6 text-foreground">
                {row.detail.map((line, j) => (
                  <Fragment key={j}>
                    {j > 0 && <br />}
                    <Inline text={line} />
                  </Fragment>
                ))}
              </span>
            </li>
          ))}
        </ol>
      );
    case "details":
      return (
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {block.rows.map((row) => (
            <div key={row.label} className="bg-surface/60 px-5 py-4">
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="mt-1 text-sm font-medium leading-6">
                <Inline text={row.value} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case "person":
      return (
        <div className="rounded-2xl border border-border bg-surface/60 p-5 md:p-6">
          <div className="flex items-center gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand font-display text-lg font-semibold text-ink"
              aria-hidden="true"
            >
              {block.name
                .split(/\s+/)
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-medium leading-6">{block.name}</p>
              {block.role.length > 0 && (
                <p className="mt-0.5 text-sm text-muted-foreground">{joined(block.role)}</p>
              )}
            </div>
          </div>
          {block.bio.length > 0 && (
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{joined(block.bio)}</p>
          )}
          {block.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {block.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-medium text-electric"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      );
  }
}

export function EventDescription({ text, title }: { text: string; title: string }) {
  const lead = descriptionLead(text, title);
  const sections = parseDescription(text).map((section, index) =>
    index === 0 && !section.heading
      ? {
          ...section,
          // The opening lines repeat the title and the header's lead; drop them here.
          blocks: section.blocks.filter(
            (block) =>
              !(
                block.kind === "paragraph" &&
                (title.toLowerCase().startsWith(block.lines.join(" ").toLowerCase()) ||
                  block.lines.join(" ") === lead)
              ),
          ),
        }
      : section,
  );
  const people = (section: Section) => section.blocks.some((block) => block.kind === "person");

  return (
    <div className="space-y-12">
      {sections
        .filter((section) => section.heading || section.blocks.length)
        .map((section, i) => (
          <section key={i} className="space-y-5">
            {section.heading && (
              <h3 className="flex items-center gap-3 font-display text-xl font-medium md:text-2xl">
                {section.heading.icon && (
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-lg"
                    aria-hidden="true"
                  >
                    {section.heading.icon}
                  </span>
                )}
                {section.heading.text}
              </h3>
            )}
            <div className={people(section) ? "grid gap-4 md:grid-cols-2" : "space-y-5"}>
              {section.blocks.map((block, j) => (
                <BlockView key={j} block={block} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
