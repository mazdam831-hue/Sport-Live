import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHead } from "@/components/site/page-head";
import { SportCard } from "@/components/site/cards";
import { SPORTS } from "@/data/mock";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title: "Tous les sports — SportLive" },
      { name: "description", content: "Football, tennis, basket, F1, cyclisme, rugby, handball, MMA, MotoGP, athlétisme… tous les sports couverts sur SportLive." },
      { property: "og:title", content: "Tous les sports — SportLive" },
      { property: "og:description", content: "Choisis ton sport et retrouve scores, actus, streaming et alertes dédiés." },
    ],
  }),
  component: SportsPage,
});

function SportsPage() {
  const [q, setQ] = useState("");
  const [onlyLive, setOnlyLive] = useState(false);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SPORTS.filter((s) => {
      if (onlyLive && !s.live) return false;
      if (!needle) return true;
      return (
        s.name.toLowerCase().includes(needle) ||
        s.desc.toLowerCase().includes(needle) ||
        s.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [q, onlyLive]);

  const liveCount = SPORTS.filter((s) => s.live).length;

  return (
    <>
      <PageHead
        title="Sports"
        emphasis="couverts"
        subtitle={`${SPORTS.length} sports suivis · ${liveCount} avec du live actuellement. Choisis un sport pour ses scores, actus et diffuseurs.`}
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Sports" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8">
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un sport, une compétition…"
              className="w-full pl-9 pr-3.5 py-2.5 bg-card border border-border rounded-sm text-sm outline-none focus:border-live-brd"
            />
          </div>
          <button
            onClick={() => setOnlyLive((v) => !v)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-sm text-[11px] font-bold border uppercase tracking-wider transition-all ${
              onlyLive
                ? "bg-live-dim border-live-brd text-live"
                : "border-border text-muted-2 hover:border-[#2A362E] hover:text-foreground"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${onlyLive ? "bg-live animate-pulse" : "bg-muted-fg"}`} />
            En direct uniquement
          </button>
        </div>

        {list.length === 0 ? (
          <div className="rounded-md border border-border bg-card p-10 text-center text-sm text-muted-2">
            Aucun sport ne correspond à ces filtres.
          </div>
        ) : (
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
            {list.map((s) => (
              <SportCard key={s.slug} s={s} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
