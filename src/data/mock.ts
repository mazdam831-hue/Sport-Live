export type Match = {
  icon: string;
  home: string;
  away: string;
  league: string;
  score?: string;
  minute?: string;
  status: "live" | "done" | "soon";
  time?: string;
};

export type Article = {
  slug: string;
  cat: string;
  icon: string;
  title: string;
  excerpt: string;
  time: string;
  source: string;
  featured?: boolean;
  bg?: string;
};

export type Stream = {
  name: string;
  icon: string;
  sports: string;
  type: "free" | "pay" | "mix";
  url: string;
  desc: string;
};

export type Horaire = { icon: string; title: string; rows: [string, string][] };
export type Sport = {
  slug: string;
  icon: string;
  name: string;
  desc: string;
  tags: string[];
  live: boolean;
};

export const LIVE_MATCHES: Match[] = [
  { icon: "⚽", home: "PSG", away: "OM", league: "Ligue 1", score: "2 – 1", minute: "72'", status: "live" },
  { icon: "🎾", home: "Alcaraz", away: "Djokovic", league: "Wimbledon", score: "2 – 1", minute: "3e set", status: "live" },
  { icon: "🏀", home: "Lakers", away: "Bulls", league: "NBA", score: "88 – 91", minute: "Q3", status: "live" },
  { icon: "🏎️", home: "Verstappen P1", away: "Leclerc P3", league: "GP Monaco", score: "42/78", minute: "Tour", status: "live" },
  { icon: "🚴", home: "Pogacar", away: "Vingegaard", league: "Tour de France", score: "+2'14\"", minute: "km 94", status: "live" },
  { icon: "🏉", home: "Toulouse", away: "La Rochelle", league: "Top 14", score: "21 – 17", minute: "65'", status: "live" },
];

export const UPCOMING: Match[] = [
  { icon: "⚽", home: "Real Madrid", away: "FC Barcelona", league: "La Liga", status: "soon", time: "21h00" },
  { icon: "⚽", home: "Manchester City", away: "Arsenal", league: "Premier League", status: "soon", time: "17h30" },
  { icon: "⚽", home: "Bayern Munich", away: "Dortmund", league: "Bundesliga", status: "soon", time: "18h30" },
  { icon: "🏀", home: "Boston Celtics", away: "Miami Heat", league: "NBA", status: "soon", time: "01h00" },
  { icon: "🎾", home: "Sinner", away: "Medvedev", league: "ATP Masters", status: "soon", time: "11h00" },
  { icon: "🏉", home: "Clermont", away: "Stade Français", league: "Top 14", status: "soon", time: "18h00" },
];

export const FINISHED: Match[] = [
  { icon: "⚽", home: "Liverpool", away: "Chelsea", league: "Premier League", score: "3 – 2", status: "done", time: "FT" },
  { icon: "🏀", home: "Warriors", away: "Suns", league: "NBA", score: "112 – 108", status: "done", time: "FT" },
  { icon: "🎾", home: "Swiatek", away: "Sabalenka", league: "WTA Rome", score: "6-3 6-4", status: "done", time: "FT" },
];

export const ARTICLES: Article[] = [
  { slug: "psg-om-classico", cat: "football", icon: "⚽", title: "Ligue 1 : PSG-OM, choc au sommet au Parc des Princes", excerpt: "Le Classico s'annonce explosif. Le PSG domine le championnat mais l'OM crée la surprise.", time: "Il y a 12 min", source: "L'Équipe", featured: true, bg: "linear-gradient(135deg,#0A1710,#12241A)" },
  { slug: "wimbledon-alcaraz-djokovic", cat: "tennis", icon: "🎾", title: "Wimbledon : Alcaraz défie Djokovic en demi-finale", excerpt: "L'Espagnol, champion en titre, affrontera le Serbe pour une place en finale.", time: "Il y a 28 min", source: "Eurosport" },
  { slug: "gp-monaco-verstappen", cat: "f1", icon: "🏎️", title: "GP Monaco : Verstappen en pole, Leclerc sous pression", excerpt: "Max Verstappen a signé la pole. Charles Leclerc, natif de Monaco, part 3e.", time: "Il y a 35 min", source: "F1 TV" },
  { slug: "nba-lakers-celtics", cat: "basket", icon: "🏀", title: "NBA Playoffs : LeBron porte les Lakers face aux Celtics", excerpt: "Avec 31 points et 10 passes, LeBron James a mené Los Angeles en prolongation.", time: "Il y a 1h", source: "NBA.com" },
  { slug: "tour-france-pogacar", cat: "cyclisme", icon: "🚴", title: "Tour de France : Pogacar accélère, Vingegaard craque", excerpt: "Tadej Pogacar a placé une attaque décisive dans le col du Galibier.", time: "Il y a 1h30", source: "FranceInfo Sport", featured: true, bg: "linear-gradient(135deg,#08150F,#0E2016)" },
  { slug: "top14-toulouse-titre", cat: "rugby", icon: "🏉", title: "Top 14 : Stade Toulousain champion, 23e titre historique", excerpt: "Toulouse a battu La Rochelle 32-20 en finale au Stade de France.", time: "Il y a 2h", source: "LNR.fr" },
  { slug: "mbappe-real-prolongation", cat: "football", icon: "⚽", title: "Transferts : Mbappé prolonge au Real Madrid jusqu'en 2028", excerpt: "Kylian Mbappé a signé une prolongation avec le Real Madrid selon les médias espagnols.", time: "Il y a 2h15", source: "L'Équipe" },
  { slug: "nadal-bilan-retraite", cat: "tennis", icon: "🎾", title: "Rafael Nadal : un an après sa retraite, quel bilan ?", excerpt: "Depuis sa retraite officielle en novembre 2024, l'Espagnol reste une figure incontournable du tennis mondial.", time: "Il y a 3h", source: "Eurosport" },
  { slug: "wembanyama-mvp", cat: "basket", icon: "🏀", title: "Victor Wembanyama MVP : une saison historique pour le Français", excerpt: "Le Français a remporté le trophée de MVP à seulement 21 ans après une saison exceptionnelle en NBA.", time: "Il y a 9h", source: "NBA.com", featured: true, bg: "linear-gradient(135deg,#0B1712,#122A1D)" },
  { slug: "ferrari-barcelone", cat: "f1", icon: "🏎️", title: "Ferrari annonce une évolution majeure pour Barcelone", excerpt: "La Scuderia présente un fond plat et un aileron retouchés.", time: "Il y a 10h", source: "F1 TV" },
  { slug: "giro-evenepoel", cat: "cyclisme", icon: "🚴", title: "Giro : Evenepoel lâche le peloton dans le Stelvio", excerpt: "Le champion belge a accéléré à 12 km du sommet.", time: "Il y a 11h", source: "Eurosport" },
  { slug: "psg-handball-nantes", cat: "handball", icon: "🤾", title: "Starligue : le PSG Handball déroule face à Nantes", excerpt: "Victoire nette 34-27 des Parisiens qui creusent l'écart en tête.", time: "Il y a 13h", source: "L'Équipe" },
];

export const STREAMS: Stream[] = [
  { name: "France TV Sport", icon: "📺", sports: "Cyclisme · Rugby · Athlétisme · JO", type: "free", url: "https://www.france.tv/sport", desc: "Le service public : Tour de France, Roland-Garros, Six Nations en clair." },
  { name: "L'Équipe TV", icon: "📺", sports: "Football · Handball · Boxe", type: "free", url: "https://www.lequipe.fr/television/", desc: "La chaîne 100% sport gratuite du groupe L'Équipe." },
  { name: "Molotov TV", icon: "📡", sports: "40+ chaînes sport en direct", type: "free", url: "https://www.molotov.tv/fr_fr/cat/3/sport", desc: "Agrégateur TV gratuit : chaînes sportives en clair sur un seul écran." },
  { name: "Sport en France", icon: "🏆", sports: "70+ sports · Chaîne du CNOSF", type: "free", url: "https://sportenfrance.com/", desc: "Sports olympiques et fédérations en accès libre." },
  { name: "FranceInfo Sport", icon: "🚴", sports: "Tour de France · Race Center", type: "free", url: "https://www.franceinfo.fr/sports/directs/", desc: "Directs commentés, race center cyclisme minute par minute." },
  { name: "Eurosport", icon: "🌸", sports: "Tennis · Cyclisme · Ski · Snooker", type: "mix", url: "https://www.eurosport.fr/watch/", desc: "Actus gratuits ; directs complets via abonnement Eurosport/Max." },
  { name: "NBA.com", icon: "🏀", sports: "Scores · Highlights · NBA TV", type: "mix", url: "https://www.nba.com/games", desc: "Scores et highlights gratuits ; matchs complets via League Pass." },
  { name: "MotoGP", icon: "🏍️", sports: "MotoGP · Moto2 · Moto3", type: "mix", url: "https://www.motogp.com/en", desc: "Résumés et timing gratuits ; courses complètes via VideoPass." },
  { name: "UFC", icon: "🥊", sports: "MMA · Prelims gratuits", type: "mix", url: "https://www.ufc.com/events", desc: "Early prelims souvent gratuits ; main cards en pay-per-view." },
  { name: "F1 TV", icon: "🏎️", sports: "Formule 1 officiel", type: "pay", url: "https://f1tv.formula1.com/", desc: "Toutes les séances F1 en direct, onboards et data en temps réel." },
  { name: "myCANAL", icon: "📺", sports: "CL · PL · Top 14 · MotoGP · F1", type: "pay", url: "https://www.canalplus.com/sport", desc: "L'offre sport premium la plus complète en France." },
  { name: "beIN Sports", icon: "📺", sports: "Champions League · NBA · Hand", type: "pay", url: "https://www.beinsports.com/fr", desc: "Football international, NBA et sports co." },
];

export const HORAIRES: Horaire[] = [
  { icon: "⚽", title: "Football", rows: [["Ligue 1", "Mer & Sam 21h"], ["Premier League", "Sam 13h & 16h"], ["Champions League", "Mar-Mer 21h"], ["La Liga / Serie A", "Sam-Dim 18h-22h"]] },
  { icon: "🎾", title: "Tennis", rows: [["Sessions", "11h – 21h"], ["Finales Grand Chelem", "15h"], ["ATP Masters", "14h & 20h"], ["Night session", "19h"]] },
  { icon: "🏀", title: "Basketball", rows: [["NBA (h. fr.)", "01h – 04h"], ["Playoffs", "01h30 & 04h"], ["Finals", "02h"], ["Euroligue", "18h30 & 20h30"]] },
  { icon: "🏎️", title: "Formule 1", rows: [["EL1 & EL2", "Ven 12h30 & 16h"], ["EL3", "Sam 12h30"], ["Qualifs", "Sam 15h"], ["Course", "Dim 14h"]] },
  { icon: "🏍️", title: "MotoGP", rows: [["Essais libres", "Ven 09h & 13h30"], ["Qualifs", "Sam 10h15 & 14h"], ["Sprint", "Sam 15h"], ["Course", "Dim 13h"]] },
  { icon: "🚴", title: "Cyclisme", rows: [["Plaine", "Dép. 12h · Arr. 17h"], ["Montagne", "Dép. 12h · Arr. 18h"], ["CLM", "Dès 13h"], ["Classiques", "09h – 17h"]] },
  { icon: "🏉", title: "Rugby", rows: [["Top 14", "Ven 20h45"], ["Multiplex", "Sam 14h30 & 18h"], ["Champions Cup", "Sam 13h & 16h"], ["Six Nations", "Sam 14h45"]] },
  { icon: "🤾", title: "Handball", rows: [["Starligue", "Jeu 20h · Sam 17h"], ["LDC", "Mar-Mer 21h"], ["EHF Euro", "15h & 18h & 21h"]] },
];

export const SPORTS: Sport[] = [
  { slug: "football", icon: "⚽", name: "Football", desc: "Ligue 1, Premier League, Liga, Serie A, Bundesliga, Champions League.", tags: ["L'Équipe", "Molotov", "myCANAL"], live: true },
  { slug: "tennis", icon: "🎾", name: "Tennis", desc: "Roland-Garros, Wimbledon, US Open, circuits ATP et WTA.", tags: ["Eurosport", "France TV"], live: true },
  { slug: "basket", icon: "🏀", name: "Basketball", desc: "NBA, Playoffs, Finals, Euroligue, Betclic Élite.", tags: ["NBA.com", "beIN Sports"], live: true },
  { slug: "f1", icon: "🏎️", name: "Formule 1", desc: "Tous les GP, qualifs et essais libres sur F1 TV.", tags: ["F1 TV", "myCANAL"], live: false },
  { slug: "cyclisme", icon: "🚴", name: "Cyclisme", desc: "Tour de France, Giro, Vuelta et classiques.", tags: ["FranceInfo", "France TV"], live: true },
  { slug: "rugby", icon: "🏉", name: "Rugby", desc: "Top 14, Pro D2, Six Nations, Champions Cup.", tags: ["LNR.fr", "myCANAL"], live: true },
  { slug: "handball", icon: "🤾", name: "Handball", desc: "Starligue, Ligue des Champions EHF, équipes de France.", tags: ["EHF.eu"], live: false },
  { slug: "mma", icon: "🥊", name: "MMA · Boxe", desc: "UFC, Bellator, boxe anglaise, kick-boxing.", tags: ["UFC.com", "DAZN"], live: false },
  { slug: "motogp", icon: "🏍️", name: "MotoGP", desc: "Tous les Grands Prix Moto, Moto2, Moto3.", tags: ["MotoGP.com"], live: false },
  { slug: "athletisme", icon: "🏃", name: "Athlétisme", desc: "Diamond League, Championnats du monde, JO.", tags: ["World Athletics"], live: false },
  { slug: "golf", icon: "⛳", name: "Golf", desc: "Masters, US Open, The Open Championship, Ryder Cup.", tags: ["Golf Channel"], live: false },
  { slug: "volley", icon: "🏐", name: "Volleyball", desc: "Ligue des Nations, championnats du monde, Ligue A.", tags: ["FFVolley"], live: false },
];

export const TICKER = [
  "⚽ Ligue 1 · PSG 2–1 OM · 72'",
  "🎾 Wimbledon · Alcaraz 6-4 3-6 5-2 · 3e set",
  "🏀 NBA · Lakers 88–91 Bulls · Q3",
  "🏎️ F1 · GP Monaco · Verstappen P1 · Tour 42/78",
  "🚴 Tour de France · Pogacar en tête · km 94",
  "🏉 Top 14 · Toulouse 21–17 La Rochelle · 65'",
  "📺 Molotov TV · Sport gratuit 24h/24",
  "🥊 UFC 312 · Ce samedi · Main card 03h00",
];

export const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/scores", label: "Scores" },
  { to: "/actus", label: "Actualités" },
  { to: "/streaming", label: "Streaming" },
  { to: "/horaires", label: "Programme" },
  { to: "/sports", label: "Sports" },
  { to: "/alertes", label: "Alertes" },
  { to: "/a-propos", label: "À propos" },
] as const;
