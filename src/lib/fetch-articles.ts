export async function fetchRSSArticles(feedUrl: string) {
  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
    const data = await response.json();
    
    if (data.items) {
      return data.items.slice(0, 5).map((item: any) => ({
        slug: item.guid || item.link,
        title: item.title.substring(0, 60), // Limiter à 60 caractères
        excerpt: item.description?.replace(/<[^>]*>/g, '').substring(0, 100) || '',
        time: new Date(item.pubDate).toLocaleString('fr-FR'),
        source: item.source?.title || 'News',
        link: item.link,
      }));
    }
  } catch (error) {
    console.error('RSS fetch failed:', error);
  }
  return [];
}

export async function getAllArticles() {
  const feeds = [
    'https://www.lequipe.fr/rss/actu.xml',
    'https://rmcsport.bfmtv.com/rss',
    'https://www.eurosport.fr/rss/actualites.xml',
  ];
  
  const allArticles = await Promise.all(feeds.map(feed => fetchRSSArticles(feed)));
  return allArticles.flat().slice(0, 10); // Max 10 articles
}
