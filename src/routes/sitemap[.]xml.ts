import { createFileRoute } from "@tanstack/react-router";
import { articlesFrom } from "@/lib/content";
import { getPublicEvents } from "@/lib/admin.functions";
import { getSiteContent } from "@/lib/content.functions";
import { SITE_URL } from "@/lib/metadata";

const STATIC_PATHS = [
  "/",
  "/innovation-lab",
  "/ecosystem",
  "/colleges",
  "/apply",
  "/events",
  "/community",
  "/campus-ambassadors",
  "/network",
  "/resources",
  "/faqs",
  "/contact",
  "/privacy",
  "/terms",
  "/refunds",
  "/cookies",
];

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [events, content] = await Promise.all([getPublicEvents(), getSiteContent()]);
        const articlePaths = articlesFrom(content.content)
          .filter((article) => !article.sample)
          .map((article) => `/resources/${encodeURIComponent(article.slug)}`);
        const eventPaths = events.map((event) => `/events/${encodeURIComponent(event.slug)}`);
        const urls = Array.from(
          new Set(
            [...STATIC_PATHS, ...articlePaths, ...eventPaths].map((path) => `${SITE_URL}${path}`),
          ),
        );
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
          },
        });
      },
    },
  },
});
