const {
  sectionHeader,
  formatRelativeTime,
  cardItem,
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

  xTwitterNews.slice(0, 8).forEach((news) => {
    const relativeTime = formatRelativeTime(news.posted_on);
    const engagementStr = formatEngagement(news.engagement);

    // Logic for Title vs Summary
    // Tweets are often just text. We should use a short excerpt as Title (link) and the rest as Summary.
    let title = news.title;
    let summary = null;

    // Clean newlines in title for the link part
    title = title.replace(/[\r\n]+/g, " ");

    if (title.length > 40) {
      summary = news.title; // Use full text as summary (can preserve newlines in logic, but cardItem cleans it)
      title = title.substring(0, 40) + "..."; // Short title for the link
    } else {
      // Short tweet, no summary needed, just title link
      summary = null;
    }

    // Use cardItem for consistency
    message += cardItem(
      title,
      news.url,
      summary,
      news.source,
      `${relativeTime}${engagementStr ? " | " + engagementStr : ""}`,
    );
  });

  return message;
};

module.exports = { formatXTwitter };
