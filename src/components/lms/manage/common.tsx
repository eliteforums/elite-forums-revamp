import { Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { fieldCls } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { orderLessons, percent, type LmsCohort, type LmsProgram } from "@/lib/lms";
import { lmsError, useLmsRefresh, type LmsAdminData } from "../session";

export type AdminData = LmsAdminData;

/** Runs a change, reports it, then reloads LMS data everywhere. */
export function useAction() {
  const refresh = useLmsRefresh();
  const [busy, setBusy] = useState(false);
  const run = async <T,>(
    task: () => Promise<T>,
    success?: string | ((result: T) => string | null),
  ): Promise<T | undefined> => {
    setBusy(true);
    try {
      const result = await task();
      const message = typeof success === "function" ? success(result) : success;
      if (message) toast.success(message);
      await refresh();
      return result;
    } catch (error) {
      toast.error(lmsError(error));
      return undefined;
    } finally {
      setBusy(false);
    }
  };
  return { run, busy };
}

/** Lookups and per-learner progress derived once from the admin data. */
export function useLookups(data: AdminData) {
  return useMemo(() => {
    const programs = new Map(data.programs.map((p) => [p.id, p]));
    const cohorts = new Map(data.cohorts.map((c) => [c.id, c]));
    const profiles = new Map(data.profiles.map((p) => [p.id, p]));
    const lessons = new Map(data.lessons.map((l) => [l.id, l]));
    const lessonTotals = new Map<string, number>();
    for (const program of data.programs)
      lessonTotals.set(
        program.id,
        orderLessons(
          data.modules.filter((m) => m.program_id === program.id),
          data.lessons.filter((l) => l.program_id === program.id && l.published),
        ).length,
      );
    const completed = new Map(
      data.progress.map((row) => [`${row.user_id}|${row.program_id}`, row]),
    );
    const progressOf = (userId: string, programId: string) => {
      const total = lessonTotals.get(programId) ?? 0;
      const done = Math.min(completed.get(`${userId}|${programId}`)?.completed ?? 0, total);
      return { done, total, percent: percent(done, total) };
    };
    const enrollmentsOf = (userId: string) => data.enrollments.filter((e) => e.user_id === userId);
    return { programs, cohorts, profiles, lessons, lessonTotals, progressOf, enrollmentsOf };
  }, [data]);
}

export type Lookups = ReturnType<typeof useLookups>;

export function SearchBox({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block min-w-0 flex-1 sm:max-w-xs">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        className={cn(fieldCls, "pl-9")}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  indeterminate = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  indeterminate?: boolean;
}) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      ref={(element) => {
        if (element) element.indeterminate = indeterminate && !checked;
      }}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      className="h-4 w-4 shrink-0 cursor-pointer rounded border-input accent-[var(--electric)]"
    />
  );
}

/** "programme" or "programme:cohort" — one select for either choice. */
export function TargetSelect({
  programs,
  cohorts,
  value,
  onChange,
  emptyLabel = "No programme",
  className,
}: {
  programs: LmsProgram[];
  cohorts: LmsCohort[];
  value: string;
  onChange: (value: string) => void;
  emptyLabel?: string;
  className?: string;
}) {
  return (
    <select
      className={cn(fieldCls, className)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{emptyLabel}</option>
      {programs.map((program) => {
        const own = cohorts.filter((c) => c.program_id === program.id && c.status !== "archived");
        return (
          <optgroup key={program.id} label={program.title}>
            <option value={program.id}>{program.title} — no cohort</option>
            {own.map((cohort) => (
              <option key={cohort.id} value={`${program.id}:${cohort.id}`}>
                {program.title} — {cohort.name}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}

export const splitTarget = (value: string) => {
  const [programId, cohortId] = value.split(":");
  return { programId: programId || null, cohortId: cohortId || null };
};

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>;
}

/** Sticky bar for actions on the ticked rows. */
export function SelectionBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode;
}) {
  if (!count) return null;
  return (
    <div className="sticky top-16 z-20 mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-electric/40 bg-background/95 px-3 py-2 shadow-lg backdrop-blur lg:top-4">
      <span className="px-1 text-sm font-medium">{count} selected</span>
      <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">
        Clear
      </button>
      <div className="ml-auto flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function useSelection(ids: string[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const visible = ids.filter((id) => selected.has(id));
  return {
    selected,
    ids: [...selected],
    count: selected.size,
    has: (id: string) => selected.has(id),
    toggle: (id: string, on: boolean) =>
      setSelected((current) => {
        const next = new Set(current);
        if (on) next.add(id);
        else next.delete(id);
        return next;
      }),
    allChecked: ids.length > 0 && visible.length === ids.length,
    someChecked: visible.length > 0,
    toggleAll: (on: boolean) =>
      setSelected((current) => {
        const next = new Set(current);
        for (const id of ids) {
          if (on) next.add(id);
          else next.delete(id);
        }
        return next;
      }),
    clear: () => setSelected(new Set()),
  };
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "px-3 py-2.5 text-left text-xs font-medium text-muted-foreground first:pl-4 last:pr-4",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <td className={cn("px-3 py-3 align-middle first:pl-4 last:pr-4", className)}>{children}</td>
  );
}

export const todayIso = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const confirmAction = (message: string) =>
  typeof window === "undefined" ? false : window.confirm(message);
