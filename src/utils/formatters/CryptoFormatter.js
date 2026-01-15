const {
  sectionHeader,
  priceItem,
  linkItem,
} = require("./DingTalkMarkdownUtils");

/**
 * Format crypto market and news data
 * @param {object} data
 * @param {Array} data.marketData
 * @param {Array} data.newsData
 * @param {object} data.sentimentData
 * @returns {string} Formatted crypto report
 */
const formatCrypto = ({ marketData, newsData, sentimentData }) => {
  let message = sectionHeader("💰", "加密行情");

  // Sentiment Data (Fear & Greed)
  if (sentimentData) {
    const sentimentIcon =
      sentimentData.value >= 50
        ? sentimentData.value >= 75
          ? "🔥"
          : "😊"
        : sentimentData.value <= 25
        ? "😰"
        : "😐";
    message += `${sentimentIcon} **恐慌贪婪指数**: ${sentimentData.value} (${sentimentData.classification})\n\n`;
  }

  // Market Data
  if (marketData && marketData.length > 0) {
    marketData.forEach((coin) => {
      const price = coin.current_price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      const change = coin.price_change_percentage_24h.toFixed(2);
      const icon = change >= 0 ? "📈" : "📉";
      const changeStr = `${change > 0 ? "+" : ""}${change}%`;
      message += priceItem(icon, coin.symbol.toUpperCase(), price, changeStr);
    });
  }

  // News Data with Links
  if (newsData && newsData.length > 0) {
    message += "**📰 最新资讯**\n\n";
    newsData.slice(0, 10).forEach((news, index) => {
      message += linkItem(index + 1, news.title, news.url);
    });
  }

  // Fallback if data is missing but expected
  if (
    (!marketData || marketData.length === 0) &&
    (!newsData || newsData.length === 0)
  ) {
    return sectionHeader("💰", "加密行情") + "_数据暂时获取失败..._";
  }

  return message;
};

module.exports = { formatCrypto };
