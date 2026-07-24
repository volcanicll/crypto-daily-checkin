const { EMOJI, FORMAT_LIMITS } = require("../../config/constants");

/**
 * 掘金技术社区格式化器
 * @param {Array} news - 掘金新闻数组
 * @returns {string} 格式化后的 Markdown 字符串
 */
function formatJuejin(news) {
  if (!news || news.length === 0) {
    return "";
  }

  const lines = [];
  lines.push(`${EMOJI.juejin} **掘金技术社区**`);
  lines.push(`> _中文开发者社区 · 技术文章_`);
  lines.push("");

  // 按类别分组
  const grouped = {};
  news.forEach(item => {
    const category = item.category || "技术";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });

  // 输出每个类别
  for (const [category, items] of Object.entries(grouped)) {
    const categoryEmoji = getCategoryEmoji(category);
    lines.push(`**${categoryEmoji} ${category}**`);
    
    items.slice(0, 3).forEach((item, index) => {
      const title = truncateText(item.title, FORMAT_LIMITS.titleLength);
      const author = item.author ? ` · ${item.author}` : "";
      
      lines.push(`${index + 1}. **[${title}](${item.url})**${author}`);
      
      if (item.description) {
        const desc = truncateText(item.description, 100);
        lines.push(`   > ${desc}`);
      }
      
      // 显示互动数据
      const stats = [];
      if (item.digg_count > 0) stats.push(`👍 ${item.digg_count}`);
      if (item.comment_count > 0) stats.push(`💬 ${item.comment_count}`);
      if (item.view_count > 0) stats.push(`👁️ ${item.view_count}`);
      
      if (stats.length > 0) {
        lines.push(`   ${stats.join(" · ")}`);
      }
    });
    
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * 根据类别获取对应的表情符号
 * @param {string} category - 类别名称
 * @returns {string}
 */
function getCategoryEmoji(category) {
  const emojiMap = {
    前端: "🎨",
    后端: "⚙️",
    人工智能: "🤖",
    DevOps: "🚀",
    移动开发: "📱",
    数据库: "💾",
    技术: "📝",
    编程语言: "💻",
    开源项目: "🆓",
    算法: "🧮",
    面试: "🎯",
    职场: "💼",
  };
  
  return emojiMap[category] || emojiMap.技术;
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
  formatJuejin,
};