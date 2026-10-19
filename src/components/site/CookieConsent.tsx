import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import { useContent } from "@/lib/content-context";
const STORAGE_KEY = "elite-forums-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const c = useContent("global");

  useEffect(() => {
    setVisible(window.localStorage.getItem(STORAGE_KEY) === null);
  }, []);

  function saveChoice(choice: "accepted" | "essential-only") {
    window.localStorage.setItem(STORAGE_KEY, choice);
    window.dispatchEvent(new Event("elite-forums-cookie-consent"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface p-4 shadow-2xl sm:inset-x-4 sm:p-5 md:inset-x-auto md:right-6 md:max-w-lg"
    >
      <p className="eyebrow text-electric">{c.t("cookies.eyebrow")}</p>
      <h2 className="mt-2 text-lg text-foreground">{c.t("cookies.title")}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {c.t("cookies.body")} Read our{" "}
        <Link to="/cookies" className="text-foreground underline underline-offset-2">
          Cookie Policy
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-foreground underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button type="button" variant="brand" size="sm" onClick={() => saveChoice("accepted")}>
          {c.t("cookies.accept")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => saveChoice("essential-only")}
        >
          {c.t("cookies.essential")}
        </Button>
      </div>
    </aside>
  );
}
