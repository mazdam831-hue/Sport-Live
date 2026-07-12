import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, Play, Radio, Star, Zap } from "lucide-react";
import { sportMeta } from "@/lib/sport-images";
import { Scoreboard, ScoreboardSkeleton } from "@/components/site/scoreboard";
import {
  ArticleCard,
  ArticleFeatured,
  SportCard,
  StreamCard,
} from "@/components/site/cards";
import { SPORTS, STREAMS } from "@/data/mock";
import { useLiveMatches, useSportsNews } from "@/hooks/use-sports-data";
import { useFavorites } from "@/hooks/use-favorites";
import heroBg from "@/assets/hero-stadium.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data: liveMatches, isLoading: liveLoading } = useLiveMatches();
  const { data: articles } = useSportsNews();
  const { favorites, isFavorite } = useFavorites();
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const latest = articles.filter((a) => a.slug !== featured?.slug).slice(0, 5);

  // Sports favoris affichés en premier, le reste dans l'ordre original
  const sortedSports = favorites.length
    ? [
        ...SPORTS.filter((s) => isFavorite(s.slug)),
        ...SPORTS.filter((s) => !isFavorite(s.slug)),
      ]
    : SPORTS;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background image with dark overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={heroBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            width={1920}
            height={1200}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(34,226,122,0.12),transparent_60%)]" />
        </div>

        <div className="relative max-w-[1320px] mx-auto px-[5vw] py-16 md:py-20 grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
          <div>
            <div className="animate-fade-up inline-flex items-center gap-2 mb-5 text-[10px] font-mono font-bold uppercase tracking-[2px] text-accent live-badge">
              En ce moment
            </div>
            <h1 className="animate-fade-up-1 font-display font-black uppercase leading-[0.92] tracking-tight text-[clamp(46px,7vw,92px)] mb-5">
              Toute l'actu sport.
              <br />
              <em className="not-italic text-gradient-live italic">En direct.</em>
            </h1>
            <p className="animate-fade-up-2 text-[15px] md:text-base text-muted-2 leading-[1.7] max-w-lg mb-7">
              Scores en temps réel, actualités vérifiées, alertes personnalisées et
              streaming légal. Un seul portail pour tous les sports —{" "}
              <span className="text-foreground font-semibold">gratuit</span>, sans
              compte obligatoire.
            </p>
            <div className="animate-fade-up-3 flex gap-2.5 flex-wrap">
              <Link
                to="/scores"
                className="bg-accent text-accent-foreground px-6 py-3.5 text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 rounded-sm hover:brightness-110 transition-all shadow-[0_10px_40px_-10px_var(--live-brd)]"
              >
                <Play className="w-[15px] h-[15px] fill-current" /> Scores live
              </Link>
              <Link
                to="/alertes"
                className="border border-border bg-card/40 backdrop-blur px-6 py-3.5 text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 rounded-sm hover:border-accent hover:text-accent transition-all"
              >
                <Bell className="w-[15px] h-[15px]" /> Mes alertes
              </Link>
            </div>

            <dl className="animate-fade-up-4 grid grid-cols-2 sm:grid-cols-4 gap-0 mt-10 border-t border-border">
              {[
                ["12+", "Sports couverts"],
                ["24/7", "Scores auto"],
                ["100%", "Gratuit"],
                ["0€", "Sans compte"],
              ].map(([n, l], i, arr) => (
                <div
                  key={l}
                  className={`pt-4 pb-1 pr-5 ${
                    i < arr.length - 1 ? "sm:border-r border-border" : ""
                  } ${i < 2 ? "border-b sm:border-b-0 border-border" : ""}`}
                >
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <strong className="block font-display text-[28px] md:text-[32px] font-black tracking-tight text-gradient-live tabnum">
                      {n}
                    </strong>
                    <span className="text-[9px] text-muted-fg uppercase tracking-[1.5px] font-mono font-bold">
                      {l}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-up-2 hidden lg:block">
            {liveLoading ? (
              <ScoreboardSkeleton />
            ) : (
              <Scoreboard matches={liveMatches.slice(0, 5)} updatedAt={new Date()} />
            )}
          </div>
        </div>
      </section>

      {/* ============ ACTUS + SIDEBAR ============ */}
      <section className="relative max-w-[1320px] mx-auto px-[5vw] py-12 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
              <Zap className="w-6 h-6 text-accent" />
              Actualités
              <span className="text-[9px] font-black uppercase tracking-wider bg-accent text-accent-foreground px-2.5 py-1 font-mono rounded-sm">
                À la une
              </span>
            </h2>
            <Link
              to="/actus"
              className="text-xs font-black uppercase tracking-wider text-accent inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Tout voir <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {featured && <ArticleFeatured a={featured} />}
          <div className="flex flex-col">
            {latest.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-5">
          <div className="lg:hidden">
            {liveLoading ? (
              <ScoreboardSkeleton />
            ) : (
              <Scoreboard matches={liveMatches.slice(0, 5)} updatedAt={new Date()} />
            )}
          </div>
          <div className="card-elevated rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-mid/60">
              <div className="text-xs font-black uppercase tracking-wider inline-flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-accent" /> Streaming gratuit
              </div>
            </div>
            <div>
              {STREAMS.filter((s) => s.type === "free")
                .slice(0, 5)
                .map((s) => {
                  const meta = sportMeta(`${s.sports} ${s.name} ${s.icon}`);
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border last:border-b-0 hover:bg-white/[.04] transition-colors group"
                    >
                      <span className="relative w-10 h-10 rounded-sm overflow-hidden border border-border shrink-0 group-hover:border-live-brd transition-colors">
                        <img
                          src={meta.img}
                          alt={meta.label}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute inset-0 mix-blend-overlay opacity-60"
                          style={{ background: `linear-gradient(135deg, ${meta.color}, transparent 65%)` }}
                        />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold group-hover:text-accent transition-colors">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-muted-fg font-mono truncate">
                          {s.sports}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-[color:var(--sport-foot)]/15 border border-[color:var(--sport-foot)]/40 text-[color:var(--sport-foot)] font-mono rounded-[2px]">
                        FREE
                      </span>
                    </a>
                  );
                })}
            </div>
          </div>
        </aside>
      </section>

      {/* ============ SPORTS ============ */}
      <section className="relative bg-mid/60 border-y border-border py-14 px-[5vw]">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
              Tous les <em className="not-italic text-gradient-live italic">sports</em>
              {favorites.length > 0 && (
                <span className="text-[9px] font-black uppercase tracking-wider bg-accent/15 text-accent px-2 py-1 font-mono rounded-sm inline-flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current" /> Favoris en tête
                </span>
              )}
            </h2>
            <Link
              to="/sports"
              className="text-xs font-black uppercase tracking-wider text-accent inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Voir tous <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
            {sortedSports.slice(0, 8).map((s) => (
              <SportCard key={s.slug} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ STREAMING PREVIEW ============ */}
      <section className="py-14 px-[5vw]">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight">
              Où <em className="not-italic text-gradient-live italic">regarder</em>
            </h2>
            <Link
              to="/streaming"
              className="text-xs font-black uppercase tracking-wider text-accent inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Toutes les plateformes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
            {STREAMS.slice(0, 6).map((s) => (
              <StreamCard key={s.name} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden border-y border-live-brd py-14 px-[5vw] text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-live-dim via-transparent to-live-dim" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 40% 60% at 50% 50%, color-mix(in oklab, var(--accent) 20%, transparent), transparent 60%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">
            Ne rate <em className="not-italic text-gradient-live italic">aucun</em> score
          </h2>
          <p className="text-sm md:text-base text-muted-2 mb-6">
            Configure des alertes pour ton équipe, ton sport, ta compétition.
            Notifications directement dans le navigateur, sur tous tes appareils.
          </p>
          <div className="flex gap-2.5 justify-center flex-wrap">
            <Link
              to="/alertes"
              className="bg-accent text-accent-foreground px-6 py-3.5 text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 rounded-sm hover:brightness-110 transition-all shadow-[0_10px_40px_-10px_var(--live-brd)]"
            >
              <Bell className="w-[15px] h-[15px]" /> Créer une alerte
            </Link>
            <Link
              to="/horaires"
              className="border border-border bg-card/40 backdrop-blur px-6 py-3.5 text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 rounded-sm hover:border-accent hover:text-accent transition-all"
            >
              Programme TV
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
