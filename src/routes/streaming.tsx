import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHead } from "@/components/site/page-head";
import { StreamCard } from "@/components/site/cards";
import { STREAMS } from "@/data/mock";

export const Route = createFileRoute("/streaming")({
  head: () => ({
    meta: [
      { title: "Streaming sport gratuit et payant — SportLive" },
      { name: "description", content: "Toutes les plateformes de streaming sport : France TV Sport, L'Équipe TV, Molotov, Eurosport, F1 TV, myCANAL, beIN Sports." },
      { property: "og:title", content: "Streaming sport — SportLive" },
      { property: "og:description", content: "Où regarder le sport ? Plateformes gratuites, payantes et partielles, vérifiées et légales." },
    ],
  }),
  component: StreamingPage,
});

const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "free", label: "Gratuit" },
  { id: "mix", label: "Partiel" },
  { id: "pay", label: "Abonnement" },
] as const;

function StreamingPage() {
  const [f, setF] = useState<(typeof FILTERS)[number]["id"]>("all");
  const list = useMemo(() => (f === "all" ? STREAMS : STREAMS.filter((s) => s.type === f)), [f]);

  return (
    <>
      <PageHead
        title="Streaming"
        emphasis="sport"
        subtitle="Toutes les plateformes légales pour regarder le sport en direct — gratuites, sur abonnement ou mixtes."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Streaming" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8">
        <div className="flex gap-1.5 flex-wrap mb-6">
          {FILTERS.map((x) => (
            <button
              key={x.id}
              onClick={() => setF(x.id)}
              className={`px-3.5 py-1.5 rounded-sm text-[11px] font-bold border transition-all uppercase tracking-wider ${
                f === x.id
                  ? "bg-turf border-live-brd text-[#EAF6EE]"
                  : "border-border text-muted-2 hover:border-[#2A362E] hover:text-foreground"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {list.map((s) => (
            <StreamCard key={s.name} s={s} />
          ))}
        </div>
      </section>
    </>
  );
}
