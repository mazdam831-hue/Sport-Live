import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

export type SyncStatusProps = {
  isFetching?: boolean;
  isError?: boolean;
  isFallback?: boolean;
  updatedAt?: number;
  source?: string;
  onRetry?: () => void;
};

function fmtTime(ts?: number) {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return "—";
  }
}

export function SyncStatus({ isFetching, isError, isFallback, updatedAt, source, onRetry }: SyncStatusProps) {
  const state = isError ? "error" : isFallback ? "stale" : isFetching ? "loading" : "ok";
  const color =
    state === "error"
      ? "text-red-400 border-red-500/30 bg-red-500/5"
      : state === "stale"
        ? "text-amber-300 border-amber-500/30 bg-amber-500/5"
        : state === "loading"
          ? "text-live border-live-brd bg-live-dim/40"
          : "text-turf-2 border-border bg-card-2";

  const Icon = state === "error" ? AlertTriangle : state === "ok" ? CheckCircle2 : RefreshCw;
  const label =
    state === "error"
      ? "Erreur de mise à jour"
      : state === "stale"
        ? "Données de démonstration"
        : state === "loading"
          ? "Mise à jour…"
          : "À jour";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border font-mono text-[10px] uppercase tracking-wider ${color}`}>
      <Icon className={`w-3 h-3 ${state === "loading" ? "animate-spin" : ""}`} />
      <span className="font-bold">{label}</span>
      <span className="text-muted-2 hidden sm:inline">·</span>
      <span className="text-muted-2 hidden sm:inline">{fmtTime(updatedAt)}</span>
      {source && <span className="text-muted-2 hidden md:inline">· {source}</span>}
      {isError && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="ml-1 underline decoration-dotted underline-offset-2 hover:text-foreground"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
