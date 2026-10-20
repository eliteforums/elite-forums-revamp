import { CheckCircle2, Copy, Download, Mail, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { downloadFile, toCsv } from "@/lib/lms";
import type { CreatedUser } from "@/lib/lms-admin.functions";
import { cn } from "@/lib/utils";

const loginUrl = () => `${typeof window === "undefined" ? "" : window.location.origin}/lms`;

export function welcomeMessage(user: CreatedUser) {
  return [
    `Hi ${user.fullName.split(/\s+/)[0]},`,
    "",
    "Your Elite Forums learning account is ready.",
    "",
    `Sign in: ${loginUrl()}`,
    `Email: ${user.email}`,
    `Temporary password: ${user.password}`,
    "",
    "You'll be asked to choose your own password the first time you sign in.",
    "",
    "— Team Elite Forums",
  ].join("\n");
}

const OUTCOMES: Record<CreatedUser["outcome"], { label: string; tone: string }> = {
  created: { label: "Ready", tone: "text-electric" },
  existing: { label: "Already a learner", tone: "text-cyan" },
  linked: { label: "Existing login", tone: "text-cyan" },
  failed: { label: "Failed", tone: "text-destructive" },
};

/** Login details after creating accounts or resetting passwords. Shown once only. */
export function CredentialsDrawer({
  title,
  results,
  onClose,
}: {
  title: string;
  results: CreatedUser[];
  onClose: () => void;
}) {
  const withPasswords = results.filter((row) => row.password);
  const failed = results.filter((row) => row.outcome === "failed").length;

  const download = () =>
    downloadFile(
      `elite-forums-logins-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv([
        ["Name", "Email", "Password", "Login link", "Result", "Note"],
        ...results.map((row) => [
          row.fullName,
          row.email,
          row.password ?? "",
          loginUrl(),
          OUTCOMES[row.outcome].label,
          row.message ?? "",
        ]),
      ]),
    );

  return (
    <Drawer
      title={title}
      subtitle={`${withPasswords.length} with new passwords${failed ? ` · ${failed} failed` : ""}`}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          {withPasswords.length > 0 && (
            <Button
              variant="outline"
              onClick={() =>
                void navigator.clipboard
                  .writeText(withPasswords.map(welcomeMessage).join("\n\n——————\n\n"))
                  .then(() => toast.success("Welcome messages copied."))
              }
            >
              <Copy /> Copy all messages
            </Button>
          )}
          <Button variant="brand" onClick={download}>
            <Download /> Download CSV
          </Button>
        </div>
      }
    >
      {withPasswords.length > 0 && (
        <p className="mb-5 flex gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm leading-6">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          Save these passwords now: download the CSV or copy the messages. They can't be shown
          again. If one is lost, reset that learner's password.
        </p>
      )}
      <ul className="divide-y divide-border rounded-xl border border-border">
        {results.map((row) => (
          <li key={row.email} className="flex flex-wrap items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{row.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">{row.email}</p>
              {row.password && (
                <p className="mt-1.5 inline-block rounded-md bg-muted px-2 py-1 font-mono text-sm">
                  {row.password}
                </p>
              )}
              {row.message && <p className="mt-1 text-xs text-muted-foreground">{row.message}</p>}
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                OUTCOMES[row.outcome].tone,
              )}
            >
              {row.outcome === "created" && <CheckCircle2 className="h-3.5 w-3.5" />}
              {OUTCOMES[row.outcome].label}
            </span>
            {row.password && (
              <div className="flex w-full gap-1.5 sm:w-auto">
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Copy message for ${row.fullName}`}
                  onClick={() =>
                    void navigator.clipboard
                      .writeText(welcomeMessage(row))
                      .then(() => toast.success("Message copied."))
                  }
                >
                  <Copy />
                </Button>
                <Button asChild size="sm" variant="ghost" aria-label={`Email ${row.fullName}`}>
                  <a
                    href={`mailto:${row.email}?subject=${encodeURIComponent(
                      "Your Elite Forums learning account",
                    )}&body=${encodeURIComponent(welcomeMessage(row))}`}
                  >
                    <Mail />
                  </a>
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Drawer>
  );
}
