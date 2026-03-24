const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * Format AI news data
 * @param {Array} aiNews
 * @returns {string} Formatted AI news report
 */
const formatAiNews = (aiNews) => {
  if (!aiNews || aiNews.length === 0) return "";

  let message = sectionHeader(EMOJI.ai, "AI 前沿资讯");
  message += "> _大模型动态 · 研究前沿 · 行业新闻_\n\n";

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
