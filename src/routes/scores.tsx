import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHead } from "@/components/site/page-head";
import { SyncStatus } from "@/components/site/sync-status";
import { type Match } from "@/data/mock";
import { useLiveMatches, useUpcomingMatches, useFinishedMatches } from "@/hooks/use-sports-data";

export const Route = createFileRoute("/scores")({
  head: () => ({
    meta: [
      { title: "Scores en direct — SportLive" },
      { name: "description", content: "Tous les scores sportifs en temps réel : football, tennis, basket, F1, rugby, MotoGP." },
      { property: "og:title", content: "Scores en direct — SportLive" },
      { property: "og:description", content: "Scores live, matchs à venir et résultats du jour, actualisés en temps réel." },
    ],
  }),
  component: ScoresPage,
});

function ScoresPage() {
  const [tab, setTab] = useState<"live" | "soon" | "done">("live");
  const live = useLiveMatches();
  const soon = useUpcomingMatches();
  const done = useFinishedMatches();

  const active =
    tab === "live" ? live : tab === "soon" ? soon : done;

  const TABS = [
    { id: "live" as const, label: "En direct", count: live.data.length, dot: "bg-live" },
    { id: "soon" as const, label: "À venir", count: soon.data.length, dot: "bg-amber-400" },
    { id: "done" as const, label: "Terminés", count: done.data.length, dot: "bg-turf-2" },
  ];

  const byLeague = active.data.reduce<Record<string, Match[]>>((acc, m) => {
    (acc[m.league] ||= []).push(m);
    return acc;
  }, {});

  return (
    <>
      <PageHead
        title="Scores"
        emphasis="live"
        subtitle="Suivez tous les matchs en direct, les résultats du jour et les prochaines rencontres."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Scores" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-2">
            <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />{live.data.length} live</span>
            <span>·</span>
            <span>{soon.data.length} à venir</span>
            <span>·</span>
            <span>{done.data.length} terminés</span>
          </div>
          <SyncStatus
            isFetching={active.isFetching}
            isError={!!active.isError}
            isFallback={active.isFallback}
            updatedAt={active.dataUpdatedAt}
            source={tab === "live" ? "TheSportsDB + API-Football" : "TheSportsDB"}
            onRetry={() => active.refetch()}
          />
        </div>

        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="flex gap-1 px-3 pt-3 overflow-x-auto border-b border-border items-center">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px whitespace-nowrap transition-colors inline-flex items-center gap-2 ${
                  tab === t.id
                    ? "border-live text-live"
                    : "border-transparent text-muted-2 hover:text-foreground"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                {t.label} <span className="text-muted-fg font-mono">({t.count})</span>
              </button>
            ))}
            <div className="ml-auto pr-2 hidden sm:flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <span>Rafraîchi {tab === "live" ? "toutes les 30s" : "toutes les 5 min"}</span>
            </div>
          </div>
          {Object.entries(byLeague).length === 0 && !active.isFetching && (
            <div className="px-5 py-10 text-center">
              <div className="text-sm text-muted-2 mb-1">Aucun match {tab === "live" ? "en direct" : tab === "soon" ? "à venir" : "terminé"} pour l'instant.</div>
              <div className="text-[11px] text-muted-foreground font-mono">Les données s'actualisent automatiquement.</div>
            </div>
          )}
          {Object.entries(byLeague).map(([league, matches]) => (
            <div key={league}>
              <div className="px-5 py-2 bg-card-2 text-[10px] font-bold uppercase tracking-wider text-muted-2 border-b border-border font-mono flex items-center justify-between">
                <span>{league}</span>
                <span className="text-muted-foreground">{matches.length} {matches.length > 1 ? "matchs" : "match"}</span>
              </div>
              {matches.map((m, i) => (
                <div
                  key={i}
                  className="grid [grid-template-columns:1fr_auto_1fr_auto] items-center gap-3.5 px-5 py-4 border-b border-border last:border-b-0 hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="text-sm font-bold text-right truncate">{m.home}</div>
                  <div className={`font-mono text-[19px] font-bold tracking-tight px-3.5 py-1 border whitespace-nowrap tabnum ${
                    m.status === "live" ? "bg-live-dim/60 border-live-brd text-live" : "bg-card-2 border-border"
                  }`}>
                    {m.score ?? "vs"}
                  </div>
                  <div className="text-sm font-bold truncate">{m.away}</div>
                  <div
                    className={`text-[10px] font-bold font-mono text-right min-w-[80px] inline-flex items-center justify-end gap-1.5 ${
                      m.status === "live" ? "text-live" : m.status === "done" ? "text-turf-2" : "text-muted-foreground"
                    }`}
                  >
                    {m.status === "live" && <span className="w-1 h-1 rounded-full bg-live animate-pulse" />}
                    {m.minute ?? m.time}
                  </div>
                </div>
              ))}
            </div>
          ))}
          {active.isFallback && (
            <div className="px-5 py-3 text-[10px] text-amber-300/80 font-mono border-t border-amber-500/20 bg-amber-500/[0.03]">
              Aucun match retourné par l'API à cet instant — données de démonstration affichées.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
