import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHead } from "@/components/site/page-head";
import { ArticleCard, StreamCard } from "@/components/site/cards";
import { SPORTS, STREAMS } from "@/data/mock";
import { useSportsNews } from "@/hooks/use-sports-data";

export const Route = createFileRoute("/sports/$sport")({
  loader: ({ params }) => {
    const sport = SPORTS.find((s) => s.slug === params.sport);
    if (!sport) throw notFound();
    return { sport };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Sport introuvable — SportLive" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.sport;
    return {
      meta: [
        { title: `${s.name} — Scores, actus et streaming — SportLive` },
        { name: "description", content: `${s.name} sur SportLive : ${s.desc}` },
        { property: "og:title", content: `${s.name} — SportLive` },
        { property: "og:description", content: s.desc },
      ],
    };
  },
  component: SportDetail,
  notFoundComponent: () => (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <h1 className="font-display text-4xl font-extrabold uppercase mb-3">Sport introuvable</h1>
      <p className="text-muted-foreground mb-6">Ce sport n'est pas encore couvert.</p>
      <Link to="/sports" className="text-live font-bold">← Voir tous les sports</Link>
    </div>
  ),
});

function SportDetail() {
  const { sport } = Route.useLoaderData();
  const { data: allArticles } = useSportsNews();
  const articles = allArticles.filter((a) => a.cat === sport.slug);
  const streams = STREAMS.filter((s) => sport.tags.some((t: string) => s.name.includes(t.split(" ")[0])));

  return (
    <>
      <PageHead
        title={sport.name}
        emphasis={sport.live ? "· LIVE" : undefined}
        subtitle={sport.desc}
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Sports", to: "/sports" }, { label: sport.name }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8 grid gap-8 lg:grid-cols-[1fr_330px]">
        <div>
          <h2 className="font-display text-xl font-extrabold uppercase mb-4 flex items-center gap-2">
            {sport.icon} Dernières actus
          </h2>
          {articles.length ? (
            articles.map((a) => <ArticleCard key={a.slug} a={a} />)
          ) : (
            <div className="text-sm text-muted-foreground border border-dashed border-border rounded-sm p-6 text-center">
              Pas d'article pour le moment sur ce sport.
            </div>
          )}
          <Link to="/actus" className="text-xs font-bold text-live inline-flex items-center gap-1.5 mt-4">
            Toutes les actus <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <aside>
          <h2 className="font-display text-xl font-extrabold uppercase mb-4">Où regarder</h2>
          <div className="flex flex-col gap-3">
            {streams.length ? (
              streams.map((s) => <StreamCard key={s.name} s={s} />)
            ) : (
              <p className="text-xs text-muted-foreground">
                Consultez la page{" "}
                <Link to="/streaming" className="text-live font-bold">
                  Streaming
                </Link>{" "}
                pour toutes les plateformes.
              </p>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
