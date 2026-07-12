import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Article, Stream, Horaire, Sport } from "@/data/mock";
import { sportMeta, resolveSport } from "@/lib/sport-images";

/* ============================================================
 * ArticleCard — hero image left, text right. No emoji.
 * ============================================================ */
export function ArticleCard({ a }: { a: Article }) {
  const meta = sportMeta(a.cat);
  return (
    <Link
      to="/actus"
      className="group flex gap-4 py-4 border-b border-border cursor-pointer transition-colors hover:bg-white/[.02] -mx-2 px-2 rounded-sm"
    >
      <div className="relative w-[110px] h-[78px] rounded-sm overflow-hidden shrink-0 bg-card-2">
        <img
          src={meta.img}
          // Point 7 : alt décrit le contenu de l'article
          alt={`Actualité ${meta.label} — ${a.title}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ background: `linear-gradient(135deg, ${meta.color}, transparent 60%)` }}
        />
        <span
          className="absolute bottom-1 left-1.5 text-[8px] font-black tracking-[1.5px] uppercase font-mono px-1.5 py-0.5 rounded-[2px] backdrop-blur-sm"
          style={{
            background: `color-mix(in oklab, ${meta.color} 22%, rgba(0,0,0,.4))`,
            color: "#fff",
          }}
        >
          {meta.label}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[9px] font-black tracking-[1.5px] uppercase mb-1 font-mono"
          style={{ color: meta.color }}
        >
          {a.cat}
        </div>
        <h3 className="text-[14px] font-bold leading-[1.35] mb-1.5 line-clamp-2 group-hover:text-accent transition-colors">
          {a.title}
        </h3>
        <p className="text-[12px] text-muted-2 leading-[1.55] mb-1.5 line-clamp-2">{a.excerpt}</p>
        <div className="text-[10px] text-muted-fg font-mono flex gap-1.5">
          <span>{a.time}</span> · <span>{a.source}</span>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
 * ArticleFeatured — big cover.
 * ============================================================ */
export function ArticleFeatured({ a }: { a: Article }) {
  const meta = sportMeta(a.cat);
  return (
    <Link
      to="/actus"
      className="group block rounded-md overflow-hidden border border-border mb-4 cursor-pointer hover-lift"
    >
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={meta.img}
          // Point 7 : alt complet avec titre de l'article
          alt={`${meta.label} — ${a.title}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div
          className="absolute inset-0 opacity-50 mix-blend-multiply"
          style={{
            background: `linear-gradient(135deg, ${meta.color}22, transparent 55%)`,
          }}
        />
        <span
          className="absolute top-3 left-3 text-[9px] font-black tracking-[1.5px] uppercase px-2.5 py-1 z-10 font-mono rounded-sm"
          style={{
            background: `color-mix(in oklab, ${meta.color} 18%, transparent)`,
            color: meta.color,
            border: `1px solid color-mix(in oklab, ${meta.color} 40%, transparent)`,
          }}
        >
          À la une · {a.cat}
        </span>
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-[22px] md:text-2xl font-display font-black tracking-tight leading-[1.1] mb-2 text-foreground">
            {a.title}
          </h3>
          <div className="text-[10px] text-muted-2 font-mono flex gap-2 uppercase tracking-wider">
            <span>{a.time}</span> · <span>{a.source}</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-card">
        <p className="text-[13px] text-muted-2 leading-[1.6]">{a.excerpt}</p>
      </div>
    </Link>
  );
}

const STREAM_BADGE = {
  free: {
    label: "GRATUIT",
    cls: "bg-[color:var(--sport-foot)]/15 text-[color:var(--sport-foot)] border border-[color:var(--sport-foot)]/40",
  },
  pay: {
    label: "ABONNEMENT",
    cls: "bg-[color:var(--copper)]/15 text-[color:var(--copper)] border border-[color:var(--copper)]/40",
  },
  mix: {
    label: "PARTIEL",
    cls: "bg-[color:var(--amber)]/15 text-[color:var(--amber)] border border-[color:var(--amber)]/40",
  },
};

/* ============================================================
 * StreamCard — image thumb replaces emoji.
 * ============================================================ */
export function StreamCard({ s }: { s: Stream }) {
  const b = STREAM_BADGE[s.type];
  const meta = sportMeta(`${s.sports} ${s.name} ${s.icon}`);
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-elevated rounded-md overflow-hidden hover:border-live-brd hover-lift flex flex-col"
    >
      <div className="relative h-[120px] overflow-hidden">
        <img
          src={meta.img}
          // Point 7 : alt décrit la plateforme de streaming et ses sports
          alt={`Regarder ${meta.label} sur ${s.name}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-50 mix-blend-overlay"
          style={{ background: `linear-gradient(135deg, ${meta.color}, transparent 60%)` }}
        />
        <span
          className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 tracking-wider font-mono rounded-sm ${b.cls}`}
        >
          {b.label}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-[15px] font-extrabold leading-tight">{s.name}</div>
        <p className="text-xs text-muted-2 leading-[1.55]">{s.desc}</p>
        <div className="text-[11px] text-muted-fg font-mono">{s.sports}</div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <span className="text-[11px] font-bold text-accent flex items-center gap-1 font-mono uppercase tracking-wider group-hover:gap-2 transition-all">
            Ouvrir <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ============================================================
 * HoraireCard — banner image + list.
 * ============================================================ */
export function HoraireCard({ h }: { h: Horaire }) {
  const meta = sportMeta(`${h.title} ${h.icon}`);
  return (
    <div className="card-elevated rounded-sm overflow-hidden hover-lift border-l-2 border-l-accent">
      <div className="relative h-[90px] overflow-hidden">
        <img
          src={meta.img}
          // Point 7 : alt décrit le sport du programme
          alt={`Programme ${h.title} — horaires et diffusion`}
          loading="lazy"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ background: `linear-gradient(135deg, ${meta.color}, transparent 60%)` }}
        />
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
          <div className="text-sm font-black uppercase tracking-wider text-foreground">
            {h.title}
          </div>
          <span
            className="text-[9px] font-mono font-bold uppercase tracking-[1.5px] px-1.5 py-0.5 rounded-[2px]"
            style={{
              background: `color-mix(in oklab, ${meta.color} 22%, transparent)`,
              color: meta.color,
              border: `1px solid color-mix(in oklab, ${meta.color} 40%, transparent)`,
            }}
          >
            {meta.label}
          </span>
        </div>
      </div>
      <ul className="text-[11px] text-muted-2 leading-[2] p-3">
        {h.rows.map(([k, v]) => (
          <li
            key={k}
            className="flex justify-between gap-3 border-b border-border/60 last:border-b-0"
          >
            <span className="text-muted-2">{k}</span>
            <strong className="text-foreground font-semibold font-mono text-[10px] tabnum">
              {v}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
 * SportCard — image dominant, no emoji center.
 * ============================================================ */
export function SportCard({ s }: { s: Sport }) {
  const meta = sportMeta(s.slug);
  const key = resolveSport(s.slug);
  return (
    <Link
      to="/sports/$sport"
      params={{ sport: key }}
      className="group card-elevated rounded-md overflow-hidden hover-lift block"
    >
      <div className="relative h-[170px] overflow-hidden">
        <img
          src={meta.img}
          // Point 7 : alt inclut le nom complet du sport
          alt={`${s.name} en direct — scores et actualités SportLive`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-60 mix-blend-overlay"
          style={{
            background: `linear-gradient(135deg, ${meta.color}, transparent 65%)`,
          }}
        />
        {s.live && (
          <span className="absolute top-2 right-2 live-badge z-10">Live</span>
        )}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div
            className="inline-block text-[9px] font-black tracking-[1.5px] uppercase font-mono px-2 py-0.5 rounded-[2px]"
            style={{
              background: `color-mix(in oklab, ${meta.color} 22%, rgba(0,0,0,.4))`,
              color: "#fff",
              border: `1px solid color-mix(in oklab, ${meta.color} 40%, transparent)`,
            }}
          >
            {s.slug}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="text-[15px] font-black mb-1 group-hover:text-accent transition-colors">
          {s.name}
        </div>
        <p className="text-[11px] text-muted-2 mb-2 leading-[1.55] line-clamp-2">{s.desc}</p>
        <div className="flex flex-wrap gap-1">
          {s.tags.map((t) => (
            <span
              key={t}
              className="bg-white/5 border border-border px-1.5 py-0.5 text-[9px] text-muted-2 font-mono rounded-[2px]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
