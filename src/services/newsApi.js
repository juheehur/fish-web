const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

const FALLBACK_NEWS = [
  {
    title: "Essential Tips for Beginner Snorkelers",
    description: "Learn the basics of snorkeling with our comprehensive guide for beginners, including equipment selection and breathing techniques...",
    urlToImage: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-15T09:00:00Z",
    source: { name: "Snorkeling Guide" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Best Snorkeling Spots Around the World",
    description: "Discover the top destinations for snorkeling adventures, from the Great Barrier Reef to the Caribbean's crystal-clear waters...",
    urlToImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-14T10:30:00Z",
    source: { name: "Travel Explorer" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Snorkeling Safety: What You Need to Know",
    description: "Important safety tips and guidelines for a safe snorkeling experience, including weather considerations and buddy system practices...",
    urlToImage: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-13T14:15:00Z",
    source: { name: "Water Safety Today" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Snorkeling Gear Guide 2024",
    description: "A detailed review of the latest snorkeling equipment, from masks to fins, helping you choose the best gear for your adventures...",
    urlToImage: "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-12T11:45:00Z",
    source: { name: "Gear Review" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Snorkeling with Sea Turtles: A Complete Guide",
    description: "Tips and guidelines for responsibly observing sea turtles while snorkeling, including best locations and seasonal timing...",
    urlToImage: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-11T16:20:00Z",
    source: { name: "Marine Life Guide" },
    url: "https://marinetag.vercel.app/news"
  }
];

export const getNews = async () => {
  if (process.env.NODE_ENV === 'production') {
    return FALLBACK_NEWS;
  }

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
  if (process.env.NODE_ENV === 'production') {
    const searchLower = searchTerm.toLowerCase();
    return FALLBACK_NEWS.filter(news => 
      news.title.toLowerCase().includes(searchLower) || 
      news.description.toLowerCase().includes(searchLower)
    );
  }

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