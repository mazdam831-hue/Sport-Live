import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Bell, Newspaper, Shield, Tv, Trophy } from "lucide-react";
import { PageHead } from "@/components/site/page-head";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — SportLive" },
      { name: "description", content: "SportLive : portail sport gratuit — scores en direct, actualités, streaming vérifié, alertes personnalisées." },
      { property: "og:title", content: "À propos — SportLive" },
      { property: "og:description", content: "Notre mission : rendre le sport accessible à tous, en un seul portail gratuit." },
    ],
  }),
  component: AboutPage,
});

const STATS: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }[] = [
  { icon: Trophy, value: "12+", label: "sports couverts" },
  { icon: Activity, value: "30s", label: "rafraîchissement live" },
  { icon: Newspaper, value: "24", label: "articles agrégés / jour" },
  { icon: Tv, value: "12", label: "diffuseurs légaux référencés" },
];

const PILLARS = [
  {
    icon: Activity,
    title: "Scores en temps réel",
    body:
      "TheSportsDB pour tous les sports, complété par API-Football pour le minutage réel (73', mi-temps). Retry automatique en cas d'incident réseau.",
  },
  {
    icon: Newspaper,
    title: "Actualité agrégée",
    body:
      "Flux Google News France filtré par sport, avec sources vérifiées : L'Équipe, Eurosport, FranceInfo Sport, NBA.com, F1 TV.",
  },
  {
    icon: Tv,
    title: "Streaming légal",
    body:
      "Uniquement des liens vers des diffuseurs officiels. Aucun lien pirate, aucun IPTV. Gratuit, partiel ou abonnement clairement indiqué.",
  },
  {
    icon: Bell,
    title: "Alertes personnalisées",
    body:
      "Suivez vos équipes favorites. Stockage local par défaut, synchronisation dans le cloud si vous vous connectez.",
  },
  {
    icon: Shield,
    title: "Vie privée",
    body:
      "Aucun tracker publicitaire, pas de pop-up, pas de revente de données. Les alertes synchronisées sont protégées par RLS Postgres.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHead
        title="À propos"
        emphasis="SportLive"
        subtitle="Un portail unique pour suivre le sport : scores, actus, streaming légal et alertes — gratuit et sans pub."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "À propos" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-md border border-border bg-card p-5 border-t-2 border-t-turf"
            >
              <Icon className="w-4 h-4 text-live mb-2" />
              <div className="font-display text-3xl font-black leading-none tabnum">{value}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-2 mt-1.5">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission + pillars */}
        <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
          <div>
            <h3 className="font-display text-[15px] font-bold uppercase tracking-wider mb-3">
              Notre mission
            </h3>
            <p className="text-[13px] text-muted-2 leading-[1.8] mb-6 max-w-[720px]">
              SportLive rassemble en un seul endroit les scores en direct, les actualités et les plateformes de
              streaming vérifiées. Pas de pop-up, pas de compte obligatoire, pas de données revendues. Notre
              seule ambition : rendre le sport lisible et accessible, dans un design pensé pour être lu de nuit
              comme en plein match.
            </p>

            <h3 className="font-display text-[15px] font-bold uppercase tracking-wider mb-3">
              Ce que nous faisons bien
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {PILLARS.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-md border border-border bg-card p-4 hover:border-[#2A362E] transition-colors"
                >
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-sm bg-turf/40 border border-live-brd inline-flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-live" />
                    </span>
                    <span className="font-display font-bold text-[13px] uppercase tracking-wide">
                      {title}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-2 leading-[1.7]">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4 h-fit">
            <div className="rounded-md border border-border bg-card p-5 border-t-2 border-t-live">
              <div className="text-[10px] font-mono uppercase tracking-wider text-live mb-1">
                Contact rapide
              </div>
              <p className="text-[12px] text-muted-2 leading-[1.7] mb-3">
                Une suggestion, une correction, un partenariat ? On lit tout.
              </p>
              <a
                href="mailto:contact@sportlive.example"
                className="text-xs font-bold text-live font-mono uppercase tracking-wider hover:underline"
              >
                contact@sportlive.example →
              </a>
            </div>
            <div className="rounded-md border border-border bg-card p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-2 mb-2">
                Sources techniques
              </div>
              <ul className="text-[12px] text-muted-2 space-y-1 font-mono">
                <li>· TheSportsDB · scores multi-sport</li>
                <li>· API-Football · minutage foot</li>
                <li>· Google News RSS · agrégation FR</li>
                <li>· Postgres + RLS · alertes cloud</li>
              </ul>
            </div>
            <Link
              to="/alertes"
              className="block rounded-md border border-border bg-turf/30 p-4 hover:bg-turf/50 transition-colors group"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-live mb-1">Prêt ?</div>
              <div className="font-display font-bold text-sm">
                Configurez vos alertes
                <span className="inline-block ml-1 transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
