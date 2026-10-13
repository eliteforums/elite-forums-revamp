import { CheckCircle2, Loader2 } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import type { z } from "zod";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { flatten, type FieldErrors } from "@/lib/schemas";

export const inputCls =
  "w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-ring/30 aria-[invalid=true]:border-destructive";

export function Field({
  label,
  name,
  error,
  hint,
  optional,
  children,
  className,
}: {
  label: string;
  name: string;
  error?: string | undefined;
  hint?: string | undefined;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={name} className="flex items-baseline justify-between text-sm font-medium">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-muted-foreground">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Honeypot({ name = "website" }: { name?: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Leave empty
        <input type="text" name={name} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function Consent({
  error,
  name = "consent",
  children,
}: {
  error?: string | undefined;
  name?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name={name}
          className="mt-0.5 h-4 w-4 accent-[var(--electric)]"
          aria-invalid={!!error}
        />
        <span>
          {children ?? (
            <>
              I consent to Elite Forums collecting and using these details to respond to me, as
              described in the{" "}
              <Link to="/privacy" className="text-foreground underline underline-offset-2">
                privacy policy
              </Link>
              . I also agree to the{" "}
              <Link to="/terms" className="text-foreground underline underline-offset-2">
                terms of service
              </Link>
              . .
            </>
          )}
        </span>
      </label>
      {error && (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type Submit = (args: { data: never }) => Promise<{ ok: boolean; error?: string }>;

/** Shared submission lifecycle: client validation, duplicate-submit lock, server call. */
export function useFormSubmit<S extends z.ZodTypeAny>(
  schema: S,
  submit: unknown,
  toValues: (fd: FormData) => Record<string, unknown>,
) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const lock = useRef(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current) return;
    const parsed = schema.safeParse(toValues(new FormData(e.currentTarget)));
    if (!parsed.success) {
      setErrors(flatten(parsed.error));
      const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid=true]");
      first?.focus();
      return;
    }
    setErrors({});
    lock.current = true;
    setState("loading");
    try {
      const res = await (submit as Submit)({ data: parsed.data as never });
      if (res.ok) setState("success");
      else {
        setState("error");
        setMessage(res.error ?? "Something went wrong.");
      }
    } catch {
      setState("error");
      setMessage("We couldn't reach the server. Check your connection and try again.");
    } finally {
      lock.current = false;
    }
  }
  return { errors, state, message, onSubmit };
}

export function SubmitRow({
  state,
  label,
  message,
}: {
  state: string;
  label: string;
  message?: string;
}) {
  return (
    <div className="space-y-3">
      {state === "error" && (
        <p
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm"
          role="alert"
        >
          {message}
        </p>
      )}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        disabled={state === "loading"}
        className="w-full sm:w-auto"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="animate-spin" /> Sending…
          </>
        ) : (
          label
        )}
      </Button>
    </div>
  );
}

export function Success({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="panel bg-brand p-8 text-ink md:p-12" role="status">
      <CheckCircle2 className="h-10 w-10" />
      <h3 className="display-xl mt-6 text-3xl md:text-4xl">{title}</h3>
      <div className="mt-4 max-w-xl text-ink/80">{children}</div>
    </div>
  );
}

export const val = (fd: FormData, k: string) => String(fd.get(k) ?? "");
export const chk = (fd: FormData, k: string) => fd.get(k) === "on";
