import type { z } from "zod";

export type FieldErrors = Record<string, string>;

/** Zod issues as one message per top-level field. */
export function flatten(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const i of err.issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}
