import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarCheck, Handshake, Lightbulb } from "lucide-react";
import { LogoMark } from "@/components/site/Logo";
import founder from "@/assets/founder.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elite Forums — Where students meet founders" },
      { name: "description", content: "A community connecting college students, E-Cells and founders through workshops, hackathons and founder conversations." },
      { property: "og:title", content: "Elite Forums — Where students meet founders" },
      { property: "og:description", content: "Workshops, hackathons and founder conversations for college students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const card = "relative overflow-hidden rounded-3xl";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-10 md:h-12" />
      <span className="font-display text-2xl font-bold tracking-tight md:text-4xl">EliteForums</span>
    </span>
  );
}

function Index() {
  return (
    <section className="px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <h1 className="sr-only">Elite Forums — where students meet founders</h1>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[1fr_1.3fr_1fr]">
        {/* Column 1 */}
        <div className="flex flex-col gap-5">
          <div className={`${card} flex h-44 items-center justify-center bg-paper text-ink`}>
            <Wordmark />
          </div>

          <div className={`${card} min-h-[480px] bg-gradient-to-b from-cyan to-turquoise text-ink`}>
            <img src={founder} alt="Silhouette of a young founder" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
            <div className="relative flex justify-between p-6 text-xs">
              <span>eliteforums.in</span><span>© All rights reserved</span>
            </div>
            <p className="absolute left-4 top-16 origin-bottom-left font-display text-6xl font-bold [writing-mode:vertical-rl] rotate-180">EliteForums</p>
            <p className="absolute right-5 top-16 text-[0.65rem] tracking-[0.4em] [writing-mode:vertical-rl]">BUILDING THE NEXT FOUNDERS — 2026</p>
            <div className="absolute bottom-6 left-6 right-6 flex items-end gap-4">
              <LogoMark className="h-12" />
              <p className="font-display text-xl font-bold uppercase leading-tight text-foreground/40">Learn. Build.<br />Connect with<br />founders.</p>
            </div>
          </div>

          <div className={`${card} bg-gradient-to-br from-electric to-turquoise p-6 text-ink`}>
            <div className="flex justify-between">
              <p className="font-display text-7xl font-bold">Aaa</p>
              <p className="text-sm">Typography</p>
            </div>
            <p className="mt-4 text-xs leading-relaxed">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789</p>
            <p className="mt-2 text-right text-sm">Space Grotesk</p>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-5">
          <div className={`${card} h-80 bg-paper`}>
            <svg viewBox="0 0 600 320" className="h-full w-full" aria-hidden="true">
              {[180, 260, 340, 420].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="320" stroke="var(--ink-muted)" strokeOpacity=".3" />)}
              {[0, 60, 120, 180].map((o) => <line key={o} x1={o} y1="320" x2={o + 420} y2="0" stroke="var(--ink-muted)" strokeOpacity=".3" />)}
              {[[180, 260], [260, 340], [340, 420]].map(([a, b], i) => (
                <polygon key={i} points={`${a},${230 - i * 10} ${a},${150 - i * 10} ${b},${90 - i * 10} ${b},${170 - i * 10}`} fill="var(--electric)" fillOpacity=".25" stroke="var(--electric)" />
              ))}
              <text x="300" y="300" fontSize="12" fill="var(--ink-muted)" textAnchor="middle">45° construction grid</text>
            </svg>
          </div>

          <div className={`${card} flex min-h-[620px] flex-col items-center bg-gradient-to-b from-electric to-turquoise px-6 pt-10 text-center text-ink`}>
            <Wordmark className="scale-75" />
            <p className="mt-6 font-display text-2xl font-bold uppercase md:text-4xl">Where students meet</p>
            <p className="font-display text-6xl font-black uppercase leading-none md:text-8xl">Founders</p>
            {[0, 1, 2].map((i) => (
              <p key={i} className="font-display text-6xl font-black uppercase leading-none text-ink/10 md:text-8xl" aria-hidden="true">Founders</p>
            ))}
            <LogoMark mono="ink" className="absolute bottom-24 left-1/2 h-40 -translate-x-1/2" />
            <p className="absolute bottom-6 left-6 text-left text-xs">Building the<br />next generation<br />of founders</p>
            <Link to="/community" className="absolute bottom-6 right-6 inline-flex items-center gap-1 rounded-full bg-ink px-5 py-3 text-sm text-foreground">
              Join now <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-5">
          <div className={`${card} h-80 bg-gradient-to-b from-cyan to-electric`}>
            <div className="p-4 font-display text-6xl font-bold leading-[0.85] text-turquoise/60" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => <p key={i}>Elite</p>)}
            </div>
            <div className="absolute -bottom-6 -right-6 left-24 top-12 flex flex-col items-center rounded-tl-[3rem] border-[10px] border-surface bg-ink pt-8 text-foreground">
              <p className="font-display text-3xl font-bold">9:41</p>
              <div className="mt-6 grid h-20 w-20 place-items-center rounded-2xl bg-brand"><LogoMark mono="ink" className="h-10" /></div>
              <p className="mt-3 text-lg">EliteForums</p>
            </div>
          </div>

          <div className={`${card} flex items-center justify-around bg-cyan p-6 text-ink`}>
            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-ink text-electric"><Lightbulb className="h-12 w-12" /></div>
            <CalendarCheck className="h-14 w-14" />
            <Handshake className="h-14 w-14" />
          </div>

          <div className={`${card} flex flex-1 flex-col items-center justify-center gap-2 bg-teal py-12 font-display font-bold uppercase text-foreground`}>
            <p className="text-4xl opacity-30">Learn</p>
            <p className="text-4xl opacity-60">Build</p>
            <p className="text-5xl">Founders</p>
            <p className="text-4xl opacity-60">Network</p>
            <p className="text-4xl opacity-30">Growth</p>
          </div>
        </div>
      </div>
    </section>
  );
}
