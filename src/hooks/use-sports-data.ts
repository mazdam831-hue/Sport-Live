import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getLiveMatches, getUpcomingMatches, getFinishedMatches, getSportsNews } from "@/lib/sportsdb.functions";
import { LIVE_MATCHES, UPCOMING, FINISHED, ARTICLES, type Article, type Match } from "@/data/mock";

const LIVE_REFRESH_MS = 30_000;
const DAY_REFRESH_MS = 5 * 60_000;
const NEWS_REFRESH_MS = 5 * 60_000;

export function useLiveMatches() {
  const q = useQuery<Match[]>({
    queryKey: ["sportlive", "live"],
    queryFn: () => getLiveMatches(),
    refetchInterval: LIVE_REFRESH_MS,
    staleTime: LIVE_REFRESH_MS / 2,
  });
  const data = q.data && q.data.length > 0 ? q.data : LIVE_MATCHES;
  return { ...q, data, isFallback: !q.data || q.data.length === 0 };
}

export function useUpcomingMatches() {
  const q = useQuery<Match[]>({
    queryKey: ["sportlive", "upcoming"],
    queryFn: () => getUpcomingMatches(),
    refetchInterval: DAY_REFRESH_MS,
    staleTime: DAY_REFRESH_MS / 2,
  });
  const data = q.data && q.data.length > 0 ? q.data : UPCOMING;
  return { ...q, data, isFallback: !q.data || q.data.length === 0 };
}

export function useFinishedMatches() {
  const q = useQuery<Match[]>({
    queryKey: ["sportlive", "finished"],
    queryFn: () => getFinishedMatches(),
    refetchInterval: DAY_REFRESH_MS,
    staleTime: DAY_REFRESH_MS / 2,
  });
  const data = q.data && q.data.length > 0 ? q.data : FINISHED;
  return { ...q, data, isFallback: !q.data || q.data.length === 0 };
}

export function useSportsNews() {
  const q = useQuery<Article[]>({
    queryKey: ["sportlive", "news"],
    queryFn: () => getSportsNews(),
    refetchInterval: NEWS_REFRESH_MS,
    staleTime: NEWS_REFRESH_MS / 2,
  });
  const data = q.data && q.data.length > 0 ? q.data : ARTICLES;
  return { ...q, data, isFallback: !q.data || q.data.length === 0 };
}

// --- Alerts: watch live scores and notify on score changes for subscribed teams ---

type Sub = { name: string };

/**
 * Lecture de secours depuis localStorage (utilisateurs non connectés).
 * Quand l'utilisateur est connecté, les subs viennent de useAlertes (Supabase)
 * et sont passés directement via le paramètre `subs`.
 */
function readLocalSubs(): Sub[] {
  try {
    const s = JSON.parse(localStorage.getItem("sportlive_subs") || "[]");
    return Array.isArray(s) ? s : [];
  } catch {
    return [];
  }
}

function matchesSub(sub: string, m: Match) {
  const n = sub.toLowerCase();
  return (
    m.home.toLowerCase().includes(n) ||
    m.away.toLowerCase().includes(n) ||
    m.league.toLowerCase().includes(n)
  );
}

/**
 * @param live  Matchs en direct actuels.
 * @param subs  Liste des alertes actives. Si omis, lit localStorage (mode invité).
 *              Passer directement depuis useAlertes() quand l'utilisateur est connecté.
 */
export function useAlertsWatcher(live: Match[], subs?: Sub[]) {
  const lastScores = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const activeSubs = subs ?? readLocalSubs();
    if (activeSubs.length === 0) return;
    for (const m of live) {
      if (!m.score) continue;
      const key = `${m.home}|${m.away}|${m.league}`;
      const prev = lastScores.current.get(key);
      lastScores.current.set(key, m.score);
      if (prev == null || prev === m.score) continue;
      const hit = activeSubs.find((s) => matchesSub(s.name, m));
      if (!hit) continue;
      try {
        new Notification(`SportLive ${m.icon}`, {
          body: `${m.home} ${m.score} ${m.away} · ${m.minute ?? "LIVE"} — ${m.league}`,
          tag: key,
        });
      } catch {
        // ignore
      }
    }
  }, [live, subs]);
}
