const {
  sectionHeader,
  cardItem,
  formatRelativeTime,
} = require("./DingTalkMarkdownUtils");
const { EMOJI } = require("../../config/constants");

/**
 * 格式化 Product Hunt 热门产品数据
 * @param {Array} products
 * @returns {string}
 */
const formatProductHunt = (products) => {
  if (!products || products.length === 0) return "";

  let message = sectionHeader(EMOJI.productHunt, "科技新品");
  message += "> _Product Hunt · 每日热门产品_\n\n";

  products.forEach((product) => {
    const relativeTime = formatRelativeTime(product.posted_on);
    message += cardItem(
      product.title,
      product.url,
      product.description,
      product.source,
      relativeTime,
    );
  });

  return message;
};

module.exports = { formatProductHunt };
