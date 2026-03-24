const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * Format V2EX news data
 * @param {Array} v2exNews - Array of V2EX topic objects
 * @returns {string} Formatted V2EX news report
 */
const formatV2ex = (v2exNews) => {
  if (!v2exNews || v2exNews.length === 0) return "";

  let message = sectionHeader(EMOJI.v2ex, "V2EX 精选");
  message += "> _技术社区热点 · 开发者话题_\n\n";

  v2exNews.slice(0, 10).forEach((topic) => {
    const relativeTime = formatRelativeTime(topic.posted_on);
    // 使用节点名称作为来源，格式更简洁
    const nodeInfo = topic.nodeTitle || topic.nodeName || "V2EX";
    const summary = topic.description || "";

    message += cardItem(
      topic.title,
      topic.url,
      summary,
      nodeInfo,
      relativeTime
    );
  });

  return message;
};

module.exports = { formatV2ex };
