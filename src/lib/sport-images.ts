/**
 * Mapping central : clé sport → images Unsplash + couleur accent.
 * Chaque sport dispose de 4 à 6 variantes ; sportMeta() choisit la variante
 * de manière déterministe (hash de l'input) pour que le même match affiche
 * toujours la même image, mais que des matchs différents varient visuellement.
 */
export type SportKey =
  | "football"
  | "tennis"
  | "basket"
  | "f1"
  | "motogp"
  | "cyclisme"
  | "rugby"
  | "handball"
  | "mma"
  | "athletisme"
  | "ski"
  | "hockey"
  | "golf"
  | "volley"
  | "tv"
  | "trophy";

const U = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

// ── Couleur et label par défaut (image principale conservée comme index 0) ───
export const SPORT_IMAGES: Record<SportKey, { img: string; color: string; label: string }> = {
  football:   { img: U("photo-1551958219-acbc608c6377"), color: "var(--sport-foot)",       label: "Football" },
  tennis:     { img: U("photo-1622279457486-62dcc4a431d6"), color: "var(--sport-tennis)",  label: "Tennis" },
  basket:     { img: U("photo-1546519638-68e109498ffc"),  color: "var(--sport-basket)",    label: "Basketball" },
  f1:         { img: U("photo-1568605117036-5fe5e7bab0b7"), color: "var(--sport-f1)",      label: "Formule 1" },
  motogp:     { img: U("photo-1517649763962-0c623066013b"), color: "var(--sport-motogp)",  label: "MotoGP" },
  cyclisme:   { img: U("photo-1508007226037-c8e6bef7dfe7"), color: "var(--sport-cyclisme)",label: "Cyclisme" },
  rugby:      { img: U("photo-1544919982-b61976f0ba43"),  color: "var(--sport-rugby)",     label: "Rugby" },
  handball:   { img: U("photo-1519861531473-9200262188bf"), color: "var(--sport-handball)",label: "Handball" },
  mma:        { img: U("photo-1517438322307-e67111335449"), color: "var(--sport-mma)",     label: "MMA · Boxe" },
  athletisme: { img: U("photo-1461896836934-ffe607ba8211"), color: "var(--sport-athletisme)", label: "Athlétisme" },
  ski:        { img: U("photo-1551698618-1dfe5d97d256"),  color: "var(--accent)",          label: "Ski" },
  hockey:     { img: U("photo-1580692475446-c2fabbbf4dc4"), color: "var(--accent)",        label: "Hockey" },
  golf:       { img: U("photo-1587174486073-ae5e5cff23aa"), color: "var(--sport-golf)",    label: "Golf" },
  volley:     { img: U("photo-1592656094267-764a45160876"), color: "var(--sport-volley)",  label: "Volleyball" },
  tv:         { img: U("photo-1522869635100-9f4c5e86aa37"), color: "var(--accent)",        label: "Diffusion" },
  trophy:     { img: U("photo-1567878884012-ef73df67c8c1"), color: "var(--sport-athletisme)", label: "Compétition" },
};

// ── Variantes par sport (4–6 photos Unsplash visuellement cohérentes) ────────
const SPORT_IMAGE_VARIANTS: Record<SportKey, string[]> = {
  football: [
    "photo-1551958219-acbc608c6377", // ballon sur gazon
    "photo-1574629810360-7efbbe195018", // stade aérien
    "photo-1518091043644-c1d4457512c6", // joueur en action
    "photo-1508098682722-e99c43a406b2", // but / célébration
    "photo-1431324155629-1a6dac1f3967", // gazon vert stade
    "photo-1511886929837-354d827aae26", // stade de nuit
  ],
  tennis: [
    "photo-1622279457486-62dcc4a431d6", // joueur en action
    "photo-1554068865-24cecd4e34b8",    // court vue aérienne
    "photo-1542144582-1ba00456b5e3",    // service puissant
    "photo-1535131749006-b7f58c99034b", // balle sur court
    "photo-1545809074-59472b3f5ecc",    // filet de tennis
  ],
  basket: [
    "photo-1546519638-68e109498ffc",    // panier et joueur
    "photo-1504450758481-7338eba7524a", // dribble en match
    "photo-1505666287802-931dc83948e9", // panier vu d'en bas
    "photo-1577471488278-16eec37ffcc2", // match NBA
    "photo-1608245449230-4ac19066d2d0", // terrain parquet
  ],
  f1: [
    "photo-1568605117036-5fe5e7bab0b7", // voiture F1 en course
    "photo-1541447271487-09612b3f49f7", // départ de course
    "photo-1490548862699-b20e78b0ee15", // pit stop
    "photo-1504197832061-98ff2c6e8c2b", // circuit aérien
    "photo-1559494007-9f5847c49d94",    // cockpit F1
  ],
  motogp: [
    "photo-1517649763962-0c623066013b", // moto en virage
    "photo-1558618666-fcd25c85cd64",    // course de motos
    "photo-1599058917765-a780eda07a3e", // moto de course
    "photo-1449426468159-d96dbf08f19f", // accélération
  ],
  cyclisme: [
    "photo-1508007226037-c8e6bef7dfe7", // peloton
    "photo-1541625602330-2277a4c46182", // montagne
    "photo-1534438327276-14e5300c3a48", // cycliste seul
    "photo-1476047792041-1d2ef3f34a3c", // route cycliste
    "photo-1569579933032-9e04cc25f08b", // départ de course
  ],
  rugby: [
    "photo-1544919982-b61976f0ba43",    // plaquage
    "photo-1611375126683-70bfaef3e64c", // mêlée
    "photo-1607457561901-e6ec3a6d16cf", // ballon ovale
    "photo-1551634979-2b11f8c946fe",    // match en stade
  ],
  handball: [
    "photo-1519861531473-9200262188bf", // gardien en action
    "photo-1569517282132-25d22f4573e6", // tir au but
    "photo-1558618047-3c8c76ca7d13",    // match de handball
    "photo-1494199505258-5f95387f933c", // ballon en vol
  ],
  mma: [
    "photo-1517438322307-e67111335449", // combat MMA
    "photo-1552196563-55cd4e45efb3",    // boxe en salle
    "photo-1530549387789-4c1017266635", // ring
    "photo-1571019613454-1cb2f99b2d8b", // gants de boxe
  ],
  athletisme: [
    "photo-1461896836934-ffe607ba8211", // course sur piste
    "photo-1476480862126-209bfaa8edc8", // départ de sprint
    "photo-1587741426406-b2c3cb6ad70c", // ligne d'arrivée
    "photo-1607962837359-5e7e89f86776", // saut en longueur
    "photo-1535131749006-b7f58c99034b", // stade d'athlétisme
  ],
  ski: [
    "photo-1551698618-1dfe5d97d256",    // descente
    "photo-1522163182402-834f871fd851", // slalom
    "photo-1547327132-cdfd968f4dc5",    // piste enneigée
    "photo-1517083704-b6d7ea27e87e",    // skieur en action
  ],
  hockey: [
    "photo-1580692475446-c2fabbbf4dc4", // match sur glace
    "photo-1614778701980-1234b87e2fad", // crosse et palet
    "photo-1578763363228-6e8428de69b2", // patinoire
    "photo-1565299507177-b0ac66763828", // gardien
  ],
  golf: [
    "photo-1587174486073-ae5e5cff23aa", // swing au départ
    "photo-1530028828-25beeabb1ff5",    // fairway
    "photo-1536240478700-b869ad10e2bc", // parcours aérien
    "photo-1591491634026-6b80bfc71b9b", // putting green
  ],
  volley: [
    "photo-1592656094267-764a45160876", // match en salle
    "photo-1547347298-4074fc3086f0",    // smash
    "photo-1612872087720-bb876e2e67d1", // beach volley
    "photo-1574158622682-e40e69881006", // filet de volley
  ],
  tv: [
    "photo-1522869635100-9f4c5e86aa37",
    "photo-1593359677879-a4bb92f829e1",
  ],
  trophy: [
    "photo-1567878884012-ef73df67c8c1",
    "photo-1579952363873-27f3bade9f55",
    "photo-1558618666-fcd25c85cd64",
  ],
};

// ── Lookup rapide ─────────────────────────────────────────────────────────────

const ALIASES: Record<string, SportKey> = {
  foot: "football", soccer: "football", basketball: "basket", nba: "basket",
  formule1: "f1", formula1: "f1", velo: "cyclisme", tourdefrance: "cyclisme",
  moto: "motogp", boxe: "mma", ufc: "mma", hand: "handball", athle: "athletisme",
};

const EMOJI_TO_KEY: Record<string, SportKey> = {
  "⚽": "football", "🎾": "tennis", "🏀": "basket", "🏎️": "f1", "🏎": "f1",
  "🏍️": "motogp", "🏍": "motogp", "🚴": "cyclisme", "🚵": "cyclisme",
  "🏉": "rugby", "🤾": "handball", "🥊": "mma", "🏃": "athletisme",
  "⛷️": "ski", "⛷": "ski", "🏒": "hockey", "⛳": "golf", "🏐": "volley",
  "📺": "tv", "📡": "tv", "🏆": "trophy", "🌸": "tennis",
};

export function resolveSport(input?: string | null): SportKey {
  if (!input) return "football";
  if (EMOJI_TO_KEY[input]) return EMOJI_TO_KEY[input];
  const norm = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (norm in SPORT_IMAGES) return norm as SportKey;
  if (ALIASES[norm]) return ALIASES[norm];
  for (const key of Object.keys(SPORT_IMAGES)) {
    if (norm.includes(key)) return key as SportKey;
  }
  for (const [alias, key] of Object.entries(ALIASES)) {
    if (norm.includes(alias)) return key;
  }
  for (const [emo, key] of Object.entries(EMOJI_TO_KEY)) {
    if (input.includes(emo)) return key;
  }
  return "football";
}

/** Hash djb2 léger — déterministe, varie par contenu de l'input */
function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h);
}

/**
 * Retourne les métadonnées du sport.
 * Si `input` est fourni, la variante d'image est choisie de façon déterministe
 * (hash de l'input) : même match → même image, mais deux matchs différents
 * du même sport peuvent afficher des visuels différents.
 */
export function sportMeta(input?: string | null) {
  const key = resolveSport(input);
  const base = SPORT_IMAGES[key];
  const variants = SPORT_IMAGE_VARIANTS[key];
  if (!variants || variants.length === 0) return base;
  const idx = input ? hashStr(input) % variants.length : 0;
  return { ...base, img: U(variants[idx]) };
}
