import { z } from "zod";
import { SITE_URL } from "./metadata";

/**
 * Campaign (UTM) attribution. When someone lands on the site from a tagged
 * link, the tags are kept for the rest of their visit (session storage only)
 * and sent with any form they submit, so the admin console can show which
 * campaign brought each registration or application.
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

const STORAGE_KEY = "ef-attribution";

const text = z.string().trim().max(300).optional();
export const attributionSchema = z
  .object({
    utm_source: text,
    utm_medium: text,
    utm_campaign: text,
    utm_term: text,
    utm_content: text,
    landing_page: text,
    referrer: text,
  })
  .partial()
  .catch({});
export type Attribution = z.infer<typeof attributionSchema>;

function read(): Attribution {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? attributionSchema.parse(JSON.parse(stored)) : {};
  } catch {
    return {};
  }
}

/** Record campaign tags from the current address. Call on every page view. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const tags = Object.fromEntries(
      UTM_KEYS.filter((key) => params.get(key)).map((key) => [key, params.get(key)!.slice(0, 300)]),
    );
    const current = read();
    const referrer =
      document.referrer && !document.referrer.startsWith(window.location.origin)
        ? document.referrer.slice(0, 300)
        : undefined;
    // A new tagged link replaces the old campaign; otherwise keep the first touch.
    if (Object.keys(tags).length > 0 || !current.landing_page) {
      const next: Attribution = {
        ...(Object.keys(tags).length > 0 ? tags : current),
        landing_page: window.location.pathname.slice(0, 300),
        ...(referrer ? { referrer } : current.referrer ? { referrer: current.referrer } : {}),
      };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    /* Storage can be unavailable (private mode); attribution is best-effort. */
  }
}

/** Attribution to send with a form submission. */
export function currentAttribution(): Attribution {
  return typeof window === "undefined" ? {} : read();
}

/** Build a tagged link. Existing query parameters on the address are kept. */
export function buildUtmUrl(base: string, tags: Partial<Record<UtmKey, string>>): string {
  const url = new URL(base, SITE_URL);
  for (const key of UTM_KEYS) {
    const value = tags[key]?.trim();
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

/**
 * Outbound links to partner registration pages carry the visitor's campaign,
 * or else credit the Elite Forums website, without overriding tags already on
 * the link.
 */
export function tagOutboundLink(href: string, campaign: string): string {
  try {
    const url = new URL(href);
    if (UTM_KEYS.some((key) => url.searchParams.has(key))) return href;
    const visitor = currentAttribution();
    const tags = visitor.utm_source
      ? visitor
      : { utm_source: "eliteforums.in", utm_medium: "referral", utm_campaign: campaign };
    for (const key of UTM_KEYS) {
      const value = tags[key];
      if (value) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return href;
  }
}

/** Lowercase-with-hyphens, for campaign names. */
export const campaignSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
