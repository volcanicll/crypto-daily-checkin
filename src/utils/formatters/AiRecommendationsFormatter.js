const { sectionHeader, agentCodeLinkItem } = require("./DingTalkMarkdownUtils");

/**
 * Format AI recommended news
 * @param {Array} recommendations - AI 推荐的资讯列表（带 aiReason）
 * @returns {string} Formatted AI recommendations
 */
const formatAiRecommendations = (recommendations) => {
  if (!recommendations || recommendations.length === 0) return "";

  let message = sectionHeader("⭐", "AI 精选推荐");
  message += "> _AI 从全部资讯中筛选的高价值内容_\n\n";

  recommendations.forEach((news, index) => {
    const sourceName = news.source || news.author || "Unknown";
    message += `${index + 1}. **[${truncateTitle(news.title)}](${
      news.url
    })**\n`;
    message += `   _${sourceName}_ · 💡 ${news.aiReason}\n\n`;
  });

  return message;
};

/**
 * 截断标题
 * @param {string} title
 * @returns {string}
 */
const truncateTitle = (title) => {
  if (!title) return "";
  return title.length > 50 ? title.substring(0, 47) + "..." : title;
};

module.exports = { formatAiRecommendations };
