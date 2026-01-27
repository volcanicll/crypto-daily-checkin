const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");

/**
 * 分类标签映射
 */
const CATEGORY_LABELS = {
  official: "📢",
  opensource: "⭐",
  community: "💬",
  devtools: "🔧",
  newsletter: "📰",
  twitter: "📌",
};

/**
 * Format Agent Code news data
 * @param {Array} agentCodeNews
 * @returns {string} Formatted Agent Code news report
 */
const formatAgentCode = (agentCodeNews) => {
  if (!agentCodeNews || agentCodeNews.length === 0) return "";

  let message = sectionHeader("🧑‍💻", "Agent Code 前沿");
  message += "> _AI 编程助手 · Vibe Coding · 热门开源项目_\n\n";

  agentCodeNews.slice(0, 8).forEach((news) => {
    const relativeTime = formatRelativeTime(news.posted_on);
    const categoryIcon = CATEGORY_LABELS[news.category] || "📌";
    const summary = news.description || "";

    message += cardItem(
      news.title,
      news.url,
      summary,
      `${categoryIcon} ${news.source}`,
      relativeTime,
    );
  });

  return message;
};

module.exports = { formatAgentCode };
