import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { LmsShell } from "@/components/lms/LmsShell";
import { MeProvider, lmsError, lmsKeys, useLmsSignOut } from "@/components/lms/session";
import { fieldCls } from "@/components/admin/ui";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Rich, useContent } from "@/lib/content-context";
import { changeMyPassword, getLmsMe } from "@/lib/lms.functions";

export const Route = createFileRoute("/lms")({
  head: () => ({
    meta: [
      { title: "Learning platform — Elite Forums" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LmsLayout,
});

function LmsLayout() {
  const client = useQueryClient();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) setUserId(data.session?.user.id ?? null);
    });
    let current: string | null | undefined;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = session?.user.id ?? null;
      // A different person signed in on this browser: drop the last one's data.
      if (current !== undefined && current !== next) client.removeQueries({ queryKey: ["lms"] });
      current = next;
      setUserId(next);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [client]);

  return (
    <div className="min-h-svh bg-background text-foreground">
      {userId === undefined ? (
        <Centered>
          <Loader2 className="h-5 w-5 animate-spin text-electric" />
        </Centered>
      ) : userId ? (
        <SignedIn key={userId} />
      ) : (
        <SignIn />
      )}
      <Toaster position="top-right" />
    </div>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return <div className="flex min-h-svh items-center justify-center px-5">{children}</div>;
}

function SignedIn() {
  const me = useQuery({ queryKey: lmsKeys.me, queryFn: () => getLmsMe(), retry: 1 });
  const signOut = useLmsSignOut();

  if (me.isPending)
    return (
      <Centered>
        <Loader2 className="h-5 w-5 animate-spin text-electric" />
      </Centered>
    );
  if (me.isError)
    return (
      <Notice title="You can't open the learning platform" body={lmsError(me.error)}>
        <Button variant="outline" onClick={() => void me.refetch()}>
          Try again
        </Button>
        <Button variant="ghost" onClick={() => void signOut()}>
          Sign out
        </Button>
      </Notice>
    );
  if (me.data.setupRequired)
    return (
      <Notice
        title="One step before the LMS opens"
        body="The learning platform's database tables don't exist yet. Open the Supabase SQL editor, run supabase/migrations/0007_lms.sql, then reload this page."
      >
        <Button variant="brand" onClick={() => window.location.reload()}>
          Reload
        </Button>
        <Button variant="ghost" onClick={() => void signOut()}>
          Sign out
        </Button>
      </Notice>
    );
  if (me.data.profile?.must_change_password) return <ChooseNewPassword />;

  return (
    <MeProvider value={me.data}>
      <LmsShell>
        <Outlet />
      </LmsShell>
    </MeProvider>
  );
}

function Notice({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <Centered>
      <div className="max-w-md text-center">
        <Logo className="mx-auto mb-8 h-8" />
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>
      </div>
    </Centered>
  );
}

function PasswordInput({
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className={`${fieldCls} pr-11`}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function SignIn() {
  const c = useContent("lms");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError)
      setError(
        /invalid login/i.test(authError.message)
          ? "That email and password don't match. Check the details you were sent."
          : /banned/i.test(authError.message)
            ? "Your access has been paused. Contact the Elite Forums team."
            : authError.message,
      );
    setBusy(false);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand p-12 text-ink lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" />
        <Logo variant="ink" className="relative h-9 self-start" />
        <div className="relative">
          <p className="eyebrow">{c.t("signin.eyebrow")}</p>
          <h1 className="display-xl mt-4 max-w-md text-5xl xl:text-6xl [&_.text-brand]:bg-none [&_.text-brand]:text-ink/50">
            <Rich text={c.t("signin.title")} />
          </h1>
          <p className="mt-6 max-w-sm text-sm font-medium leading-6">{c.t("signin.intro")}</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-16">
        <form className="w-full max-w-sm" onSubmit={signIn}>
          <Logo className="mb-10 h-8 lg:hidden" />
          <p className="eyebrow text-electric">{c.t("signin.eyebrow")}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold">Sign in</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground lg:hidden">
            {c.t("signin.intro")}
          </p>
          <label className="mt-8 block space-y-1.5 text-xs font-medium">
            Email
            <input
              type="email"
              className={fieldCls}
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="mt-4 block space-y-1.5 text-xs font-medium">
            Password
            <PasswordInput
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p
              className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm"
              role="alert"
            >
              {error}
            </p>
          )}
          <Button className="mt-6 w-full" size="lg" variant="brand" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"} <ArrowUpRight />
          </Button>
          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            {c.t("signin.help")}
          </p>
          <a
            href="/"
            className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Back to the website
          </a>
        </form>
      </div>
    </div>
  );
}

/** First sign-in with a password the admin chose: the learner picks their own. */
function ChooseNewPassword() {
  const client = useQueryClient();
  const signOut = useLmsSignOut();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError("");
    try {
      await changeMyPassword({ data: { password } });
      toast.success("Password saved. Welcome aboard!");
      await client.invalidateQueries({ queryKey: lmsKeys.me });
    } catch (err) {
      setError(lmsError(err, "Unable to save your password."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Centered>
      <form className="w-full max-w-sm" onSubmit={save}>
        <Logo className="mb-10 h-8" />
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-electric/10 text-electric">
          <KeyRound className="h-5 w-5" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold">Choose your own password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You signed in with a temporary password. Pick a new one only you know before you continue.
        </p>
        <label className="mt-8 block space-y-1.5 text-xs font-medium">
          New password
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </label>
        <label className="mt-4 block space-y-1.5 text-xs font-medium">
          Repeat it
          <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" />
        </label>
        {error && (
          <p
            className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm"
            role="alert"
          >
            {error}
          </p>
        )}
        <Button className="mt-6 w-full" size="lg" variant="brand" disabled={busy}>
          {busy ? "Saving…" : "Save and continue"}
        </Button>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-4 block w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Sign out
        </button>
      </form>
    </Centered>
  );
}
