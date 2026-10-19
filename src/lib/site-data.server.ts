import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { FORM_IDS, type FormOverrides } from "./forms";
import { CONTENT_PAGES, type ContentOverrides, type ContentValue } from "./site-content";

const PAGE_IDS = new Set(CONTENT_PAGES.map((page) => page.id));
const FORM_KEYS = new Set<string>(FORM_IDS.map((id) => `form.${id}`));
const CACHE_MS = 30_000;

export type SiteData = { content: ContentOverrides; forms: FormOverrides };
let cache: { at: number; value: SiteData } | undefined;

export function clearSiteDataCache() {
  cache = undefined;
}

/**
 * Administrator edits — page copy and form settings — from `site_content`.
 * Falls back to the last good copy (or nothing, meaning defaults) on failure.
 */
export async function loadSiteData(): Promise<SiteData> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  try {
    const { data, error } = await supabaseAdmin.from("site_content").select("key, value");
    if (error) throw new Error(error.message);
    const value: SiteData = { content: {}, forms: {} };
    for (const row of data ?? []) {
      if (!row.value || typeof row.value !== "object") continue;
      if (PAGE_IDS.has(row.key)) value.content[row.key] = row.value as Record<string, ContentValue>;
      else if (FORM_KEYS.has(row.key))
        value.forms[row.key.slice(5) as keyof FormOverrides] = row.value;
    }
    cache = { at: Date.now(), value };
    return value;
  } catch (error) {
    console.error("Unable to load site content", error instanceof Error ? error.message : error);
    return cache?.value ?? { content: {}, forms: {} };
  }
}
