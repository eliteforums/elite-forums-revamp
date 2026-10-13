import { Fragment, createContext, useContext, useMemo, type ReactNode } from "react";
import { contentReader, type ContentOverrides, type ContentReader } from "./site-content";
import founder from "@/assets/founder.webp";
import hackathon from "@/assets/hackathon.webp";
import students from "@/assets/students.webp";

const ContentContext = createContext<ContentOverrides>({});

export function SiteContentProvider({
  overrides,
  children,
}: {
  overrides: ContentOverrides;
  children: ReactNode;
}) {
  return <ContentContext.Provider value={overrides}>{children}</ContentContext.Provider>;
}

/** Editable copy for one page, as declared in `site-content.ts`. */
export function useContent(page: string): ContentReader {
  const overrides = useContext(ContentContext);
  return useMemo(() => contentReader(page, overrides), [page, overrides]);
}

const BUILT_IN: Record<string, string> = { students, founder, hackathon };

/** A built-in photo name or an image link; falls back to the given built-in photo. */
export function resolveImage(value: string, fallback: keyof typeof BUILT_IN | string): string {
  const chosen = value.trim();
  return BUILT_IN[chosen] ?? (chosen || BUILT_IN[fallback] || fallback);
}

/**
 * Renders "rich" copy: each new line becomes a line break and *asterisks* mark
 * words shown in the brand colour.
 */
export function Rich({ text, breakClassName }: { text: string; breakClassName?: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              <br className={breakClassName} />{" "}
            </>
          )}
          {line.split(/(\*[^*]+\*)/g).map((part, j) =>
            part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
              <span key={j} className="text-brand">
                {part.slice(1, -1)}
              </span>
            ) : (
              <Fragment key={j}>{part}</Fragment>
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}
