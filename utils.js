// Shared utility functions for URL statistics
const getUrlStats = async (shortUrl, baseUrl, token) => {
  try {
    // Extract slug from short URL
    const urlParts = shortUrl.split('/');
    const slug = urlParts[urlParts.length - 1];
    
    // Construct stats API URL
    const statsBaseUrl = baseUrl.replace('/api/link/create', '');
    const statsUrl = `${statsBaseUrl}/api/stats/counters?slug=${slug}`;
    
    const response = await fetch(statsUrl, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return {
        visits: parseInt(data.data[0].visits) || 0,
        visitors: parseInt(data.data[0].visitors) || 0,
        referers: parseInt(data.data[0].referers) || 0
      };
    }
    
    return { visits: 0, visitors: 0, referers: 0 };
  } catch (error) {
    console.error('Failed to get stats:', error);
    return { visits: 0, visitors: 0, referers: 0 };
  }
};

// Make available globally
window.getUrlStats = getUrlStats;
