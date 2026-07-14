import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, Info } from "lucide-react";
import { PageHead } from "@/components/site/page-head";
import { HoraireCard } from "@/components/site/cards";
import { HORAIRES } from "@/data/mock";

export const Route = createFileRoute("/horaires")({
  head: () => ({
    meta: [
      { title: "Programme TV sport — Horaires — SportLive" },
      { name: "description", content: "Programme TV sport : horaires habituels par sport et compétition. Football, tennis, F1, MotoGP, cyclisme, rugby, basket." },
      { property: "og:title", content: "Programme sport — SportLive" },
      { property: "og:description", content: "Les horaires de diffusion de vos sports préférés, en un coup d'œil." },
    ],
  }),
  component: HorairesPage,
});

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function HorairesPage() {
  const [q, setQ] = useState("");
  const now = new Date();
  const today = DAYS[(now.getDay() + 6) % 7];

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return HORAIRES;
    return HORAIRES.filter(
      (h) =>
        h.title.toLowerCase().includes(needle) ||
        h.rows.some(([a, b]) => (a + b).toLowerCase().includes(needle)),
    );
  }, [q]);

  return (
    <>
      <PageHead
        title="Programme"
        emphasis="TV"
        subtitle="Horaires habituels par compétition. Vérifiez toujours la grille de la chaîne le jour même."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Programme" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-muted-2">
            <CalendarDays className="w-3.5 h-3.5 text-live" />
            Aujourd'hui · <span className="text-foreground font-bold">{today}</span>
            <span className="text-muted-fg">
              {now.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
            </span>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un sport, une compétition…"
            className="w-full sm:w-64 px-3.5 py-2 bg-card border border-border rounded-sm text-sm outline-none focus:border-live-brd"
          />
        </div>

        <div className="rounded-md border border-border bg-card-2/60 p-3 mb-5 flex items-start gap-2 text-[11px] text-muted-2 leading-relaxed">
          <Info className="w-3.5 h-3.5 mt-0.5 text-live shrink-0" />
          <span>
            Ces horaires sont indicatifs et basés sur les habitudes de diffusion en France (heure locale). Les
            événements exceptionnels (finales, décalages) peuvent modifier ces créneaux.
          </span>
        </div>

        <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]">
          {list.map((h) => (
            <HoraireCard key={h.title} h={h} />
          ))}
        </div>
      </section>
    </>
  );
}
