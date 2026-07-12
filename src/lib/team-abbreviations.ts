/**
 * Abréviation intelligente des noms d'équipes pour l'affichage compact
 * dans le Scoreboard et les cartes de match.
 *
 * Règles :
 *  1. Si le nom est déjà ≤ SHORT_THRESHOLD caractères → intact (PSG, OM, NBA…)
 *  2. Si le nom est dans KNOWN_ABBREVS → abréviation curatée
 *  3. Sinon → heuristique : premier mot significatif (ignore les préfixes FC/AS/RC…)
 *
 * Ne traite PAS les noms de joueurs individuels (ex : "Djokovic", "Alcaraz").
 * Ceux-ci sont détectés comme noms courts (un seul mot) et retournés intacts.
 */

const SHORT_THRESHOLD = 10;

const KNOWN_ABBREVS: Record<string, string> = {
  // ── Football ──────────────────────────────────────────────────────────────
  "Manchester City":            "Man City",
  "Manchester United":          "Man Utd",
  "Real Madrid":                "R. Madrid",
  "Atletico Madrid":            "Atl. Madrid",
  "Atlético de Madrid":         "Atl. Madrid",
  "Bayern Munich":              "Bayern",
  "FC Bayern München":          "Bayern",
  "Borussia Dortmund":          "Dortmund",
  "Bayer Leverkusen":           "Leverkusen",
  "RB Leipzig":                 "Leipzig",
  "Eintracht Frankfurt":        "Frankfurt",
  "Borussia Mönchengladbach":   "M'gladbach",
  "Tottenham Hotspur":          "Tottenham",
  "West Ham United":            "West Ham",
  "Wolverhampton Wanderers":    "Wolves",
  "Brighton & Hove Albion":     "Brighton",
  "Nottingham Forest":          "Nott'm F.",
  "Leicester City":             "Leicester",
  "Newcastle United":           "Newcastle",
  "Leeds United":               "Leeds",
  "Aston Villa":                "Aston Villa",
  "Crystal Palace":             "C. Palace",
  "Paris Saint-Germain":        "PSG",
  "Olympique Lyonnais":         "Lyon",
  "Olympique de Marseille":     "Marseille",
  "Stade Rennais":              "Rennes",
  "AS Monaco":                  "Monaco",
  "OGC Nice":                   "Nice",
  "FC Nantes":                  "Nantes",
  "Girondins de Bordeaux":      "Bordeaux",
  "Stade Brestois 29":          "Brest",
  "RC Strasbourg":              "Strasbourg",
  "Sporting CP":                "Sporting",
  "Benfica":                    "Benfica",
  "FC Porto":                   "Porto",
  "AC Milan":                   "Milan",
  "Inter Milan":                "Inter",
  "FC Internazionale":          "Inter",
  "Juventus FC":                "Juventus",
  "SS Lazio":                   "Lazio",
  "AS Roma":                    "Roma",
  "SSC Napoli":                 "Napoli",
  "FC Barcelona":               "Barça",
  "Sevilla FC":                 "Séville",
  "Valencia CF":                "Valencia",
  "Real Betis":                 "Betis",
  "Villarreal CF":              "Villarreal",
  "Celtic FC":                  "Celtic",
  "Rangers FC":                 "Rangers",
  "Ajax Amsterdam":             "Ajax",
  "AFC Ajax":                   "Ajax",
  "PSV Eindhoven":              "PSV",
  "Feyenoord":                  "Feyenoord",
  "Galatasaray SK":             "Galatasaray",
  "Fenerbahçe SK":              "Fenerbahçe",
  "Besiktas JK":                "Beşiktaş",
  "Shakhtar Donetsk":           "Shakhtar",
  // ── Basketball NBA ────────────────────────────────────────────────────────
  "Los Angeles Lakers":         "Lakers",
  "Los Angeles Clippers":       "Clippers",
  "Golden State Warriors":      "Warriors",
  "Boston Celtics":             "Celtics",
  "Brooklyn Nets":              "Nets",
  "New York Knicks":            "Knicks",
  "Philadelphia 76ers":         "76ers",
  "Miami Heat":                 "Heat",
  "Chicago Bulls":              "Bulls",
  "Milwaukee Bucks":            "Bucks",
  "Phoenix Suns":               "Suns",
  "Denver Nuggets":             "Nuggets",
  "San Antonio Spurs":          "Spurs",
  "Minnesota Timberwolves":     "Minnesota",
  "Oklahoma City Thunder":      "OKC",
  "Portland Trail Blazers":     "Portland",
  "Sacramento Kings":           "Sacramento",
  "New Orleans Pelicans":       "Pelicans",
  "Memphis Grizzlies":          "Memphis",
  "Dallas Mavericks":           "Dallas",
  "Houston Rockets":            "Houston",
  "Utah Jazz":                  "Utah Jazz",
  "Washington Wizards":         "Wizards",
  "Orlando Magic":              "Orlando",
  "Indiana Pacers":             "Pacers",
  "Cleveland Cavaliers":        "Cavs",
  "Detroit Pistons":            "Detroit",
  "Charlotte Hornets":          "Charlotte",
  "Toronto Raptors":            "Raptors",
  "Atlanta Hawks":              "Atlanta",
  // ── Rugby ─────────────────────────────────────────────────────────────────
  "Stade Toulousain":           "Toulouse",
  "Stade Aurillacois":          "Aurillac",
  "Stade Français Paris":       "St. Français",
  "Racing 92":                  "Racing",
  "Stade Rochelais":            "La Rochelle",
  "ASM Clermont Auvergne":      "Clermont",
  "Lyon OU":                    "LOU",
  "Bordeaux-Bèglès":            "UBB",
  "Section Paloise":            "Pau",
  "Bayonne":                    "Bayonne",
  "Perpignan":                  "Perpignan",
  "Montpellier Hérault Rugby":  "MHR",
  // ── F1 ────────────────────────────────────────────────────────────────────
  "Red Bull Racing":            "Red Bull",
  "Mercedes-AMG Petronas":      "Mercedes",
  "Scuderia Ferrari":           "Ferrari",
  "Aston Martin F1":            "Aston Martin",
  "McLaren F1 Team":            "McLaren",
  "Alpine F1 Team":             "Alpine",
  "Williams Racing":            "Williams",
  "Haas F1 Team":               "Haas",
  "Visa Cash App RB":           "RB",
  "Kick Sauber":                "Sauber",
};

const SKIP_PREFIXES = new Set([
  "fc", "as", "rc", "sc", "ac", "vfb", "rb", "ogc", "hsv", "vfl", "bsc",
  "fk", "cf", "ca", "ss", "sk", "ck", "afc", "asc", "fcu", "asm",
]);

/**
 * Abrège un nom d'équipe pour l'affichage compact.
 * Les noms ≤ SHORT_THRESHOLD caractères sont retournés sans modification.
 */
export function abbreviateTeam(name: string): string {
  if (!name) return name;
  if (name.length <= SHORT_THRESHOLD) return name;

  // Abréviation curatée connue
  if (KNOWN_ABBREVS[name]) return KNOWN_ABBREVS[name];

  const words = name.trim().split(/\s+/);
  if (words.length === 1) return name; // prénom ou nom court → intact

  // Premier mot significatif (ignore FC, AS, RC, etc.)
  const meaningful = words.find((w) => !SKIP_PREFIXES.has(w.toLowerCase()));
  if (meaningful && meaningful.length >= 4) return meaningful;

  // Dernier recours : deux premiers mots
  return words.slice(0, 2).join(" ");
}

/**
 * Abrège uniquement si le nom dépasse `maxLen` caractères.
 * Utile pour un seuil personnalisé selon la largeur disponible.
 */
export function abbreviateTeamIf(name: string, maxLen = SHORT_THRESHOLD): string {
  if (!name || name.length <= maxLen) return name;
  return abbreviateTeam(name);
}
