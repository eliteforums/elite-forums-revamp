import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "elite-forums-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

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
      className="fixed inset-x-4 bottom-4 z-[60] rounded-2xl border border-border bg-surface p-5 shadow-2xl md:inset-x-auto md:right-6 md:max-w-lg"
    >
      <p className="eyebrow text-electric">Your privacy choices</p>
      <h2 className="mt-2 text-lg text-foreground">Cookies on Elite Forums</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        We use essential browser storage for security, authentication and form operation. Optional
        analytics help us understand page usage. Read our{" "}
        <Link to="/cookies" className="text-foreground underline underline-offset-2">
          Cookie Policy
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-foreground underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="brand" size="sm" onClick={() => saveChoice("accepted")}>
          Accept optional cookies
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => saveChoice("essential-only")}
        >
          Essential only
        </Button>
      </div>
    </aside>
  );
}
