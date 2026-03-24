const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * Format Agent Code news data
 * @param {Array} agentCodeNews
 * @returns {string} Formatted Agent Code news report
 */
const formatAgentCode = (agentCodeNews) => {
  if (!agentCodeNews || agentCodeNews.length === 0) return "";

  let message = sectionHeader(EMOJI.agentCode, "Agent Code 前沿");
  message += "> _AI编程助手 · Vibe Coding · 热门项目_\n\n";

  agentCodeNews.slice(0, 10).forEach((news) => {
    const relativeTime = formatRelativeTime(news.posted_on);
    const summary = news.description || "";

    message += cardItem(
      news.title,
      news.url,
      summary,
      news.source,
      relativeTime,
    );
  });

  return message;
};

module.exports = { formatAgentCode };
