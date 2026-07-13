import { Link } from "@tanstack/react-router";
import { ArrowRight, RefreshCw } from "lucide-react";
import type { Match } from "@/data/mock";
import { sportMeta } from "@/lib/sport-images";

export function ScoreboardSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card-elevated rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton h-3 w-16" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-3">
            <div className="skeleton h-6 w-6 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3 w-3/4" />
              <div className="skeleton h-2 w-1/3" />
            </div>
            <div className="skeleton h-6 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Scoreboard({
  matches,
  title = "Matchs en cours",
  updatedAt,
}: {
  matches: Match[];
  title?: string;
  updatedAt?: Date | null;
}) {
  return (
    <div className="scanlines card-elevated rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-live-dim relative z-10">
        <div className="flex items-center gap-2">
          <span className="live-badge">Live</span>
          <span className="font-mono text-[10px] font-bold tracking-wider text-muted-2 uppercase">
            {title}
          </span>
        </div>
        <div className="text-[10px] text-muted-2 font-mono tracking-wider inline-flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 animate-spin [animation-duration:6s]" />
          {updatedAt
            ? updatedAt.toLocaleTimeString("fr-FR", { hour12: false })
            : "Temps réel"}
        </div>
      </div>
      <div className="relative z-10 divide-y divide-border">
        {matches.map((m, i) => {
          const isLive = m.status === "live";
          const isDone = m.status === "done";
          const meta = sportMeta(`${m.league} ${m.icon}`);
          return (
            <div
              key={i}
              className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center px-4 py-3 gap-3 hover:bg-white/[.03] transition-colors cursor-pointer group"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-border shrink-0">
                <img
                  src={meta.img}
                  alt={meta.label}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 mix-blend-overlay opacity-60"
                  style={{ background: `linear-gradient(135deg, ${meta.color}, transparent 70%)` }}
                />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold tracking-tight leading-tight truncate flex items-center gap-2">
                  <span className="truncate">{m.home}</span>
                  <span className="text-muted-fg font-mono text-[10px]">vs</span>
                  <span className="truncate">{m.away}</span>
                </div>
                <div className="text-[10px] text-muted-fg mt-0.5 font-mono uppercase tracking-wider truncate">
                  {m.league}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-display text-lg font-black leading-none tabnum ${
                    isLive ? "text-accent" : isDone ? "text-foreground" : "text-muted-2"
                  }`}
                >
                  {m.score ?? m.time ?? "vs"}
                </div>
                <div
                  className={`text-[9px] font-bold mt-1 font-mono tabnum uppercase tracking-wider inline-flex items-center gap-1 ${
                    isLive
                      ? "text-accent"
                      : isDone
                        ? "text-turf-2"
                        : "text-muted-fg"
                  }`}
                >
                  {isLive && (
                    <span
                      className="w-1 h-1 rounded-full bg-accent"
                      style={{ animation: "blink-dot 1.2s ease-in-out infinite" }}
                    />
                  )}
                  {m.minute ?? (isDone ? "Terminé" : m.time)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-4 py-2.5 border-t border-border relative z-10 bg-mid/60">
        <Link
          to="/scores"
          className="text-[10px] font-bold text-accent flex items-center gap-1.5 justify-center uppercase tracking-wider font-mono hover:gap-2.5 transition-all"
        >
          Tous les scores <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
