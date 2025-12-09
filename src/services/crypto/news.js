const HttpClient = require('../../utils/http');
const http = new HttpClient();
const cheerio = require('cheerio');
const { translate } = require('google-translate-api-x');

const CRYPTOCOMPARE_API_URL = 'https://min-api.cryptocompare.com/data/v2';
const COINPAPRIKA_API_URL = 'https://api.coinpaprika.com/v1';

const AI_SOURCES = [
    {
        name: 'TechCrunch AI',
        url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
        isRss: true
    },
    {
        name: 'VentureBeat AI',
        url: 'https://venturebeat.com/category/ai/feed/',
        isRss: true
    },
    {
        name: 'MIT Technology Review AI',
        url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
        isRss: true
    }
];

/**
 * Fetch with retry mechanism
 */
async function fetchWithRetry(fetchFn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchFn();
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

/**
 * Translate text to Chinese if it's likely English
 */
async function translateToChinese(text) {
    try {
        if (!text) return '';
        // Simple check: if text contains Chinese characters, assume it's already Chinese (not perfect but helpful)
        if (/[\u4e00-\u9fa5]/.test(text)) return text;

        const res = await translate(text, { to: 'zh-CN', rejectOnPartialFail: false });
        // Ensure res and res.text exist
        return (res && res.text) ? res.text : text;
    } catch (error) {
        console.warn('Translation failed, returning original text:', error.message);
        return text;
    }
}

/**
 * Fetch crypto news from CryptoCompare (Primary)
 */
async function getCryptoCompareNews() {
    const response = await http.get(`${CRYPTOCOMPARE_API_URL}/news/`, {
        params: { lang: 'EN' }
    });
    const newsData = Array.isArray(response.Data) ? response.Data : [];
    return newsData.slice(0, 5).map(item => ({
        title: item.title,
        description: item.body,
        url: item.url,
        author: item.source,
        posted_on: new Date(item.published_on * 1000).toISOString()
    }));
}

/**
 * Fetch crypto news from Coinpaprika (Backup)
 */
async function getCoinpaprikaNews() {
    const response = await http.get(`${COINPAPRIKA_API_URL}/news/latest`);
    return response.slice(0, 5).map(item => ({
        title: item.title,
        description: item.intro,
        url: item.url,
        author: item.source,
        posted_on: item.date
    }));
}

/**
 * Fetch latest crypto news with fallback and translation
 * @returns {Promise<Array>}
 */
async function getCryptoNews() {
    let news = [];
    try {
        console.log('Fetching crypto news from CryptoCompare...');
        news = await fetchWithRetry(() => getCryptoCompareNews(), 3);
    } catch (error) {
        console.error('CryptoCompare failed. Switching to Coinpaprika...', error.message);
        try {
            news = await fetchWithRetry(() => getCoinpaprikaNews(), 3);
        } catch (backupError) {
            console.error('All crypto news APIs failed:', backupError.message);
            return [];
        }
    }

    // Translate sequentially to avoid rate limits
    const translatedNews = [];
    for (const item of news) {
        translatedNews.push({
            ...item,
            title: await translateToChinese(item.title),
            description: await translateToChinese(item.description)
        });
        // Small delay to be polite to the translation service
        await new Promise(r => setTimeout(r, 200));
    }
    return translatedNews;
}

/**
 * Fetch AI news from defined sources (RSS)
 * @returns {Promise<Array>}
 */
async function getAINews() {
    const allNews = [];

    for (const source of AI_SOURCES) {
        try {
            console.log(`Fetching AI news from ${source.name}...`);
            const xml = await http.get(source.url, {
                responseType: 'text',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/rss+xml,application/xml,text/xml,*/*'
                }
            });

            const $ = cheerio.load(xml, { xmlMode: true });
            const items = [];

            $('item').each((i, el) => {
                if (i >= 3) return false; // Limit to 3 items per source

                const title = $(el).find('title').text().trim();
                const link = $(el).find('link').text().trim();
                const description = $(el).find('description').text().replace(/<[^>]*>?/gm, '').trim(); // Strip HTML from desc
                const pubDate = $(el).find('pubDate').text().trim();

                if (title && link) {
                    items.push({
                        title,
                        description: description.substring(0, 200) + '...', // Truncate description
                        url: link,
                        author: source.name,
                        posted_on: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
                    });
                }
            });

            allNews.push(...items);
        } catch (error) {
            console.error(`Error fetching ${source.name}:`, error.message);
        }
    }

    // Translate AI news sequentially
    const translatedAiNews = [];
    for (const item of allNews) {
        translatedAiNews.push({
            ...item,
            title: await translateToChinese(item.title),
            description: await translateToChinese(item.description)
        });
        await new Promise(r => setTimeout(r, 200));
    }

    return translatedAiNews;
}

module.exports = {
    getCryptoNews,
    getAINews
};
