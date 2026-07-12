import { useLiveMatches, useAlertsWatcher } from "@/hooks/use-sports-data";
import { TICKER } from "@/data/mock";
import { abbreviateTeam } from "@/lib/team-abbreviations";

export function Ticker() {
  const { data: live } = useLiveMatches();
  useAlertsWatcher(live);

  const items =
    live.length > 0
      ? live
          .slice(0, 12)
          .map((m) => `${m.icon} ${m.league} · ${abbreviateTeam(m.home)} ${m.score ?? "vs"} ${abbreviateTeam(m.away)}${m.minute ? " · " + m.minute : ""}`)
      : TICKER;
  const loop = [...items, ...items];

  return (
    <div className="flex items-stretch h-8 border-b border-border overflow-hidden bg-mid">
      <div className="flex-shrink-0 flex items-center gap-1.5 px-3.5 bg-gradient-to-r from-turf to-[color:var(--sport-foot)] text-accent-foreground font-mono text-[10px] font-black tracking-[2px]">
        <span
          className="w-1.5 h-1.5 rounded-full bg-current"
          style={{ animation: "blink-dot 1.4s ease-in-out infinite" }}
        />
        DIRECT
      </div>
      <div className="flex-1 overflow-hidden flex items-center relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-mid to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-mid to-transparent z-10" />
        <div
          className="flex whitespace-nowrap items-center hover:[animation-play-state:paused]"
          style={{ animation: "ticker-scroll 48s linear infinite" }}
        >
          {loop.map((t, i) => (
            <span
              key={i}
              className="font-mono text-[11px] font-bold px-5 text-foreground/80 tracking-wider"
            >
              {t}
              <span className="ml-5 text-accent/40">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
