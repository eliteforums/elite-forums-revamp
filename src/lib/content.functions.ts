import { createServerFn } from "@tanstack/react-start";
import type { FormOverrides } from "./forms";
import type { ContentOverrides } from "./site-content";

/**
 * Administrator edits to the site copy (keyed by page) and to the forms. The
 * site always renders: if the database is unreachable or empty, pages and
 * forms fall back to their defaults.
 */
export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ content: ContentOverrides; forms: Record<string, never> }> => {
    const { loadSiteData } = await import("./site-data.server");
    const data = await loadSiteData();
    // Form settings are plain JSON; typed loosely so they can cross the network.
    return data as unknown as { content: ContentOverrides; forms: Record<string, never> };
  },
);

export type SiteData = { content: ContentOverrides; forms: FormOverrides };
