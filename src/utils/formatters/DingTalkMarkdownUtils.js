/**
 * 钉钉 Markdown 格式化工具类
 * 提供针对钉钉机器人消息优化的 Markdown 格式化方法
 */

/**
 * 生成模块标题
 * @param {string} icon - emoji 图标
 * @param {string} title - 标题文字
 * @returns {string}
 */
const sectionHeader = (icon, title) => {
  return `## ${icon} ${title}\n`;
};

/**
 * 生成分隔线
 * @returns {string}
 */
const divider = () => {
  return "\n---\n\n";
};

/**
 * 生成价格条目
 * @param {string} icon - 涨跌 emoji
 * @param {string} name - 品种名称
 * @param {string} price - 价格字符串
 * @param {string} change - 涨跌幅字符串
 * @returns {string}
 */
const priceItem = (icon, name, price, change) => {
  return `${icon} **${name}**: ${price} (${change})\n`;
};

/**
 * 生成链接列表项
 * @param {number} index - 序号
 * @param {string} title - 标题
 * @param {string} url - 链接
 * @param {string} [source] - 来源
 * @returns {string}
 */
const linkItem = (index, title, url, source = null) => {
  // 限制标题长度，避免过长
  const truncatedTitle =
    title.length > 50 ? title.substring(0, 47) + "..." : title;
  let item = `${index}. [${truncatedTitle}](${url})`;
  if (source) {
    item += `\n   _${source}_`;
  }
  return item + "\n";
};

/**
 * 生成 Agent Code 风格的链接项（带加粗）
 * @param {number} index - 序号
 * @param {string} title - 标题
 * @param {string} url - 链接
 * @param {string} source - 来源
 * @param {string} [time] - 时间
 * @returns {string}
 */
const agentCodeLinkItem = (index, title, url, source, time = null) => {
  const truncatedTitle =
    title.length > 45 ? title.substring(0, 42) + "..." : title;
  let item = `${index}. **[${truncatedTitle}](${url})**`;
  if (source || time) {
    const meta = [source, time].filter(Boolean).join(" · ");
    item += `\n   _${meta}_`;
  }
  return item + "\n";
};

/**
 * 生成引用块
 * @param {string} text - 引用内容
 * @returns {string}
 */
const blockquote = (text) => {
  return text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
};

/**
 * 生成简洁的价格表格（钉钉 Markdown 支持有限，使用紧凑格式）
 * @param {Array<{symbol: string, price: string, change: string, icon: string}>} items
 * @returns {string}
 */
const priceTable = (items) => {
  return items
    .map(
      (item) => `${item.icon} **${item.symbol}** ${item.price} ${item.change}`
    )
    .join("\n");
};

/**
 * 格式化相对时间
 * @param {string|Date} dateStr - 日期字符串或 Date 对象
 * @returns {string}
 */
const formatRelativeTime = (dateStr) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "刚刚";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

/**
 * 生成消息头部
 * @param {string} title - 主标题
 * @returns {string}
 */
const messageHeader = (title = "每日播报") => {
  const now = new Date();
  const dateStr = now.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  return `# 📊 ${title}\n\n_${dateStr}_\n`;
};

module.exports = {
  sectionHeader,
  divider,
  priceItem,
  linkItem,
  agentCodeLinkItem,
  blockquote,
  priceTable,
  formatRelativeTime,
  messageHeader,
};
