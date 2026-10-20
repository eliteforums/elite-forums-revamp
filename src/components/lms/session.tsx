import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getLmsHome, getLmsMe, getLmsProgram } from "@/lib/lms.functions";
import { getLmsAdmin } from "@/lib/lms-admin.functions";

export type LmsMe = Awaited<ReturnType<typeof getLmsMe>>;
export type LmsHome = Awaited<ReturnType<typeof getLmsHome>>;
export type LmsProgramData = Awaited<ReturnType<typeof getLmsProgram>>;
export type LmsAdminData = Awaited<ReturnType<typeof getLmsAdmin>>;

export const lmsKeys = {
  me: ["lms", "me"] as const,
  home: ["lms", "home"] as const,
  program: (id: string) => ["lms", "program", id] as const,
  admin: ["lms", "admin"] as const,
};

const MeContext = createContext<LmsMe | null>(null);
export const MeProvider = MeContext.Provider;

export function useLmsMe(): LmsMe {
  const me = useContext(MeContext);
  if (!me) throw new Error("useLmsMe must be used inside the LMS layout");
  return me;
}

export const useLmsHome = () =>
  useQuery({ queryKey: lmsKeys.home, queryFn: () => getLmsHome(), staleTime: 30_000 });

export const useLmsProgram = (programId: string) =>
  useQuery({
    queryKey: lmsKeys.program(programId),
    queryFn: () => getLmsProgram({ data: { programId } }),
    staleTime: 30_000,
    retry: (count, error) => !String(error).includes("NOT_FOUND") && count < 2,
  });

export const useLmsAdmin = () =>
  useQuery({ queryKey: lmsKeys.admin, queryFn: () => getLmsAdmin(), staleTime: 15_000 });

/** Refreshes LMS data after a change; admins' edits can affect every learner view. */
export function useLmsRefresh() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: ["lms"] });
}

export function useLmsSignOut() {
  const client = useQueryClient();
  return async () => {
    await supabase.auth.signOut();
    client.removeQueries({ queryKey: ["lms"] });
  };
}

/** Server errors arrive as "NO_ACCESS: …" or "Unable to …: …"; show the readable part. */
export const lmsError = (error: unknown, fallback = "Something went wrong.") => {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.replace(/^(NO_ACCESS|NOT_FOUND):\s*/, "") || fallback;
};
