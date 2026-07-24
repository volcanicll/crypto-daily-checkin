const { EMOJI, FORMAT_LIMITS } = require("../../config/constants");

/**
 * SegmentFault 技术问答格式化器
 * @param {Array} news - SegmentFault 新闻数组
 * @returns {string} 格式化后的 Markdown 字符串
 */
function formatSegmentFault(news) {
  if (!news || news.length === 0) {
    return "";
  }

  const lines = [];
  lines.push(`${EMOJI.segmentfault} **SegmentFault 技术问答**`);
  lines.push(`> _中文技术社区 · 问题与解答_`);
  lines.push("");

  // 按类型分组
  const questions = news.filter(item => item.type === "question");
  const articles = news.filter(item => item.type === "article");

  // 输出热门问题
  if (questions.length > 0) {
    lines.push("**🔥 热门问题**");
    questions.slice(0, 5).forEach((item, index) => {
      const title = truncateText(item.title, FORMAT_LIMITS.titleLength);
      const author = item.author ? ` · ${item.author}` : "";
      
      lines.push(`${index + 1}. **[${title}](${item.url})**${author}`);
      
      if (item.description) {
        const desc = truncateText(item.description, 100);
        lines.push(`   > ${desc}`);
      }
    });
    lines.push("");
  }

  // 输出热门文章
  if (articles.length > 0) {
    lines.push("**📚 技术文章**");
    articles.slice(0, 5).forEach((item, index) => {
      const title = truncateText(item.title, FORMAT_LIMITS.titleLength);
      const author = item.author ? ` · ${item.author}` : "";
      
      lines.push(`${index + 1}. **[${title}](${item.url})**${author}`);
      
      if (item.description) {
        const desc = truncateText(item.description, 100);
        lines.push(`   > ${desc}`);
      }
    });
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string}
 */
function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

module.exports = {
  formatSegmentFault,
};