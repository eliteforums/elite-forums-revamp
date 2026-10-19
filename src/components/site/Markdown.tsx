import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders the small formatting language used by long editable text (legal
 * pages and similar): "## " and "### " headings, "- " bullets, "1. " numbered
 * items, blank lines between paragraphs, **bold** and [link text](/path).
 */

/** **bold**, [text](link) and bare links within one line. */
export function Inline({ text }: { text: string }) {
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
        if (href) {
          const external = !href.startsWith("/") && !href.startsWith("#");
          return (
            <a
              key={i}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="break-words text-foreground underline underline-offset-2 hover:text-electric"
            >
              {link ? link[1] : part}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

type Node = { kind: "h2" | "h3" | "p"; text: string } | { kind: "ul" | "ol"; items: string[] };

function parse(text: string): Node[] {
  const nodes: Node[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) nodes.push({ kind: "p", text: paragraph.join(" ") });
    paragraph = [];
  };
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    const last = nodes[nodes.length - 1];
    if (!line) {
      flush();
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    const bullet = line.match(/^[-•*]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (heading) {
      flush();
      nodes.push({ kind: heading[1] === "##" ? "h2" : "h3", text: heading[2]! });
    } else if (bullet || numbered) {
      flush();
      const kind = bullet ? "ul" : "ol";
      const item = (bullet ?? numbered)![1]!;
      if (last && last.kind === kind) last.items.push(item);
      else nodes.push({ kind, items: [item] });
    } else paragraph.push(line);
  }
  flush();
  return nodes;
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const nodes = parse(text);
  const out: ReactNode[] = [];
  nodes.forEach((node, i) => {
    if (node.kind === "h2")
      out.push(
        <h2
          key={i}
          className="border-t border-border pt-8 text-2xl text-foreground first:border-0 first:pt-0"
        >
          <Inline text={node.text} />
        </h2>,
      );
    else if (node.kind === "h3")
      out.push(
        <h3 key={i} className="pt-2 text-lg font-medium text-foreground">
          <Inline text={node.text} />
        </h3>,
      );
    else if (node.kind === "p")
      out.push(
        <p key={i}>
          <Inline text={node.text} />
        </p>,
      );
    else if (node.kind === "ul" || node.kind === "ol") {
      const List = node.kind;
      out.push(
        <List
          key={i}
          className={cn("space-y-2 pl-5", node.kind === "ul" ? "list-disc" : "list-decimal")}
        >
          {node.items.map((item, j) => (
            <li key={j}>
              <Inline text={item} />
            </li>
          ))}
        </List>,
      );
    }
  });
  return <div className={cn("reading-copy space-y-5", className)}>{out}</div>;
}
