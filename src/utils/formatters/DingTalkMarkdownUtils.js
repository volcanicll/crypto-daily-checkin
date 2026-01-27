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
  return `\n## ${icon} ${title}\n\n`;
};

/**
 * 生成卡片式条目 (UI/UX Pro Max)
 * @param {string} title - 标题
 * @param {string} url - 链接
 * @param {string} summary - 摘要/引文
 * @param {string} source - 来源
 * @param {string} time - 时间
 * @returns {string}
 */
const cardItem = (title, url, summary, source, time) => {
  // Clean title: remove newlines, brackets, and limit length efficiently
  const cleanTitleStr = title.replace(/[\r\n]+/g, " ").replace(/[\[\]]/g, "");
  const safeTitle =
    cleanTitleStr.length > 50
      ? cleanTitleStr.substring(0, 47) + "..."
      : cleanTitleStr;

  let item = `- **[${safeTitle}](${url})**\n`;

  if (summary) {
    // 使用引用块作为卡片内容背景
    // 限制摘要长度, Remove newlines from summary to keep blockquote clean
    const cleanSummaryText = summary.replace(/[\r\n]+/g, " ");
    const cleanSummary =
      cleanSummaryText.length > 100
        ? cleanSummaryText.substring(0, 97) + "..."
        : cleanSummaryText;
    item += `> ${cleanSummary}\n`;
  }

  const metaParts = [source, time].filter(Boolean);
  if (metaParts.length > 0) {
    // Meta信息放在引用块内或紧接其后，这里放在引用块最后一行看起来更像卡片底部
    // 使用斜体区分
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
 * @param {string} title - 标题
 * @param {string} url - 链接
 * @param {string} [source] - 来源
 * @returns {string}
 */
const linkItem = (title, url, source = null) => {
  // 限制标题长度
  const truncatedTitle =
    title.length > 50 ? title.substring(0, 47) + "..." : title;

  // 移除标题中可能破坏 Markdown 的字符
  const safeTitle = truncatedTitle.replace(/[\[\]]/g, "");

  let item = `- [${safeTitle}](${url})`;
  if (source) {
    // 来源使用更小的字体感觉（虽然钉钉不支持小字体，但可以用斜体区分）
    item += `  _${source}_`;
  }
  return item + "\n";
};

/**
 * 生成 Agent Code 风格的链接项（带加粗）
 * @param {string} title - 标题
 * @param {string} url - 链接
 * @param {string} source - 来源
 * @param {string} [time] - 时间
 * @returns {string}
 */
const agentCodeLinkItem = (title, url, source, time = null) => {
  const truncatedTitle =
    title.length > 45 ? title.substring(0, 42) + "..." : title;

  const safeTitle = truncatedTitle.replace(/[\[\]]/g, "");

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
};
