export const SITE_URL = "https://eliteforums.in";

export function pageMeta(title: string, description: string, path = "/") {
  const fullTitle = `${title} — Elite Forums`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "Elite Forums, startup community India, aspiring founders, student entrepreneurs, E-Cell, entrepreneurship events, founder mentorship",
      },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}${path}` },
      { property: "og:site_name", content: "Elite Forums" },
      { property: "og:image", content: `${SITE_URL}/og-image.svg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `${SITE_URL}/og-image.svg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}${path}` }],
  };
}
