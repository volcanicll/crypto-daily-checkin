/**
 * Format gold price data
 * @param {object} goldData 
 * @returns {string} Formatted gold report
 */
const formatGold = (goldData) => {
    if (!goldData || (!goldData.ny_gold && !goldData.cn_gold)) return "";

    let message = "【🏆 今日金价 🏆】\n";

    if (goldData.cn_gold) {
        const { price, change_percent, name } = goldData.cn_gold;
        const icon = change_percent >= 0 ? "📈" : "📉";
        message += `${icon} ${name}: ¥${price.toFixed(2)}/g (${change_percent > 0 ? '+' : ''}${change_percent.toFixed(2)}%)\n`;
    }

    if (goldData.cn_silver) {
        const { price, change_percent, name } = goldData.cn_silver;
        const icon = change_percent >= 0 ? "📈" : "📉";
        message += `${icon} ${name}: ¥${price.toFixed(2)}/kg (${change_percent > 0 ? '+' : ''}${change_percent.toFixed(2)}%)\n`;
    }

    if (goldData.ny_gold) {
        const { price, change_percent, name } = goldData.ny_gold;
        const icon = change_percent >= 0 ? "📈" : "📉";
        message += `${icon} ${name}: $${price.toFixed(2)}/oz (${change_percent > 0 ? '+' : ''}${change_percent.toFixed(2)}%)\n`;
    }

    if (goldData.ny_silver) {
        const { price, change_percent, name } = goldData.ny_silver;
        const icon = change_percent >= 0 ? "📈" : "📉";
        message += `${icon} ${name}: $${price.toFixed(2)}/oz (${change_percent > 0 ? '+' : ''}${change_percent.toFixed(2)}%)\n`;
    }

    return message;
};

module.exports = { formatGold };
