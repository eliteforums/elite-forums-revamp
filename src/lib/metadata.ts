export const SITE_URL = "https://eliteforums.in";

type PageMetaOptions = {
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  noFollow?: boolean;
};

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function pageMeta(
  title: string,
  description: string,
  path = "/",
  options: PageMetaOptions = {},
) {
  const fullTitle = `${title} — Elite Forums`;
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(options.image ?? "/og-image.png");
  const imageAlt = options.imageAlt ?? "Elite Forums founder and startup ecosystem";
  const robots = options.noIndex
    ? options.noFollow
      ? "noindex, nofollow"
      : "noindex, follow"
    : "index, follow, max-image-preview:large";
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { name: "robots", content: robots },
      { name: "googlebot", content: robots },
      { name: "author", content: "Elite Forums" },
      { name: "application-name", content: "Elite Forums" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: options.type ?? "website" },
      { property: "og:url", content: canonical },
      { property: "og:site_name", content: "Elite Forums" },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: imageAlt },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", type: "text/plain", href: `${SITE_URL}/llms.txt` },
    ],
  };
}
