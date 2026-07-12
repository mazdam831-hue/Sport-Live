import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHead } from "@/components/site/page-head";
import { type Match } from "@/data/mock";
import { useLiveMatches, useUpcomingMatches, useFinishedMatches } from "@/hooks/use-sports-data";
import { abbreviateTeam } from "@/lib/team-abbreviations";

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
    tab === "live"
      ? { data: live.data, isFetching: live.isFetching, isFallback: live.isFallback }
      : tab === "soon"
        ? { data: soon.data, isFetching: soon.isFetching, isFallback: soon.isFallback }
        : { data: done.data, isFetching: done.isFetching, isFallback: done.isFallback };

  const TABS = [
    { id: "live" as const, label: "En direct", count: live.data.length },
    { id: "soon" as const, label: "À venir", count: soon.data.length },
    { id: "done" as const, label: "Terminés", count: done.data.length },
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
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8">
        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="flex gap-1 px-3 pt-3 overflow-x-auto border-b border-border items-center">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "border-live text-live"
                    : "border-transparent text-muted-2 hover:text-foreground"
                }`}
              >
                {t.label} ({t.count})
              </button>
            ))}
            <div className="ml-auto pr-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              {active.isFetching && <span className="text-live">↻ Mise à jour…</span>}
              <span className="hidden sm:inline">Scores · rafraîchi toutes les 30s</span>
            </div>
          </div>
          {Object.entries(byLeague).map(([league, matches]) => (
            <div key={league}>
              <div className="px-5 py-2 bg-card-2 text-[10px] font-bold uppercase tracking-wider text-muted-2 border-b border-border font-mono">
                {league}
              </div>
              {matches.map((m, i) => (
                <div
                  key={i}
                  className="grid [grid-template-columns:1fr_auto_1fr_auto] items-center gap-3.5 px-5 py-4 border-b border-border last:border-b-0 hover:bg-white/5 cursor-pointer"
                >
                  <div className="text-sm font-bold text-right truncate" title={m.home}>{abbreviateTeam(m.home)}</div>
                  <div className="font-mono text-[19px] font-bold tracking-tight px-3.5 py-1 bg-card-2 border border-border whitespace-nowrap tabnum">
                    {m.score ?? "vs"}
                  </div>
                  <div className="text-sm font-bold truncate" title={m.away}>{abbreviateTeam(m.away)}</div>
                  <div
                    className={`text-[10px] font-bold font-mono text-right min-w-[64px] ${
                      m.status === "live" ? "text-live" : m.status === "done" ? "text-turf-2" : "text-muted-foreground"
                    }`}
                  >
                    {m.minute ?? m.time}
                  </div>
                </div>
              ))}
            </div>
          ))}
          {active.isFallback && (
            <div className="px-5 py-3 text-[10px] text-muted-foreground font-mono">
              Aucun match retourné par l'API à cet instant — données de démonstration affichées.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
