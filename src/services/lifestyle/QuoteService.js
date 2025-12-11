const axios = require("axios");
const https = require('https');
const { BASE_URL } = require("../../config/constants");

/**
 * Service for fetching daily quotes/love words
 */
class QuoteService {
    constructor() {
        this.loveApisConfig = [
            { url: BASE_URL.QINGHUA_BACKUP, path: "content" },
            { url: BASE_URL.HITOKOTO, path: "hitokoto" },
            { url: BASE_URL.QINGHUA, path: "returnObj" },
        ];
    }

    /**
     * Safe request wrapper
     * @param {string} url 
     * @returns {Promise<any>}
     */
    async safeRequest(url) {
        try {
            const response = await axios.get(url, {
                timeout: 5000,
                maxRedirects: 5,
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
            return response;
        } catch (error) {
            console.error(`Request failed for ${url}:`, error.message);
            return null;
        }
    }

    /**
     * Get daily quote
     * @returns {Promise<string|null>} Quote content or null
     */
    async getDailyQuote() {
        try {
            for (const api of this.loveApisConfig) {
                const response = await this.safeRequest(api.url);
                const data = response?.data || {};
                if (data && data[api.path]) {
                    return data[api.path];
                }
            }
            return null;
        } catch (error) {
            console.error("Error fetching quote:", error);
            return null;
        }
    }
}

module.exports = new QuoteService();
