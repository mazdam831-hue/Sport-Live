import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { NAV_LINKS } from "@/data/mock";

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border pt-10 px-[5vw] pb-5 mt-auto">
      <div className="max-w-[1320px] mx-auto grid gap-8 md:grid-cols-[2fr_1fr_1fr_1fr] mb-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-[17px] font-extrabold uppercase tracking-wide">
            <span className="w-[26px] h-[26px] bg-turf border border-live-brd rounded-sm flex items-center justify-center">
              <Play className="w-3 h-3 fill-live text-live" />
            </span>
            Sport<em className="not-italic text-live">Live</em>
          </Link>
          <p className="text-[11px] text-muted-foreground leading-[1.7] max-w-[230px] mt-2.5">
            Scores en direct, actualités sportives, alertes personnalisées et streaming vérifié — gratuit.
          </p>
        </div>
        <div>
          <h4 className="text-[9px] font-bold uppercase tracking-[1.5px] text-muted-foreground mb-3 font-mono">Le site</h4>
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="block text-[11px] text-muted-foreground hover:text-live mb-2">
              {l.label}
            </Link>
          ))}
        </div>
        <div>
          <h4 className="text-[9px] font-bold uppercase tracking-[1.5px] text-muted-foreground mb-3 font-mono">Streaming gratuit</h4>
          {[
            ["France TV Sport", "https://www.france.tv/sport"],
            ["L'Équipe TV", "https://www.lequipe.fr/television/"],
            ["Molotov TV", "https://www.molotov.tv/fr_fr/cat/3/sport"],
            ["Sport en France", "https://sportenfrance.com/"],
          ].map(([n, u]) => (
            <a key={n} href={u} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted-foreground hover:text-live mb-2">
              {n}
            </a>
          ))}
        </div>
        <div>
          <h4 className="text-[9px] font-bold uppercase tracking-[1.5px] text-muted-foreground mb-3 font-mono">Sports officiels</h4>
          {[
            ["LNR Rugby", "https://www.lnr.fr/"],
            ["NBA.com", "https://www.nba.com/games"],
            ["World Athletics", "https://worldathletics.org/"],
            ["MotoGP", "https://www.motogp.com/en"],
          ].map(([n, u]) => (
            <a key={n} href={u} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted-foreground hover:text-live mb-2">
              {n}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-[1320px] mx-auto pt-4 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono flex-wrap gap-2">
        <span>
          © {new Date().getFullYear()} <em className="not-italic text-live">SportLive</em> — Portail sport gratuit
        </span>
        <div className="flex gap-3.5">
          <Link to="/a-propos">À propos</Link>
          <Link to="/a-propos">Mentions légales</Link>
          <Link to="/a-propos">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
