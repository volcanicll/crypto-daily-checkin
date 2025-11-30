const HttpClient = require('../../utils/http');
const http = new HttpClient();

/**
 * Fetch Crypto Fear & Greed Index
 * Source: https://api.alternative.me/fng/
 */
async function getFearAndGreedIndex() {
    try {
        const response = await http.get('https://api.alternative.me/fng/');

        if (response && response.data && response.data.length > 0) {
            const data = response.data[0];
            return {
                value: data.value,
                classification: data.value_classification,
                timestamp: data.timestamp
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching Fear & Greed Index:', error.message);
        return null;
    }
}

module.exports = {
    getFearAndGreedIndex
};
