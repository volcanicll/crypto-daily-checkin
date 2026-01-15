const {
  sectionHeader,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");

/**
 * 格式化互动数据
 * @param {object} engagement
 * @returns {string}
 */
const formatEngagement = (engagement) => {
  if (!engagement) return "";
  const parts = [];
  if (engagement.views >= 10000) {
    parts.push(`👁 ${(engagement.views / 10000).toFixed(1)}w`);
  }
  if (engagement.favorites > 0) {
    parts.push(`❤️ ${engagement.favorites}`);
  }
  if (engagement.retweets > 0) {
    parts.push(`🔄 ${engagement.retweets}`);
  }
  if (engagement.replies > 0) {
    parts.push(`💬 ${engagement.replies}`);
  }
  return parts.join(" ");
};

/**
 * Format X/Twitter news data
 * @param {Array} xTwitterNews
 * @returns {string} Formatted X/Twitter news report
 */
const formatXTwitter = (xTwitterNews) => {
  if (!xTwitterNews || xTwitterNews.length === 0) return "";

  let message = sectionHeader("𝕏", "X/Twitter 热门");
  message += "> _AI · Agent Code · 技术热帖_\n\n";

  xTwitterNews.slice(0, 8).forEach((news, index) => {
    const relativeTime = formatRelativeTime(news.posted_on);
    const engagementStr = formatEngagement(news.engagement);

    // 截取标题
    const title =
      news.title.length > 60 ? news.title.substring(0, 57) + "..." : news.title;

    // 格式：序号 + 标题链接
    message += `${index + 1}. [${title}](${news.url})\n`;
    // 来源 + 时间 + 互动数据
    message += `   _${news.source} · ${relativeTime}_`;
    if (engagementStr) {
      message += ` | ${engagementStr}`;
    }
    message += "\n\n";
  });

  return message;
};

module.exports = { formatXTwitter };
