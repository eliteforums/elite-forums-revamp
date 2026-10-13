export const SITE_URL = "https://eliteforums.in";

export function pageMeta(title: string, description: string, path = "/") {
  const fullTitle = `${title} — Elite Forums`;
  const canonical = `${SITE_URL}${path}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "googlebot", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "Elite Forums" },
      { name: "application-name", content: "Elite Forums" },
      { property: "og:locale", content: "en_IN" },
      {
        name: "keywords",
        content:
          "Elite Forums, startup community India, aspiring founders, student entrepreneurs, E-Cell, entrepreneurship events, founder mentorship",
      },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { property: "og:site_name", content: "Elite Forums" },
      { property: "og:image", content: `${SITE_URL}/og-image.svg` },
      { property: "og:image:alt", content: "Elite Forums founder and startup ecosystem" },
      { property: "og:image:type", content: "image/svg+xml" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `${SITE_URL}/og-image.svg` },
      { name: "twitter:image:alt", content: "Elite Forums founder and startup ecosystem" },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", type: "text/plain", href: `${SITE_URL}/llms.txt` },
    ],
  };
}
