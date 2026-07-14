import { createServerFn } from "@tanstack/react-start";
import type { Match, Article } from "@/data/mock";

// ── Clé & base URL TheSportsDB ────────────────────────────────────────────────
const TSDB_KEY =
  (typeof import.meta !== "undefined" && (import.meta.env as Record<string, string>)?.VITE_SPORTSDB_API_KEY) ||
  process.env?.VITE_SPORTSDB_API_KEY ||
  "3";
const TSDB = `https://www.thesportsdb.com/api/v1/json/${TSDB_KEY}`;

// ── API-Football (football live enrichment — nécessite API_FOOTBALL_KEY) ─────
const AF = "https://v3.football.api-sports.io";

// ── ESPN public API (source de secours, sans clé) ────────────────────────────
const ESPN_ENDPOINTS: { url: string; sport: string; icon: string }[] = [
  { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard",       sport: "Soccer",            icon: "⚽" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",   sport: "Basketball",        icon: "🏀" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",     sport: "American Football", icon: "🏈" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",       sport: "Ice Hockey",        icon: "🏒" },
];

// ── Flux RSS d'actualités ─────────────────────────────────────────────────────
const NEWS_FEEDS = [
  {
    source: "Google News Football",
    url: "https://news.google.com/rss/search?q=football&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    source: "Google News Basketball",
    url: "https://news.google.com/rss/search?q=nba&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    source: "Google News Tennis",
    url: "https://news.google.com/rss/search?q=tennis&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    source: "Google News Formule 1",
    url: "https://news.google.com/rss/search?q=formule+1&hl=fr&gl=FR&ceid=FR:fr",
  },
];
const SPORT_META: Record<string, { icon: string }> = {
  Soccer:             { icon: "⚽" },
  Basketball:         { icon: "🏀" },
  "Ice Hockey":       { icon: "🏒" },
  "American Football":{ icon: "🏈" },
  Baseball:           { icon: "⚾" },
  Rugby:              { icon: "🏉" },
  Motorsport:         { icon: "🏎️" },
  Fighting:           { icon: "🥊" },
  Tennis:             { icon: "🎾" },
  Cycling:            { icon: "🚴" },
  Handball:           { icon: "🤾" },
};

function iconFor(sport?: string | null) {
  if (!sport) return "🏆";
  return SPORT_META[sport]?.icon ?? "🏆";
}

// ── Fetch avec retry + backoff exponentiel (V3) ───────────────────────────────
async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  opts: { retries?: number; timeoutMs?: number; baseDelayMs?: number } = {},
): Promise<Response> {
  const retries     = opts.retries     ?? 3;
  const timeoutMs   = opts.timeoutMs   ?? 8000;
  const baseDelayMs = opts.baseDelayMs ?? 350;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const to   = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      clearTimeout(to);
      if (res.ok) return res;
      if (res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status}`);
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      clearTimeout(to);
      lastErr = e;
    }
    if (attempt === retries) break;
    const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 150;
    await new Promise((r) => setTimeout(r, delay));
  }
  throw lastErr instanceof Error ? lastErr : new Error("fetchWithRetry failed");
}

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetchWithRetry(url, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
  });
  return res.json();
}

async function fetchText(url: string): Promise<string> {
  const res = await fetchWithRetry(url, {
    headers: { "User-Agent": "SportLive/1.0", Accept: "application/rss+xml, text/xml, */*" },
  });
  return res.text();
}

const DAY_SPORTS = ["Soccer", "Basketball", "Rugby", "Ice Hockey", "American Football", "Baseball"];
function ymd(d: Date) { return d.toISOString().slice(0, 10); }

// ── TheSportsDB ───────────────────────────────────────────────────────────────
type TSDBEvent = {
  idEvent: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
  strLeague?: string;
  strSport?: string;
  intHomeScore?: string | null;
  intAwayScore?: string | null;
  strStatus?: string | null;
  strProgress?: string | null;
  strTime?: string | null;
  strTimestamp?: string | null;
};

async function fetchTSDBDay(day: string): Promise<TSDBEvent[]> {
  const results = await Promise.allSettled(
    DAY_SPORTS.map((s) =>
      fetchJson(`${TSDB}/eventsday.php?d=${day}&s=${encodeURIComponent(s)}`),
    ),
  );
  const events: TSDBEvent[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      const data = r.value as Record<string, unknown>;
      const evs  = (data?.events ?? []) as TSDBEvent[] | null;
      if (Array.isArray(evs)) events.push(...evs);
    }
  }
  return events;
}

// Classification améliorée V3 : combine strStatus, timestamp et delta horaire
function classifyTSDB(e: TSDBEvent): Match["status"] {
  const raw = (e.strStatus || e.strProgress || "").trim();
  if (/^(NS|Not Started|TBD|Postponed|PPD)$/i.test(raw)) return "soon";
  if (/^(FT|AET|AP|PEN|Match Finished|Finished|Ended|Full Time|After Extra Time|After Penalties)$/i.test(raw)) return "done";
  if (/^(1H|2H|HT|ET|BT|LIVE|In Play|Playing|Half Time|First Half|Second Half|Extra Time)$/i.test(raw)) return "live";

  const hasScore  = e.intHomeScore != null && e.intAwayScore != null;
  const startedMs = e.strTimestamp ? Date.parse(e.strTimestamp) : NaN;
  const now       = Date.now();

  if (!isNaN(startedMs)) {
    const delta = now - startedMs;
    if (delta < -60_000) return "soon";
    if (delta >= -60_000 && delta < 3.5 * 3600_000) {
      if (hasScore) return "live";
      return "live";
    }
    return "done";
  }
  if (hasScore) return "done";
  return "soon";
}

function tsdbToMatch(e: TSDBEvent, status: Match["status"]): Match {
  const score =
    e.intHomeScore != null && e.intAwayScore != null
      ? `${e.intHomeScore} – ${e.intAwayScore}`
      : undefined;
  const timeLabel = e.strTime
    ? e.strTime.slice(0, 5)
    : e.strTimestamp
      ? new Date(e.strTimestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      : "—";
  return {
    icon:   iconFor(e.strSport),
    home:   e.strHomeTeam ?? "—",
    away:   e.strAwayTeam ?? "—",
    league: e.strLeague ?? e.strSport ?? "—",
    score,
    minute: status === "live" ? e.strProgress || e.strStatus || "LIVE" : undefined,
    time:   status !== "live" ? timeLabel : undefined,
    status,
  };
}

// ── ESPN fallback ─────────────────────────────────────────────────────────────
type ESPNComp = { competitors: { team: { displayName: string }; score: string; winner?: boolean }[]; status: { type: { state: string; completed: boolean; description: string }; displayClock: string } };

async function fetchESPNLive(): Promise<Match[]> {
  const results = await Promise.allSettled(
    ESPN_ENDPOINTS.map(({ url, sport, icon }) =>
      (fetchJson(url) as Promise<{ events?: { competitions?: ESPNComp[] }[] }>).then((data) => {
        const matches: Match[] = [];
        for (const ev of data?.events ?? []) {
          for (const comp of ev.competitions ?? []) {
            const [h, a] = comp.competitors ?? [];
            if (!h || !a) continue;
            const state = comp.status?.type?.state ?? "";
            const status: Match["status"] = state === "in" ? "live" : comp.status?.type?.completed ? "done" : "soon";
            matches.push({
              icon,
              home:   h.team.displayName,
              away:   a.team.displayName,
              league: sport,
              score:  state !== "pre" ? `${h.score} – ${a.score}` : undefined,
              minute: state === "in" ? comp.status.displayClock : undefined,
              status,
            });
          }
        }
        return matches;
      }),
    ),
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

// ── API-Football enrichment (V3) ──────────────────────────────────────────────
type AFFixture = {
  fixture: { status: { short: string; elapsed: number | null } };
  league: { name: string };
  teams: { home: { name: string }; away: { name: string } };
  goals: { home: number | null; away: number | null };
};

function labelForAFStatus(short: string, elapsed: number | null): string {
  switch (short) {
    case "1H": return elapsed != null ? `${elapsed}'` : "1re mi-temps";
    case "2H": return elapsed != null ? `${elapsed}'` : "2e mi-temps";
    case "HT": return "Mi-temps";
    case "ET": return elapsed != null ? `${elapsed}' (prol.)` : "Prolongations";
    case "P":  return "Tirs au but";
    default:   return short;
  }
}

function normName(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\b(fc|cf|sc|ac|club|de|the)\b/g, "").replace(/[^a-z0-9]/g, "");
}

async function fetchAFLive(): Promise<AFFixture[]> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return [];
  try {
    const res  = await fetchWithRetry(`${AF}/fixtures?live=all`, { headers: { "x-apisports-key": key } }, { retries: 2, timeoutMs: 6000 });
    const json = (await res.json()) as { response?: AFFixture[] };
    return json.response ?? [];
  } catch { return []; }
}

function mergeAFIntoMatches(matches: Match[], live: AFFixture[]): Match[] {
  if (live.length === 0) return matches;
  const consumed = new Set<number>();
  const enriched = matches.map((m) => {
    const homeN = normName(m.home), awayN = normName(m.away);
    const idx   = live.findIndex((f, i) => {
      if (consumed.has(i)) return false;
      const h = normName(f.teams.home.name), a = normName(f.teams.away.name);
      return (h.includes(homeN) || homeN.includes(h)) && (a.includes(awayN) || awayN.includes(a));
    });
    if (idx === -1) return m;
    consumed.add(idx);
    const f     = live[idx];
    const score = f.goals.home != null && f.goals.away != null ? `${f.goals.home} – ${f.goals.away}` : m.score;
    return { ...m, status: "live" as const, score, minute: labelForAFStatus(f.fixture.status.short, f.fixture.status.elapsed), time: undefined };
  });
  live.forEach((f, i) => {
    if (consumed.has(i)) return;
    enriched.push({ icon: "⚽", home: f.teams.home.name, away: f.teams.away.name, league: f.league.name, score: f.goals.home != null && f.goals.away != null ? `${f.goals.home} – ${f.goals.away}` : undefined, minute: labelForAFStatus(f.fixture.status.short, f.fixture.status.elapsed), status: "live" });
  });
  return enriched;
}

// ── Server functions ───────────────────────────────────────────────────────────
export const getLiveMatches = createServerFn({ method: "GET" }).handler(async (): Promise<Match[]> => {
  const [events, afLive] = await Promise.all([
    fetchTSDBDay(ymd(new Date())).catch(() => [] as TSDBEvent[]),
    fetchAFLive(),
  ]);
  const base = events.map((e) => ({ e, s: classifyTSDB(e) })).filter((x) => x.s === "live").map((x) => tsdbToMatch(x.e, x.s)).slice(0, 80);
  if (base.length > 0) return mergeAFIntoMatches(base, afLive).slice(0, 80);
  const espn = await fetchESPNLive().catch(() => []);
  return espn.filter((m) => m.status === "live").slice(0, 50);
});

export const getUpcomingMatches = createServerFn({ method: "GET" }).handler(async (): Promise<Match[]> => {
  const today    = ymd(new Date());
  const tomorrow = ymd(new Date(Date.now() + 86400000));
  const [a, b]   = await Promise.all([
    fetchTSDBDay(today).catch(() => [] as TSDBEvent[]),
    fetchTSDBDay(tomorrow).catch(() => [] as TSDBEvent[]),
  ]);
  const soon = [...a, ...b].map((e) => ({ e, s: classifyTSDB(e) })).filter((x) => x.s === "soon").map((x) => tsdbToMatch(x.e, x.s)).slice(0, 60);
  if (soon.length > 0) return soon;
  const espn = await fetchESPNLive().catch(() => []);
  return espn.filter((m) => m.status === "soon").slice(0, 60);
});

export const getFinishedMatches = createServerFn({ method: "GET" }).handler(async (): Promise<Match[]> => {
  const today     = ymd(new Date());
  const yesterday = ymd(new Date(Date.now() - 86400000));
  const [a, b]    = await Promise.all([
    fetchTSDBDay(today).catch(() => [] as TSDBEvent[]),
    fetchTSDBDay(yesterday).catch(() => [] as TSDBEvent[]),
  ]);
  const done = [...a, ...b].map((e) => ({ e, s: classifyTSDB(e) })).filter((x) => x.s === "done").map((x) => tsdbToMatch(x.e, x.s)).slice(0, 60);
  if (done.length > 0) return done;
  const espn = await fetchESPNLive().catch(() => []);
  return espn.filter((m) => m.status === "done").slice(0, 60);
});

// ── Actualités RSS ────────────────────────────────────────────────────────────
const CAT_RULES: [RegExp, string, string][] = [
  [/foot|ligue 1|premier league|liga|serie a|bundesliga|psg|om|real|barça|barca/i, "football", "⚽"],
  [/tennis|roland|wimbledon|us open|atp|wta|djokovic|alcaraz|sinner/i,             "tennis",   "🎾"],
  [/nba|basket|lakers|celtics|wembanyama|euroligue/i,                               "basket",   "🏀"],
  [/formule 1|\bf1\b|verstappen|leclerc|hamilton|ferrari/i,                         "f1",       "🏎️"],
  [/cyclisme|tour de france|giro|vuelta|pogacar|vingegaard/i,                       "cyclisme", "🚴"],
  [/rugby|top 14|xv de france|toulouse|racing/i,                                    "rugby",    "🏉"],
  [/handball|starligue|karabatic/i,                                                 "handball", "🤾"],
  [/mma|ufc|boxe/i,                                                                 "mma",      "🥊"],
  [/motogp|moto\s?gp|quartararo/i,                                                  "motogp",   "🏍️"],
];

function pickCat(text: string): { cat: string; icon: string } {
  for (const [re, cat, icon] of CAT_RULES) if (re.test(text)) return { cat, icon };
  return { cat: "football", icon: "🏆" };
}

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function timeAgo(date: Date) {
  const diff = Math.max(0, Date.now() - date.getTime());
  const m    = Math.floor(diff / 60000);
  if (m < 1)  return "à l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

function stripHtml(s: string) {
  return s
    .replace(/<[^>]+>/g, " ")   // remplace les tags par un espace (évite mots collés)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s{2,}/g, " ")    // collapse les espaces multiples
    .trim();
}

/**
 * Extrait le contenu d'un ou plusieurs tags XML, tolère les namespaces
 * (ex: <dc:date>) et les CDATA.
 */
function pickTag(block: string, ...tags: string[]): string {
  for (const tag of tags) {
    const rex = new RegExp(`<(?:[\\w-]+:)?${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w-]+:)?${tag}>`, "i");
    const r   = block.match(rex);
    if (r) return r[1].replace(/^\s*<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "").trim();
  }
  return "";
}

/**
 * Extrait l'URL d'un bloc RSS/Atom.
 * Google News encapsule le <link> dans un CDATA contenant du HTML (<a href="...">).
 * On détecte ce cas et on extrait l'href directement.
 */
function pickLink(block: string): string {
  const raw = pickTag(block, "link");

  // Cas Google News : le contenu du tag <link> est un fragment HTML "<a href="...">"
  const hrefInHtml = raw.match(/href=["']([^"']+)["']/i);
  if (hrefInHtml) return hrefInHtml[1];

  // Cas Atom : <link href="..." /> (self-closing, pas de texte interne)
  if (!raw) {
    const selfClosing = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
    if (selfClosing) return selfClosing[1];
  }

  return raw;
}

type RssItem = { title: string; link: string; pubDate: string; description: string; source: string };

function parseRss(xml: string, defaultSource: string): RssItem[] {
  const items: RssItem[] = [];
  const isAtom = !/<item[\s>]/i.test(xml) && /<entry[\s>]/i.test(xml);
  const re     = isAtom ? /<entry[\s\S]*?<\/entry>/g : /<item[\s\S]*?<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const block = m[0];
    const title = stripHtml(pickTag(block, "title"));
    if (!title) continue;
    items.push({
      title,
      link:        pickLink(block),
      pubDate:     pickTag(block, "pubDate", "dc:date", "published", "updated"),
      description: stripHtml(pickTag(block, "description", "summary", "content")),
      source:      stripHtml(pickTag(block, "source")) || defaultSource,
    });
  }
  return items;
}

function deduplicateItems(items: RssItem[]): RssItem[] {
  const seenTitles = new Set<string>();
  const seenUrls   = new Set<string>();
  return items.filter((it) => {
    const normTitle = it.title.toLowerCase().slice(0, 40).replace(/\s+/g, " ").trim();
    const normUrl   = it.link.split("?")[0].replace(/\/$/, "");
    if (seenTitles.has(normTitle) || (normUrl && seenUrls.has(normUrl))) return false;
    seenTitles.add(normTitle);
    if (normUrl) seenUrls.add(normUrl);
    return true;
  });
}

export const getSportsNews = createServerFn({ method: "GET" }).handler(async (): Promise<Article[]> => {
  const results = await Promise.allSettled(
    NEWS_FEEDS.map(({ url, source }) => fetchText(url).then((xml) => parseRss(xml, source))),
  );

  const allItems: RssItem[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      allItems.push(...r.value);
    } else {
      const { url, source } = NEWS_FEEDS[i];
      console.warn(`[SportLive] Flux RSS indisponible — ${source} (${url}):`, r.reason);
    }
  });

  if (allItems.length === 0) return [];

  allItems.sort((a, b) => {
    const da = a.pubDate ? Date.parse(a.pubDate) : 0;
    const db = b.pubDate ? Date.parse(b.pubDate) : 0;
    return db - da;
  });

  const items = deduplicateItems(allItems).slice(0, 30);
  const featuredBg = [
    "linear-gradient(135deg,#0A1710,#12241A)",
    "linear-gradient(135deg,#08150F,#0E2016)",
    "linear-gradient(135deg,#0B1712,#122A1D)",
  ];

  return items.map((it, i) => {
    const { cat, icon } = pickCat(`${it.title} ${it.description}`);
    const date          = it.pubDate ? new Date(it.pubDate) : new Date();
    const isFeatured    = i === 0 || i === Math.floor(items.length / 2);
    return {
      slug:     slugify(it.title) || `article-${i}`,
      cat,
      icon,
      title:    it.title,
      excerpt:  it.description.slice(0, 220),
      time:     isNaN(date.getTime()) ? "récemment" : timeAgo(date),
      source:   it.source,
      featured: isFeatured,
      bg:       isFeatured ? featuredBg[i % featuredBg.length] : undefined,
    };
  });
});
