const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * 格式化宏观金融新闻
 * @param {Array} macroNews - 宏观新闻数组
 * @returns {string} 格式化的宏观新闻报告
 */
const formatMacroNews = (macroNews) => {
  if (!macroNews || macroNews.length === 0) return "";

  let message = sectionHeader(EMOJI.macro, "宏观要闻");
  message += "> _美联储 · 加息 · 通胀 · GDP_\n\n";

  macroNews.slice(0, 10).forEach((news) => {
    const relativeTime = formatRelativeTime(news.pubDate);
    const sourceName = news.source || "";
    const summary = news.description || "";

    message += cardItem(
      news.title,
      news.link,
      summary,
      sourceName,
      relativeTime,
    );
  });

  return message;
};

module.exports = { formatMacroNews };
