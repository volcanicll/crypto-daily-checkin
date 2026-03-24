/**
 * 钉钉 Markdown 格式化工具类
 * 提供针对钉钉机器人消息优化的 Markdown 格式化方法
 */

const { FORMAT_LIMITS } = require("../../config/constants");

/**
 * 截断文本工具
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 截断后缀
 * @returns {string}
 */
function truncateText(text, maxLength = FORMAT_LIMITS.titleLength, suffix = FORMAT_LIMITS.ellipsis) {
  if (!text) return "";
  const clean = text.replace(/[\r\n]+/g, " ").replace(/[\[\]]/g, "");
  return clean.length > maxLength
    ? clean.substring(0, maxLength - suffix.length) + suffix
    : clean;
}

/**
 * 生成模块标题
 * @param {string} icon - emoji 图标
 * @param {string} title - 标题文字
 * @returns {string}
 */
const sectionHeader = (icon, title) => {
  return `\n## ${icon} ${title}\n\n`;
};

/**
 * 生成卡片式条目 (UI/UX Pro Max)
 * 支持两种调用方式：
 * 1. cardItem({ title, url, summary, source, time })
 * 2. cardItem(title, url, summary, source, time) - 向后兼容
 */
const cardItem = (...args) => {
  // 解析参数（支持对象和传统多参数）
  let title, url, summary, source, time;

  if (args.length === 1 && typeof args[0] === 'object') {
    // 对象参数
    ({ title, url, summary, source, time } = args[0]);
  } else {
    // 传统多参数（向后兼容）
    [title, url, summary, source, time] = args;
  }

  const safeTitle = truncateText(title, FORMAT_LIMITS.titleLength);

  let item = `- **[${safeTitle}](${url})**\n`;

  if (summary) {
    const cleanSummary = truncateText(summary, FORMAT_LIMITS.summaryLength);
    item += `> ${cleanSummary}\n`;
  }

  const metaParts = [source, time].filter(Boolean);
  if (metaParts.length > 0) {
    item += `> *${metaParts.join(" · ")}*\n`;
  }

  return item + "\n";
};

/**
 * 生成分隔线
 * @returns {string}
 */
const divider = () => {
  return "\n\n---\n\n";
};

/**
 * 生成带标签的信息行
 * @param {string} label - 标签
 * @param {string} value - 内容
 * @returns {string}
 */
const infoRow = (label, value) => {
  return `- **${label}**: ${value}\n`;
};

/**
 * 生成价格条目（紧凑版）
 * @param {string} icon - 涨跌 emoji
 * @param {string} name - 品种名称
 * @param {string} price - 价格字符串
 * @param {string} change - 涨跌幅字符串
 * @returns {string}
 */
const priceItem = (icon, name, price, change) => {
  return `> ${icon} **${name}**\n> ${price}  ${change}\n> \n`;
};

/**
 * 生成链接列表项 (无序列表)
 * 支持两种调用方式：
 * 1. linkItem({ title, url, source })
 * 2. linkItem(title, url, source) - 向后兼容
 */
const linkItem = (...args) => {
  // 解析参数（支持对象和传统多参数）
  let title, url, source;

  if (args.length === 1 && typeof args[0] === 'object') {
    // 对象参数
    ({ title, url, source } = args[0]);
  } else {
    // 传统多参数（向后兼容）
    [title, url, source] = args;
  }

  const safeTitle = truncateText(title, FORMAT_LIMITS.titleLength);

  let item = `- [${safeTitle}](${url})`;
  if (source) {
    item += `  _${source}_`;
  }
  return item + "\n";
};

/**
 * 生成 Agent Code 风格的链接项（带加粗）
 * 支持两种调用方式：
 * 1. agentCodeLinkItem({ title, url, source, time })
 * 2. agentCodeLinkItem(title, url, source, time) - 向后兼容
 */
const agentCodeLinkItem = (...args) => {
  // 解析参数（支持对象和传统多参数）
  let title, url, source, time;

  if (args.length === 1 && typeof args[0] === 'object') {
    // 对象参数
    ({ title, url, source, time } = args[0]);
  } else {
    // 传统多参数（向后兼容）
    [title, url, source, time] = args;
  }

  const safeTitle = truncateText(title, 45);

  let item = `- **[${safeTitle}](${url})**`;

  const metaParts = [];
  if (source) metaParts.push(source);
  if (time) metaParts.push(time);

  if (metaParts.length > 0) {
    item += `\n  > ${metaParts.join(" · ")}`;
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
 * 生成价格表格（使用引用块模拟表格）
 * @param {Array<{symbol: string, price: string, change: string, icon: string}>} items
 * @returns {string}
 */
const priceTable = (items) => {
  return items
    .map(
      (item) =>
        `> ${item.icon} **${item.symbol}** ${item.price} \`${item.change}\``,
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
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // 1小时内显示分钟
    if (diffMinutes < 1) return "刚刚";
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;

    // 24小时内显示小时
    if (diffHours < 24) return `${diffHours}小时前`;

    // 7天内显示天
    if (diffDays < 7) return `${diffDays}天前`;

    // 更早显示日期
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
  return `# ${title}\n**${dateStr}**\n\n`;
};

module.exports = {
  sectionHeader,
  divider,
  infoRow,
  priceItem,
  cardItem,
  linkItem,
  agentCodeLinkItem,
  blockquote,
  priceTable,
  formatRelativeTime,
  messageHeader,
  truncateText, // 导出工具函数供其他模块使用
};
