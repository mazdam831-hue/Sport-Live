/**
 * Badge discret en position fixe (bas droite, z-index élevé).
 * Affiché uniquement quand toutes les sources de scores échouent et
 * que le site affiche les données de démonstration (mock).
 * Ne modifie pas la mise en page — position:fixed, hors du flux.
 */
import { useLiveMatches } from "@/hooks/use-sports-data";
import { WifiOff } from "lucide-react";

export function FallbackBanner() {
  const { isFallback } = useLiveMatches();

  if (!isFallback) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[70] animate-fade-in"
    >
      <div
        className="inline-flex items-center gap-2 px-3 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider
          bg-card/90 border border-border backdrop-blur-sm shadow-lg
          text-muted-2"
      >
        <WifiOff className="w-3 h-3 shrink-0 opacity-70" />
        <span>Données de démonstration</span>
        <span className="text-muted-fg normal-case font-normal tracking-normal">— APIs indisponibles</span>
      </div>
    </div>
  );
}
