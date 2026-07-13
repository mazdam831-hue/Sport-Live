// Fetch images from Unsplash or Pexels based on query
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export async function fetchArticleImage(sport: string, title: string): Promise<string> {
  try {
    // Try Unsplash first
    if (UNSPLASH_KEY) {
      const query = `${sport} ${title}`.substring(0, 50);
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
      );
      const data = await response.json();
      if (data.results?.length > 0) {
        return data.results[0].urls.regular;
      }
    }

    // Fallback to Pexels
    if (PEXELS_KEY) {
      const query = `${sport}`.substring(0, 30);
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      const data = await response.json();
      if (data.photos?.length > 0) {
        return data.photos[0].src.large;
      }
    }

    // Fallback image
    return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80";
  } catch (error) {
    console.error("Image fetch failed:", error);
    return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80";
  }
}

export async function fetchSportImage(sport: string): Promise<string> {
  try {
    if (UNSPLASH_KEY) {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(sport)}&per_page=1`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
      );
      const data = await response.json();
      if (data.results?.length > 0) {
        return data.results[0].urls.regular;
      }
    }

    if (PEXELS_KEY) {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(sport)}&per_page=1`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      const data = await response.json();
      if (data.photos?.length > 0) {
        return data.photos[0].src.large;
      }
    }

    return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80";
  } catch (error) {
    console.error("Sport image fetch failed:", error);
    return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80";
  }
}
