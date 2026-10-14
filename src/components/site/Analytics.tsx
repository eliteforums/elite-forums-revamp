import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const MEASUREMENT_ID = "G-RZY47VR9T3";
const CONSENT_KEY = "elite-forums-cookie-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    eliteForumsAnalyticsConfigured?: boolean;
  }
}

export function Analytics() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const enable = () => {
      if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;
      loadAnalytics(pathname);
    };

    enable();
    window.addEventListener("elite-forums-cookie-consent", enable);
    return () => window.removeEventListener("elite-forums-cookie-consent", enable);
  }, [pathname]);

  return null;
}

function loadAnalytics(pathname: string) {
  const scriptId = "google-analytics-gtag";

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.addEventListener(
      "error",
      () => console.error("Google Analytics failed to load. Check network or content blockers."),
      { once: true },
    );
    document.head.appendChild(script);
  }

  if (!window.eliteForumsAnalyticsConfigured) {
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
    window.eliteForumsAnalyticsConfigured = true;
  }

  window.gtag("event", "page_view", {
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
  });
}
