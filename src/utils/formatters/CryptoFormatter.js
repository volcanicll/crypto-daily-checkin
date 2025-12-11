/**
 * Format crypto market and news data
 * @param {object} data
 * @param {Array} data.marketData
 * @param {Array} data.newsData
 * @param {object} data.sentimentData
 * @returns {string} Formatted crypto report
 */
const formatCrypto = ({ marketData, newsData, sentimentData }) => {
    let message = "【💰 今日行情 💰】\n";

    // Sentiment Data (Fear & Greed)
    if (sentimentData) {
        message += `🧠 恐慌贪婪指数: ${sentimentData.value} (${sentimentData.classification})\n\n`;
    }

    // Market Data
    if (marketData && marketData.length > 0) {
        message += "📊 市场行情 (24h):\n";
        marketData.forEach(coin => {
            const price = coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            const change = coin.price_change_percentage_24h.toFixed(2);
            const icon = change >= 0 ? "📈" : "📉";
            message += `${icon} ${coin.symbol}: ${price} (${change > 0 ? '+' : ''}${change}%)\n`;
        });
        message += "\n";
    }

    // News Data with Links
    if (newsData && newsData.length > 0) {
        message += "📰 最新资讯:\n";
        newsData.slice(0, 20).forEach((news, index) => {
            message += `${index + 1}. [${news.title}](${news.url})\n`;
        });
    }

    // Fallback if data is missing but expected
    if ((!marketData || marketData.length === 0) && (!newsData || newsData.length === 0)) {
        // If completely empty, we might want to return a different message or just the header? 
        // For now preserving original logic which returns a failure message on catch, 
        // but here we might have partial data. 
        // If truly nothing:
        return "【💰 行情数据暂时获取失败...】";
    }

    return message;
};

module.exports = { formatCrypto };
