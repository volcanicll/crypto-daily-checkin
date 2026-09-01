const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * 格式化每日安全雷达
 * @param {Array} news - 安全资讯数组
 * @returns {string} 格式化的内容
 */
const formatSecurityRadar = (news) => {
  if (!news || news.length === 0) return "";

  let message = sectionHeader(EMOJI.security, "安全雷达");
  message += "> _漏洞 · 攻防 · 数据安全_\n\n";

  news.slice(0, 8).forEach((item) => {
    const relativeTime = formatRelativeTime(item.pubDate);

    message += cardItem({
      title: item.title,
      url: item.link,
      summary: item.description || "",
      source: item.source || "",
      time: relativeTime,
    });
  });

  return message;
};

module.exports = { formatSecurityRadar };
