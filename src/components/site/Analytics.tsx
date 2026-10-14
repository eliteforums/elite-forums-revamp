import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const MEASUREMENT_ID = "G-RZY47VR9T3";
const CONSENT_KEY = "elite-forums-cookie-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    eliteForumsAnalyticsConfigured?: boolean;
    eliteForumsAnalyticsConsentGranted?: boolean;
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
  if (!window.gtag) {
    console.error("Google Analytics was not initialized in the document head.");
    return;
  }

  if (!window.eliteForumsAnalyticsConsentGranted) {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.eliteForumsAnalyticsConsentGranted = true;
  }

  if (!window.eliteForumsAnalyticsConfigured) {
    window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
    window.eliteForumsAnalyticsConfigured = true;
  }

  window.gtag("event", "page_view", {
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
  });
}
