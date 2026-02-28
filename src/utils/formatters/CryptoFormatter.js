const {
  sectionHeader,
  priceItem,
  cardItem,
  infoRow,
  formatRelativeTime,
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
  message += "> _主流币价格 · 恐慌贪婪指数_\n\n";

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
    message +=
      infoRow(
        "恐慌贪婪指数",
        `${sentimentIcon} ${sentimentData.value} (${sentimentData.classification})`,
      ) + "\n";
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
    message += "\n**📰 最新资讯**\n\n";
    // Increase limit slightly as layout is more compact, or keep 10.
    // Logic changed: linkItem no longer takes index.
    newsData.slice(0, 10).forEach((news) => {
      const relativeTime = formatRelativeTime(news.posted_on);
      const summary = news.description || "";
      const source = news.author || "CryptoNews";

      message += cardItem(news.title, news.url, summary, source, relativeTime);
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
