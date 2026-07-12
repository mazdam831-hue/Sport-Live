import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHead } from "@/components/site/page-head";
import { ArticleCard, ArticleFeatured } from "@/components/site/cards";
import { useSportsNews } from "@/hooks/use-sports-data";

export const Route = createFileRoute("/actus")({
  head: () => ({
    meta: [
      { title: "Actualités sportives — SportLive" },
      { name: "description", content: "Toutes les actualités sportives : football, tennis, basket, F1, cyclisme, rugby, MMA et plus." },
      { property: "og:title", content: "Actualités sportives — SportLive" },
      { property: "og:description", content: "Le meilleur de l'actu sport, sources vérifiées, mis à jour en continu." },
    ],
  }),
  component: ActusPage,
});

const CATS = ["all", "football", "tennis", "basket", "f1", "cyclisme", "rugby", "handball"];

function ActusPage() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const { data: articles, isFetching } = useSportsNews();

  const filtered = useMemo(
    () =>
      articles.filter(
        (a) =>
          (cat === "all" || a.cat === cat) &&
          (q === "" || (a.title + a.excerpt).toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, q, articles],
  );

  const featured = filtered.find((a) => a.featured) ?? filtered[0];
  const rest = filtered.filter((a) => a.slug !== featured?.slug);

  return (
    <>
      <PageHead
        title="Actualités"
        emphasis="sport"
        subtitle="Football, tennis, basket, F1, rugby, cyclisme… toute l'actu sport en un seul flux."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Actualités" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8">
        <div className="flex gap-1.5 flex-wrap mb-4">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3.5 py-1.5 rounded-sm text-[11px] font-bold border transition-all uppercase tracking-wider ${
                cat === c
                  ? "bg-turf border-live-brd text-[#EAF6EE]"
                  : "border-border text-muted-2 hover:border-[#2A362E] hover:text-foreground"
              }`}
            >
              {c === "all" ? "Tous" : c}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un article, une équipe, un joueur…"
          className="w-full max-w-md px-3.5 py-2.5 bg-card border border-border rounded-sm text-sm outline-none focus:border-live-brd mb-6"
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
          <div>
            {featured && <ArticleFeatured a={featured} />}
            {rest.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-muted-foreground py-10 text-center">Aucun article trouvé.</div>
            )}
          </div>
          <aside className="hidden lg:block">
            <div className="bg-card border border-border rounded-md overflow-hidden">
              <div className="px-4 py-3 border-b border-border text-xs font-extrabold uppercase tracking-wider">
                Sources vérifiées
              </div>
              <div className="p-4 text-[11px] text-muted-2 leading-[1.7] font-mono space-y-1.5">
                <div>· L'Équipe</div>
                <div>· Eurosport</div>
                <div>· FranceInfo Sport</div>
                <div>· LNR.fr</div>
                <div>· NBA.com / F1 TV</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
