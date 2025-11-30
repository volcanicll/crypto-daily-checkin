const HttpClient = require('../../utils/http');
const http = new HttpClient();

const CRYPTOCOMPARE_API_URL = 'https://min-api.cryptocompare.com/data/v2';

/**
 * Fetch latest crypto news
 * @returns {Promise<Array>} - Array of news objects
 */
async function getCryptoNews() {
    try {
        const response = await http.get(`${CRYPTOCOMPARE_API_URL}/news/`, {
            params: { lang: 'EN' }
        });

        const newsData = Array.isArray(response.Data) ? response.Data : [];

        // Return top 5 news items
        return newsData.slice(0, 5).map(item => ({
            title: item.title,
            description: item.body,
            url: item.url,
            author: item.source,
            posted_on: new Date(item.published_on * 1000).toISOString()
        }));
    } catch (error) {
        console.error('Error fetching crypto news:', error.message);
        return [];
    }
}

module.exports = {
    getCryptoNews
};
