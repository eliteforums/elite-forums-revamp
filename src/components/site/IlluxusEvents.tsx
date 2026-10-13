import { useEffect, useRef } from "react";

const ILLUXUS_SCRIPT_ID = "illuxus-events-embed";

export function IlluxusEvents() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (document.getElementById(ILLUXUS_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = ILLUXUS_SCRIPT_ID;
    script.src = "https://illuxus.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      container?.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="my-events"
      data-org="bm"
      data-filter="upcoming"
      data-theme="auto"
      aria-label="Upcoming events"
      className="illuxus-events-embed min-h-24"
    />
  );
}
