const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.REACT_APP_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

const FALLBACK_NEWS = [
  {
    title: "Marine Life Under Threat: Global Study Reveals Impact of Ocean Pollution",
    description: "New research highlights the devastating effects of plastic pollution on marine ecosystems, with particular focus on coral reefs and marine mammals...",
    urlToImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-15T09:00:00Z",
    source: { name: "Ocean Conservation News" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Breakthrough in Marine Biology: New Species Discovered in Pacific",
    description: "Scientists have identified a previously unknown species of deep-sea fish, marking a significant breakthrough in marine biodiversity research...",
    urlToImage: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-14T10:30:00Z",
    source: { name: "Marine Science Today" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Climate Change's Impact on Ocean Currents: Latest Findings",
    description: "Recent studies show significant changes in ocean current patterns, raising concerns about marine ecosystems and global climate systems...",
    urlToImage: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-13T14:15:00Z",
    source: { name: "Climate Research Weekly" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Innovative Ocean Cleanup Technologies Show Promise",
    description: "New technologies for removing plastic waste from oceans demonstrate successful results in recent trials, offering hope for marine conservation...",
    urlToImage: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-12T11:45:00Z",
    source: { name: "Tech & Environment" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Sustainable Fishing Practices: A Global Initiative",
    description: "International cooperation leads to new guidelines for sustainable fishing, aiming to protect marine life while supporting fishing communities...",
    urlToImage: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-11T16:20:00Z",
    source: { name: "Sustainable Seas" },
    url: "https://marinetag.vercel.app/news"
  }
];

export const getNews = async () => {
  try {
    const query = encodeURIComponent('snorkeling OR snorkelling');
    const response = await fetch(
      `${BASE_URL}?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return FALLBACK_NEWS;
  }
};

export const searchNews = async (searchTerm) => {
  try {
    const query = encodeURIComponent(`${searchTerm} AND (snorkeling OR snorkelling)`);
    const response = await fetch(
      `${BASE_URL}?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error searching news:', error);
    const searchLower = searchTerm.toLowerCase();
    return FALLBACK_NEWS.filter(news => 
      news.title.toLowerCase().includes(searchLower) || 
      news.description.toLowerCase().includes(searchLower)
    );
  }
}; 