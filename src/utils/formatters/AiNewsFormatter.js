const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");

/**
 * Format AI news data
 * @param {Array} aiNews
 * @returns {string} Formatted AI news report
 */
const formatAiNews = (aiNews) => {
  if (!aiNews || aiNews.length === 0) return "";

  let message = sectionHeader("🤖", "AI 前沿资讯");

  aiNews.slice(0, 10).forEach((news) => {
    const relativeTime = formatRelativeTime(news.posted_on);
    const sourceName = news.author || "";
    const summary = news.description || "";

    message += cardItem(
      news.title,
      news.url,
      summary,
      sourceName,
      relativeTime,
    );
  });

  return message;
};

module.exports = { formatAiNews };
