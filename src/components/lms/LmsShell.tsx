import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BookMarked,
  ClipboardCheck,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Settings2,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";
import { useLmsHome, useLmsMe, useLmsSignOut } from "./session";

export const MANAGE_TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "people", label: "People", icon: Users },
  { id: "programmes", label: "Programmes", icon: BookMarked },
  { id: "cohorts", label: "Cohorts", icon: Layers },
  { id: "reviews", label: "Reviews", icon: ClipboardCheck },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "announcements", label: "Announcements", icon: Megaphone },
] as const;

export type ManageTab = (typeof MANAGE_TABS)[number]["id"];

const itemCls = (active: boolean) =>
  cn(
    "flex min-h-11 touch-manipulation items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
    active
      ? "bg-electric/10 font-medium text-electric"
      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const me = useLmsMe();
  const home = useLmsHome();
  const { pathname, tab } = useRouterState({
    select: (state) => ({
      pathname: state.location.pathname.replace(/\/+$/, "") || "/",
      tab: (state.location.search as { tab?: string }).tab ?? "overview",
    }),
  });
  const programmes = home.data?.programs ?? [];
  const learner = [
    { label: "Home", icon: Home, to: "/lms" },
    { label: "My certificates", icon: Award, to: "/lms/certificates" },
    { label: "Account", icon: UserRound, to: "/lms/account" },
  ] as const;

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-3" aria-label="Learning platform">
      <div className="flex flex-col gap-1">
        {learner.map(({ label, icon: Icon, to }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={itemCls(pathname === to)}
            aria-current={pathname === to ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" /> {label}
          </Link>
        ))}
      </div>
      {programmes.length > 0 && (
        <div>
          <p className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {me.isAdmin && !me.profile ? "Preview programmes" : "My programmes"}
          </p>
          <div className="flex flex-col gap-1">
            {programmes.slice(0, 8).map((program) => {
              const active = pathname.startsWith(`/lms/programs/${program.id}`);
              return (
                <Link
                  key={program.id}
                  to="/lms/programs/$programId"
                  params={{ programId: program.id }}
                  onClick={onNavigate}
                  className={itemCls(active)}
                >
                  <GraduationCap className="h-4 w-4 shrink-0" />
                  <span className="truncate">{program.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {me.isAdmin && (
        <div>
          <p className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Manage
          </p>
          <div className="flex flex-col gap-1">
            {MANAGE_TABS.map(({ id, label, icon: Icon }) => {
              const active = pathname === "/lms/manage" && tab === id;
              return (
                <Link
                  key={id}
                  to="/lms/manage"
                  search={{ tab: id }}
                  onClick={onNavigate}
                  className={itemCls(active)}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" /> {label}
                </Link>
              );
            })}
            <a href="/admin" className={itemCls(false)}>
              <Settings2 className="h-4 w-4 shrink-0" /> Website admin
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function AccountFooter() {
  const me = useLmsMe();
  const signOut = useLmsSignOut();
  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-ink">
          {(me.profile?.full_name || me.email).slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{me.profile?.full_name ?? "Administrator"}</p>
          <p className="truncate text-xs text-muted-foreground" title={me.email}>
            {me.email}
          </p>
        </div>
        {me.isAdmin && (
          <ShieldCheck className="ml-auto h-4 w-4 shrink-0 text-electric" aria-label="Admin" />
        )}
      </div>
      <button onClick={() => void signOut()} className={cn(itemCls(false), "w-full")}>
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/lms" className="flex items-center gap-3">
      <Logo className="h-7" />
      <span className="rounded-md border border-border px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
        Learn
      </span>
    </Link>
  );
}

export function LmsShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.href });
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-svh lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface/60 lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Brand />
        </div>
        <Navigation />
        <AccountFooter />
      </aside>
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Brand />
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-[100dvh] w-[min(20rem,85vw)] flex-col border-r border-border bg-background pb-[env(safe-area-inset-bottom)]">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Navigation onNavigate={() => setOpen(false)} />
            <AccountFooter />
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
    </div>
  );
}
