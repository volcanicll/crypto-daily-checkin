const { sectionHeader } = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * 格式化「科技史上的今天」
 * @param {Array} events - [{ year, text, url, title }]
 * @returns {string} 格式化的内容
 */
const formatTechHistory = (events) => {
  if (!events || events.length === 0) return "";

  let message = sectionHeader(EMOJI.techHistory, "科技史上的今天");
  message += "> _那年今日，改变世界的瞬间_\n\n";

  events.forEach((event) => {
    message += `- **${event.year}年** · ${event.text}`;
    if (event.url) {
      message += ` [📖](${event.url})`;
    }
    message += "\n";
  });

  return message + "\n";
};

module.exports = { formatTechHistory };
