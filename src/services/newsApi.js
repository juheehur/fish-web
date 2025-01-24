const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

const FALLBACK_NEWS = [
  {
    title: "Exploring the Hidden Wonders of Marine Life: A Snorkeler's Guide",
    description: "Discover the best practices for observing marine life while snorkeling, including tips for identifying different species and understanding their behaviors in their natural habitat...",
    urlToImage: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-15T09:00:00Z",
    source: { name: "Marine Explorer" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "The Art of Underwater Photography: Capturing Marine Life",
    description: "Learn essential techniques for photographing marine life while snorkeling, from choosing the right equipment to composing the perfect shot under challenging conditions...",
    urlToImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-14T10:30:00Z",
    source: { name: "Ocean Photography" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Protecting Our Coral Reefs: A Snorkeler's Responsibility",
    description: "Understanding the importance of responsible snorkeling practices and how individual actions can help preserve delicate coral reef ecosystems for future generations...",
    urlToImage: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-13T14:15:00Z",
    source: { name: "Reef Conservation" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Marine Life Identification Guide for Snorkelers",
    description: "A comprehensive guide to identifying common marine species encountered while snorkeling, including fish, corals, and other fascinating underwater creatures...",
    urlToImage: "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-12T11:45:00Z",
    source: { name: "Marine Biology Guide" },
    url: "https://marinetag.vercel.app/news"
  },
  {
    title: "Safety First: Essential Tips for Snorkeling Adventures",
    description: "Expert advice on snorkeling safety, including equipment checks, weather awareness, and best practices for an enjoyable and secure underwater experience...",
    urlToImage: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-02-11T16:20:00Z",
    source: { name: "Water Safety Today" },
    url: "https://marinetag.vercel.app/news"
  }
];

export const getNews = async () => {
  if (process.env.NODE_ENV === 'production') {
    // Return fallback news in production
    return FALLBACK_NEWS;
  }

  try {
    const query = encodeURIComponent('(snorkeling OR snorkelling OR "marine life" OR "coral reef")');
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
    // Return fallback news if API call fails
    return FALLBACK_NEWS;
  }
};

export const searchNews = async (searchTerm) => {
  if (process.env.NODE_ENV === 'production') {
    // Filter fallback news based on search term
    const searchLower = searchTerm.toLowerCase();
    return FALLBACK_NEWS.filter(news => 
      news.title.toLowerCase().includes(searchLower) || 
      news.description.toLowerCase().includes(searchLower)
    );
  }

  try {
    const query = encodeURIComponent(`${searchTerm} AND (snorkeling OR snorkelling OR "marine life" OR "coral reef")`);
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
    // Filter fallback news if API call fails
    const searchLower = searchTerm.toLowerCase();
    return FALLBACK_NEWS.filter(news => 
      news.title.toLowerCase().includes(searchLower) || 
      news.description.toLowerCase().includes(searchLower)
    );
  }
}; 