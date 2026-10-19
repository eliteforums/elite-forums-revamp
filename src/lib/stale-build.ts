/**
 * After a new deployment, a tab opened before it still asks for the previous
 * build's page files, which no longer exist. Navigating then fails with a
 * "module failed to load" error. Loading the address afresh picks up the new
 * build, so we do that — at most once a minute per address, so a genuine
 * outage cannot cause a reload loop.
 */

const STORAGE_KEY = "ef-stale-build-reload";

export function isStaleBuildError(error: unknown): boolean {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error ?? "");
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS|ChunkLoadError|Loading (?:CSS )?chunk|is not a valid JavaScript MIME type/i.test(
    message,
  );
}

/** Reload the page at `href`; returns false when it already tried recently. */
export function reloadForNewBuild(href = window.location.href): boolean {
  try {
    const last = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}") as {
      href?: string;
      at?: number;
    };
    if (last.href === href && last.at && Date.now() - last.at < 60_000) return false;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ href, at: Date.now() }));
  } catch {
    /* Without storage, still reload once; the browser keeps us from looping fast. */
  }
  window.location.assign(href);
  return true;
}
