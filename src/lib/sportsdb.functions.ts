import { createServerFn } from "@tanstack/react-start";
import type { Match, Article } from "@/data/mock";

// ── Clé & base URL TheSportsDB ───────────────────────────────────────────────
// Supporte une clé API personnelle via VITE_SPORTSDB_API_KEY dans .env
// "3" = clé publique gratuite
const TSDB_KEY =
  (typeof import.meta !== "undefined" && (import.meta.env as Record<string, string>)?.VITE_SPORTSDB_API_KEY) ||
  process.env?.VITE_SPORTSDB_API_KEY ||
  "3";
const TSDB = `https://www.thesportsdb.com/api/v1/json/${TSDB_KEY}`;

// ── ESPN public API (source de secours, sans clé) ────────────────────────────
const ESPN_ENDPOINTS: { url: string; sport: string; icon: string }[] = [
  { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard",       sport: "Soccer",       icon: "⚽" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",   sport: "Basketball",   icon: "🏀" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",     sport: "American Football", icon: "🏈" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",       sport: "Ice Hockey",   icon: "🏒" },
];

// ── Flux RSS d'actualités sportives francophones ─────────────────────────────
const NEWS_FEEDS: { url: string; source: string }[] = [
  { url: "https://news.google.com/rss/search?q=sport+when:1d&hl=fr&gl=FR&ceid=FR:fr",     source: "Google News" },
  { url: "https://www.lequipe.fr/rss/actu_rss.xml",                                         source: "L'Équipe" },
  { url: "https://rmcsport.bfmtv.com/rss/infos/",                                           source: "RMC Sport" },
  { url: "https://www.eurosport.fr/rss.xml",                                                 source: "Eurosport" },
];

// ── Helpers communs ───────────────────────────────────────────────────────────

const SPORT_META: Record<string, { icon: string }> = {
  Soccer:            { icon: "⚽" },
  Basketball:        { icon: "🏀" },
  "Ice Hockey":      { icon: "🏒" },
  "American Football":{ icon: "🏈" },
  Baseball:          { icon: "⚾" },
  Rugby:             { icon: "🏉" },
  Motorsport:        { icon: "🏎️" },
  Fighting:          { icon: "🥊" },
  Tennis:            { icon: "🎾" },
  Cycling:           { icon: "🚴" },
  Handball:          { icon: "🤾" },
};

function iconFor(sport?: string | null) {
  if (!sport) return "🏆";
  return SPORT_META[sport]?.icon ?? "🏆";
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.json();
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "SportLive/1.0", Accept: "application/rss+xml, text/xml, */*" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
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
      const evs = (data?.events ?? []) as TSDBEvent[] | null;
      if (Array.isArray(evs)) events.push(...evs);
    }
  }
  return events;
}

function classifyTSDB(e: TSDBEvent): Match["status"] {
  const raw = (e.strStatus || e.strProgress || "").trim();
  if (/^(FT|AET|AP|Match Finished|Finished|Ended|Full Time)$/i.test(raw)) return "done";
  const hasScore = e.intHomeScore != null && e.intAwayScore != null;
  const startedMs = e.strTimestamp ? Date.parse(e.strTimestamp) : NaN;
  const now = Date.now();
  if (!isNaN(startedMs) && startedMs <= now && !hasScore) return "live";
  if (hasScore) {
    if (!isNaN(startedMs) && now - startedMs > 4 * 3600 * 1000) return "done";
    return "live";
  }
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
    icon: iconFor(e.strSport),
    home: e.strHomeTeam ?? "—",
    away: e.strAwayTeam ?? "—",
    league: e.strLeague ?? e.strSport ?? "—",
    score,
    minute: status === "live" ? e.strProgress || e.strStatus || "LIVE" : undefined,
    time: status !== "live" ? timeLabel : undefined,
    status,
  };
}

// ── ESPN (source de secours) ──────────────────────────────────────────────────

type ESPNCompetitor = {
  homeAway?: string;
  team?: { displayName?: string };
  score?: string;
};
type ESPNCompetition = {
  competitors?: ESPNCompetitor[];
  status?: {
    type?: { name?: string; completed?: boolean; state?: string };
    displayClock?: string;
  };
  notes?: Array<{ headline?: string }>;
};
type ESPNEvent = {
  name?: string;
  competitions?: ESPNCompetition[];
};

function espnToMatches(data: unknown, icon: string, leagueName: string): Match[] {
  const events = ((data as Record<string, unknown>)?.events ?? []) as ESPNEvent[];
  const out: Match[] = [];
  for (const ev of events) {
    const comp = ev.competitions?.[0];
    if (!comp) continue;
    const home = comp.competitors?.find((c) => c.homeAway === "home");
    const away = comp.competitors?.find((c) => c.homeAway === "away");
    if (!home || !away) continue;
    const state = comp.status?.type?.state ?? "";
    const completed = comp.status?.type?.completed ?? false;
    let status: Match["status"];
    if (completed) status = "done";
    else if (state === "in") status = "live";
    else status = "soon";
    const homeScore = home.score;
    const awayScore = away.score;
    const score =
      homeScore !== undefined && awayScore !== undefined
        ? `${homeScore} – ${awayScore}`
        : undefined;
    out.push({
      icon,
      home: home.team?.displayName ?? "—",
      away: away.team?.displayName ?? "—",
      league: leagueName,
      score,
      minute: status === "live" ? comp.status?.displayClock ?? "LIVE" : undefined,
      status,
    });
  }
  return out;
}

async function fetchESPNMatches(statusFilter: Match["status"]): Promise<Match[]> {
  const results = await Promise.allSettled(
    ESPN_ENDPOINTS.map(({ url, sport, icon }) =>
      fetchJson(url).then((data) => espnToMatches(data, icon, sport)),
    ),
  );
  const matches: Match[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") matches.push(...r.value);
  }
  return matches.filter((m) => m.status === statusFilter);
}

// ── Fonctions exportées — scores ──────────────────────────────────────────────

export const getLiveMatches = createServerFn({ method: "GET" }).handler(async (): Promise<Match[]> => {
  try {
    const events = await fetchTSDBDay(ymd(new Date()));
    const live = events
      .map((e) => ({ e, s: classifyTSDB(e) }))
      .filter((x) => x.s === "live")
      .map((x) => tsdbToMatch(x.e, x.s));
    if (live.length > 0) return live.slice(0, 50);
  } catch { /* fallback ci-dessous */ }

  // Secours : ESPN
  try {
    const espn = await fetchESPNMatches("live");
    if (espn.length > 0) return espn.slice(0, 50);
  } catch { /* les deux sources ont échoué */ }

  return [];
});

export const getUpcomingMatches = createServerFn({ method: "GET" }).handler(async (): Promise<Match[]> => {
  const today    = ymd(new Date());
  const tomorrow = ymd(new Date(Date.now() + 86400000));
  try {
    const [a, b] = await Promise.all([fetchTSDBDay(today), fetchTSDBDay(tomorrow)]);
    const soon = [...a, ...b]
      .map((e) => ({ e, s: classifyTSDB(e) }))
      .filter((x) => x.s === "soon")
      .map((x) => tsdbToMatch(x.e, x.s));
    if (soon.length > 0) return soon.slice(0, 60);
  } catch { /* fallback */ }

  try {
    const espn = await fetchESPNMatches("soon");
    if (espn.length > 0) return espn.slice(0, 60);
  } catch { /* les deux sources ont échoué */ }

  return [];
});

export const getFinishedMatches = createServerFn({ method: "GET" }).handler(async (): Promise<Match[]> => {
  const today     = ymd(new Date());
  const yesterday = ymd(new Date(Date.now() - 86400000));
  try {
    const [a, b] = await Promise.all([fetchTSDBDay(today), fetchTSDBDay(yesterday)]);
    const done = [...a, ...b]
      .map((e) => ({ e, s: classifyTSDB(e) }))
      .filter((x) => x.s === "done")
      .map((x) => tsdbToMatch(x.e, x.s));
    if (done.length > 0) return done.slice(0, 60);
  } catch { /* fallback */ }

  try {
    const espn = await fetchESPNMatches("done");
    if (espn.length > 0) return espn.slice(0, 60);
  } catch { /* les deux sources ont échoué */ }

  return [];
});

// ── Flux RSS — actualités ─────────────────────────────────────────────────────

const CAT_RULES: [RegExp, string, string][] = [
  [/foot|ligue 1|premier league|liga|serie a|bundesliga|psg|om|real|barça|barca|champions/i, "football", "⚽"],
  [/tennis|roland|wimbledon|us open|atp|wta|djokovic|alcaraz|nadal|sinner/i, "tennis", "🎾"],
  [/nba|basket|lakers|celtics|wembanyama|euroligue/i, "basket", "🏀"],
  [/formule 1|\bf1\b|verstappen|leclerc|hamilton|ferrari|gp\s/i, "f1", "🏎️"],
  [/cyclisme|tour de france|giro|vuelta|pogacar|vingegaard/i, "cyclisme", "🚴"],
  [/rugby|top 14|xv de france|toulouse|racing|six nations/i, "rugby", "🏉"],
  [/handball|starligue|karabatic/i, "handball", "🤾"],
  [/mma|ufc|boxe|boxing/i, "mma", "🥊"],
  [/motogp|moto\s?gp|quartararo|marc marquez/i, "motogp", "🏍️"],
];

function pickCat(text: string): { cat: string; icon: string } {
  for (const [re, cat, icon] of CAT_RULES) if (re.test(text)) return { cat, icon };
  return { cat: "sport", icon: "🏆" };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function timeAgo(date: Date) {
  const diff = Math.max(0, Date.now() - date.getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

function stripHtml(s: string) {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

type RssItem = { title: string; link: string; pubDate: string; description: string; source: string };

function parseRss(xml: string, defaultSource: string): RssItem[] {
  const items: RssItem[] = [];
  const re = /<item[\s\S]*?<\/item>/g;
  let m: RegExpExecArray | null;
  const pick = (block: string, tag: string) => {
    const rex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
    const r = block.match(rex);
    if (!r) return "";
    return r[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
  };
  while ((m = re.exec(xml)) !== null) {
    const block = m[0];
    items.push({
      title:       stripHtml(pick(block, "title")),
      link:        pick(block, "link"),
      pubDate:     pick(block, "pubDate"),
      description: stripHtml(pick(block, "description")),
      source:      stripHtml(pick(block, "source")) || defaultSource,
    });
  }
  return items;
}

/** Déduplique par titre normalisé (40 premiers caractères) et par URL */
function deduplicateItems(items: RssItem[]): RssItem[] {
  const seenTitles = new Set<string>();
  const seenUrls   = new Set<string>();
  return items.filter((it) => {
    if (!it.title) return false;
    const normTitle = it.title.toLowerCase().slice(0, 40).replace(/\s+/g, " ").trim();
    const normUrl   = it.link.split("?")[0].replace(/\/$/, "");
    if (seenTitles.has(normTitle) || (normUrl && seenUrls.has(normUrl))) return false;
    seenTitles.add(normTitle);
    if (normUrl) seenUrls.add(normUrl);
    return true;
  });
}

export const getSportsNews = createServerFn({ method: "GET" }).handler(async (): Promise<Article[]> => {
  // Fetch tous les flux en parallèle — on ignore les erreurs individuelles
  const results = await Promise.allSettled(
    NEWS_FEEDS.map(({ url, source }) =>
      fetchText(url).then((xml) => parseRss(xml, source)),
    ),
  );

  const allItems: RssItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") allItems.push(...r.value);
  }

  if (allItems.length === 0) return [];

  // Trier par date décroissante, puis dédupliquer
  allItems.sort((a, b) => {
    const da = a.pubDate ? Date.parse(a.pubDate) : 0;
    const db = b.pubDate ? Date.parse(b.pubDate) : 0;
    return db - da;
  });
  const items = deduplicateItems(allItems).slice(0, 30);

  const featuredIdx = new Set([0, Math.floor(items.length / 3)]);
  const featuredBg = [
    "linear-gradient(135deg,#0A1710,#12241A)",
    "linear-gradient(135deg,#08150F,#0E2016)",
    "linear-gradient(135deg,#0B1712,#122A1D)",
  ];

  return items.map((it, i) => {
    const cat  = pickCat(`${it.title} ${it.description}`);
    const date = it.pubDate ? new Date(it.pubDate) : new Date();
    return {
      slug:     slugify(it.title) || `article-${i}`,
      cat:      cat.cat,
      icon:     cat.icon,
      title:    it.title,
      excerpt:  it.description.slice(0, 220),
      time:     isNaN(date.getTime()) ? "récemment" : timeAgo(date),
      source:   it.source,
      featured: featuredIdx.has(i),
      bg:       featuredIdx.has(i) ? featuredBg[i % featuredBg.length] : undefined,
    };
  });
});
