import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { KeyRound, LogOut, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Card, FieldLabel, fieldCls } from "@/components/admin/ui";
import { PageHeading } from "@/components/lms/bits";
import { lmsError, lmsKeys, useLmsMe, useLmsSignOut } from "@/components/lms/session";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/lms";
import { changeMyPassword, updateMyProfile } from "@/lib/lms.functions";

export const Route = createFileRoute("/lms/account")({
  component: AccountPage,
});

function AccountPage() {
  const me = useLmsMe();
  const signOut = useLmsSignOut();
  return (
    <>
      <PageHeading
        eyebrow="Account"
        title="Your details"
        description="Keep your contact details current so the team can reach you about classes and certificates."
        actions={
          <Button variant="ghost" onClick={() => void signOut()}>
            <LogOut /> Sign out
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {me.profile ? (
          <ProfileForm />
        ) : (
          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold">
              <UserRound className="h-4 w-4 text-electric" /> Administrator
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You're signed in as {me.email}. Administrators don't have a learner profile.
            </p>
          </Card>
        )}
        <PasswordForm />
      </div>
    </>
  );
}

function ProfileForm() {
  const me = useLmsMe();
  const client = useQueryClient();
  const profile = me.profile!;
  const [fullName, setFullName] = useState(profile.full_name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [organisation, setOrganisation] = useState(profile.organisation ?? "");
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await updateMyProfile({ data: { fullName, phone, organisation } });
      await client.invalidateQueries({ queryKey: lmsKeys.me });
      toast.success("Details saved.");
    } catch (error) {
      toast.error(lmsError(error, "Unable to save your details."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 font-display text-base font-semibold">
        <UserRound className="h-4 w-4 text-electric" /> Profile
      </h2>
      <form onSubmit={save} className="mt-5 space-y-4">
        <FieldLabel label="Full name" hint="Printed on your certificates.">
          <input
            className={fieldCls}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </FieldLabel>
        <FieldLabel label="Email" hint="Your login. Ask the team if it needs to change.">
          <input className={fieldCls} value={profile.email} disabled />
        </FieldLabel>
        <FieldLabel label="Phone">
          <input
            className={fieldCls}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="College or startup">
          <input
            className={fieldCls}
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
          />
        </FieldLabel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Member since {formatDate(profile.created_at)}
          </p>
          <Button variant="brand" disabled={busy}>
            {busy ? "Saving…" : "Save details"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) return void toast.error("Use at least 8 characters.");
    if (password !== confirm) return void toast.error("The two passwords don't match.");
    setBusy(true);
    try {
      await changeMyPassword({ data: { password } });
      setPassword("");
      setConfirm("");
      toast.success("Password changed.");
    } catch (error) {
      toast.error(lmsError(error, "Unable to change your password."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="self-start p-6">
      <h2 className="flex items-center gap-2 font-display text-base font-semibold">
        <KeyRound className="h-4 w-4 text-electric" /> Change password
      </h2>
      <form onSubmit={save} className="mt-5 space-y-4">
        <FieldLabel label="New password">
          <input
            className={fieldCls}
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FieldLabel>
        <FieldLabel label="Repeat new password">
          <input
            className={fieldCls}
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </FieldLabel>
        <div className="flex justify-end">
          <Button variant="outline" disabled={busy}>
            {busy ? "Saving…" : "Change password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
