const axios = require("axios");
const https = require('https');
const { BASE_URL } = require("../../config/constants");

/**
 * Service for fetching weather data
 */
class WeatherService {
    constructor() {
        this.weatherApis = [
            BASE_URL.WEATHER,
            "https://tianqiapi.com/api", // Backup API 1
            "https://www.yiketianqi.com/api", // Backup API 2
        ];
    }

    /**
     * Safe request wrapper with timeout and error handling
     * @param {string} url 
     * @returns {Promise<any>} Response object or null
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
     * Get weather data for a specific city
     * @param {string} city 
     * @returns {Promise<object|null>} Weather data or null
     */
    async getWeather(city = "重庆") {
        try {
            for (const api of this.weatherApis) {
                const res = await this.safeRequest(`${api}?city=${encodeURIComponent(city)}`);
                if (res && res.data) {
                    // Standardize return format if needed, but for now returning raw data wrapper
                    // Assuming the structure matches what was used before: res.data.data
                    return res.data;
                }
            }
            return null;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null;
        }
    }
}

module.exports = new WeatherService();
