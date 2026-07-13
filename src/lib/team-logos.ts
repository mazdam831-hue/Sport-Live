// Dynamic team logo fetcher with caching
const logoCache = new Map<string, string>();

const FALLBACK_LOGOS: Record<string, string> = {
  "football": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Fusball_DFB.svg/100px-Fusball_DFB.svg.png",
  "tennis": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Tenis_CoA.svg/100px-Tenis_CoA.svg.png",
  "basketball": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Basketball.svg/100px-Basketball.svg.png",
  "f1": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Formula_1_logo_2020%2C_World_Championship.svg/100px-Formula_1_logo_2020%2C_World_Championship.svg.png",
  "rugby": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Rugby_league_ball.svg/100px-Rugby_league_ball.svg.png",
  "handball": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Handball_pictogram.svg/100px-Handball_pictogram.svg.png",
  "golf": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Golf_ball.svg/100px-Golf_ball.svg.png",
  "volleyball": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Volley_ball.svg/100px-Volley_ball.svg.png",
};

export async function getTeamLogo(teamName: string, sport: string = "football"): Promise<string> {
  // Check cache first
  if (logoCache.has(teamName)) {
    return logoCache.get(teamName)!;
  }

  try {
    // Search Wikimedia for team logo
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(teamName + " logo")}&format=json&origin=*`
    );
    const data = await response.json();
    
    if (data.query?.search?.length > 0) {
      const firstResult = data.query.search[0].title;
      // Construct Wikimedia image URL
      const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/${firstResult.substring(5)}/100px-${firstResult.substring(5)}`;
      logoCache.set(teamName, imageUrl);
      return imageUrl;
    }
  } catch (error) {
    console.error(`Logo fetch failed for ${teamName}:`, error);
  }

  // Fallback to sport-specific default
  const sportLower = sport.toLowerCase();
  const fallback = FALLBACK_LOGOS[sportLower] || FALLBACK_LOGOS["football"];
  logoCache.set(teamName, fallback);
  return fallback;
}

export function getFallbackLogo(sport: string = "football"): string {
  return FALLBACK_LOGOS[sport.toLowerCase()] || FALLBACK_LOGOS["football"];
}
