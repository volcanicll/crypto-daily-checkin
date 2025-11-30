const HttpClient = require('../../utils/http');
const http = new HttpClient();

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

/**
 * Fetch market data for specified coins
 * @returns {Promise<Array>} - Array of market data objects
 */
async function getMarketData() {
    try {
        // Fetch data for BTC, ETH, SOL
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
        const promises = symbols.map(symbol =>
            http.get(`${BINANCE_API_URL}/ticker/24hr`, {
                params: { symbol }
            })
        );

        const results = await Promise.all(promises);

        return results.map(data => ({
            name: data.symbol.replace('USDT', ''),
            symbol: data.symbol.replace('USDT', ''),
            current_price: parseFloat(data.lastPrice),
            price_change_percentage_24h: parseFloat(data.priceChangePercent),
            high_24h: parseFloat(data.highPrice),
            low_24h: parseFloat(data.lowPrice)
        }));
    } catch (error) {
        console.error('Error fetching market data:', error.message);
        return [];
    }
}

module.exports = {
    getMarketData
};
