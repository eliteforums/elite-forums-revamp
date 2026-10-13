import { createServerFn } from "@tanstack/react-start";
import { CONTENT_PAGES, type ContentOverrides, type ContentValue } from "./site-content";

const PAGE_IDS = new Set(CONTENT_PAGES.map((page) => page.id));
const CACHE_MS = 30_000;
let cache: { at: number; value: ContentOverrides } | undefined;

/** Drop the cached copy so the next page view reads fresh content. */
export function clearSiteContentCache() {
  cache = undefined;
}

/**
 * Administrator edits to the site copy, keyed by page. The site always renders:
 * if the database is unreachable or empty, pages fall back to their defaults.
 */
export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentOverrides> => {
    if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin.from("site_content").select("key, value");
      if (error) throw new Error(error.message);
      const value: ContentOverrides = {};
      for (const row of data ?? []) {
        if (PAGE_IDS.has(row.key) && row.value && typeof row.value === "object")
          value[row.key] = row.value as Record<string, ContentValue>;
      }
      cache = { at: Date.now(), value };
      return value;
    } catch (error) {
      console.error("Unable to load site content", error instanceof Error ? error.message : error);
      return cache?.value ?? {};
    }
  },
);
