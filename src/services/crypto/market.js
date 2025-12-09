const HttpClient = require('../../utils/http');
const http = new HttpClient();

const BINANCE_API_URL = 'https://api.binance.com/api/v3';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetch with retry mechanism
 * @param {Function} fetchFn - Function to execute
 * @param {number} retries - Number of retries
 * @returns {Promise<any>}
 */
async function fetchWithRetry(fetchFn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchFn();
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential-ish backoff
        }
    }
}

/**
 * Fetch market data from Binance (Primary)
 * @returns {Promise<Array>}
 */
async function getBinanceData() {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
    const promises = symbols.map(symbol =>
        http.get(`${BINANCE_API_URL}/ticker/24hr`, {
            params: { symbol },
            timeout: 10000
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
}

/**
 * Fetch market data from CoinGecko (Backup)
 * @returns {Promise<Array>}
 */
async function getCoinGeckoData() {
    // ids: bitcoin,ethereum,solana
    const response = await http.get(`${COINGECKO_API_URL}/coins/markets`, {
        params: {
            vs_currency: 'usd',
            ids: 'bitcoin,ethereum,solana'
        },
        timeout: 10000
    });

    return response.map(item => ({
        name: item.symbol.toUpperCase(),
        symbol: item.symbol.toUpperCase(),
        current_price: item.current_price,
        price_change_percentage_24h: item.price_change_percentage_24h,
        high_24h: item.high_24h,
        low_24h: item.low_24h
    }));
}

/**
 * Fetch market data with fallback
 * @returns {Promise<Array>} - Array of market data objects
 */
async function getMarketData() {
    try {
        console.log('Fetching market data from Binance...');
        return await fetchWithRetry(() => getBinanceData(), 3);
    } catch (error) {
        console.error('Binance API failed after retries. Switching to CoinGecko...', error.message);
        try {
            return await fetchWithRetry(() => getCoinGeckoData(), 3);
        } catch (backupError) {
            console.error('All market data APIs failed:', backupError.message);
            return [];
        }
    }
}

module.exports = {
    getMarketData
};
