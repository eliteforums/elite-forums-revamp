import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each([
    ["/lms", "/lms/"],
    ["/lms/manage", "/lms/manage"],
    ["/lms/certificates", "/lms/certificates"],
    ["/lms/programs/abc", "/lms/programs/$programId"],
    ["/lms/programs/abc/lessons/def", "/lms/programs/$programId_/lessons/$lessonId"],
    ["/certificates/EF-2026-ABCDEF", "/certificates/$serial"],
  ])("matches the learning platform page for %s", (path, routeId) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    expect(router.matchRoutes(path).at(-1)?.routeId).toBe(routeId);
  });
});
