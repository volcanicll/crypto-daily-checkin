const { EMOJI, FORMAT_LIMITS } = require("../../config/constants");

/**
 * Reddit 技术社区格式化器
 * @param {Array} news - Reddit 新闻数组
 * @returns {string} 格式化后的 Markdown 字符串
 */
function formatReddit(news) {
  if (!news || news.length === 0) {
    return "";
  }

  const lines = [];
  lines.push(`${EMOJI.reddit} **Reddit 技术社区**`);
  lines.push(`> _热门讨论 · 开发者观点_`);
  lines.push("");

  // 按类别分组
  const grouped = {};
  news.forEach(item => {
    const category = item.category || "其他";
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
      const source = item.source ? ` · ${item.source.replace("Reddit ", "")}` : "";
      
      lines.push(`${index + 1}. **[${title}](${item.url})**${source}`);
      
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
 * 根据类别获取对应的表情符号
 * @param {string} category - 类别名称
 * @returns {string}
 */
function getCategoryEmoji(category) {
  const emojiMap = {
    programming: "💻",
    webdev: "🌐",
    javascript: "📜",
    python: "🐍",
    rust: "🦀",
    golang: "🔵",
    machinelearning: "🤖",
    llm: "🧠",
    datascience: "📊",
    artificial: "🔬",
    devops: "⚙️",
    sysadmin: "🖥️",
    docker: "🐳",
    kubernetes: "☸️",
    blockchain: "⛓️",
    quantum: "⚛️",
    cybersecurity: "🔒",
    singularity: "🚀",
    opensource: "🆓",
    github: "🐙",
    other: "📝",
  };
  
  return emojiMap[category.toLowerCase()] || emojiMap.other;
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
  formatReddit,
};