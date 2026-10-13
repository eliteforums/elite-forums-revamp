import { Fragment } from "react";

type Block = { kind: "heading"; text: string } | { kind: "paragraph"; lines: string[] };

const EMOJI = /^\p{Extended_Pictographic}/u;

/**
 * Event descriptions are typed as plain text in the admin console. This reads
 * the structure people naturally give them — blank lines between paragraphs
 * and emoji-led lines as section titles. Keep ordinary short lines as body
 * copy; guessing at headings makes descriptions look inconsistent.
 */
export function parseDescription(text: string): Block[] {
  return text
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((chunk) =>
      chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0)
    .map((lines): Block => {
      if (lines.length === 1) {
        const first = lines[0]!;
        if (EMOJI.test(first) && first.length <= 60) return { kind: "heading", text: first };
        return { kind: "paragraph", lines };
      }
      return { kind: "paragraph", lines };
    });
}

/** The opening paragraph, for the page header and search-engine description. */
export function descriptionLead(text: string, title: string): string {
  const paragraph = parseDescription(text).find(
    (block) =>
      block.kind === "paragraph" &&
      block.lines.join(" ").length > 60 &&
      !title.toLowerCase().startsWith(block.lines[0]!.toLowerCase()),
  );
  const lead = paragraph?.kind === "paragraph" ? paragraph.lines.join(" ") : text.trim();
  return lead.length > 260 ? `${lead.slice(0, 257).replace(/\s+\S*$/, "")}…` : lead;
}

const withBreaks = (lines: string[]) =>
  lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));

export function EventDescription({ text, title }: { text: string; title: string }) {
  // A first line that only repeats the page title adds nothing under it.
  const blocks = parseDescription(text).filter(
    (block, i) =>
      !(
        i === 0 &&
        block.kind === "heading" &&
        title.toLowerCase().startsWith(block.text.toLowerCase())
      ),
  );
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.kind === "heading")
          return (
            <h3
              key={i}
              className="border-t border-border pt-8 font-display text-xl font-medium text-foreground first:border-0 first:pt-0 md:text-2xl [&:not(:first-child)]:mt-10"
            >
              {block.text}
            </h3>
          );
        return (
          <p key={i} className="max-w-prose text-base leading-8 text-muted-foreground">
            {withBreaks(block.lines)}
          </p>
        );
      })}
    </div>
  );
}
