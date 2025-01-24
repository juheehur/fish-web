const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export const getSnorkelingNews = async () => {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?` +
      'q=(snorkeling OR snorkelling OR "marine life" OR "coral reef")&' +
      'language=en&' +
      'sortBy=publishedAt&' +
      'pageSize=10&' +
      `apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: new Date(article.publishedAt),
      source: article.source.name
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}; 