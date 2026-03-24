const {
  sectionHeader,
  linkItem,
} = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * 格式化新闻亮点
 * @param {Array} highlights - 新闻亮点数组
 * @returns {string} 格式化的新闻亮点
 */
const formatNewsHighlights = (highlights) => {
  if (!highlights || highlights.length === 0) return "";

  let message = sectionHeader(EMOJI.highlights, "今日头条");
  message += "> _AI 识别的重要市场动态_\n\n";

  highlights.forEach((highlight, index) => {
    const emoji = (index + 1).toString().padStart(2, "0") + ".";
    const impact = highlight.impact ? ` - ${highlight.impact}` : "";

    if (highlight.url) {
      message += linkItem(`${emoji} ${highlight.title}${impact}`, highlight.url, highlight.source);
    } else {
      message += `> ${emoji} ${highlight.title}${impact}\n`;
      if (highlight.source) {
        message += `> _${highlight.source}_\n\n`;
      } else {
        message += "\n";
      }
    }
  });

  return message;
};

module.exports = { formatNewsHighlights };
