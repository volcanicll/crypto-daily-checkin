const { sectionHeader, priceItem } = require("./DingTalkMarkdownUtils");

/**
 * Format gold price data
 * @param {object} goldData
 * @returns {string} Formatted gold report
 */
const formatGold = (goldData) => {
  if (!goldData || (!goldData.ny_gold && !goldData.cn_gold)) return "";

  let message = sectionHeader("🏆", "今日金价");

  if (goldData.cn_gold) {
    const { price, change_percent, name } = goldData.cn_gold;
    const icon = change_percent >= 0 ? "📈" : "📉";
    const changeStr = `${change_percent > 0 ? "+" : ""}${change_percent.toFixed(
      2
    )}%`;
    message += priceItem(icon, name, `¥${price.toFixed(2)}/g`, changeStr);
  }

  if (goldData.cn_silver) {
    const { price, change_percent, name } = goldData.cn_silver;
    const icon = change_percent >= 0 ? "📈" : "📉";
    const changeStr = `${change_percent > 0 ? "+" : ""}${change_percent.toFixed(
      2
    )}%`;
    message += priceItem(icon, name, `¥${price.toFixed(2)}/kg`, changeStr);
  }

  if (goldData.ny_gold) {
    const { price, change_percent, name } = goldData.ny_gold;
    const icon = change_percent >= 0 ? "📈" : "📉";
    const changeStr = `${change_percent > 0 ? "+" : ""}${change_percent.toFixed(
      2
    )}%`;
    message += priceItem(icon, name, `$${price.toFixed(2)}/oz`, changeStr);
  }

  if (goldData.ny_silver) {
    const { price, change_percent, name } = goldData.ny_silver;
    const icon = change_percent >= 0 ? "📈" : "📉";
    const changeStr = `${change_percent > 0 ? "+" : ""}${change_percent.toFixed(
      2
    )}%`;
    message += priceItem(icon, name, `$${price.toFixed(2)}/oz`, changeStr);
  }

  return message;
};

module.exports = { formatGold };
