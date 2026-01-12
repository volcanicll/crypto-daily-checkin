const { sectionHeader, linkItem } = require("./DingTalkMarkdownUtils");

/**
 * Format AI news data
 * @param {Array} aiNews
 * @returns {string} Formatted AI news report
 */
const formatAiNews = (aiNews) => {
  if (!aiNews || aiNews.length === 0) return "";

  let message = sectionHeader("🤖", "AI 前沿资讯");

  aiNews.slice(0, 10).forEach((news, index) => {
    message += linkItem(index + 1, news.title, news.url, news.author);
  });

  return message;
};

module.exports = { formatAiNews };
