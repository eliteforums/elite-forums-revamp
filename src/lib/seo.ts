import { pageMeta } from "./metadata";
import { CONTENT_PAGES, contentReader, type ContentOverrides } from "./site-content";

type HeadMatch = { routeId: string; loaderData?: unknown };

/** Administrator content edits, loaded once by the root route. */
export function overridesFrom(matches: readonly HeadMatch[]): ContentOverrides {
  const root = matches.find((match) => match.routeId === "__root__");
  return (root?.loaderData ?? {}) as ContentOverrides;
}

/**
 * Head tags for a page, from its "Search & sharing" settings in the admin
 * console (falling back to the defaults in `site-content.ts`).
 */
export function contentMeta(matches: readonly HeadMatch[], pageId: string) {
  const page = CONTENT_PAGES.find((p) => p.id === pageId);
  const c = contentReader(pageId, overridesFrom(matches));
  const image = c.t("seo.image").trim();
  const keywords = c.t("seo.keywords").trim();
  return pageMeta(c.t("seo.title"), c.t("seo.description"), page?.path ?? "/", {
    ...(image ? { image } : {}),
    ...(keywords ? { keywords } : {}),
    ...(c.on("seo.noindex") ? { noIndex: true } : {}),
  });
}
